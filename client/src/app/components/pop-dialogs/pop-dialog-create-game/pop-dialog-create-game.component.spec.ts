import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopDialogCreateGameComponent } from './pop-dialog-create-game.component';

describe('PopDialogCreateGameComponent', () => {
  let component: PopDialogCreateGameComponent;
  let fixture: ComponentFixture<PopDialogCreateGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopDialogCreateGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopDialogCreateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  

});
