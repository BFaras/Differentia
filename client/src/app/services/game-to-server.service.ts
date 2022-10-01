import { ElementRef, Injectable } from '@angular/core';
import { MESSAGE_JEU_CREER, MESSAGE_JEU_NON_CREER, MESSAGE_NOMBRE_DIFFERENCE_ERREUR } from "@common/const";
import { Game } from '@common/game';
import { ImageToSendToServer } from '@common/imageToSendToServer';
import { CommunicationService } from './communication.service';
@Injectable({
  providedIn: 'root'
})
export class GameToServerService {
  private urlImageOfDifference:any;
  private numberDifference:number;
  private originalImagesUploaded:ImageToSendToServer;
  private modifiedImageUploaded:ImageToSendToServer
  gameToAdd: Game

  constructor(private communicationService: CommunicationService) { }
  //HTTP-CODE TO MODIFY AFTER MEETING SEB
  statusCodeTreatment(responseStatusCode: Number) {
    if(true) alert(MESSAGE_JEU_NON_CREER);
    else alert(MESSAGE_JEU_CREER);
}

validateNumberOfDifferences() {
    return this.numberDifference >= 3 && this.numberDifference <= 9;
}

  addGame(inputName: ElementRef) {
    this.gameToAdd = { name: inputName.nativeElement.value,
        numberOfDifferences: this.numberDifference , 
        times:[], images : [this.originalImagesUploaded.image,
            this.modifiedImageUploaded.image,
            this.urlImageOfDifference] }
            
    if(this.validateNumberOfDifferences()) {
        this.communicationService
            .addGame(this.gameToAdd)
            .subscribe((httpStatus: Number) => {
                this.statusCodeTreatment(httpStatus);
            });
    }
    else alert(MESSAGE_NOMBRE_DIFFERENCE_ERREUR);
}

  getOriginalImageUploaded(){
    return this.originalImagesUploaded
  }

  setOriginalUrlUploaded(index:any, imageSrc:any){
    this.originalImagesUploaded = {
      image: imageSrc , 
      index: index,
    }
    
  }
  
  getModifiedImageUploaded(){
    return this.modifiedImageUploaded
  }

  setModifiedUrlUploaded(index:any, imageSrc:any){
    this.modifiedImageUploaded = {
      image: imageSrc , 
      index: index,
    }
    
  }

  setUrlImageOfDifference(url:any){
    this.urlImageOfDifference = url 
  }

  setNumberDifference(numberOfDiff:number){
    this.numberDifference = numberOfDiff
  }

  getUrlImageOfDifferences()
  {
    return this.urlImageOfDifference
  }

  getNumberDifference(){
    return this.numberDifference
  }



}
