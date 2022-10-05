
import { TestBed } from '@angular/core/testing';
import { VerifyImageService } from './verify-image.service';
import { UploadFileService } from './upload-file.service';
import SpyObj = jasmine.SpyObj;
const mockEventFile = {
  target: {
    files: [
      new Blob([""], { type: 'text/html' }),
    ],
  },
}

class MatDialogMock {
  open() {
      return;
  }
}

describe('VerifyImageService', () => {
  let service: VerifyImageService;
  let uploadFileSpy: SpyObj<UploadFileService>;

  beforeEach(() => {
    uploadFileSpy = jasmine.createSpyObj('UploadFileService',['setOriginalImage','setModifiedImage'])
    uploadFileSpy.setModifiedImage.and.returnValue();
    uploadFileSpy.setOriginalImage.and.returnValue();
    TestBed.configureTestingModule({
      providers:[{provide: UploadFileService,useValue: uploadFileSpy}]
    });
    service = TestBed.inject(VerifyImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the file',()=>{
    const imageToSend = new File([""], "filename", { type: 'text/html' });
    service.setFile(imageToSend);
    expect(service.file).toEqual(imageToSend)
  })
  it('should test process Buffer',()=>{
    const spyGettingBmp = spyOn<any>(service,'getBmp').and.returnValue({})
    const spyTransformation = spyOn<any>(service,'transformByteToImage').and.returnValue({})

    service.processBuffer(mockEventFile);

    expect(spyGettingBmp).toHaveBeenCalled()
    expect(spyTransformation).toHaveBeenCalled()
  })

  it('it should call transformByteToImage',()=>{
    let bufferMock = "buffer"
    let srcMock = 'string'
    service.transformByteToImage(bufferMock);
    expect(typeof service.getImage().src).toEqual(srcMock );

  })

  it('it should call all functions in sendImageRespetContraints and the warning should be false',()=>{
    const spyConstraint = spyOn<any>(service,'verifyImageConstraint').and.returnValue(true)
    const spyTransformation = spyOn<any>(service,'verifyImageFormat').and.returnValue(true)
    const spySentMultipleOrSingle = spyOn<any>(service,'verifyIfSentMultipleOrSingle').and.returnValue(true)
    const spygetBitDepth = spyOn<any>(service,'getBitDepth').and.returnValue(24)
    let mockDialog :MatDialogMock = {
      open() {
        return;
  }}; 
    const imageToSend = new File([""], "filename", { type: 'text/html' });
    const isWarningActivated = service.verifyRespectAllContraints(mockDialog,imageToSend)
    expect(spyConstraint).toHaveBeenCalled()
    expect(spyTransformation).toHaveBeenCalled()
    expect(spySentMultipleOrSingle).toHaveBeenCalled()
    expect(spygetBitDepth).toHaveBeenCalled()
    expect(isWarningActivated).toBeFalsy()

  })

  it('it should call all functions in sendImageRespetContraints and the warning should be true',()=>{
    spyOn<any>(service,'verifyImageConstraint').and.returnValue(true)
    spyOn<any>(service,'verifyImageFormat').and.returnValue(false)
    spyOn<any>(service,'verifyIfSentMultipleOrSingle').and.returnValue(true)
    spyOn<any>(service,'getBitDepth').and.returnValue(24)
    let mockDialog :MatDialogMock = {
      open() {
        return;
  }}; 
    const imageToSend = new File([""], "filename", { type: 'text/html' });
    expect(service.verifyRespectAllContraints(mockDialog,imageToSend)).toBeTruthy()

  })

  it('should gave same value getBitDeptj to bitDepth of service',()=>{
    service.bitDepth = 10;
    let answerExpect = 10;
    expect(service.getBitDepth()).toEqual(answerExpect)

  })

  it('should give true when right type when doing this function verifyImageFormat',()=>{
    const imageToSend = new File([""], "filename", { type: 'image/bmp' });
    service.verifyImageFormat(imageToSend);
    expect(service.verifyImageFormat(imageToSend)).toBeTruthy

  })

  it('should verifyImageWidthHeight give true when we have right height and width ',()=>{
    const fakeWidth = 640;
    const fakeHeight = 480;
    service.imageToVerify.width = 640;
    service.imageToVerify.height = 480;

    expect(service.verifyImageWidthHeight(fakeWidth,fakeHeight)).toBeTruthy

  })

  it('should verifyImageWidthHeight give true when we have right height and width ',()=>{
    const fakeWidth = 640;
    const fakeHeight = 200;
    service.imageToVerify.width = 640;
    service.imageToVerify.height = 480;

    expect(service.verifyImageWidthHeight(fakeWidth,fakeHeight)).toBeFalsy()

  })

  it('should verifyImageConstraint be called and return true',()=>{
    const spy = spyOn<any>(service,'verifyImageWidthHeight').and.returnValue(true)
    service.verifyImageConstraint()

    expect(spy).toBeTruthy()

  })

  it('should verifyIfSentMultipleOrSingle both ',()=>{
    const fakeUrlInfo = "string";
    const fakeDialog = {
      bothImage: true,
    }


    service.verifyIfSentMultipleOrSingle(fakeUrlInfo,fakeDialog)
    expect(service.verifyIfSentMultipleOrSingle(fakeUrlInfo,fakeDialog)).toBe()

  })

  it('should update single original file ',()=>{
    const fakeUrlInfo = "string";
    const fakeDialog = {
      bothImage: false,
      indexOfImage:0
    }

    uploadFileSpy.setModifiedImage.and.returnValue();
    let spy = uploadFileSpy.setOriginalImage.and.returnValue();
    service.verifyIfSentMultipleOrSingle(fakeUrlInfo,fakeDialog)
    expect(service.verifyIfSentMultipleOrSingle(fakeUrlInfo,fakeDialog)).toBe()
    expect(spy).toHaveBeenCalled()
  })

  it('should update single modified filed ',()=>{
    const fakeUrlInfo = "string";
    const fakeDialog = {
      bothImage: false,
      indexOfImage:1
    }

    let spy = uploadFileSpy.setModifiedImage.and.returnValue();
    service.verifyIfSentMultipleOrSingle(fakeUrlInfo,fakeDialog)
    expect(service.verifyIfSentMultipleOrSingle(fakeUrlInfo,fakeDialog)).toBe()
    expect(spy).toHaveBeenCalled()
  })



  
});
