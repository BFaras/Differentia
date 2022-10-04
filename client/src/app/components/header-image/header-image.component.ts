import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ListImagesRenderedService } from '@app/services/list-images-rendered.service';
import { PopDialogDownloadImagesComponent } from '../pop-dialogs/pop-dialog-download-images/pop-dialog-download-images.component';

@Component({
    selector: 'app-header-image',
    templateUrl: './header-image.component.html',
    styleUrls: ['./header-image.component.scss'],
})
export class HeaderImageComponent implements OnInit {
    @Input() indexOfImageToSend: number;
    constructor(public dialog: MatDialog, public editImagesService: ListImagesRenderedService) {}

    ngOnInit(): void {}

    onCreateDownloadPopDialog() {
        this.dialog.open(PopDialogDownloadImagesComponent, {
            height: '400px',
            width: '600px',
            data: {
                indexOfImage: this.indexOfImageToSend,
                bothImage: false,
            },
        });
    }

    onDeleteImage() {
        this.editImagesService.sendIdImageToRemove(this.indexOfImageToSend);
    }
}
