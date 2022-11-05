import { expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { WaitingLineHandlerService } from './waiting-line-handler.service';

describe('WaitingLineHandlerService tests', () => {
    const testGameName = 'test12345';
    // const testUsername = 'myName15';
    const testSocketId1 = 'JKHSDA125';
    let server: io.Server;
    let event = 'event';
    // const testSocketId2 = 'IIUUYSD5896';
    let waitingLineHandlerService: WaitingLineHandlerService;
    let playersCreatingAGame: Map<string, string> = new Map<string, string>();
    // let playersJoiningAGame: Map<string, string[]> = new Map<string, string[]>();
    beforeEach(async () => {
        sinon.stub(waitingLineHandlerService, <any>'addCreatingPlayer').callsFake(() => {
            return playersCreatingAGame.set(testGameName, testSocketId1);
        });
        // sinon.stub(waitingLineHandlerService, <any>'playersJoiningAGame').callsFake(() => {
        //     return playersJoiningAGame;
        // });
    });

    afterEach(async () => {
        sinon.restore();
    });

    it('should use th infos of playersCreatingAGame', () => {
        sinon.stub(waitingLineHandlerService, <any>'addCreatingPlayer').callsFake(() => {
            return playersCreatingAGame.set(testGameName, testSocketId1);
        });
        waitingLineHandlerService.addCreatingPlayer(testGameName, testSocketId1);
        expect(playersCreatingAGame.get(testGameName)).to.deep.equals({ testGameName: testSocketId1 });
    });

    it('should use th infos of playersCreatingAGame', () => {
        sinon.stub(waitingLineHandlerService, <any>'updateJoiningPlayer').callThrough();
        waitingLineHandlerService.updateJoiningPlayer(server, testGameName, event);
        expect(waitingLineHandlerService.getCreatorPlayer(testGameName)).to.be.true;
    });

    // it('should call setupNecessaryGameServices() on begin game', async () => {
    //     const spy = sinon.spy(gameManagerService, <any>'setupNecessaryGameServices');
    //     await gameManagerService.beginGame(serverSocket, testGameName);
    //     expect(spy.calledOnce);
    // });
});
