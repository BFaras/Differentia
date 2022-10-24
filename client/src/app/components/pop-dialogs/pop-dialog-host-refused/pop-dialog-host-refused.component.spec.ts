import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopDialogHostRefusedComponent } from './pop-dialog-host-refused.component';

describe('PopDialogHostRefusedComponent', () => {
  let component: PopDialogHostRefusedComponent;
  let fixture: ComponentFixture<PopDialogHostRefusedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopDialogHostRefusedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopDialogHostRefusedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
