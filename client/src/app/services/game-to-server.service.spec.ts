
import { CommunicationService } from './communication.service';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ImageToSendToServer } from '@common/imageToSendToServer';
import { GameToServerService } from './game-to-server.service';
import { Subject} from 'rxjs';
import SpyObj = jasmine.SpyObj;
describe('GameToServerService', () => {
  let service: GameToServerService;
  let elmentRef: ElementRef;
  let communicationServiceSpy: SpyObj<CommunicationService>
  let mockEmitterAddGame: Subject<Number>;


  class MockElementRef extends ElementRef {}

  beforeEach(() => {
    mockEmitterAddGame = new Subject();
    communicationServiceSpy = jasmine.createSpyObj('CommunicationService',['addGame'])
    communicationServiceSpy.addGame.and.returnValue(mockEmitterAddGame)
    TestBed.configureTestingModule({
      imports:[
        {provide: ElementRef, useClass:  MockElementRef},
        {provide: CommunicationService, useValue: communicationServiceSpy} 
        ]
    });
    service = TestBed.inject(GameToServerService);
  });



  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should verify number of differences is really between 3 and 9 ', () => {
    service.setNumberDifference(4);
    expect(service).toBeTruthy();
  });

  it('should verify getter and setter set up Original image and get it', () => {
    const mockImageUploaded:ImageToSendToServer = {
      image: "imageSrc" , 
      index: 4,
    }
    

    service.setOriginalUrlUploaded(mockImageUploaded.image, mockImageUploaded.index)
    expect(service.getOriginalImageUploaded()).toBe(mockImageUploaded)
  });

  it('should verify getter and setter set up modified image and get it', () => {
    const mockImageUploaded:ImageToSendToServer = {
      image: "imageSrcModified" , 
      index: 8,
    }; 

    service.setModifiedUrlUploaded(mockImageUploaded.image, mockImageUploaded.index);
    expect(service.getModifiedImageUploaded()).toBe(mockImageUploaded);
    console.log(elmentRef);
  });


});
