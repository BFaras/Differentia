import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { VerifyImageService } from '@app/services/verify-image.service';
import { PopDialogDownloadImagesComponent } from './pop-dialog-download-images.component';
import SpyObj = jasmine.SpyObj;

const mockEventFileRightType = {
    target: {
        files: [new Blob([''], { type: 'image/bmp' })],
    },
};
const mockEventFileWrongType = {
    target: {
        files: [new Blob([''], { type: 'file/text' })],
    },
};

describe('PopDialogDownloadImagesComponent', () => {
    let component: PopDialogDownloadImagesComponent;
    let fixture: ComponentFixture<PopDialogDownloadImagesComponent>;
    let verifyImageServiceSpy: SpyObj<VerifyImageService>;
    const imageToMock = new Image();

    beforeEach(async () => {
        imageToMock.src = 'string';
        verifyImageServiceSpy = jasmine.createSpyObj('VerifyImageService', [
            'setFile',
            'processBuffer',
            'getImage',
            'verifyRespectAllContraints',
            'getWarningActivated',
        ]);
        verifyImageServiceSpy.processBuffer.and.returnValue();

        verifyImageServiceSpy.getImage.and.returnValue(imageToMock);
        verifyImageServiceSpy.setFile.and.returnValue();
        await TestBed.configureTestingModule({
            declarations: [PopDialogDownloadImagesComponent],
            imports: [MatIconModule, MatDialogModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: VerifyImageService, useValue: verifyImageServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogDownloadImagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should give warning', () => {
        component.onClickUploadImage(mockEventFileWrongType);
        expect(component.warningActivated).toBeTruthy();
    });

    it('should call function setFile', () => {
        component.onClickUploadImage(mockEventFileRightType);
        expect(verifyImageServiceSpy.setFile).toHaveBeenCalled();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });
});
