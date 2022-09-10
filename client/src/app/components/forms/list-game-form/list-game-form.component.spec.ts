import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGameFormComponent } from './list-game-form.component';

describe('ListGameFormComponent', () => {
  let component: ListGameFormComponent;
  let fixture: ComponentFixture<ListGameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGameFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
