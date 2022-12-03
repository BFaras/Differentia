import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MergeImageCanvasHandlerService } from '@app/services/merge-image-canvas-handler.service';
import { PopDialogValidateGameComponent } from './pop-dialog-validate-game.component';

describe('PopDialogValidateGameComponent', () => {
    let component: PopDialogValidateGameComponent;
    let fixture: ComponentFixture<PopDialogValidateGameComponent>;
    let dialogRefSpyObj = jasmine.createSpyObj({ close: null });
    let dialogSpy: jasmine.Spy;
    dialogRefSpyObj.componentInstance = { body: '' };

    beforeEach(async () => {
        const mergeImageCanvasServiceMock = jasmine.createSpyObj('MergeImageCanvasHandlerService', ['resetCanvas']);

        await TestBed.configureTestingModule({
            declarations: [PopDialogValidateGameComponent],
            imports: [MatDialogModule],
            providers: [{ provide: MergeImageCanvasHandlerService, useValue: mergeImageCanvasServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogValidateGameComponent);
        dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create a pop modal', () => {
        component.onCreateCreateGame();
        expect(dialogSpy).toHaveBeenCalled();
    });

    it('should change the value of the radius', () => {
        const mockValue = 3;
        component.onRadiusChanged(mockValue);
        expect(component.valueChosen).toEqual(mockValue);
    });

    it('should change to true if value chosen in not null', () => {
        const mockValue = 5;
        component.valueChosen = mockValue;
        component.startsGeneratingImageDifferenceAndNumberDifference();
        expect(component.isImageDifferenceReady).toBeTruthy();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });
});
