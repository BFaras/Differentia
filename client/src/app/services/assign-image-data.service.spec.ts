import { TestBed } from '@angular/core/testing';
import { AssignImageDataService } from './assign-image-data.service';
describe('AssignImageDataService', () => {
  let service: AssignImageDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignImageDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return isImageObtained through a function ' , ()=>{
    service.isImageObtained = true;
    expect(service.getIsImageObtained()).toBeTruthy()
  })

  it('should return urlImage through a function ', ()=>{
    service.urlImage = "string";
    expect(service.getUrlImage()).toEqual(service.urlImage)
  })

  it('should assign variable To imageData  ', ()=>{
    let mockDataImage = {
      index: 2,
      url :"fakeUrl"
    }
    service.assignImageData(mockDataImage);
    expect(service.urlImage).toEqual(mockDataImage.url);
    expect(service.isImageObtained).toBeTruthy()

  })

  it('should delete image and isImageObtained should be false ', ()=>{
    let mockUrlImage = "";
    service.deleteImage();
    expect(service.isImageObtained).toBeFalsy()
    expect(service.urlImage).toEqual(mockUrlImage)

  })

  it('should assignMultipleImageData change url Image and change isImageObtained value',()=>{
    let mockUrl = "some url";
    service.assignMultipleImageData(mockUrl)
    expect(service.isImageObtained).toBeTruthy()
    expect(service.urlImage).toEqual(mockUrl)
  })





});
