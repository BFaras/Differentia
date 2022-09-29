import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { Socket } from 'socket.io-client';

import { ImageToImageDifferenceService } from './image-to-image-difference.service';
import { SocketClientService } from './socket-client.service';

describe('ImageToImageDifferenceService', () => {
<<<<<<< HEAD
    let imageToImageDiffService: ImageToImageDifferenceService;
    let mainCanvas: HTMLCanvasElement;
    let originalImage: HTMLImageElement = new Image(640, 480);
    let modifiedImage: HTMLImageElement = new Image(640, 480);
    let differencesImageToPutDataIn: HTMLImageElement;
=======
    let service: ImageToImageDifferenceService;
    let renderer: Renderer2;
    //let mainCanvas: HTMLCanvasElement;
    let originalImage: HTMLImageElement = new Image();
    let modifiedImage: HTMLImageElement = new Image();
    //let differencesImageToPutDataIn: HTMLImageElement;
>>>>>>> 5b4892cf6a7acd96e9aca7cbcfd2be9a3a97e8f2

    beforeEach(async() => {
        TestBed.configureTestingModule({});
<<<<<<< HEAD
        imageToImageDiffService = TestBed.inject(ImageToImageDifferenceService);
        mainCanvas = CanvasTestHelper.createCanvas(1,1);
=======
        //mainCanvas = renderer.createElement('canvas');
        service = TestBed.inject(ImageToImageDifferenceService);
        originalImage.src = '../../assets/ImageBlanche.bmp';
        modifiedImage.src = '../../assets/image_7_diff.bmp';
>>>>>>> 5b4892cf6a7acd96e9aca7cbcfd2be9a3a97e8f2
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
