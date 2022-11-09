import { ServerIOTestHelper } from '@app/classes/server-io-test-helper';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { WaitingLineHandlerService } from './waiting-line-handler.service';

describe('WaitingLineHandlerService tests', () => {
    const testGameName = 'test12345';
    const testSocketId1 = 'JKHSDA125';
    let server: io.Server;
    let socket: io.Socket;
    let event = 'event';
    let waitingLineHandlerService: WaitingLineHandlerService;
    let gameInfo = ['info1', 'info2'];
    let addJoiningPlayerIdSpy: sinon.SinonSpy;
    let deleteJoiningPlayerIdSpy: sinon.SinonSpy;
    let playergetSpy: sinon.SinonSpy;
    let playersetSpy: sinon.SinonSpy;
    let playerdeleteSpy: sinon.SinonSpy;

    let playerCreatordeleteSpy: sinon.SinonSpy;
    let playerCreatorsetSpy: sinon.SinonSpy;
    let playerCreatorgetSpy: sinon.SinonSpy;

    let getIDFirstPlayerWaitingSpy: sinon.SinonSpy;
    let getUsernamePlayerSpy: sinon.SinonSpy;
    let getSocketByIDSpy: sinon.SinonSpy;
    let getCreatorPlayerSpy: sinon.SinonSpy;
    let serverSpy: sinon.SinonSpy;

    beforeEach(() => {
        waitingLineHandlerService = new WaitingLineHandlerService();
        server = new ServerIOTestHelper() as unknown as io.Server;
        serverSpy = sinon.spy(server, 'to');

        playergetSpy = sinon.spy(waitingLineHandlerService['playersJoiningAGame'], 'get');
        playersetSpy = sinon.spy(waitingLineHandlerService['playersJoiningAGame'], 'set');
        playerdeleteSpy = sinon.spy(waitingLineHandlerService['playersJoiningAGame'], 'delete');

        playerCreatordeleteSpy = sinon.spy(waitingLineHandlerService['playersCreatingAGame'], 'delete');
        playerCreatorsetSpy = sinon.spy(waitingLineHandlerService['playersCreatingAGame'], 'set');
        playerCreatorgetSpy = sinon.spy(waitingLineHandlerService['playersCreatingAGame'], 'get');

        addJoiningPlayerIdSpy = sinon.spy(waitingLineHandlerService, <any> 'addJoiningPlayerId');
        deleteJoiningPlayerIdSpy = sinon.spy(waitingLineHandlerService, <any> 'deleteJoiningPlayerId');

        getIDFirstPlayerWaitingSpy = sinon.spy(waitingLineHandlerService, 'getIDFirstPlayerWaiting');
        getUsernamePlayerSpy = sinon.spy(waitingLineHandlerService, 'getUsernamePlayer');
        getCreatorPlayerSpy = sinon.spy(waitingLineHandlerService, 'getCreatorPlayer');

        getSocketByIDSpy = sinon.spy(waitingLineHandlerService, 'getSocketByID');
    });
    afterEach(async () => {
        sinon.restore();
    });

    it('should set the infos of playersCreatingAGame when addCreatingPlayer is called ', () => {
        waitingLineHandlerService.addCreatingPlayer(testGameName, testSocketId1);
        expect(playerCreatorsetSpy.calledOnce);
    });

    it('should get the infos of playersCreatingAGame when getCreatorPlayer is called ', () => {
        waitingLineHandlerService.getCreatorPlayer(testGameName);
        expect(playerCreatorgetSpy.calledOnce);
    });

    it('should add joining PlayerId when addJoiningPlayer is called ', () => {
        waitingLineHandlerService['playersJoiningAGame'].set(testGameName, [testSocketId1]);
        waitingLineHandlerService.addJoiningPlayer(testSocketId1, gameInfo);
        expect(addJoiningPlayerIdSpy.calledOnce);
    });

    it('should set playersTryingToJoin if game dont exist', () => {
        waitingLineHandlerService['addJoiningPlayerId'](testSocketId1, testGameName);
        expect(playerdeleteSpy.notCalled);
        expect(playersetSpy.calledOnce);
    });

    it('should update playersTryingToJoin if game exist', () => {
        waitingLineHandlerService['playersJoiningAGame'].set(testGameName, [testSocketId1]);
        waitingLineHandlerService['addJoiningPlayerId'](testSocketId1, testGameName);
        expect(playerdeleteSpy.calledOnce);
        expect(playersetSpy.calledOnce);
        expect(playergetSpy.calledOnce);
    });

    it('should call deleteJoiningPlayer ', () => {
        waitingLineHandlerService.deleteJoiningPlayer(testSocketId1, testGameName);
        expect(deleteJoiningPlayerIdSpy.calledOnce);
    });

    it('should call deleteCreatorOfGame ', () => {
        waitingLineHandlerService.deleteCreatorOfGame(testGameName);
        expect(playerCreatordeleteSpy.calledOnce);
    });

    it('should call setUsernamePlayer ', () => {
        waitingLineHandlerService.setUsernamePlayer(testSocketId1, testGameName, server);
        expect(getSocketByIDSpy.calledOnce);
    });

    it('should call getUsernamePlayer ', () => {
        socket.data.username = 'test';
        expect(waitingLineHandlerService.getUsernamePlayer(socket.id, server)).to.equal('test');
        expect(getSocketByIDSpy.calledOnce);
    });

    it('should call getPresenceOfJoiningPlayers ', () => {
        waitingLineHandlerService.getPresenceOfJoiningPlayers(testGameName);
        expect(playergetSpy.calledOnceWith(testGameName));
    });

    it('should call getUsernameFirstPlayerWaiting ', () => {
        waitingLineHandlerService['playersJoiningAGame'].set(testGameName, [testSocketId1]);

        const playersWaiting = waitingLineHandlerService['playersJoiningAGame'].get(testGameName) as string[];
        const playersShift = sinon.spy(playersWaiting, 'shift');
        const playersUnshift = sinon.spy(playersWaiting, 'unshift');
        waitingLineHandlerService.getUsernameFirstPlayerWaiting(testGameName, server);
        expect(getIDFirstPlayerWaitingSpy.calledOnce);
        expect(getUsernamePlayerSpy.calledOnce);
        expect(playersShift.calledOnce);
        expect(playersUnshift.calledOnce);
    });

    it('should call getIDFirstPlayerWaiting ', () => {
        waitingLineHandlerService['playersJoiningAGame'].set(testGameName, [testSocketId1]);

        waitingLineHandlerService['getIDFirstPlayerWaiting'](testGameName);
        expect(playergetSpy.calledOnce);
    });

    it('should getCreatorPlayer when updateJoiningPlayer is called ', () => {
        waitingLineHandlerService['playersJoiningAGame'].set(testGameName, [testSocketId1]);

        waitingLineHandlerService.updateJoiningPlayer(server, testGameName, event);
        expect(getCreatorPlayerSpy.calledOnceWith(testGameName));
        expect(serverSpy.calledOnce);
    });

    it('should send an event to all the players joining', () => {
        waitingLineHandlerService['playersJoiningAGame'].set(testGameName, [testSocketId1]);
        waitingLineHandlerService.sendEventToAllJoiningPlayers(server, testGameName, event);
        expect(playergetSpy.calledOnce);
    });

    it('should not send an event to all the players joining', () => {
        waitingLineHandlerService.sendEventToAllJoiningPlayers(server, testGameName, event);
        expect(playergetSpy.calledOnce);
    });
});
