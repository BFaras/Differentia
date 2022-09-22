import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditImagesService } from '@app/services/edit-images.service';
import { Subject } from 'rxjs';
import { ModifiedImageComponent } from './modified-image.component';
import SpyObj = jasmine.SpyObj;

describe('ModifiedImageComponent', () => {
    let component: ModifiedImageComponent;
    let fixture: ComponentFixture<ModifiedImageComponent>;
    let communicationServiceSpy: SpyObj<EditImagesService>;
    let mockEmitterGetIDToRemove: Subject<unknown>;
    let mockEmitterGetSingleImage: Subject<{ index: number; url: string }>;
    let mockEmitterGetMultipleImage: Subject<string>;

    beforeEach(async () => {
        mockEmitterGetIDToRemove = new Subject();
        mockEmitterGetSingleImage = new Subject();
        mockEmitterGetMultipleImage = new Subject();
        communicationServiceSpy = jasmine.createSpyObj('EditImagesService', ['getIdImageToRemove', 'getDataImageSingle', 'getDataImageMultiple']);
        communicationServiceSpy.getIdImageToRemove.and.returnValue(mockEmitterGetIDToRemove);
        communicationServiceSpy.getDataImageSingle.and.returnValue(mockEmitterGetSingleImage);
        communicationServiceSpy.getDataImageMultiple.and.returnValue(mockEmitterGetMultipleImage);
        await TestBed.configureTestingModule({
            declarations: [ModifiedImageComponent],
            providers: [{ provide: EditImagesService, useValue: communicationServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModifiedImageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should test subscription of getIdImageToRemove ', () => {
        const spy = spyOn(component, 'deleteImage');
        mockEmitterGetIDToRemove.next(1);
        expect(spy).toHaveBeenCalled();
    });

    it('should test subscription of getDataImageSingle ', () => {
        const spy = spyOn(component, 'assignImageData');
        mockEmitterGetSingleImage.next({ index: 1, url: 'string' });
        expect(spy).toHaveBeenCalled();
    });

    it('should test subscription of getDataMultipleImage ', () => {
        const spy = spyOn(component, 'assignMultipleImageData');
        mockEmitterGetMultipleImage.next('string');
        expect(spy).toHaveBeenCalled();
    });

    it('should delete image if it s the right index', () => {
        component.idFromParent = 1;
        component.deleteImage(1);
        expect(component.secondImageObtained).toBeFalsy();
    });

    it('should not delete image if it s wrong index', () => {
        component.idFromParent = 2;
        component.deleteImage(1);
        expect(component.secondImageObtained).not.toBeDefined();
    });

    it('should assign imageData to variable if it s the right index', () => {
        const mockValue = { index: 1, url: 'string' };
        component.idFromParent = 1;
        component.assignImageData(mockValue);
        expect(component.secondImageObtained).toBeTruthy();
        expect(component.urlImageSecond).toEqual(mockValue.url);
        expect(component.idFromParent).toEqual(mockValue.index);
    });

    it('shoulda not assign imageData to variable if it s not the right index', () => {
        const mockValue = { index: 2, url: 'string' };
        component.assignImageData(mockValue);
        expect(component.secondImageObtained).not.toBeDefined();
        expect(component.urlImageSecond).not.toBeDefined();
        expect(component.idFromParent).not.toBeDefined();
    });

    it('should assign Url to variable if it s the right index', () => {
        const mockValue = { index: 1, url: 'string' };
        component.idFromParent = 1;
        component.assignMultipleImageData(mockValue.url);
        expect(component.secondImageObtained).toBeTruthy();
        expect(component.urlImageSecond).toEqual(mockValue.url);
        expect(component.idFromParent).toEqual(mockValue.index);
    });
});
