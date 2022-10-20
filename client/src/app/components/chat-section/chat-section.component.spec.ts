import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatMessagesService } from '@app/services/chat-messages.service';
import { ChatMessage } from '@common/chat-message';
import { Observable, Subscriber } from 'rxjs';

import { ChatSectionComponent } from './chat-section.component';

describe('ChatSectionComponent', () => {
  const testMessage : ChatMessage = {senderName : "Player1", message : "Hi"};
  let chatSectionComponent: ChatSectionComponent;
  let fixture: ComponentFixture<ChatSectionComponent>;
  let chatMessagesService : ChatMessagesService;
  let testObserver : Subscriber<ChatMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatSectionComponent);
    chatSectionComponent = fixture.componentInstance;
    fixture.detectChanges();

    chatMessagesService = TestBed.inject(ChatMessagesService);
    chatMessagesService.messagesObservable = new Observable((observer: Subscriber<ChatMessage>) => {
      testObserver = observer
      observer.next(testMessage);
    });

    chatSectionComponent.ngOnInit();
  });

  it('should subscribe to the ChatMessagesService observable on init ', () => {
    expect(testObserver).not.toBeUndefined();
  });

  it('should call addMessage when the observer sends information', () => {
    const spy = spyOn(chatSectionComponent, <any>'addMessage');
    expect(spy).toHaveBeenCalled;
  });

  it('should add a message to the message list when the observable sends an event', () => {
    testObserver.next(testMessage);
    expect(chatSectionComponent.messagesSent).toEqual([testMessage,testMessage]);
  })

  it('should unsubscribe from the observable on ngOnDestroy and not use the callback', () => {
    chatSectionComponent.ngOnDestroy();
    testObserver.next(testMessage);
    expect(chatSectionComponent.messagesSent).not.toEqual([testMessage, testMessage]);
  })
});
