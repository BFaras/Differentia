import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';
import { ToolSettingComponent } from '@app/components/tool-setting/tool-setting.component';
import { GameToServerService } from '@app/services/game-to-server.service';
import { ListImagesRenderedService } from '@app/services/list-images-rendered.service';
import { ImageToSendToServer } from '@common/imageToSendToServer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject } from 'rxjs';
import { GameCreationPageComponent } from './game-creation-page.component';
import SpyObj = jasmine.SpyObj;
import { Component } from '@angular/core';
@Component({ selector: 'app-list-images-rendered', template: '' })
class ListImagesRenderedComponent {}

describe('GameCreationPageComponent', () => {
    let component: GameCreationPageComponent;
    let fixture: ComponentFixture<GameCreationPageComponent>;
    const dialogRefSpyObj = jasmine.createSpyObj({ close: null });
    let dialogSpy: jasmine.Spy;
    dialogRefSpyObj.componentInstance = { body: '' };
    let listImagesRenderedSpy: SpyObj<ListImagesRenderedService>;
    let gameToServerServiceSpy: SpyObj<GameToServerService>;
    let mockEmitterGetIDToRemove: Subject<unknown>;
    let mockEmitterGetSingleImage: Subject<{ index: number; url: string }>;
    let mockEmitterGetMultipleImage: Subject<string>;
    let mockImageToSerever: ImageToSendToServer;

    beforeEach(async () => {
        mockImageToSerever = {
            image: 'url',
            index: 2,
        };
        mockEmitterGetIDToRemove = new Subject();
        mockEmitterGetSingleImage = new Subject();
        mockEmitterGetMultipleImage = new Subject();
        listImagesRenderedSpy = jasmine.createSpyObj('ListImagesRenderedService', [
            'getIdImageToRemoveObservable',
            'getDataImageSingleObservable',
            'getDataImageMultipleObservable',
        ]);
        listImagesRenderedSpy.getIdImageToRemoveObservable.and.returnValue(mockEmitterGetIDToRemove);
        listImagesRenderedSpy.getDataImageSingleObservable.and.returnValue(mockEmitterGetSingleImage);
        listImagesRenderedSpy.getDataImageMultipleObservable.and.returnValue(mockEmitterGetMultipleImage);
        gameToServerServiceSpy = jasmine.createSpyObj('gameToServerServiceSpy', [
            'setOriginalUrlUploaded',
            'setModifiedUrlUploaded',
            'getModifiedImageUploaded',
            'getOriginalImageUploaded',
        ]);
        gameToServerServiceSpy.setOriginalUrlUploaded.and.returnValue();
        gameToServerServiceSpy.setModifiedUrlUploaded.and.returnValue();
        gameToServerServiceSpy.getModifiedImageUploaded.and.returnValue(mockImageToSerever);
        gameToServerServiceSpy.getOriginalImageUploaded.and.returnValue(mockImageToSerever);
        await TestBed.configureTestingModule({
            declarations: [GameCreationPageComponent, ToolSettingComponent, ListImagesRenderedComponent],
            imports: [
                MatDialogModule,
                RouterTestingModule.withRoutes([]),
                MatProgressSpinnerModule,
                MatIconModule,
                FormsModule,
                MatSelectModule,
                MatIconModule,
                FontAwesomeModule,
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: ListImagesRenderedService, useValue: listImagesRenderedSpy },
                { provide: GameToServerService, useValue: gameToServerServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCreationPageComponent);
        dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create a pop modal', () => {
        component.onCreateDownloadPopDialog();
        expect(dialogSpy).toHaveBeenCalled();
    });

    it('should create a pop modal', () => {
        component.onCreateValidatePopDialog();
        expect(dialogSpy).toHaveBeenCalled();
    });

    it('should verify getDataMultiple', () => {
        mockEmitterGetMultipleImage.next('string');
        expect(gameToServerServiceSpy.setOriginalUrlUploaded).toHaveBeenCalled();
        expect(gameToServerServiceSpy.setModifiedUrlUploaded).toHaveBeenCalled();
    });

    it('should verify setting Original url', () => {
        mockEmitterGetSingleImage.next({ index: 0, url: 'string' });
        expect(gameToServerServiceSpy.setOriginalUrlUploaded).toHaveBeenCalled();
    });

    it('should verify setting modified url', () => {
        mockEmitterGetSingleImage.next({ index: 1, url: 'string' });
        expect(gameToServerServiceSpy.setModifiedUrlUploaded).toHaveBeenCalled();
    });

    it('verify imageUpload', () => {
        expect(component.verifyTwoImagesUploaded()).toBeFalsy();
    });

    it('should test getIdImageToRemove', () => {
        mockEmitterGetIDToRemove.next(0);
        expect(gameToServerServiceSpy.setOriginalUrlUploaded).toHaveBeenCalled();
    });
});
