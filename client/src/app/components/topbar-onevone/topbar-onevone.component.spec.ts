import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarOnevoneComponent } from './topbar-onevone.component';

describe('TopbarOnevoneComponent', () => {
  let component: TopbarOnevoneComponent;
  let fixture: ComponentFixture<TopbarOnevoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopbarOnevoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopbarOnevoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
