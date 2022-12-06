import { RecordTime } from '@app/classes/record-times';
import { GameTimes } from '@common/game-times';
import { GameModeTimes } from '@common/games-record-times';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import * as sinon from 'sinon';
import { RecordTimesService } from './database.games.service';
import { DatabaseServiceMock } from './database.service.mock';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('RecordTimes service', () => {
    let recordTimesService: RecordTimesService;
    let databaseService: DatabaseServiceMock;
    let client: MongoClient;
    let testGameRecordTimes: GameTimes;
    let testTimes: GameModeTimes;
    let defaultRecordTimes: GameModeTimes;

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        client = (await databaseService.start()) as MongoClient;
        recordTimesService = new RecordTimesService(databaseService as any);
        testTimes = {
            soloGameTimes: [new RecordTime('00:15', 'player1'), new RecordTime('00:17', 'player2'), new RecordTime('00:20', 'player3')],
            multiplayerGameTimes: [new RecordTime('00:11', 'player4'), new RecordTime('00:13', 'player5'), new RecordTime('00:15', 'player6')],
        };
        defaultRecordTimes = {
            soloGameTimes: [new RecordTime('02:00', 'David'), new RecordTime('02:15', 'Jean'), new RecordTime('02:30', 'Paul')],
            multiplayerGameTimes: [new RecordTime('02:00', 'Brook'), new RecordTime('02:15', 'Leon'), new RecordTime('02:30', 'Tom')],
        };

        testGameRecordTimes = {
            name: 'Test game',
            recordTimes: testTimes,
        };
        await recordTimesService.collection.insertOne(testGameRecordTimes);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get specific game times with valid name', async () => {
        let times = await recordTimesService.getGameTimes('Test game');
        expect(times).to.deep.equals(testGameRecordTimes.recordTimes);
    });

    it('getGameTimes should call addDefaultTimesToGameCreatedOffline when the game name is new', async () => {
        const spy = sinon.spy(RecordTimesService.prototype, <any>'addDefaultTimesToGameCreatedOffline');
        await recordTimesService.getGameTimes('Test game 2');
        expect(spy.calledOnce);
    });

    it('should add default times to a new game', async () => {
        const newGameName = 'Test game 2';
        await recordTimesService.addNewGameDefaultTimes(newGameName);
        let games = await recordTimesService.collection.find({}).toArray();
        expect(games.length).to.equal(2);
        expect(games.find((x) => x.name === newGameName)?.recordTimes).to.deep.equals(defaultRecordTimes);
    });

    it('should reset a game record times', async () => {
        await recordTimesService.resetGameRecordTimes(testGameRecordTimes.name);
        let games = await recordTimesService.collection.find({}).toArray();
        expect(games.find((x) => x.name === testGameRecordTimes.name)?.recordTimes).to.deep.equals(defaultRecordTimes);
    });

    it('should reset all games record times', async () => {
        const newGameRecordTimes = {
            name: 'Test game 2',
            recordTimes: testTimes,
        };
        await recordTimesService.collection.insertOne(newGameRecordTimes);
        await recordTimesService.resetAllGamesRecordTimes();
        let games = await recordTimesService.collection.find({}).toArray();
        expect(games.find((x) => x.name === testGameRecordTimes.name)?.recordTimes).to.deep.equals(defaultRecordTimes);
        expect(games.find((x) => x.name === newGameRecordTimes.name)?.recordTimes).to.deep.equals(defaultRecordTimes);
    });

    it('should update an existing game record times if a valid name is sent', async () => {
        const newRecordTimes: GameModeTimes = {
            soloGameTimes: [new RecordTime('00:08', 'player8')],
            multiplayerGameTimes: [new RecordTime('00:11', 'player9')],
        };
        await recordTimesService.updateGameRecordTimes(testGameRecordTimes.name, newRecordTimes);
        let gamesTimes = await recordTimesService.collection.find({}).toArray();
        expect(gamesTimes.length).to.equal(1);
        expect(gamesTimes.find((x) => x.name === testGameRecordTimes.name)?.recordTimes).to.deep.equals(newRecordTimes);
    });

    it('should sort the game record times when is multiplayer game', async () => {
        const isMultiplayer: boolean = true;
        const newRecordTimes: GameModeTimes = {
            soloGameTimes: [new RecordTime('00:20', 'player3'), new RecordTime('00:15', 'player1'), new RecordTime('00:17', 'player2')],
            multiplayerGameTimes: [new RecordTime('00:15', 'player6'), new RecordTime('00:11', 'player4'), new RecordTime('00:13', 'player5')],
        };
        await recordTimesService.updateGameRecordTimes(testGameRecordTimes.name, newRecordTimes);
        await recordTimesService.sortGameTimes(testGameRecordTimes.name, isMultiplayer);
        let gamesTimes = await recordTimesService.collection.find({}).toArray();
        expect(gamesTimes.find((x) => x.name === testGameRecordTimes.name)?.recordTimes.multiplayerGameTimes).to.deep.equals(
            testTimes.multiplayerGameTimes,
        );
    });

    it('should sort the game record times when is solo game', async () => {
        const isMultiplayer: boolean = true;
        const newRecordTimes: GameModeTimes = {
            soloGameTimes: [new RecordTime('00:20', 'player3'), new RecordTime('00:15', 'player1'), new RecordTime('00:17', 'player2')],
            multiplayerGameTimes: [new RecordTime('00:15', 'player6'), new RecordTime('00:11', 'player4'), new RecordTime('00:13', 'player5')],
        };
        await recordTimesService.updateGameRecordTimes(testGameRecordTimes.name, newRecordTimes);
        await recordTimesService.sortGameTimes(testGameRecordTimes.name, !isMultiplayer);
        let gamesTimes = await recordTimesService.collection.find({}).toArray();
        expect(gamesTimes.find((x) => x.name === testGameRecordTimes.name)?.recordTimes.soloGameTimes).to.deep.equals(testTimes.soloGameTimes);
    });

    it('should delete the game record times', async () => {
        await recordTimesService.deleteGameRecordTimes('Test game');
        let gamesTimes = await recordTimesService.collection.find({}).toArray();
        expect(gamesTimes.length).to.equal(0);
    });

    it('should not delete a game record times if it has an invalid name', async () => {
        try {
            await recordTimesService.deleteGameRecordTimes('Invalid name');
        } catch {
            let gamesTimes = await recordTimesService.collection.find({}).toArray();
            expect(gamesTimes.length).to.equal(1);
        }
    });

    it('should return valid player ranking', async () => {
        const playerRecordTime: string = '00:13';
        const playerRanking = recordTimesService.getPlayerRanking(testGameRecordTimes.recordTimes.multiplayerGameTimes, playerRecordTime);
        expect(playerRanking).to.equal(2);
    });

    it('should not return valid player ranking when unavailable', async () => {
        const playerRecordTime: string = '00:30';
        const playerRanking = recordTimesService.getPlayerRanking(testGameRecordTimes.recordTimes.multiplayerGameTimes, playerRecordTime);
        expect(playerRanking).to.equal(undefined);
    });

    //Error handling
    describe('Error handling', async () => {
        it('should throw an error if we try to get a specific game times on a closed connection', async () => {
            sinon.stub(RecordTimesService.prototype, <any>'validateName').callsFake(async() => {
                return Promise.resolve(false);
            });
            sinon.stub(RecordTimesService.prototype, 'isDatabaseAvailable').callsFake(() => {
                return true;
            });
            await client.close();
            expect(recordTimesService.getGameTimes(testGameRecordTimes.name)).to.eventually.be.rejectedWith(Error);
            sinon.restore();
        });

        it('should throw an error if we try to delete a game record times on a closed connection', async () => {
            sinon.stub(RecordTimesService.prototype, <any>'validateName').callsFake(async() => {
                return Promise.resolve(false);
            });
            sinon.stub(RecordTimesService.prototype, 'isDatabaseAvailable').callsFake(() => {
                return true;
            });
            await client.close();
            expect(recordTimesService.deleteGameRecordTimes('Test game')).to.eventually.be.rejectedWith(Error);
            sinon.restore();
        });

        it('should throw an error if we try to reset a game record times on a closed connection', async () => {
            sinon.stub(RecordTimesService.prototype, <any>'validateName').callsFake(async() => {
                return Promise.resolve(false);
            });
            sinon.stub(RecordTimesService.prototype, 'isDatabaseAvailable').callsFake(() => {
                return true;
            });
            await client.close();
            expect(recordTimesService.resetGameRecordTimes('Test game')).to.eventually.be.rejectedWith(Error);
            sinon.restore();
        });

        it('should throw an error if we try to reset all the games record times on a closed connection', async () => {
            await client.close();
            expect(recordTimesService.resetAllGamesRecordTimes()).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to update a game record times on a closed connection', async () => {
            const newRecordTimes: GameModeTimes = {
                soloGameTimes: [new RecordTime('00:08', 'player3')],
                multiplayerGameTimes: [new RecordTime('00:11', 'player4')],
            };
            await client.close();
            expect(recordTimesService.updateGameRecordTimes('Test game', newRecordTimes)).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to sort a multiplayer game record times on a closed connection', async () => {
            const isMultiplayer = true;
            await client.close();
            expect(recordTimesService.sortGameTimes(testGameRecordTimes.name, isMultiplayer)).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to sort a solo game record times on a closed connection', async () => {
            const isMultiplayer = true;
            await client.close();
            expect(recordTimesService.sortGameTimes(testGameRecordTimes.name, !isMultiplayer)).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to add default times to a game which already exist and is not a reset', async () => {
            expect(recordTimesService.addNewGameDefaultTimes(testGameRecordTimes.name)).to.eventually.be.rejectedWith(Error);
        });
    });
});
