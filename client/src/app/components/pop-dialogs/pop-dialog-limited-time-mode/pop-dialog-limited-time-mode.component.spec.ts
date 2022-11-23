import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopDialogLimitedTimeModeComponent } from './pop-dialog-limited-time-mode.component';

describe('PopDialogLimitedTimeModeComponent', () => {
  let component: PopDialogLimitedTimeModeComponent;
  let fixture: ComponentFixture<PopDialogLimitedTimeModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopDialogLimitedTimeModeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopDialogLimitedTimeModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
