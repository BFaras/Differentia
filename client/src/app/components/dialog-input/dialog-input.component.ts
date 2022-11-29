import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    DEFAULT_INITIAL_TIME,
    DEFAULT_PENALTY_TIME,
    DEFAULT_SAVED_TIME,
    EMPTY_TIME,
    INITIAL_TIME_INDEX,
    MAXIMUM_INITIAL_TIME,
    MAXIMUM_PENALTY_TIME,
    MAXIMUM_SAVED_TIME,
    MINIMUM_INITIAL_TIME,
    MINIMUM_PENALTY_TIME,
    MINIMUM_SAVED_TIME,
    MSG_ALL_TIME_RATIO,
    MSG_PENALTY_TIME_RATIO,
    MSG_SAVED_TIME_RATIO,
    PENALTY_TIME_INDEX,
    SAVED_TIME_INDEX,
    TIME_RATIO,
} from '@app/const/client-consts';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeConstants } from '@common/time-constants';

@Component({
    selector: 'app-dialog-input',
    templateUrl: './dialog-input.component.html',
    styleUrls: ['./dialog-input.component.scss'],
})
export class DialogInputComponent implements OnInit {
    @ViewChild('timeInput1', { static: true }) initialTimeInput: ElementRef;
    @ViewChild('timeInput2', { static: true }) penaltyTimeInput: ElementRef;
    @ViewChild('timeInput3', { static: true }) savedTimeInput: ElementRef;

    timeValid: boolean[] = [true, true, true];
    onlyQuitButton: boolean = true;
    timeRatioValid: boolean = true;
    msgTimeRatio: string = EMPTY_TIME;
    timeConstants: TimeConstants = {
        initialTime: DEFAULT_INITIAL_TIME,
        penaltyTime: DEFAULT_PENALTY_TIME,
        savedTime: DEFAULT_SAVED_TIME,
    };
    minTimeConstants: TimeConstants = {
        initialTime: MINIMUM_INITIAL_TIME,
        penaltyTime: MINIMUM_PENALTY_TIME,
        savedTime: MINIMUM_SAVED_TIME,
    };
    maxTimeConstants: TimeConstants = {
        initialTime: MAXIMUM_INITIAL_TIME,
        penaltyTime: MAXIMUM_PENALTY_TIME,
        savedTime: MAXIMUM_SAVED_TIME,
    };
    constructor(
        @Inject(MAT_DIALOG_DATA) public datas: any,
        public dialogRef: MatDialogRef<DialogInputComponent>,
        private socketService: SocketClientService,
    ) {}

    ngOnInit(): void {
        this.validateTimeType(this.initialTimeInput, INITIAL_TIME_INDEX);
        this.validateTimeType(this.penaltyTimeInput, PENALTY_TIME_INDEX);
        this.validateTimeType(this.savedTimeInput, SAVED_TIME_INDEX);
    }

    async submitTimes() {
        this.setDefaultValue();
        this.timeConstants = {
            initialTime: Number(this.initialTimeInput.nativeElement.value),
            penaltyTime: Number(this.penaltyTimeInput.nativeElement.value),
            savedTime: Number(this.savedTimeInput.nativeElement.value),
        };
        this.socketService.send('Set time constants', this.timeConstants);
        this.dialogRef.close();
    }

    validateTimesRatio() {
        let timeRatio = (this.initialTimeInput.nativeElement.value | this.timeConstants.initialTime) / TIME_RATIO;

        if (
            this.penaltyTimeInput.nativeElement.value <= this.initialTimeInput.nativeElement.value / TIME_RATIO &&
            this.savedTimeInput.nativeElement.value <= this.initialTimeInput.nativeElement.value / TIME_RATIO
        ) {
            this.timeRatioValid = true;
        } else {
            this.timeRatioValid = false;
            if (this.penaltyTimeInput.nativeElement.value > timeRatio) {
                this.msgTimeRatio = MSG_PENALTY_TIME_RATIO;
            }
            if (this.savedTimeInput.nativeElement.value > timeRatio) {
                this.msgTimeRatio = MSG_SAVED_TIME_RATIO;
            }

            if (this.penaltyTimeInput.nativeElement.value > timeRatio && this.savedTimeInput.nativeElement.value > timeRatio) {
                this.msgTimeRatio = MSG_ALL_TIME_RATIO;
            }
        }
    }

    validateTimeType(time: ElementRef, index: number) {
        if (time.nativeElement.value !== undefined) {
            if (this.verifyTimeRange(time) || time.nativeElement.value === EMPTY_TIME) {
                this.timeValid[index] = true;
                this.onlyQuitButton = false;
                if (
                    this.initialTimeInput.nativeElement.value === EMPTY_TIME &&
                    this.penaltyTimeInput.nativeElement.value === EMPTY_TIME &&
                    this.savedTimeInput.nativeElement.value === EMPTY_TIME
                ) {
                    this.onlyQuitButton = true;
                }
            } else {
                this.timeValid[index] = false;
                this.onlyQuitButton = true;
            }
            this.validateTimesRatio();
        }
    }

    private setDefaultValue() {
        if (this.initialTimeInput.nativeElement.value === EMPTY_TIME) {
            this.initialTimeInput.nativeElement.value = DEFAULT_INITIAL_TIME;
        }
        if (this.penaltyTimeInput.nativeElement.value === EMPTY_TIME) {
            this.penaltyTimeInput.nativeElement.value = DEFAULT_PENALTY_TIME;
        }
        if (this.savedTimeInput.nativeElement.value === EMPTY_TIME) {
            this.savedTimeInput.nativeElement.value = DEFAULT_SAVED_TIME;
        }
    }

    private verifyTimeRange(time: ElementRef) {
        let minimumTime = 0;
        let maximumTime = 0;

        if (time === this.initialTimeInput) {
            minimumTime = this.minTimeConstants.initialTime;
            maximumTime = this.maxTimeConstants.initialTime;
        }
        if (time === this.penaltyTimeInput) {
            minimumTime = this.minTimeConstants.penaltyTime;
            maximumTime = this.maxTimeConstants.penaltyTime;
        }
        if (time === this.savedTimeInput) {
            minimumTime = this.minTimeConstants.savedTime;
            maximumTime = this.maxTimeConstants.savedTime;
        }

        return time.nativeElement.value >= minimumTime && time.nativeElement.value <= maximumTime;
    }
}
