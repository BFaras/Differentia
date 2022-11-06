import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ListImagesRenderedService } from '@app/services/list-images-rendered.service';
import { HeaderImageComponent } from './header-image.component';

class MatDialogMock {
    open() {
        return;
    }
}

describe('HeaderImageComponent', () => {
    let component: HeaderImageComponent;
    let fixture: ComponentFixture<HeaderImageComponent>;
    let editImagesServiceSpy: jasmine.SpyObj<ListImagesRenderedService>;

    beforeEach(async () => {
        editImagesServiceSpy = jasmine.createSpyObj('EditImagesService', ['sendIdImageToRemove']);
        editImagesServiceSpy.sendIdImageToRemove.and.returnValue();
        await TestBed.configureTestingModule({
            declarations: [HeaderImageComponent],
            providers: [
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: ListImagesRenderedService, useValue: editImagesServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderImageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open a mock if we use method onCreateDownload', () => {
        const spy = spyOn(component['dialog'], 'open');
        component.onCreateDownloadPopDialog();
        expect(spy).toHaveBeenCalled();
    });

    it('should do an emit when using EventEmitter', () => {
        component.onDeleteImage();
        expect(component['editImagesService'].sendIdImageToRemove).toHaveBeenCalled();
    });
});
