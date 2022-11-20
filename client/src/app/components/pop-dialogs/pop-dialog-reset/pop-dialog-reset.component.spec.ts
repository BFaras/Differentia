import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopDialogResetComponent } from './pop-dialog-reset.component';

describe('PopDialogResetComponent', () => {
  let component: PopDialogResetComponent;
  let fixture: ComponentFixture<PopDialogResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopDialogResetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopDialogResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
