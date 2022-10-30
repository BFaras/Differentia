import { Injectable } from '@angular/core';
import { DrawingHistoryService } from './drawing-history.service';

@Injectable({
  providedIn: 'root'
})
export class KeyEventHandlerService {
  indexImageOnDrawing:number;
  constructor(private drawingHistoryService:DrawingHistoryService) { }

  deleteDrawnLineShortCut(){
    this.drawingHistoryService.cancelCanvas(this.indexImageOnDrawing);

  }

  cancelDeleteDrawnLineShortCut(){
    this.drawingHistoryService.cancelDeletedCanvas(this.indexImageOnDrawing);
  }
}

