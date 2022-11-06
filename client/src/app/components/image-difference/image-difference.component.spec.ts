import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeValue } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Renderer2TestHelper } from '@app/classes/renderer2-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { GameToServerService } from '@app/services/game-to-server.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { DifferencesInformations } from '@common/differences-informations';
import { ImageToSendToServer } from '@common/imageToSendToServer';
import { Socket } from 'socket.io-client';
import { ImageDifferenceComponent } from './image-difference.component';

describe('ImageDifferenceComponent', () => {
    const nbDifferencesTest = 4;
    const mockImage: ImageToSendToServer = {
        image: 'url' as SafeValue,
        index: 1,
    };

    let component: ImageDifferenceComponent;
    let fixture: ComponentFixture<ImageDifferenceComponent>;
    let gameToServerService: GameToServerService;
    let socketService: SocketClientService;
    let socketTestHelper: SocketTestHelper;
    let imageToImageDifferenceService: ImageToImageDifferenceService;
    let renderer: Renderer2;
    let getImagesDataSpy: jasmine.Spy;

    beforeEach(async () => {
        socketTestHelper = new SocketTestHelper();
        renderer = new Renderer2TestHelper() as unknown as Renderer2;

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            declarations: [ImageDifferenceComponent],
            providers: [{ provide: Renderer2, useValue: renderer }],
        }).compileComponents();

        fixture = TestBed.createComponent(ImageDifferenceComponent);
        gameToServerService = fixture.debugElement.injector.get(GameToServerService);
        imageToImageDifferenceService = fixture.debugElement.injector.get(ImageToImageDifferenceService);
        socketService = fixture.debugElement.injector.get(SocketClientService);
        socketService.socket = socketTestHelper as unknown as Socket;

        component = fixture.componentInstance;

        spyOn(gameToServerService, 'getOriginalImageUploaded').and.returnValue(mockImage);
        spyOn(gameToServerService, 'getModifiedImageUploaded').and.returnValue(mockImage);
        spyOn(imageToImageDifferenceService, 'waitForImageToLoad').and.returnValue(Promise.resolve());
        getImagesDataSpy = spyOn(imageToImageDifferenceService, 'getImagesData').and.returnValue({
            originalImageData: new Uint8ClampedArray(),
            modifiedImageData: new Uint8ClampedArray(),
            imageHeight: 0,
            imageWidth: 0,
            offSet: 0,
        });
        fixture.detectChanges();
    });

    it('should test loaded() return true with number difference and source image', async () => {
        component.finalDifferencesImage.src = mockImage.image;
        component['numberOfDifferences'] = nbDifferencesTest;
        await component.ngOnInit();
        expect(component.loaded()).toBeTruthy();
    });

    it('should test loaded() return false with source image only', async () => {
        component.finalDifferencesImage.src = mockImage.image;

        await component.ngOnInit();
        expect(component.loaded()).toBeFalsy();
    });

    it('should call functions from GameToServerService when there is an image source and a number of differences and loaded() is called', () => {
        const spy1 = spyOn(gameToServerService, 'setNumberDifference');
        const spy2 = spyOn(gameToServerService, 'setUrlImageOfDifference');
        const spy3 = spyOn(gameToServerService, 'setDifferencesList');

        component['finalDifferencesImage'].src = mockImage.image;
        component['numberOfDifferences'] = nbDifferencesTest;
        component.loaded();

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });

    it('should call getImagesData from ImageToImageDifferenceService on ngOnInit', async () => {
        await component.ngOnInit();
        expect(getImagesDataSpy).toHaveBeenCalled();
    });

    it('should send an event to the server on ngOnInit', async () => {
        const spy = spyOn(socketService, 'send').and.callFake(() => {});
        await component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should call putDifferencesDataInImage() from ImageToImageDifferenceService on a game creation differences informations event', async () => {
        const spy = spyOn(imageToImageDifferenceService, 'putDifferencesDataInImage').and.callFake(() => {});
        const differencesListTest = [
            [0, 1, 5, 8, 9],
            [100, 101, 102, 105],
        ];
        const differencesInformationsTest: DifferencesInformations = {
            differencesList: differencesListTest,
            nbOfDifferences: nbDifferencesTest,
        };

        await component.ngOnInit();
        socketTestHelper.peerSideEmit('game creation differences informations', differencesInformationsTest);
        expect(spy).toHaveBeenCalled();
    });
});
