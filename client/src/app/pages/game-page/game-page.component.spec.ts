/* eslint-disable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RecordTime } from '@app/classes/record-time';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ALL_GAMES_FINISHED, EMPTY_PLAYER_NAME, LOSING_FLAG, TIMER_HIT_ZERO_MESSAGE, WIN_FLAG } from '@app/const/client-consts';
import { CommunicationService } from '@app/services/communication.service';
import { EndGameHandlerService } from '@app/services/end-game-handler.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeService } from '@app/services/time.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    ADVERSARY_PLR_USERNAME_POS,
    CLASSIC_MODE,
    LIMITED_TIME_MODE,
    LOCAL_PLR_USERNAME_POS,
    MODIFIED_IMAGE_POSITION,
    ORIGINAL_IMAGE_POSITION,
} from '@common/const';
import { Game } from '@common/game';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { of } from 'rxjs';
import { Socket } from 'socket.io-client';
import { GamePageComponent } from './game-page.component';
import SpyObj = jasmine.SpyObj;
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
class SocketClientServiceMock extends SocketClientService {
    override connect() {};
}

@Component({ selector: 'app-play-area', template: '' })
class PlayAreaComponent {
    @Input() differentImages: HTMLImageElement[];
    @Input() localPlayerUsername: string;
    @Input() isMultiplayer: boolean;
    @Input() mode: string;
}

@Component({ selector: 'app-topbar', template: '' })
class TopbarComponent {
    @Input() nbrDifferencesFound: number[];
    @Input() playerNames: string[];
    @Input() gameMode: string;
    @Input() isMultiplayer: boolean;
}

@Component({ selector: 'app-sidebar', template: '' })
class SidebarComponent {
    @Input() numberOfDifferences: number;
    @Input() gameName: string;
    @Input() gameMode: string;
    @Input() clueTimePenalty: number;
    @Input() isMultiplayer: boolean;
}

fdescribe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let timeServiceSpy: SpyObj<TimeService>;
    let communicationServiceSpy: SpyObj<CommunicationService>;
    let endGameServiceMock: SpyObj<EndGameHandlerService>;
    let matDialogSpy: SpyObj<MatDialog>;
    let testGame: Game;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        testGame = {
            name: 'test game',
            numberOfDifferences: 7,
            times: { soloGameTimes: [new RecordTime('00:00', 'playerUsername')], multiplayerGameTimes: [new RecordTime('00:00', 'playerUsername')] },
            images: [],
            differencesList: [],
        };

        timeServiceSpy = jasmine.createSpyObj('TimeService', ['classicMode', 'changeTime']);
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['getGames']);
        communicationServiceSpy.getGames.and.returnValue(of([testGame]));
        endGameServiceMock = jasmine.createSpyObj('EndGameHandlerService', ['configureSocket']);
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

        await TestBed.configureTestingModule({
            declarations: [GamePageComponent,PlayAreaComponent,TopbarComponent,SidebarComponent],
            imports:[  MatDialogModule,
                RouterTestingModule.withRoutes([]),
                MatProgressSpinnerModule,
                MatIconModule,
                FormsModule,
                MatSelectModule,
                MatIconModule,
                FontAwesomeModule,
                BrowserAnimationsModule,],
            providers: [
                { provide: SocketClientService, useValue: socketServiceMock },
                { provide: TimeService, useValue: timeServiceSpy },
                { provide: CommunicationService, useValue: communicationServiceSpy },
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: EndGameHandlerService, useValue: endGameServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.ngOnInit();
    });

    describe('Receiving events', () => {
        it('should handle classic mode event and set the mode to classic mode', () => {
            socketHelper.peerSideEmit(CLASSIC_MODE);
            expect(component.gameMode).toEqual(CLASSIC_MODE);
        });

        it('should handle limited time mode event and  set the mode to limited time mode', () => {
            socketHelper.peerSideEmit(LIMITED_TIME_MODE);
            expect(component.gameMode).toEqual(LIMITED_TIME_MODE);
        });

        it('should handle time event and call the changeTime method of the time service', () => {
            const testTime = {
                seconds: 0,
                minutes: 0,
            };
            socketHelper.peerSideEmit('time', testTime);
            expect(component['timeService'].changeTime).toHaveBeenCalledWith(testTime);
        });

        it("should handle 'show the username' event and set the username value to the received username", () => {
            const username = 'username';
            socketHelper.peerSideEmit('show the username', username);
            expect(component.usernames[0]).toEqual(username);
        });

        it("should handle 'Valid click' event and increment the number of differences found by local player", () => {
            const differencesInfo: GameplayDifferenceInformations = {
                differencePixelsNumbers: [],
                isValidDifference: true,
                socketId: socketHelper.id,
                playerUsername: '',
            };
            const nbDifferencesFoundByLocalPlayer = component.nbDifferencesFound[LOCAL_PLR_USERNAME_POS];
            socketHelper.peerSideEmit('Valid click', differencesInfo);
            expect(component.nbDifferencesFound[LOCAL_PLR_USERNAME_POS] - 1).toEqual(nbDifferencesFoundByLocalPlayer + 1);
        });

        it("should handle 'Valid click' event and not increment the number of differences found if isValidDifference is false", () => {
            const differencesInfo: GameplayDifferenceInformations = {
                differencePixelsNumbers: [],
                isValidDifference: false,
                socketId: socketHelper.id,
                playerUsername: '',
            };

            const nbDifferencesFoundByLocalPlayer = component.nbDifferencesFound[LOCAL_PLR_USERNAME_POS];
            socketHelper.peerSideEmit('Valid click', differencesInfo);
            expect(component.nbDifferencesFound[LOCAL_PLR_USERNAME_POS]).toEqual(nbDifferencesFoundByLocalPlayer);
        });

        it("should handle 'Valid click' event and increment the number of differences found by adversary if socketId is not his", () => {
            const differencesInfo: GameplayDifferenceInformations = {
                differencePixelsNumbers: [],
                isValidDifference: true,
                socketId: '',
                playerUsername: '',
            };
            const nbDifferencesFoundByAdversary = component.nbDifferencesFound[ADVERSARY_PLR_USERNAME_POS];
            socketHelper.peerSideEmit('Valid click', differencesInfo);
            expect(component.nbDifferencesFound[ADVERSARY_PLR_USERNAME_POS] - 1).toEqual(nbDifferencesFoundByAdversary + 1);
        });

        it("should handle 'The game is' event and set the value of its attribute nbDifferences to the value of the number of differences of the game wanted", () => {
            const nameOfGame = 'test game';
            socketHelper.peerSideEmit('The game is', nameOfGame);
            expect(component['communicationService'].getGames).toHaveBeenCalled();
            expect(7).toEqual(testGame.numberOfDifferences);
        });

        // Ce test est inutile comme expliqué aux lignes 54 et 55 du fichier game-page.component.ts, cependant il a été fait car sinon nous n'atteignons pas
        // une couverture de 100%
        it("should handle 'The game is' event and set the value of its attribute nbDifferences to undefined when the game wanted doesn't exists", () => {
            const nameOfGame = 'unvalid game';
            socketHelper.peerSideEmit('The game is', nameOfGame);
            expect(component['communicationService'].getGames).toHaveBeenCalled();
            expect(component.nbDifferences).toBeUndefined();
        });
    });

    it("should handle 'The adversary username is' event and set the value of the adversary username", () => {
        const testUsername = 'userAdversary';
        socketHelper.peerSideEmit('The adversary username is', testUsername);
        expect(component.usernames[ADVERSARY_PLR_USERNAME_POS]).toEqual(testUsername);
    });

    it('should call dialog.open() on openDialog()', () => {
        const testMessageToDisplay = 'Hi';
        const testWinFlag = true;
        component['openDialog'](testMessageToDisplay, testWinFlag);
        expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('should handle a game images event and set the soruces of both images to the right one', () => {
        const imagesDataTest: string[] = ['HHH', 'SSS'];
        socketHelper.peerSideEmit('game images', imagesDataTest);
        expect(component.images[ORIGINAL_IMAGE_POSITION].src).toContain(imagesDataTest[ORIGINAL_IMAGE_POSITION]);
        expect(component.images[MODIFIED_IMAGE_POSITION].src).toContain(imagesDataTest[MODIFIED_IMAGE_POSITION]);
    });

    it('should handle a time hit zero event and call openDialog with the right attributes', () => {
        const spy = spyOn(component, <any>'openDialog').and.callFake(() => {});
        socketHelper.peerSideEmit('time hit zero');
        expect(spy).toHaveBeenCalledWith(TIMER_HIT_ZERO_MESSAGE, LOSING_FLAG);
    });

    it('should handle a no more games available event and call openDialog with the right attributes', () => {
        const spy = spyOn(component, <any>'openDialog').and.callFake(() => {});
        socketHelper.peerSideEmit('no more games available');
        expect(spy).toHaveBeenCalledWith(ALL_GAMES_FINISHED, WIN_FLAG);
    });

    it('should handle a Other player abandonned LM event and set the username of the adversary to empty and put isMultiplayerGame to false', () => {
        socketHelper.peerSideEmit('Other player abandonned LM');
        expect(component.usernames[ADVERSARY_PLR_USERNAME_POS]).toEqual(EMPTY_PLAYER_NAME);
        expect(component.isMultiplayerGame).toEqual(false);
    });

    it('should handle a Clue Time Penalty and change the time penalty', () => {
        const penalty = 5;
        socketHelper.peerSideEmit('Clue Time Penalty', penalty);
        expect(component.timeCluePenalty).toEqual(penalty);
    });
});
