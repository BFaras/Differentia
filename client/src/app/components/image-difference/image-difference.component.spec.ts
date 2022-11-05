import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeValue } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Renderer2TestHelper } from '@app/classes/renderer2-test-helper';
import { GameToServerService } from '@app/services/game-to-server.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { ImageToSendToServer } from '@common/imageToSendToServer';
import { ImageDifferenceComponent } from './image-difference.component';
// import SpyObj = jasmine.SpyObj;
describe('ImageDifferenceComponent', () => {
    let component: ImageDifferenceComponent;
    let fixture: ComponentFixture<ImageDifferenceComponent>;
    // let imageToImagesDifferenceServiceSpy: SpyObj<ImageToImageDifferenceService>;
    // let gameToServerServiceSpy: SpyObj<GameToServerService>;
    // let socketServiceSpy: SpyObj<SocketClientService>;
    let gameToServerService: GameToServerService;
    let renderer: Renderer2;
    let mockImage: ImageToSendToServer = {
        image: 'url' as SafeValue,
        index: 1,
    };

    // beforeAll(async () => {
    //     imageToImagesDifferenceServiceSpy = jasmine.createSpyObj('ImageToImageDifferenceService', [
    //         'waitForImageToLoad',
    //         'getImagesData',
    //         'putDifferencesDataInImage',
    //     ]);
    //     imageToImagesDifferenceServiceSpy.waitForImageToLoad.and.returnValue(Promise.resolve());
    // gameToServerServiceSpy = jasmine.createSpyObj('GameToServerService', [
    //     'getOriginalImageUploaded',
    //     'getModifiedImageUploaded',
    //     'setNumberDifference',
    //     'setUrlImageOfDifference',
    //     'setDifferencesList',
    // ]);
    //     socketServiceSpy = jasmine.createSpyObj('SocketClientService', ['connect', 'on', 'send']);

    //     gameToServerServiceSpy.getOriginalImageUploaded.and.returnValue(mockImage);
    //     gameToServerServiceSpy.getModifiedImageUploaded.and.returnValue(mockImage);
    //     gameToServerServiceSpy.setNumberDifference.and.returnValue();
    //     gameToServerServiceSpy.setUrlImageOfDifference.and.returnValue();
    //     gameToServerServiceSpy.setDifferencesList.and.returnValue();
    // });

    beforeEach(async () => {
        renderer = new Renderer2TestHelper() as unknown as Renderer2;

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            declarations: [ImageDifferenceComponent],
            providers: [{ provide: Renderer2, useValue: renderer }],
        }).compileComponents();

        fixture = TestBed.createComponent(ImageDifferenceComponent);
        gameToServerService = fixture.debugElement.injector.get(GameToServerService);

        spyOn(gameToServerService, 'getOriginalImageUploaded').and.callFake(() => {
            return mockImage;
        });
        spyOn(gameToServerService, 'getModifiedImageUploaded').and.callFake(() => {
            return mockImage;
        });

        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    fit('should test load return true with number difference', async () => {
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
        const spy1 = spyOn(GameToServerService.prototype, 'setNumberDifference');
        const spy2 = spyOn(GameToServerService.prototype, 'setUrlImageOfDifference');
        const spy3 = spyOn(GameToServerService.prototype, 'setDifferencesList');

        await component.ngOnInit();
        component.loaded();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });

    it('should call getImagesData from ImageToImageDifferenceService on ngOnInit', async () => {
        const spy = spyOn(ImageToImageDifferenceService.prototype, 'getImagesData');
        await component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should send an event to the server on ngOnInit', async () => {
        const spy = spyOn(SocketClientService.prototype, 'send').and.callFake(() => {});
        await component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });
});
