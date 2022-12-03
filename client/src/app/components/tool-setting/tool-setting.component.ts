import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CanvasDataHandlerService } from '@app/services/canvas-data-handler.service';
import { DrawingHistoryService } from '@app/services/drawing-history.service';
import { KeyEventHandlerService } from '@app/services/key-event-handler.service';
import { PencilService } from '@app/services/pencil.service';
import { BIG, BLACK_COLOR, CONTROL_SHIFT_Z_SHORTCUT, CONTROL_Z_SHORTCUT, MEDIUM, SMALL, VERY_BIG, VERY_SMALL, WRITE_MODE } from '@common/const';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEraser } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-tool-setting',
    templateUrl: './tool-setting.component.html',
    styleUrls: ['./tool-setting.component.scss'],
})
export class ToolSettingComponent implements OnInit {
    @Input() indexTool: number;
    @Input() nameTool: string;
    readonly widths: number[] = [VERY_SMALL, SMALL, MEDIUM, BIG, VERY_BIG];
    public color: string;
    public faEraser: IconDefinition = faEraser;
    public enableWrite: boolean = true;
    public enableErase:boolean = false;
    constructor(
        private pencilService: PencilService,
        private drawingHistoryService: DrawingHistoryService,
        private canvasDataHandle: CanvasDataHandlerService,
        private keyEventHandlerService: KeyEventHandlerService,
    ) {}

    @HostListener(CONTROL_Z_SHORTCUT, ['$event'])
    handleKeyboardToCancelDrawnLine() {
        this.keyEventHandlerService.deleteDrawnLineShortCut();
    }

    @HostListener(CONTROL_SHIFT_Z_SHORTCUT, ['$event'])
    handleKeyboardToCancelDeletedDrawnLine() {
        this.keyEventHandlerService.cancelDeleteDrawnLineShortCut();
    }

    ngOnInit(): void {
        this.setOriginalSetting();
    }

    checkIfThereAreSavedDrawnLines() {
        if (this.drawingHistoryService.getCancelDrawingHistory()[this.indexTool].length != 0) {
            return false;
        } else {
            return true;
        }
    }

    checkIfThereAreSavedDeletedDrawnLines() {
        if (this.drawingHistoryService.getRedoDrawingHistory()[this.indexTool].length != 0) {
            return false;
        } else {
            return true;
        }
    }

    cancelActionDrawnLine() {
        this.drawingHistoryService.cancelCanvas(this.indexTool);
        this.drawingHistoryService.cancelCanvas(this.indexTool);
    }

    cancelActionDeletedDrawnLine() {
        this.drawingHistoryService.redoCanvas(this.indexTool);
        this.drawingHistoryService.redoCanvas(this.indexTool);
    }

    setOriginalSetting() {
        this.pencilService.setWidth(VERY_SMALL, this.indexTool);
        this.pencilService.setColor(BLACK_COLOR, this.indexTool);
        this.pencilService.setStateOfPencilForRightCanvas(WRITE_MODE, this.indexTool);
    }

    onChangeColor(): void {
        this.pencilService.setColor(this.color, this.indexTool);
    }

    onChangeWidth(width: number): void {
        this.pencilService.setWidth(width, this.indexTool);
    }

    clearCanvas() {
        this.canvasDataHandle.clearCanvas(this.indexTool);
    }

    copyOtherCanvas() {
        this.canvasDataHandle.copyCanvas(this.indexTool);
    }

    shareDataWithOtherCanvas() {
        this.canvasDataHandle.shareDataWithOtherCanvas();
    }

    setMode(value: string): void {
        if (value === 'write') {
            this.enableErase = false;
            this.enableWrite = true;
        }

        if (value === 'erase') {
            this.enableErase = true;
            this.enableWrite = false;
        }
    }

    setPencilMode(clickEvent: Event) {
        const currentValue = (clickEvent.currentTarget as HTMLInputElement).value;
        const currentId = (clickEvent.currentTarget as HTMLInputElement).id;

        this.pencilService.setStateOfPencilForRightCanvas(currentValue, parseInt(currentId, 10));
        this.setMode(currentValue);
    }
}
