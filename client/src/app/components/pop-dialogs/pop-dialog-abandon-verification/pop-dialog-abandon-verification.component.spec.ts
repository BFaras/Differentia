import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopDialogAbandonVerificationComponent } from './pop-dialog-abandon-verification.component';

describe('PopDialogAbandonVerificationComponent', () => {
  let component: PopDialogAbandonVerificationComponent;
  let fixture: ComponentFixture<PopDialogAbandonVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopDialogAbandonVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopDialogAbandonVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
