import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MESSAGE_JEU_CREER, MESSAGE_JEU_NON_CREER, MESSAGE_NOMBRE_DIFFERENCE_ERREUR } from '@common/const';
import { Game } from '@common/game';
import { ImageToSendToServer } from '@common/imageToSendToServer';
import { StatusCodes } from 'http-status-codes';
import { CommunicationService } from './communication.service';
import { UploadFileService } from './upload-file.service';
import { RecordTime } from '@app/classes/record-time';
import { SafeValue } from '@angular/platform-browser';
@Injectable({
    providedIn: 'root',
})
export class GameToServerService {
    private urlImageOfDifference: any;
    private numberDifference: number;
    private originalImagesUploaded: ImageToSendToServer;
    private modifiedImageUploaded: ImageToSendToServer;
    private differencesList: number[][];

    constructor(private route: Router, private communicationService: CommunicationService, private uploadFileService: UploadFileService) {}

    goToAdmin() {
        this.route.navigate(['/admin']);
    }
    statusCodeTreatment(responseStatusCode: any) {
        if (responseStatusCode == StatusCodes.BAD_GATEWAY) {
            alert(MESSAGE_JEU_NON_CREER);
        } else {
            alert(MESSAGE_JEU_CREER);
            this.goToAdmin();
        }
    }

    validateNumberOfDifferences() {
        return this.numberDifference >= 3 && this.numberDifference <= 9;
    }

    addGame(nameOfGame: string) {
        this.uploadFileService.setNameGame(nameOfGame);
        this.uploadFileService.setNameImageUpload(0);
        this.uploadFileService.setNameImageUpload(1);
        const gameToAdd: Game = {
            name: nameOfGame,
            numberOfDifferences: this.numberDifference,
            times: { soloGameTimes: [new RecordTime('00:00', 'playerUsername')], multiplayerGameTimes: [new RecordTime('00:00', 'playerUsername')] },
            images: [this.uploadFileService.getNameImageUpload(0)!, this.uploadFileService.getNameImageUpload(1)!],
            differencesList: this.differencesList,
        };

        if (this.validateNumberOfDifferences()) {
            this.sendBothImagesToServer();
            this.communicationService.addGame(gameToAdd).subscribe((httpStatus: HttpResponse<any>) => {
                this.statusCodeTreatment(httpStatus.body);
            });
        } else alert(MESSAGE_NOMBRE_DIFFERENCE_ERREUR);
    }

    sendBothImagesToServer() {
        this.uploadFileService.upload(this.uploadFileService.getNameOriginalImage(), 0);
        this.uploadFileService.upload(this.uploadFileService.getNameModifiedImage(), 1);
    }

    getOriginalImageUploaded() {
        return this.originalImagesUploaded;
    }

    setOriginalUrlUploaded(index: number | undefined, imageSrc: SafeValue | undefined) {
        this.originalImagesUploaded = {
            image: imageSrc,
            index,
        };
    }

    getModifiedImageUploaded() {
        return this.modifiedImageUploaded;
    }

    setModifiedUrlUploaded(index: number | undefined, imageSrc: SafeValue | undefined) {
        this.modifiedImageUploaded = {
            image: imageSrc,
            index,
        };
    }

    setUrlImageOfDifference(url: any) {
        this.urlImageOfDifference = url;
    }

    setNumberDifference(numberOfDiff: number) {
        this.numberDifference = numberOfDiff;
    }

    setDifferencesList(diffList: number[][]) {
        this.differencesList = diffList;
    }

    getUrlImageOfDifferences() {
        return this.urlImageOfDifference;
    }

    getNumberDifference() {
        return this.numberDifference;
    }
}
