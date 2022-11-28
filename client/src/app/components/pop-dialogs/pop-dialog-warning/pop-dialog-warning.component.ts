import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-pop-dialog-warning',
    templateUrl: './pop-dialog-warning.component.html',
    styleUrls: ['./pop-dialog-warning.component.scss'],
})
export class PopDialogWarningComponent implements OnInit {
    private value: boolean;
    constructor(public dialogRef: MatDialogRef<PopDialogWarningComponent>) {}

    ngOnInit(): void {}

    applyAction() {
        this.value = true;
        this.dialogRef.close({ event: 'Oui', data: this.value });
    }

    cancelAction() {
        this.value = false;
        this.dialogRef.close({ event: 'Non' });
    }
}
