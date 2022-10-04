import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopDialogUsernameComponent } from './pop-dialog-username.component';

describe('PopDialogUsernameComponent', () => {
  let component: PopDialogUsernameComponent;
  let fixture: ComponentFixture<PopDialogUsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopDialogUsernameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopDialogUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
