import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableImagesComponent } from './editable-images.component';

describe('EditableImagesComponent', () => {
  let component: EditableImagesComponent;
  let fixture: ComponentFixture<EditableImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableImagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditableImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
