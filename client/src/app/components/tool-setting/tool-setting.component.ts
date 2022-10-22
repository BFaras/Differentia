import { Component, HostListener, OnInit } from '@angular/core';
import { DrawingHistoryService } from '@app/services/drawing-history.service';
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
  constructor(private pencilService:PencilService,
    private drawingHistoryService: DrawingHistoryService,
    ) { }


  ngOnInit(): void {
    this.setOriginalSetting()
  }

  @HostListener('document:keyup.control.z', ['$event'])
  handleKeyboardToCancelDrawnLine(event: KeyboardEvent) { 
    this.cancelActionDrawnLine()
  }

  @HostListener('document:keyup.control.shift.z', ['$event'])
  handleKeyboardToCancelDeletedDrawnLine(event: KeyboardEvent) { 
    this.cancelActionDeletedDrawnLine()
  }

  checkIfThereAreSavedDrawnLines(){
    if (this.drawingHistoryService.firstCanvasHistory[0].length != 0){
      return false
    } else{
      return true;
    }
  }

  checkIfThereAreSavedDeletedDrawnLines(){
    if (this.drawingHistoryService.firstCanvasHistory[1].length != 0){
      return false
    } else{
      return true;
    }
  }

  cancelActionDrawnLine(){
    if(this.checkIfThereAreSavedDeletedDrawnLines() == true)
    {
      this.drawingHistoryService.cancelCanvas();
      this.drawingHistoryService.cancelCanvas();
    }else{
      this.drawingHistoryService.cancelCanvas();
    }
  }

  cancelActionDeletedDrawnLine(){
    if(this.checkIfThereAreSavedDrawnLines() == true){
    this.drawingHistoryService.cancelDeletedCanvas();
    this.drawingHistoryService.cancelDeletedCanvas();
    }else{
      this.drawingHistoryService.cancelDeletedCanvas();
    }
  }

  setOriginalSetting(){
    this.pencilService.setWidth(VERY_SMALL);
    this.pencilService.setColor(BLACK_COLOR);
  }

  onChangeColor():void{
    this.pencilService.setColor(this.color);
  }

  onChangeWidth(width: number):void{
    this.pencilService.setWidth(width);
  }
}
