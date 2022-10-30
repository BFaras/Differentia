import { Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeValue } from '@angular/platform-browser';
import { Renderer2TestHelper } from '@app/classes/renderer2-test-helper';
import { GameToServerService } from '@app/services/game-to-server.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { ImageToSendToServer } from '@common/imageToSendToServer';
import { ImageDifferenceComponent } from './image-difference.component';
import SpyObj = jasmine.SpyObj;
describe('ImageDifferenceComponent', () => {
    let component: ImageDifferenceComponent;
    let fixture: ComponentFixture<ImageDifferenceComponent>;
    let imageToImagesDifferenceServiceSpy: SpyObj<ImageToImageDifferenceService>;
    let gameToServerServiceSpy: SpyObj<GameToServerService>;
    let socketServiceSpy: SpyObj<SocketClientService>;
    let renderer: Renderer2;
    let mockImage: ImageToSendToServer = {
        image: 'url' as SafeValue,
        index: 1,
    };

    beforeAll(async () => {
        imageToImagesDifferenceServiceSpy = jasmine.createSpyObj('ImageToImageDifferenceService', [
            'waitForImageToLoad',
            'getImagesData',
            'putDifferencesDataInImage',
        ]);
        imageToImagesDifferenceServiceSpy.waitForImageToLoad.and.returnValue(Promise.resolve());
        gameToServerServiceSpy = jasmine.createSpyObj('GameToServerService', [
            'getOriginalImageUploaded',
            'getModifiedImageUploaded',
            'setNumberDifference',
            'setUrlImageOfDifference',
            'setDifferencesList',
        ]);
        socketServiceSpy = jasmine.createSpyObj('SocketClientService', ['connect', 'on', 'send']);

        gameToServerServiceSpy.getOriginalImageUploaded.and.returnValue(mockImage);
        gameToServerServiceSpy.getModifiedImageUploaded.and.returnValue(mockImage);
    });

    beforeEach(async () => {
        renderer = new Renderer2TestHelper() as unknown as Renderer2;

        await TestBed.configureTestingModule({
            declarations: [ImageDifferenceComponent],
            providers: [
                { provide: GameToServerService, useValue: gameToServerServiceSpy },
                { provide: ImageDifferenceComponent, useValue: imageToImagesDifferenceServiceSpy },
                { provide: SocketClientService, useValue: socketServiceSpy },
                { provide: Renderer2, useValue: renderer },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ImageDifferenceComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should test load return true with number difference', async () => {
        component.finalDifferencesImage.src = 'string';
        component['numberOfDifferences'] = 2;

        await component.ngOnInit();
        expect(component.loaded()).toBeTruthy();
    });

    it('should test load return true with source image', async () => {
        component.finalDifferencesImage.src = 'string';

        await component.ngOnInit();
        expect(component.loaded()).toBeTruthy();
    });

    it('should call functions from GameToServerService when there is an image source and a number of differences and loaded is called', async () => {
        await component.ngOnInit();
        component.loaded();
        expect(gameToServerServiceSpy.setNumberDifference).toHaveBeenCalled();
        expect(gameToServerServiceSpy.setUrlImageOfDifference).toHaveBeenCalled();
        expect(gameToServerServiceSpy.setDifferencesList).toHaveBeenCalled();
    });

    it('should call getImagesData from ImageToImageDifferenceService on ngOnInit', async () => {
        await component.ngOnInit();
        expect(imageToImagesDifferenceServiceSpy.getImagesData).toHaveBeenCalled();
    });

    it('should send an event to the server on ngOnInit', async () => {
        await component.ngOnInit();
        expect(socketServiceSpy.send).toHaveBeenCalled();
    });
});
