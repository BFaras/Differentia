import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopDialogDownloadImagesComponent } from '@app/components/pop-dialogs/pop-dialog-download-images/pop-dialog-download-images.component';
import { PopDialogValidateGameComponent } from '@app/components/pop-dialogs/pop-dialog-validate-game/pop-dialog-validate-game.component';
import { ImageRenderedInformations } from '@app/interfaces/image-rendered-informations';
import { GameToServerService } from '@app/services/game-to-server.service';
import { ListImagesRenderedService } from '@app/services/list-images-rendered.service';
import { MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';
@Component({
    selector: 'app-game-creation-page',
    templateUrl: './game-creation-page.component.html',
    styleUrls: ['./game-creation-page.component.scss'],
})
export class GameCreationPageComponent implements OnInit {
    constructor(private dialog: MatDialog, private editImageService: ListImagesRenderedService, private gameToServerService: GameToServerService) {}

    ngOnInit(): void {
        this.gameToServerService.setOriginalUrlUploaded(undefined, undefined);
        this.gameToServerService.setModifiedUrlUploaded(undefined, undefined);
        this.subscirbeToGetDataImageMultiple();
        this.subscirbeToGetDataImageSingle();
        this.subscirbeToGetIdImageToRemove();
    }

    private subscirbeToGetDataImageMultiple() {
        this.editImageService.getDataImageMultipleObservable().subscribe((url: any) => {
            this.gameToServerService.setOriginalUrlUploaded(ORIGINAL_IMAGE_POSITION, url);
            this.gameToServerService.setModifiedUrlUploaded(MODIFIED_IMAGE_POSITION, url);
        });
    }

    private subscirbeToGetDataImageSingle() {
        this.editImageService.getDataImageSingleObservable().subscribe((dataOfImage: ImageRenderedInformations) => {
            if (dataOfImage.index == ORIGINAL_IMAGE_POSITION) {
                this.gameToServerService.setOriginalUrlUploaded(dataOfImage.index, dataOfImage.url);
            } else if (dataOfImage.index == MODIFIED_IMAGE_POSITION) {
                this.gameToServerService.setModifiedUrlUploaded(dataOfImage.index, dataOfImage.url);
            }
        });
    }

    private subscirbeToGetIdImageToRemove() {
        this.editImageService.getIdImageToRemoveObservable().subscribe((indexImage: number | undefined) => {
            if (this.gameToServerService.getModifiedImageUploaded().index == indexImage) {
                this.gameToServerService.setModifiedUrlUploaded(undefined, undefined);
            } else if (this.gameToServerService.getOriginalImageUploaded().index == indexImage) {
                this.gameToServerService.setOriginalUrlUploaded(undefined, undefined);
            }
        });
    }

    verifyTwoImagesUploaded() {
        if (
            this.gameToServerService.getOriginalImageUploaded().index === undefined ||
            this.gameToServerService.getModifiedImageUploaded().index === undefined
        ) {
            return true;
        } else {
            return false;
        }
    }

    onCreateDownloadPopDialog() {
        this.dialog.open(PopDialogDownloadImagesComponent, {
            height: '400px',
            width: '600px',
            data: {
                bothImage: true,
            },
        });
    }

    onCreateValidatePopDialog() {
        this.dialog.open(PopDialogValidateGameComponent, {
            height: '400px',
            width: '600px',
        });
    }
}
