import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePageOnevoneComponent } from './game-page-onevone.component';

describe('GamePageOnevoneComponent', () => {
  let component: GamePageOnevoneComponent;
  let fixture: ComponentFixture<GamePageOnevoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamePageOnevoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePageOnevoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
