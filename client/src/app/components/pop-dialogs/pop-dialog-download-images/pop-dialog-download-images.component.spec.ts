import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopDialogDownloadImagesComponent } from './pop-dialog-download-images.component';

describe('PopDialogDownloadImagesComponent', () => {
    let component: PopDialogDownloadImagesComponent;
    let fixture: ComponentFixture<PopDialogDownloadImagesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogDownloadImagesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogDownloadImagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
