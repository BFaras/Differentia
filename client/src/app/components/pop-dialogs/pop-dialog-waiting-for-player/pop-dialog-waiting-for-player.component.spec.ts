import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopDialogWaitingForPlayerComponent } from './pop-dialog-waiting-for-player.component';

describe('PopDialogWaitingForPlayerComponent', () => {
  let component: PopDialogWaitingForPlayerComponent;
  let fixture: ComponentFixture<PopDialogWaitingForPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopDialogWaitingForPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopDialogWaitingForPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
