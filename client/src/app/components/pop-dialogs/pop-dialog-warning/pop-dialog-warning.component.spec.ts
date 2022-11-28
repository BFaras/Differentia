import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopDialogWarningComponent } from './pop-dialog-warning.component';

describe('PopDialogWarningComponent', () => {
  let component: PopDialogWarningComponent;
  let fixture: ComponentFixture<PopDialogWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopDialogWarningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopDialogWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
