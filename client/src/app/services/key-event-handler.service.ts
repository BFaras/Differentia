import { Injectable } from '@angular/core';
import { DrawingHistoryService } from './drawing-history.service';

@Injectable({
  providedIn: 'root'
})
export class KeyEventHandlerService {
  private indexImageOnDrawing:number;
  constructor(private drawingHistoryService:DrawingHistoryService) { }

  setIndexImageOnDrawing(indexOfCanvas:number){
    this.indexImageOnDrawing = indexOfCanvas;
  }

  deleteDrawnLineShortCut(){
    this.drawingHistoryService.cancelCanvas(this.indexImageOnDrawing);

  }

  cancelDeleteDrawnLineShortCut(){
    this.drawingHistoryService.cancelDeletedCanvas(this.indexImageOnDrawing);
  }
}

