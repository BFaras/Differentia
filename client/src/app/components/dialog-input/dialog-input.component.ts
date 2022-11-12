import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
        initialTime: 30,
        penaltyTime: 5,
        savedTime: 5,
    };
    constructor(@Inject(MAT_DIALOG_DATA) public datas: any, public dialogRef: MatDialogRef<DialogInputComponent>) {}

    ngOnInit(): void {
        if (this.initialTimeInput.nativeElement.value !== undefined) this.validateTimeType(this.initialTimeInput, 0);
        if (this.penaltyTimeInput.nativeElement.value !== undefined) this.validateTimeType(this.penaltyTimeInput, 1);
        if (this.savedtimeInput.nativeElement.value !== undefined) this.validateTimeType(this.savedtimeInput, 2);
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
        if (time.nativeElement.value > 0 || time.nativeElement.value.type === Number || time.nativeElement.value === '') {
            this.timeValid[index] = true;
            this.onlyQuitButton = false;
            if (
                this.initialTimeInput.nativeElement.value === '' &&
                this.penaltyTimeInput.nativeElement.value === '' &&
                this.savedtimeInput.nativeElement.value === ''
            ) {
                this.onlyQuitButton = true;
            }
        } else {
            this.timeValid[index] = false;
            this.onlyQuitButton = true;
        }
    }
}
