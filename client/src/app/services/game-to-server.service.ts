import { HttpResponse } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MESSAGE_JEU_CREER, MESSAGE_JEU_NON_CREER, MESSAGE_NOMBRE_DIFFERENCE_ERREUR } from '@common/const';
import { Game } from '@common/game';
import { ImageToSendToServer } from '@common/imageToSendToServer';
import { StatusCodes } from 'http-status-codes';
import { CommunicationService } from './communication.service';
import { UploadFileService } from './upload-file.service';
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
        if (responseStatusCode == StatusCodes.BAD_GATEWAY) alert(MESSAGE_JEU_NON_CREER);
        else {
            alert(MESSAGE_JEU_CREER);
            this.goToAdmin();
        }
    }

    validateNumberOfDifferences() {
        return this.numberDifference >= 3 && this.numberDifference <= 9;
    }

    getDataUriImageDifference() {
        this.urlImageOfDifference = this.urlImageOfDifference.slice(22);
    }

    addGame(inputName: ElementRef) {
        const gameToAdd: Game = {
            name: inputName.nativeElement.value,
            numberOfDifferences: this.numberDifference,
            times: [],
            images: [
                this.uploadFileService.getNameOriginalImage().name,
                this.uploadFileService.getNameModifiedImage().name,
                this.urlImageOfDifference,
            ],
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
        this.uploadFileService.upload(this.uploadFileService.getNameOriginalImage());
        this.uploadFileService.upload(this.uploadFileService.getNameModifiedImage());
    }

    getOriginalImageUploaded() {
        return this.originalImagesUploaded;
    }

    setOriginalUrlUploaded(index: any, imageSrc: any) {
        this.originalImagesUploaded = {
            image: imageSrc,
            index: index,
        };
    }

    getModifiedImageUploaded() {
        return this.modifiedImageUploaded;
    }

    setModifiedUrlUploaded(index: any, imageSrc: any) {
        this.modifiedImageUploaded = {
            image: imageSrc,
            index: index,
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
