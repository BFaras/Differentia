import { ElementRef, Injectable } from '@angular/core';
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

  statusCodeTreatment(responseStatusCode: Number) {
    if(true) alert("le jeu n'a pas été créer");
    else alert("Le jeu a été créer ");
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
    else alert("Attention!! le nombre de difference n'est pas entre 3 et 9");
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
