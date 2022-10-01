import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { Socket } from 'socket.io-client';

import { BLACK_RGB, DEFAULT_OFFSET, IMAGE_HEIGHT, IMAGE_WIDTH, NB_BIT_PER_PIXEL } from '@common/const';
import { ImageToImageDifferenceService } from './image-to-image-difference.service';
import { SocketClientService } from './socket-client.service';

describe('ImageToImageDifferenceService', () => {
    const TEST_DIFFERENCES_ARRAY: number[] = [1, 255, 368];
    const originalImage: HTMLImageElement = new Image(IMAGE_WIDTH, IMAGE_HEIGHT);
    const modifiedImage: HTMLImageElement = new Image(IMAGE_WIDTH, IMAGE_HEIGHT);
    let imageToImageDiffService: ImageToImageDifferenceService;
    let mainCanvas: HTMLCanvasElement;
    let differencesImageToPutDataIn: HTMLImageElement;

    beforeEach(async () => {
        TestBed.configureTestingModule({});
        imageToImageDiffService = TestBed.inject(ImageToImageDifferenceService);
        mainCanvas = CanvasTestHelper.createCanvas(1, 1);
        differencesImageToPutDataIn = new Image(IMAGE_WIDTH, IMAGE_HEIGHT);
    });

    // Pas trop certain de l'utilite
    it('should be created', () => {
        expect(imageToImageDiffService).toBeTruthy();
    });

    it('should send information to server through socket', () => {
        const socketService = TestBed.inject(SocketClientService);
        const event = 'detect images difference';
        const action = () => {};

        socketService.socket = new SocketTestHelper() as unknown as Socket;
        const spy = spyOn(socketService.socket, 'on');

        socketService.on(event, action);
        imageToImageDiffService.sendDifferentImagesInformationToServerForGameCreation(
            mainCanvas,
            originalImage,
            modifiedImage,
            differencesImageToPutDataIn,
            DEFAULT_OFFSET,
        );
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(event, action);
    });

    it('should return the right image according to the array sent', () => {
        let imageHasDifferencesPixelsAtRightPosition = true;
        let differenceImageData: Uint8ClampedArray;

        imageToImageDiffService['setupDataInService'](mainCanvas, originalImage, modifiedImage, differencesImageToPutDataIn);
        imageToImageDiffService.putDifferencesDataInImage(TEST_DIFFERENCES_ARRAY);
        differenceImageData = imageToImageDiffService['getImageData'](differencesImageToPutDataIn, mainCanvas);

        TEST_DIFFERENCES_ARRAY.forEach((pixelNb) => {
            for (let i = 0; i < NB_BIT_PER_PIXEL - 1; i++) {
                if (differenceImageData[pixelNb * NB_BIT_PER_PIXEL + i] != BLACK_RGB) {
                    imageHasDifferencesPixelsAtRightPosition = false;
                }
            }
        });

        expect(imageHasDifferencesPixelsAtRightPosition).toBeTruthy();
    });
});
