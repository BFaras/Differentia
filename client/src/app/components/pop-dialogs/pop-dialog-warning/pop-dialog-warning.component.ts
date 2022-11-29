import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-pop-dialog-warning',
    templateUrl: './pop-dialog-warning.component.html',
    styleUrls: ['./pop-dialog-warning.component.scss'],
})
export class PopDialogWarningComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<PopDialogWarningComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string,
        private socketService: SocketClientService,
    ) {}

    ngOnInit(): void {}

    applyAction() {
        this.socketService.send('Apply action');
        this.dialogRef.close();
    }

    cancelAction() {
        this.dialogRef.close();
    }
}
