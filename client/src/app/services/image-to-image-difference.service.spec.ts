<<<<<<< HEAD
import { TestBed, waitForAsync } from '@angular/core/testing';
=======
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { Socket } from 'socket.io-client';
>>>>>>> b8190406d26d82216f9af8bccf7bff5c72f492c1

import { ImageToImageDifferenceService } from './image-to-image-difference.service';
import { SocketClientService } from './socket-client.service';

describe('ImageToImageDifferenceService', () => {
    let imageToImageDiffService: ImageToImageDifferenceService;
    let mainCanvas: HTMLCanvasElement;
    let originalImage: HTMLImageElement = new Image(640, 480);
    let modifiedImage: HTMLImageElement = new Image(640, 480);
    let differencesImageToPutDataIn: HTMLImageElement;

    beforeEach(async() => {
        TestBed.configureTestingModule({});
        imageToImageDiffService = TestBed.inject(ImageToImageDifferenceService);
        mainCanvas = CanvasTestHelper.createCanvas(1,1);
    });

    // Pas trop certain de l'utilite
    it('should be created', () => {
        expect(imageToImageDiffService).toBeTruthy();
    });

    it('should send information to server through socket', () => {
        const socketService = TestBed.inject(SocketClientService);
        const event = 'helloWorld';
        const action = () => { };
        
        socketService.socket = (new SocketTestHelper() as unknown) as Socket;
        const spy = spyOn(socketService.socket, 'on');
        
        socketService.on(event, action);
        imageToImageDiffService.setupDataInService(mainCanvas, originalImage, modifiedImage, differencesImageToPutDataIn);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(event, action);
    });

    it('should call setupDataInService with the right attribute', () => {
        // service.setupDataInService()
        expect(true).toBeTruthy();
    });

    it('should change the size of the canvas accordingly', () => {
        // service.adaptCanvasSizeToImage
        expect(true).toBeTruthy();
    });

    it('should return the right image data', () => {
        // service.getImageData
    });
});
