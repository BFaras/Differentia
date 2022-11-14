import { ServerSocketTestHelper } from '@app/classes/server-socket-test-helper';
import { NO_MORE_CLUES_AMOUNT } from '@app/server-consts';
import { CLUE_AMOUNT_DEFAULT, FIRST_CLUE_NB, SECOND_CLUE_NB } from '@common/const';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { ClueFinderService } from './clue-finder.service';
import { ClueManagerService } from './clue-manager.service';
import { MouseHandlerService } from './mouse-handler.service';

describe('ClueManagerService tests', () => {
    const testSocketId = 'AHDS5462D';
    const differencesNotFound = [
        [0, 1],
        [3, 5],
        [7, 9],
    ];
    const differenceQuadrantTest = 2;
    let clueManagerService: ClueManagerService;
    let mouseHandlerService: MouseHandlerService;
    let serverSocket: io.Socket;

    beforeEach(() => {
        clueManagerService = new ClueManagerService();
        mouseHandlerService = new MouseHandlerService();
        serverSocket = new ServerSocketTestHelper(testSocketId) as unknown as io.Socket;

        sinon.stub(mouseHandlerService, 'getListOfDifferencesNotFound').returns(differencesNotFound);
        sinon.stub(ClueFinderService.prototype, 'findClueQuandrantFromClueNumber').returns(differenceQuadrantTest);
    });
    afterEach(async () => {
        sinon.restore();
    });

    it('should be put back the amount of clues to the default amount on resetSocketClueAmount()', () => {
        clueManagerService['setSocketClueAmountLeft'](serverSocket, NO_MORE_CLUES_AMOUNT);
        clueManagerService.resetSocketClueAmount(serverSocket);
        expect(clueManagerService['getSocketClueAmount'](serverSocket)).to.equal(CLUE_AMOUNT_DEFAULT);
    });

    it('should call emit with event Clue with quadrant of difference when the clues left is 3', () => {
        const spy = sinon.spy(serverSocket, 'emit');
        clueManagerService['setSocketClueAmountLeft'](serverSocket, FIRST_CLUE_NB);
        clueManagerService.sendClueToPlayer(serverSocket, mouseHandlerService);
        expect(spy.calledWith('Clue with quadrant of difference'));
    });

    it('should call emit with event Clue with quadrant of difference when the clues left is 2', () => {
        const spy = sinon.spy(serverSocket, 'emit');
        clueManagerService['setSocketClueAmountLeft'](serverSocket, SECOND_CLUE_NB);
        clueManagerService.sendClueToPlayer(serverSocket, mouseHandlerService);
        expect(spy.calledWith('Clue with quadrant of difference'));
    });

    it('should call emit with event Clue with difference pixels when the clues left is 1', () => {
        const spy = sinon.spy(serverSocket, 'emit');
        clueManagerService['setSocketClueAmountLeft'](serverSocket, SECOND_CLUE_NB - 1);
        clueManagerService.sendClueToPlayer(serverSocket, mouseHandlerService);
        expect(spy.calledWith('Clue with difference pixels'));
    });

    it('should not call emit from socket when clues left is 0', () => {
        const spy = sinon.spy(serverSocket, 'emit');
        clueManagerService['setSocketClueAmountLeft'](serverSocket, NO_MORE_CLUES_AMOUNT);
        clueManagerService.sendClueToPlayer(serverSocket, mouseHandlerService);
        expect(spy.notCalled);
    });

    it('should not call emit from socket when differencesNotFound length is 0', () => {
        const spy = sinon.spy(serverSocket, 'emit');
        const mouseHandlerService2 = new MouseHandlerService();
        const emptyDifferencesNotFound: number[][] = [];
        sinon.stub(mouseHandlerService2, 'getListOfDifferencesNotFound').returns(emptyDifferencesNotFound);
        clueManagerService.sendClueToPlayer(serverSocket, mouseHandlerService2);
        expect(spy.notCalled);
    });

    it('should not decrement cluesAmount if there are no clues left', () => {
        clueManagerService['setSocketClueAmountLeft'](serverSocket, NO_MORE_CLUES_AMOUNT);
        clueManagerService['decrementSocketClueAmount'](serverSocket);
        expect(clueManagerService['getSocketClueAmount'](serverSocket)).to.equal(NO_MORE_CLUES_AMOUNT);
    });
});
