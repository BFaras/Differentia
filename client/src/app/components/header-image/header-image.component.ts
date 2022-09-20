import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditImagesService } from '@app/services/edit-images.service';
import { PopDialogDownloadImagesComponent } from '../pop-dialogs/pop-dialog-download-images/pop-dialog-download-images.component';

@Component({
    selector: 'app-header-image',
    templateUrl: './header-image.component.html',
    styleUrls: ['./header-image.component.scss'],
})
export class HeaderImageComponent implements OnInit {
    @Input() indexOfImageToSend: number;
    constructor(private dialog: MatDialog, private editImagesService: EditImagesService) {}

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
        this.editImagesService.activatedEmitterRemoveImage.emit(this.indexOfImageToSend);
    }
}
