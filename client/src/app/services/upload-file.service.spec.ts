import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { CommunicationService } from './communication.service';
import { UploadFileService } from './upload-file.service';
import SpyObj = jasmine.SpyObj;

describe('UploadFileService', () => {
  let mockEmitterhttpPost: Subject<Object>;
  let service: UploadFileService;
  let communicationServiceSpy:SpyObj<CommunicationService>

  beforeEach(() => {
    communicationServiceSpy = jasmine.createSpyObj('CommunicationService',['uploadFiles'])
    TestBed.configureTestingModule({
      providers:[{provide : CommunicationService,useValue : communicationServiceSpy}]
    });
    service = TestBed.inject(UploadFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should verify getter and setter of original Image',()=>{
    let mockIndex:number= 2
    let mockFile = new File([""], "filename", { type: 'text/html' });
    service.setOriginalImage(mockFile,mockIndex)
    expect(service.getNameOriginalImage()).toEqual(mockFile);
  })

  it('should verify getter and setter of modified Image',()=>{
    let mockIndex:number= 2
    let mockFile = new File([""], "filename", { type: 'text/html' });
    service.setModifiedImage(mockFile,mockIndex)
    expect(service.getNameModifiedImage()).toEqual(mockFile);
  })

  it('should verify if I go through uploadFiles nad reach subscribe inside',()=>{
    let mockFile = new File([""], "filename", { type: 'text/html' });
    service.upload(mockFile)
    const spy = communicationServiceSpy.uploadFiles.and.returnValue(mockEmitterhttpPost);
    mockEmitterhttpPost.next([])
    expect(spy).toHaveBeenCalled()
  })


});
