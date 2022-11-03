import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CanvasDataHandlerService } from '@app/services/canvas-data-handler.service';
import { DrawingHistoryService } from '@app/services/drawing-history.service';
import { KeyEventHandlerService } from '@app/services/key-event-handler.service';
import { PencilService } from '@app/services/pencil.service';
import { BIG, BLACK_COLOR, MEDIUM, SMALL, VERY_SMALL } from '@common/const';

const WRITE_MODE:string = "write";
const CONTROL_Z_SHORTCUT:string = 'document:keyup.control.z';
const CONTROL_SHIFT_Z_SHORTCUT:string = 'document:keyup.control.shift.z';
@Component({
  selector: 'app-tool-setting',
  templateUrl: './tool-setting.component.html',
  styleUrls: ['./tool-setting.component.scss']
})
export class ToolSettingComponent implements OnInit {
  readonly widths:number[] = [VERY_SMALL,SMALL,MEDIUM,BIG,15]
  public color:string;
  @Input() indexTool:number;
  constructor(private pencilService:PencilService,
    private drawingHistoryService: DrawingHistoryService,
    private canvasDataHandle:CanvasDataHandlerService,
    private keyEventHandlerService:KeyEventHandlerService

    ) { }


  ngOnInit(): void {
    this.setOriginalSetting()
  }

  @HostListener(CONTROL_Z_SHORTCUT, ['$event'])
  handleKeyboardToCancelDrawnLine() { 
    this.keyEventHandlerService.deleteDrawnLineShortCut()
  }

  @HostListener(CONTROL_SHIFT_Z_SHORTCUT, ['$event'])
  handleKeyboardToCancelDeletedDrawnLine() { 
    this.keyEventHandlerService.cancelDeleteDrawnLineShortCut()
  }

  checkIfThereAreSavedDrawnLines(){
    if (this.drawingHistoryService.getCancelDrawingHistory()[this.indexTool].length != 0){
      return false
    } else{
      return true;
    }
  }

  checkIfThereAreSavedDeletedDrawnLines(){
    if (this.drawingHistoryService.getUndoCancelDrawingHistory()[this.indexTool].length != 0){
      return false
    } else{
      return true;
    }
  }

  cancelActionDrawnLine(){
      this.drawingHistoryService.cancelCanvas(this.indexTool);
      this.drawingHistoryService.cancelCanvas(this.indexTool);

  }

  cancelActionDeletedDrawnLine(){
      this.drawingHistoryService.cancelDeletedCanvas(this.indexTool);
      this.drawingHistoryService.cancelDeletedCanvas(this.indexTool);

  }

  setOriginalSetting(){
    this.pencilService.setWidth(VERY_SMALL,this.indexTool);
    this.pencilService.setColor(BLACK_COLOR,this.indexTool);
    this.pencilService.setStateOfPencilForRightCanvas(WRITE_MODE,this.indexTool)
  }

  onChangeColor():void{
    this.pencilService.setColor(this.color,this.indexTool);
  }

  onChangeWidth(width: number):void{
    this.pencilService.setWidth(width,this.indexTool);
  }

  clearCanvas(){
    this.canvasDataHandle.clearCanvas(this.indexTool);
  }

  copyOtherCanvas(){
    this.canvasDataHandle.copyOtherCanvas(this.indexTool);
  }

  shareDataWithOtherCanvas(){
    this.canvasDataHandle.shareDataWithOtherCanvas(this.indexTool);
  }

  setPencilMode(clickEvent:Event){
    const currentValue = (clickEvent.currentTarget as HTMLInputElement).value;
    const currentId = (clickEvent.currentTarget as HTMLInputElement).id;

    this.pencilService.setStateOfPencilForRightCanvas(currentValue,parseInt(currentId))
  }
}
