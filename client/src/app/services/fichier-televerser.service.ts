import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FichierTeleverserService {
  
  private readonly baseUrl: string = environment.serverUrl;


  constructor(private http:HttpClient) { }

  upload(file:File):Observable<Object>{

    const formData = new FormData();

    formData.append('file',file,file.name);

    return this.http.post(`${this.baseUrl}/images`,formData)

  }
}
