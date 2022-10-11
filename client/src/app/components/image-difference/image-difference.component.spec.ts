import { Renderer2, ɵunwrapSafeValue as unwrapSafeValue } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeValue } from '@angular/platform-browser';
import { GameToServerService } from '@app/services/game-to-server.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { ImageToSendToServer } from '@common/imageToSendToServer';
import { ImageDifferenceComponent } from './image-difference.component';
import SpyObj = jasmine.SpyObj;
describe('ImageDifferenceComponent', () => {
    let component: ImageDifferenceComponent;
    let fixture: ComponentFixture<ImageDifferenceComponent>;
    let imageToImagesDifferenceServiceSpy: SpyObj<ImageToImageDifferenceService>;
    let gameToServerServiceSpy: SpyObj<GameToServerService>;
    let renderer2: Renderer2;
    let mockImage: ImageToSendToServer = {
        image: 'url' as SafeValue,
        index: 1,
    };

    beforeEach(async () => {
        
        imageToImagesDifferenceServiceSpy = jasmine.createSpyObj('ImageToImageDifferenceService', [
            'waitForImageToLoad',
            'sendDifferentImagesInformationToServerForGameCreation',
        ]);
        imageToImagesDifferenceServiceSpy.sendDifferentImagesInformationToServerForGameCreation.and.returnValue()
        imageToImagesDifferenceServiceSpy.waitForImageToLoad.and.returnValue(Promise.resolve())
        gameToServerServiceSpy = jasmine.createSpyObj('GameToServerService', [
            'getOriginalImageUploaded',
            'getModifiedImageUploaded',
            'setNumberDifference',
            'setUrlImageOfDifference',
        ]);
        gameToServerServiceSpy.getOriginalImageUploaded.and.returnValue(mockImage);
        gameToServerServiceSpy.getModifiedImageUploaded.and.returnValue(mockImage);
        

        await TestBed.configureTestingModule({
            declarations: [ImageDifferenceComponent],
            providers: [
                Renderer2,
                { provide: GameToServerService, useValue: gameToServerServiceSpy },
                { provide: ImageDifferenceComponent, useValue: imageToImagesDifferenceServiceSpy },
                { provide: unwrapSafeValue, useValue: 'string'},
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ImageDifferenceComponent);
        renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2);
        spyOn(renderer2, 'createElement').and.callThrough();
        component = fixture.componentInstance;
        fixture.detectChanges();
        
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should test load return true with number difference', () => {
        component.finalDifferencesImage.src = 'string';
        component.numberOfDifference = 2;
        expect(component.loaded()).toBeTruthy();
    });

    it('should test load return true', () => {
        component.finalDifferencesImage.src = 'string';
        expect(component.loaded()).toBeTruthy();
    });
    
    it('should verify we call function to generate differentImageInforamtion was called', async()=>{
        component.offset = 6;
        component.ngOnInit()
        expect(imageToImagesDifferenceServiceSpy.waitForImageToLoad).toHaveBeenCalled()


    });
    
    afterEach(() => {
        fixture.destroy();
      });


});
