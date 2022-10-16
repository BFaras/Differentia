import { Component, OnInit, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { BIG, MEDIUM, SMALL, VERY_BIG, VERY_SMALL } from '@common/const';

@Component({
  selector: 'app-tool-setting',
  templateUrl: './tool-setting.component.html',
  styleUrls: ['./tool-setting.component.scss']
})
export class ToolSettingComponent implements OnInit {
  @ViewChild("chosenWidth") chosenWidth:MatOption
  @ViewChild("writeButton") writeButton:any
  @ViewChild("eraseButton") eraseButton:any
  widths:number[] = [VERY_SMALL,SMALL,MEDIUM,BIG,VERY_BIG]
  color:string;
  constructor() { }

  ngOnInit(): void {
  }

  onChangeColor(){
    console.log( this.color)
  }

  onChangeWidth(){
    console.log( this.chosenWidth.value)
  }

  onChangeModePencil(event:Event){
    // add method to change mode of pencil service to be reated
  }

}
