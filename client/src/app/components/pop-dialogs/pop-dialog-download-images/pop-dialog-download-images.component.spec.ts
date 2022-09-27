import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { VerifyImageService } from '@app/services/verify-image.service';
import { PopDialogDownloadImagesComponent } from './pop-dialog-download-images.component';
import SpyObj = jasmine.SpyObj;

const mockEventFile = {
    target: {
      files: [
        new Blob([""], { type: 'text/html' }),
      ],
    },
  }
  

describe('PopDialogDownloadImagesComponent', () => {
    let component: PopDialogDownloadImagesComponent;
    let fixture: ComponentFixture<PopDialogDownloadImagesComponent>;
    let verifyImageServiceSpy :  SpyObj<VerifyImageService>;
    let imageToMock = new Image() ;

    beforeEach(async () => {
        imageToMock.src = "string";
        verifyImageServiceSpy = jasmine.createSpyObj('VerifyImageService', 
        ['processBuffer', 'getImage', 'verifyRespectAllContraints','getWarningActivated']);
        verifyImageServiceSpy.verifyRespectAllContraints.and.returnValue(true);
        verifyImageServiceSpy.processBuffer.and.returnValue();
        verifyImageServiceSpy.getImage.and.returnValue(imageToMock);
        await TestBed.configureTestingModule({
            declarations: [PopDialogDownloadImagesComponent],
            imports: [ MatIconModule,MatDialogModule ],
            providers:[
                { provide: MAT_DIALOG_DATA, useValue: {}},
                { provide: VerifyImageService, useValue: verifyImageServiceSpy } 
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogDownloadImagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should give warning',()=>{
        setTimeout(function() {

        verifyImageServiceSpy.verifyRespectAllContraints.and.returnValue(true);
        component.onClickUploadImage(mockEventFile)
        expect(component.warningActivated).toBeTruthy();  
      
          }, 300);

    })

    it('should not give warning', ()=>{
        verifyImageServiceSpy.verifyRespectAllContraints.and.returnValue(false);
        component.onClickUploadImage(mockEventFile)
        expect(component.warningActivated).toBeFalsy()
    })

    

});
