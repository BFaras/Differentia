import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginalImageComponent } from './original-image.component';

describe('OriginalImageComponent', () => {
  let component: OriginalImageComponent;
  let fixture: ComponentFixture<OriginalImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OriginalImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OriginalImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
