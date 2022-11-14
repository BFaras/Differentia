import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    DEFAULT_INITIAL_TIME,
    DEFAULT_PENALTY_TIME,
    DEFAULT_SAVED_TIME,
    EMPTY_TIME,
    INITIAL_TIME_INDEX,
    MINIMUM_TIME_VALUE,
    PENALTY_TIME_INDEX,
    SAVED_TIME_INDEX,
} from '@app/client-consts';
import { TimeConstants } from '@common/time-constants';

@Component({
    selector: 'app-dialog-input',
    templateUrl: './dialog-input.component.html',
    styleUrls: ['./dialog-input.component.scss'],
})
export class DialogInputComponent implements OnInit {
    @ViewChild('timeInput1', { static: true }) initialTimeInput: ElementRef;
    @ViewChild('timeInput2', { static: true }) penaltyTimeInput: ElementRef;
    @ViewChild('timeInput3', { static: true }) savedtimeInput: ElementRef;

    timeValid: boolean[] = [true, true, true];
    onlyQuitButton: boolean = true;
    timeConstants: TimeConstants = {
        initialTime: DEFAULT_INITIAL_TIME,
        penaltyTime: DEFAULT_PENALTY_TIME,
        savedTime: DEFAULT_SAVED_TIME,
    };
    constructor(@Inject(MAT_DIALOG_DATA) public datas: any, public dialogRef: MatDialogRef<DialogInputComponent>) {}

    ngOnInit(): void {
        if (this.initialTimeInput.nativeElement.value !== undefined) this.validateTimeType(this.initialTimeInput, INITIAL_TIME_INDEX);
        if (this.penaltyTimeInput.nativeElement.value !== undefined) this.validateTimeType(this.penaltyTimeInput, PENALTY_TIME_INDEX);
        if (this.savedtimeInput.nativeElement.value !== undefined) this.validateTimeType(this.savedtimeInput, SAVED_TIME_INDEX);
    }

    submitTimes() {
        this.timeConstants = {
            initialTime: this.initialTimeInput.nativeElement.value,
            penaltyTime: this.penaltyTimeInput.nativeElement.value,
            savedTime: this.savedtimeInput.nativeElement.value,
        };
        this.dialogRef.close();
    }
    validateTimeType(time: ElementRef, index: number) {
        if (time.nativeElement.value > MINIMUM_TIME_VALUE || time.nativeElement.value.type === Number || time.nativeElement.value === EMPTY_TIME) {
            this.timeValid[index] = true;
            this.onlyQuitButton = false;
            if (
                this.initialTimeInput.nativeElement.value === EMPTY_TIME &&
                this.penaltyTimeInput.nativeElement.value === EMPTY_TIME &&
                this.savedtimeInput.nativeElement.value === EMPTY_TIME
            ) {
                this.onlyQuitButton = true;
            }
        } else {
            this.timeValid[index] = false;
            this.onlyQuitButton = true;
        }
    }
}
