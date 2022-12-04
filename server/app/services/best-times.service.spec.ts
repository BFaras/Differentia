import { RecordTime } from '@app/classes/record-times';
import { ServerIOTestHelper } from '@app/classes/server-io-test-helper';
import { GameModeTimes } from '@common/games-record-times';
import { RecordTimeInformations } from '@common/record-time-infos';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { BestTimesService } from './best-times.service';
import { RecordTimesService } from './database.games.service';

import { Time } from '@common/time';

describe('BestTimesService tests', () => {
    let bestTimesService: BestTimesService;

    beforeEach(() => {
        bestTimesService = new BestTimesService(new ServerIOTestHelper() as unknown as io.Server);
    });
    afterEach(async () => {
        sinon.restore();
    });

    it('should emit the new record time to all active players when there is new record', async () => {
        const testRecordTimeInfos: RecordTimeInformations = {
            playerName: 'playerTest',
            playerRanking: 1,
            gameName: 'Test game',
            isMultiplayer: false,
        };
        const emitStub = sinon.spy(bestTimesService['sio'], 'emit');
        bestTimesService['hasNewRecord'] = true;
        bestTimesService['notifyAllActivePlayers'](testRecordTimeInfos.playerName, testRecordTimeInfos.gameName, testRecordTimeInfos.isMultiplayer);
        expect(emitStub.calledOnce);
        expect(bestTimesService.hasNewRecord).to.equal(false);
    });

    it('should not emit new record time to all active players when there is not new record time', async () => {
        const testRecordTimeInfos: RecordTimeInformations = {
            playerName: 'playerTest',
            playerRanking: 1,
            gameName: 'Test game',
            isMultiplayer: false,
        };
        const emitStub = sinon.spy(bestTimesService['sio'], 'emit');
        bestTimesService['notifyAllActivePlayers'](testRecordTimeInfos.playerName, testRecordTimeInfos.gameName, testRecordTimeInfos.isMultiplayer);
        expect(emitStub.notCalled);
    });

    it('should convert from time type to string if minute and second are not two digit format', async () => {
        const gameTime: Time = {
            minutes: 0,
            seconds: 8,
        };
        const gameTimeInString = '00:08';
        expect(bestTimesService['timeFormatToString'](gameTime)).to.equal(gameTimeInString);
    });

    it('should convert from time type to string if second is not two digit format', async () => {
        const gameTime: Time = {
            minutes: 10,
            seconds: 8,
        };
        const gameTimeInString = '10:08';
        expect(bestTimesService['timeFormatToString'](gameTime)).to.equal(gameTimeInString);
    });

    it('should convert from time type to string if minute is not two digit format', async () => {
        const gameTime: Time = {
            minutes: 0,
            seconds: 12,
        };
        const gameTimeInString = '00:12';
        expect(bestTimesService['timeFormatToString'](gameTime)).to.equal(gameTimeInString);
    });

    it('should convert from time type to string if minute and second are two digit format', async () => {
        const gameTime: Time = {
            minutes: 10,
            seconds: 11,
        };
        const gameTimeInString = '10:11';
        expect(bestTimesService['timeFormatToString'](gameTime)).to.equal(gameTimeInString);
    });

    it('should convert time for comparison', async () => {
        const gameTime: string = '00:10';
        const value: number = 10;
        expect(bestTimesService['convertTimeForComparison'](gameTime)).to.equal(value);
    });

    it('should return the multiplayer game sorted times', async () => {
        const testTimes: GameModeTimes = {
            soloGameTimes: [new RecordTime('00:15', 'player1')],
            multiplayerGameTimes: [new RecordTime('00:11', 'player2')],
        };
        const isMultiplayer = true;
        expect(bestTimesService['rankTimesByMode'](testTimes, isMultiplayer)).to.equal(testTimes.multiplayerGameTimes);
    });

    it('should return the solo game sorted times', async () => {
        const testTimes: GameModeTimes = {
            soloGameTimes: [new RecordTime('00:15', 'player1')],
            multiplayerGameTimes: [new RecordTime('00:11', 'player2')],
        };
        const isMultiplayer = true;
        expect(bestTimesService['rankTimesByMode'](testTimes, !isMultiplayer)).to.equal(testTimes.soloGameTimes);
    });

    it('updateAndSortTimes should call 3 methods when called ', async () => {
        const testRecordTimeInfos: RecordTimeInformations = {
            playerName: 'playerTest',
            playerRanking: 1,
            gameName: 'Test game',
            isMultiplayer: true,
        };
        const testTimes: GameModeTimes = {
            soloGameTimes: [new RecordTime('00:15', 'player1')],
            multiplayerGameTimes: [new RecordTime('00:11', 'player2')],
        };
        const updateGameRecordTimesStub = sinon.stub(RecordTimesService.prototype, <any>'updateGameRecordTimes').callsFake(() => {});
        const sortGameTimesStub = sinon.stub(RecordTimesService.prototype, <any>'sortGameTimes').callsFake(() => {});
        const getGameTimesStub = sinon.stub(RecordTimesService.prototype, <any>'getGameTimes').callsFake(() => {});

        await bestTimesService['updateAndSortTimes'](testRecordTimeInfos, testTimes);
        expect(updateGameRecordTimesStub.calledOnce);
        expect(sortGameTimesStub.calledOnce);
        expect(getGameTimesStub.calledOnce);
    });

    it('retrieveLastTime should return the last record time of multiplayer mode and call 1 method', async () => {
        const testRecordTimeInfos: RecordTimeInformations = {
            playerName: 'playerTest',
            playerRanking: 1,
            gameName: 'Test game',
            isMultiplayer: true,
        };
        const testTimes: GameModeTimes = {
            soloGameTimes: [new RecordTime('00:15', 'player1'), new RecordTime('00:17', 'player2'), new RecordTime('00:20', 'player3')],
            multiplayerGameTimes: [new RecordTime('00:11', 'player4'), new RecordTime('00:13', 'player5'), new RecordTime('00:15', 'player6')],
        };
        const getGameTimesStub = sinon.stub(RecordTimesService.prototype, <any>'getGameTimes').callsFake(() => {
            return testTimes;
        });
        expect(await bestTimesService['retrieveLastRecordTime'](testRecordTimeInfos.gameName, testRecordTimeInfos.isMultiplayer)).to.deep.equals(15);
        expect(getGameTimesStub.calledOnce);
    });

    it('retrieveLastTime should return the last record timeo of solo mode and call 1 method', async () => {
        const testRecordTimeInfos: RecordTimeInformations = {
            playerName: 'playerTest',
            playerRanking: 1,
            gameName: 'Test game',
            isMultiplayer: true,
        };
        const testTimes: GameModeTimes = {
            soloGameTimes: [new RecordTime('00:15', 'player1'), new RecordTime('00:17', 'player2'), new RecordTime('00:20', 'player3')],
            multiplayerGameTimes: [new RecordTime('00:11', 'player4'), new RecordTime('00:13', 'player5'), new RecordTime('00:15', 'player6')],
        };
        const getGameTimesStub = sinon.stub(RecordTimesService.prototype, <any>'getGameTimes').callsFake(() => {
            return testTimes;
        });
        expect(await bestTimesService['retrieveLastRecordTime'](testRecordTimeInfos.gameName, !testRecordTimeInfos.isMultiplayer)).to.deep.equals(20);
        expect(getGameTimesStub.calledOnce);
    });

    it('compareGameTimeWithDbTimes should call 5 methods when called the player chronometer time is a record and database is available', async () => {
        const testRecordTimeInfos: RecordTimeInformations = {
            playerName: 'playerTest',
            playerRanking: 1,
            gameName: 'Test game',
            isMultiplayer: true,
        };
        const gameTime: Time = {
            minutes: 0,
            seconds: 8,
        };
        const isDatabaseAvailableStub = sinon.stub(RecordTimesService.prototype, 'isDatabaseAvailable').callsFake(() => {
            return true;
        });
        const timeFormatToStringStub = sinon.spy(BestTimesService.prototype, <any>'timeFormatToString');
        const retrieveLastRecordTimeStub = sinon.stub(BestTimesService.prototype, <any>'retrieveLastRecordTime').callsFake(() => {
            return 10;
        });
        const convertTimeForComparisonStub = sinon.spy(BestTimesService.prototype, <any>'convertTimeForComparison');
        const setValidRecordTimesStub = sinon.stub(BestTimesService.prototype, <any>'setValidRecordTimes').callsFake(() => {});

        await bestTimesService.compareGameTimeWithDbTimes(gameTime, testRecordTimeInfos);
        expect(isDatabaseAvailableStub.calledOnce);
        expect(timeFormatToStringStub.calledOnce);
        expect(retrieveLastRecordTimeStub.calledOnce);
        expect(convertTimeForComparisonStub.calledOnce);
        expect(setValidRecordTimesStub.calledOnce);
    });

    it('compareGameTimeWithDbTimes should call 4 methods when the player chronometer time is not a record and database is available', async () => {
        const testRecordTimeInfos: RecordTimeInformations = {
            playerName: 'playerTest',
            playerRanking: 1,
            gameName: 'Test game',
            isMultiplayer: true,
        };
        const gameTime: Time = {
            minutes: 0,
            seconds: 8,
        };
        const isDatabaseAvailableStub = sinon.stub(RecordTimesService.prototype, 'isDatabaseAvailable').callsFake(() => {
            return true;
        });
        const timeFormatToStringStub = sinon.spy(BestTimesService.prototype, <any>'timeFormatToString');
        const retrieveLastRecordTimeStub = sinon.stub(BestTimesService.prototype, <any>'retrieveLastRecordTime').callsFake(() => {
            return 7;
        });
        const convertTimeForComparisonStub = sinon.spy(BestTimesService.prototype, <any>'convertTimeForComparison');

        await bestTimesService.compareGameTimeWithDbTimes(gameTime, testRecordTimeInfos);
        expect(isDatabaseAvailableStub.calledOnce);
        expect(timeFormatToStringStub.calledOnce);
        expect(retrieveLastRecordTimeStub.calledOnce);
        expect(convertTimeForComparisonStub.calledOnce);
    });

    it('compareGameTimeWithDbTimes should call 5 methods when called the player chronometer time is a record and database is not available', async () => {
        const testRecordTimeInfos: RecordTimeInformations = {
            playerName: 'playerTest',
            playerRanking: 1,
            gameName: 'Test game',
            isMultiplayer: true,
        };
        const gameTime: Time = {
            minutes: 0,
            seconds: 8,
        };
        const isDatabaseAvailableStub = sinon.stub(RecordTimesService.prototype, 'isDatabaseAvailable').callsFake(() => {
            return false;
        });
        await bestTimesService.compareGameTimeWithDbTimes(gameTime, testRecordTimeInfos);
        expect(isDatabaseAvailableStub.calledOnce);
    });

    it('setValidRecordTimes should call 4 methods when called and handle the setting of multiplayer valid record times', async () => {
        const testRecordTimeInfos: RecordTimeInformations = {
            playerName: 'playerTest',
            playerRanking: 1,
            gameName: 'Test game',
            isMultiplayer: true,
        };
        const testTimes: GameModeTimes = {
            soloGameTimes: [new RecordTime('00:15', 'player1'), new RecordTime('00:17', 'player2'), new RecordTime('00:20', 'player3')],
            multiplayerGameTimes: [new RecordTime('00:11', 'player4'), new RecordTime('00:13', 'player5'), new RecordTime('00:15', 'player6')],
        };
        const gameTime: string = '00:14';

        const getGameTimesStub = sinon.stub(RecordTimesService.prototype, <any>'getGameTimes').callsFake(() => {
            return testTimes;
        });
        const updateGameRecordTimesStub = sinon.stub(BestTimesService.prototype, <any>'updateAndSortTimes').callsFake(() => {
            return testTimes;
        });
        const rankTimesByModeStub = sinon.stub(BestTimesService.prototype, <any>'rankTimesByMode').callsFake(() => {
            return testTimes.multiplayerGameTimes;
        });
        const playerRankingStub = sinon.stub(RecordTimesService.prototype, <any>'getPlayerRanking').callsFake(() => {});
        await bestTimesService['setValidRecordTimes'](gameTime, testRecordTimeInfos);
        expect(getGameTimesStub.calledOnce);
        expect(updateGameRecordTimesStub.calledOnce);
        expect(rankTimesByModeStub.calledOnce);
        expect(playerRankingStub.calledOnce);
        expect(bestTimesService.hasNewRecord).to.equal(true);
    });

    it('setValidRecordTimes should call 4 methods when called and handle the setting of solo valid record times', async () => {
        const testRecordTimeInfos: RecordTimeInformations = {
            playerName: 'playerTest',
            playerRanking: 1,
            gameName: 'Test game',
            isMultiplayer: false,
        };
        const testTimes: GameModeTimes = {
            soloGameTimes: [new RecordTime('00:15', 'player1'), new RecordTime('00:17', 'player2'), new RecordTime('00:20', 'player3')],
            multiplayerGameTimes: [new RecordTime('00:11', 'player4'), new RecordTime('00:13', 'player5'), new RecordTime('00:15', 'player6')],
        };
        const gameTime: string = '00:14';

        const getGameTimesStub = sinon.stub(RecordTimesService.prototype, <any>'getGameTimes').callsFake(() => {
            return testTimes;
        });
        const updateGameRecordTimesStub = sinon.stub(BestTimesService.prototype, <any>'updateAndSortTimes').callsFake(() => {
            return testTimes;
        });
        const rankTimesByModeStub = sinon.stub(BestTimesService.prototype, <any>'rankTimesByMode').callsFake(() => {
            return testTimes.multiplayerGameTimes;
        });
        const playerRankingStub = sinon.stub(RecordTimesService.prototype, <any>'getPlayerRanking').callsFake(() => {});
        await bestTimesService['setValidRecordTimes'](gameTime, testRecordTimeInfos);
        expect(getGameTimesStub.calledOnce);
        expect(updateGameRecordTimesStub.calledOnce);
        expect(rankTimesByModeStub.calledOnce);
        expect(playerRankingStub.calledOnce);
        expect(bestTimesService.hasNewRecord).to.equal(true);
    });
});
