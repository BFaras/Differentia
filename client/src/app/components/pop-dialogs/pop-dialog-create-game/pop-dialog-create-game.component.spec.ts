import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameToServerService } from '@app/services/game-to-server.service';
import { PopDialogCreateGameComponent } from './pop-dialog-create-game.component';
import SpyObj = jasmine.SpyObj;
describe('PopDialogCreateGameComponent', () => {
  let component: PopDialogCreateGameComponent;
  let fixture: ComponentFixture<PopDialogCreateGameComponent>;
  let gameToServerServiceSpy : SpyObj<GameToServerService>;
  let mockValue:number

  beforeEach(async () => {
    mockValue = 10;
    gameToServerServiceSpy= jasmine.createSpyObj('GameToServerService',['getNumberDifference','addGame']);
    gameToServerServiceSpy.getNumberDifference.and.returnValue(mockValue);
    gameToServerServiceSpy.addGame.and.returnValue();
    await TestBed.configureTestingModule({
      declarations: [ PopDialogCreateGameComponent ],
      providers:[{provide: GameToServerService, useValue:gameToServerServiceSpy }],
    })
    .compileComponents();


    fixture = TestBed.createComponent(PopDialogCreateGameComponent);
    
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change number of difference', () => {
    component.getNumberOfDifference()
    expect(component.numberOfDifference).toBe(mockValue)

  });

  it('should call add game of gameToServerService',()=>{
    component.addGame()
    expect(gameToServerServiceSpy.addGame).toHaveBeenCalled()
  })

  afterEach(() => {
    fixture.destroy();
  });
});
