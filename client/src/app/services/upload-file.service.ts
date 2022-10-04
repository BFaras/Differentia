
import { Injectable } from '@angular/core';

import { CommunicationService } from './communication.service';
@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  private nameOriginalImage:File;
  originalIndex:number
  private nameModifiedImage:File
  modifiedIndex:number
  constructor(private communicationService:CommunicationService) { }

  getNameOriginalImage(){
    return this.nameOriginalImage;
  }

  setOriginalImage(file:File,index:number){
      this.nameOriginalImage = file;
      this.originalIndex =  index;
  }

  getNameModifiedImage(){
    return this.nameModifiedImage
  }

  setModifiedImage(file:File,index:number){
      this.nameModifiedImage = file;
      this.modifiedIndex = index;
  }
  
  upload(file:File){

    const formData = new FormData();

    formData.append('file',file,file.name);

    this.communicationService.uploadFiles(formData).subscribe((e)=>{
      console.log(e)
    })

  }
}
