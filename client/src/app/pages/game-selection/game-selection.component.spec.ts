import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SocketClientService } from '@app/services/socket-client.service';
import { Socket } from 'socket.io-client';

import { GameSelectionComponent } from './game-selection.component';
export class SocketClientServiceMock extends SocketClientService {
    override connect() {}
}

describe('GameSelectionComponent', () => {
    let component: GameSelectionComponent;
    let fixture: ComponentFixture<GameSelectionComponent>;
    let socketClientServiceMock: SocketClientServiceMock;
    let socketTestHelper: SocketTestHelper;

    beforeAll(async () => {
        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [{ provide: SocketClientService, useValue: socketClientServiceMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [GameSelectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GameSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call config socket', () => {
        spyOn(socketClientServiceMock, 'on');
        socketTestHelper.peerSideEmit('reconnect');
        component['configureGameSelectionSocketFeatures'];
        expect(socketClientServiceMock.on).toHaveBeenCalled();
    });
});
