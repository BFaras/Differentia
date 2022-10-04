import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FichierTeleverserService {
  private nameOriginalImage:File;
  originalIndex:number
  private nameModifiedImage:File
  modifiedIndex:number
  private readonly baseUrl: string = environment.serverUrl;


  constructor(private http:HttpClient) { }

  getNameOriginalImage(){
    return this.nameOriginalImage;
  }

  setOriginalImage(file:File,index:number){
      this.nameOriginalImage = file;
      this.originalIndex =  index;
      console.log(file)
  }

  getNameModifiedImage(){
    return this.nameModifiedImage
  }

  setModifiedImage(file:File,index:number){
      this.nameModifiedImage = file;
      this.modifiedIndex = index;
      console.log(file)
  }
  
  upload(file:File):Observable<Object>{

    const formData = new FormData();

    formData.append('file',file,file.name);

    return this.http.post(`${this.baseUrl}/images`,formData)

  }
}
