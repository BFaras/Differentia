import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignImageDataService } from '@app/services/assign-image-data.service';
import { ListImagesRenderedService } from '@app/services/list-images-rendered.service';
import { Subject } from 'rxjs';
import { ImageRenderedComponent } from './image-rendered.component';
import SpyObj = jasmine.SpyObj;

describe('ImageRenderedComponent', () => {
    let component: ImageRenderedComponent;
    let fixture: ComponentFixture<ImageRenderedComponent>;
    let listImagesRenderedSpy: SpyObj<ListImagesRenderedService>;
    let assignImageDataSpy: SpyObj<AssignImageDataService>
    let mockEmitterGetIDToRemove: Subject<unknown>;
    let mockEmitterGetSingleImage: Subject<{ index: number; url: string }>;
    let mockEmitterGetMultipleImage: Subject<string>;

    beforeEach(async () => {
        mockEmitterGetIDToRemove = new Subject();
        mockEmitterGetSingleImage = new Subject();
        mockEmitterGetMultipleImage = new Subject();
        listImagesRenderedSpy = jasmine.createSpyObj('ListImagesRenderedService', ['getIdImageToRemove', 'getDataImageSingle', 'getDataImageMultiple']);
        listImagesRenderedSpy.getIdImageToRemove.and.returnValue(mockEmitterGetIDToRemove);
        listImagesRenderedSpy.getDataImageSingle.and.returnValue(mockEmitterGetSingleImage);
        listImagesRenderedSpy.getDataImageMultiple.and.returnValue(mockEmitterGetMultipleImage);
        assignImageDataSpy = jasmine.createSpyObj('AssignImageDataService',[
            'getIsImageObtained','getUrlImage','assignImageData',
            'deleteImage','assignMultipleImageData'])
        
        await TestBed.configureTestingModule({
            declarations: [ImageRenderedComponent],
            providers: [{ provide: ListImagesRenderedService, useValue: listImagesRenderedSpy },
                { provide: AssignImageDataService, useValue: assignImageDataSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageRenderedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should test subscription of getIdImageToRemove ', () => {
        component.idFromParent = 4
        mockEmitterGetIDToRemove.next(4);
        const spyDelete = assignImageDataSpy.deleteImage.and.returnValue()
        expect(spyDelete).toHaveBeenCalled();
    });

    it('should change value of is image Obtained and get url image', () => {
        const mokUrl = "url"
        const mockBool = true;
        assignImageDataSpy.getIsImageObtained.and.returnValue(mockBool)
        assignImageDataSpy.getUrlImage.and.returnValue(mokUrl)
        component.updateIsImageObtainedAndUrl()
        expect(component.isImageObtained).toBeTruthy()
        expect(component.urlImage).toEqual(mokUrl)
    });

    it('should try getDataSingleImage ',()=>{
        component.idFromParent = 4
        mockEmitterGetSingleImage.next({index : 4, url :"url"})
        const spyAssignImageData = assignImageDataSpy.assignImageData.and.returnValue()
        component.getDeletedImageId()
        expect(spyAssignImageData).toHaveBeenCalled()

    })

    it('should get data multiple Images',()=>{
        const mockUrl = "url"
        mockEmitterGetMultipleImage.next(mockUrl)
        const spy = assignImageDataSpy.assignMultipleImageData.and.returnValue()
        component.getDataMultipleImage()
        expect(spy).toHaveBeenCalled()

    })
});
