import { Component, OnInit } from '@angular/core';
import { PencilService } from '@app/services/pencil.service';
import { BIG, BLACK_COLOR, MEDIUM, SMALL, VERY_BIG, VERY_SMALL } from '@common/const';

@Component({
  selector: 'app-tool-setting',
  templateUrl: './tool-setting.component.html',
  styleUrls: ['./tool-setting.component.scss']
})
export class ToolSettingComponent implements OnInit {
  widths:number[] = [VERY_SMALL,SMALL,MEDIUM,BIG,VERY_BIG]
  color:string;
  constructor(private pencilService:PencilService) { }

  ngOnInit(): void {
    this.setOriginalSetting()
  }

  setOriginalSetting(){
    this.pencilService.setWidth(VERY_SMALL);
    this.pencilService.setColor(BLACK_COLOR)
  }

  onChangeColor():void{
    this.pencilService.setColor(this.color)
  }

  onChangeWidth(width: number):void{
    this.pencilService.setWidth(width)
  }
}
