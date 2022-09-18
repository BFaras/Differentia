import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopDialogDownloadImagesComponent } from '../pop-dialogs/pop-dialog-download-images/pop-dialog-download-images.component';
@Component({
    selector: 'app-header-image',
    templateUrl: './header-image.component.html',
    styleUrls: ['./header-image.component.scss'],
})
export class HeaderImageComponent implements OnInit {
    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {}

    onCreateDownloadPopDialog() {
        this.dialog.open(PopDialogDownloadImagesComponent, {
            height: '400px',
            width: '600px',
        });
    }
}
