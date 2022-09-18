import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopDialogValidateGameComponent } from './pop-dialog-validate-game.component';

describe('PopDialogValidateGameComponent', () => {
  let component: PopDialogValidateGameComponent;
  let fixture: ComponentFixture<PopDialogValidateGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopDialogValidateGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopDialogValidateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
