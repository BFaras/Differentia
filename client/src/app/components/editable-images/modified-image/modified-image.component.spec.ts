import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifiedImageComponent } from './modified-image.component';

describe('ModifiedImageComponent', () => {
  let component: ModifiedImageComponent;
  let fixture: ComponentFixture<ModifiedImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifiedImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifiedImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
