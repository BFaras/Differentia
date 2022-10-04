import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopDialogEndgameComponent } from './pop-dialog-endgame.component';

describe('PopDialogEndgameComponent', () => {
  let component: PopDialogEndgameComponent;
  let fixture: ComponentFixture<PopDialogEndgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopDialogEndgameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopDialogEndgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
