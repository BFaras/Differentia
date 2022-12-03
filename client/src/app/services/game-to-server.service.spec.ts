import { HttpResponse } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MESSAGE_JEU_CREER, MESSAGE_JEU_NON_CREER } from '@common/const';
import { ImageToSendToServer } from '@common/imageToSendToServer';
import { StatusCodes } from 'http-status-codes';
import { Subject } from 'rxjs';
import { CommunicationService } from './communication.service';
import { GameToServerService } from './game-to-server.service';
import { UploadFileService } from './upload-file.service';

import SpyObj = jasmine.SpyObj;
describe('GameToServerService', () => {
    const imageTestValue = { name: 'Hi', image: 'src' };
    let service: GameToServerService;
    let elmentRef: string;
    let communicationServiceSpy: SpyObj<CommunicationService>;
    let mockEmitterAddGame: Subject<HttpResponse<any>>;

    const mockElementRef = {
        nativeElement: {
            value: 'name',
        },
    };

    let mockRouter = {
        navigate: jasmine.createSpy('navigate'),
    };

    beforeEach(async () => {
        mockEmitterAddGame = new Subject();

        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['addGame']);
        communicationServiceSpy.addGame.and.returnValue(mockEmitterAddGame);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([])],
            providers: [
                { provide: ElementRef, useValue: mockElementRef },
                { provide: CommunicationService, useValue: communicationServiceSpy },
                { provide: Router, useValue: mockRouter },
            ],
        });
        service = TestBed.inject(GameToServerService);
        elmentRef = "stest"

        spyOn(UploadFileService.prototype, 'getNameOriginalImage').and.returnValue(imageTestValue as unknown as File);
        spyOn(UploadFileService.prototype, 'getNameModifiedImage').and.returnValue(imageTestValue as unknown as File);
        spyOn(UploadFileService.prototype, 'upload').and.callFake(() => {});
    });

    it('should navigate', () => {
        service['goToAdmin']();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should verify number of differences is really between 3 and 9 ', () => {
        service.setNumberDifference(4);
        expect(service).toBeTruthy();
    });

    it('should verify getter and setter set up Original image and get it', () => {
        const mockImageUploaded: ImageToSendToServer = {
            image: 'imageSrc',
            index: 4,
        };

        service.setOriginalUrlUploaded(mockImageUploaded.index, mockImageUploaded.image);
        expect(service.getOriginalImageUploaded()).toEqual(mockImageUploaded);
    });

    it('should verify getter and setter set up modified image and get it', () => {
        const mockImageUploaded: ImageToSendToServer = {
            image: 'imageSrcModified',
            index: 8,
        };

        service.setModifiedUrlUploaded(mockImageUploaded.index, mockImageUploaded.image);
        expect(service.getModifiedImageUploaded()).toEqual(mockImageUploaded);
    });

    it('should add new game', () => {
        let mockNumberDiff: number = 5;
        let mockIndex: number = 2;
        let mockImage: string = 'src';

        const spy = spyOn(service, <any>'statusCodeTreatment');

        service.setModifiedUrlUploaded(mockIndex, mockImage);
        service.setOriginalUrlUploaded(mockIndex, mockImage);
        service.setNumberDifference(mockNumberDiff);
        service.setNumberDifference(mockNumberDiff);

        service.addGame(elmentRef);
        mockEmitterAddGame.next(new HttpResponse());

        expect(spy).toHaveBeenCalled();
    });

    it('should not add new game', () => {
        let mockNumberDiff: number = 2;
        let mockIndex: number = 2;
        let mockImage: string = 'src';

        const spy = spyOn(service, <any>'statusCodeTreatment');

        service.setModifiedUrlUploaded(mockIndex, mockImage);
        service.setOriginalUrlUploaded(mockIndex, mockImage);
        service.setNumberDifference(mockNumberDiff);
        service.setNumberDifference(mockNumberDiff);

        service.addGame(elmentRef);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should give an alert for game not created ', () => {
        spyOn(window, 'alert');
        HttpResponse;
        service['statusCodeTreatment'](StatusCodes.BAD_GATEWAY);
        expect(window.alert).toHaveBeenCalledWith(MESSAGE_JEU_NON_CREER);
    });

    it('should give an alert for game created ', () => {
        spyOn(window, 'alert');
        service['statusCodeTreatment'](StatusCodes.CREATED);
        expect(window.alert).toHaveBeenCalledWith(MESSAGE_JEU_CREER);
    });

    it('should test set and get url image', () => {
        const mockUrl = 'url';
        service.setUrlImageOfDifference(mockUrl);
        expect(service.getUrlImageOfDifferences()).toEqual(mockUrl);
    });

    it('should get number of differences getter and setter', () => {
        const mockNumberDifferences = 6;
        service.setNumberDifference(mockNumberDifferences);
        expect(service.getNumberDifference()).toEqual(mockNumberDifferences);
    });
});
