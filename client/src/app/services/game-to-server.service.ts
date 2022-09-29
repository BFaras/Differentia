import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameToServerService {
  private urlImageOfDifference:any;
  private numberDifference:number;

  constructor() { }

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
