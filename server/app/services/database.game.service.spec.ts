import { HttpException } from '@app/classes/http.exception';
import { RecordTime } from '@app/classes/record-times';
import { GameTimes } from '@common/game-times';
import { GameModeTimes } from '@common/games-record-times';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
// import { Time } from '../../../common/time';
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
    //  let testTimeOne: Time;

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

        // testTimeOne = {
        //     minutes: 0,
        //     seconds: 59,
        // };
        testGameRecordTimes = {
            name: 'Test game',
            recordTimes: testTimes,
        };
        await recordTimesService.collection.insertOne(testGameRecordTimes);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    // it('should get all games from DB', async () => {
    //     let games = await gamesService.getAllGames();
    //     expect(games.length).to.equal(1);
    //     expect(testGame).to.deep.equals(games[0]);
    // });

    // it('should get specific course with valid name', async () => {
    //     let game = await gamesService.getGame('Test Game');
    //     expect(game).to.deep.equals(testGame);
    // });

    it('should get specific game times with valid name', async () => {
        let times = await recordTimesService.getGameTimes('Test game');
        expect(times).to.deep.equals(testGameRecordTimes.recordTimes);
    });

    // it('should get specific game number of differences based on its name', async () => {
    //     let numberOfDifferences = await gamesService.getGameNumberOfDifferences('Test game');
    //     expect(numberOfDifferences).to.deep.equals(testGame.numberOfDifferences);
    // });

    // it("should add new time to a game's times based on its name", async () => {
    //     let oldTimes = await gamesService.getGameTimes(testGame.name);
    //     await gamesService.addNewTimeToGame(testTimeOne, testGame.name);
    //     let games = await gamesService.collection.find({}).toArray();
    //     expect(oldTimes.length + 1).to.equals(games.find((x) => x.name === testGame.name)?.times.length);
    //     expect(testTimeOne).to.deep.equals(games.find((x) => x.name === testGame.name)?.times[0]);
    // });

    it('should add default times to a new game', async () => {
        const newGameName = 'Test game 2';
        await recordTimesService.addNewGameDefaultTimes(newGameName);
        let games = await recordTimesService.collection.find({}).toArray();
        expect(games.length).to.equal(2);
        expect(games.find((x) => x.name === newGameName)?.recordTimes).to.deep.equals(defaultRecordTimes);
    });

    // it('should not insert a new game if it has an invalid number of difference, credits, images or name', async () => {
    //     let secondGame: Game = {
    //         name: 'Test Game',
    //         numberOfDifferences: 10,
    //         times: [testTimeOne],
    //         images: [],
    //     };
    //     try {
    //         await gamesService.addGame(secondGame);
    //     } catch {
    //         let games = await gamesService.collection.find({}).toArray();
    //         expect(games.length).to.equal(1);
    //     }
    // });

    // it("should not validate a game's name if it has the same name as another game in the database", async () => {
    //     expect((await gamesService['validateName']('Test Game')).valueOf()).to.be.false;
    // });

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
            soloGameTimes: [new RecordTime('00:20', 'player1'), new RecordTime('00:15', 'player2'), new RecordTime('00:17', 'player3')],
            multiplayerGameTimes: [new RecordTime('00:15', 'player4'), new RecordTime('00:11', 'player5'), new RecordTime('00:13', 'player6')],
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
            soloGameTimes: [new RecordTime('00:20', 'player1'), new RecordTime('00:15', 'player2'), new RecordTime('00:17', 'player3')],
            multiplayerGameTimes: [new RecordTime('00:15', 'player4'), new RecordTime('00:11', 'player5'), new RecordTime('00:13', 'player6')],
        };
        await recordTimesService.updateGameRecordTimes(testGameRecordTimes.name, newRecordTimes);
        await recordTimesService.sortGameTimes(testGameRecordTimes.name, !isMultiplayer);
        let gamesTimes = await recordTimesService.collection.find({}).toArray();
        expect(gamesTimes.find((x) => x.name === testGameRecordTimes.name)?.recordTimes.soloGameTimes).to.deep.equals(testTimes.soloGameTimes);
    });

    // it('should not modify an existing game data if no valid name is passed', async () => {
    //     let modifiedGame: Game = {
    //         name: 'Invalid name',
    //         numberOfDifferences: 4,
    //         times: testTimes,
    //         images: ['image1', 'image2'],
    //     };

    //     await gamesService.modifyGame(modifiedGame);
    //     let games = await gamesService.collection.find({}).toArray();
    //     expect(games.length).to.equal(1);
    //     expect(games.find((x) => x.name === testGame.name)?.name).to.not.equals(modifiedGame.name);
    // });

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

    //Error handling
    describe('Error handling', async () => {
        // it('should throw an error if we try to get all games on a closed connection', async () => {
        //     await client.close();
        //     expect(gamesService.getAllGames()).to.eventually.be.rejectedWith(Error);
        // });

        // it('should throw an error if we try to add a game on a closed connection', async () => {
        //     await client.close();
        //     gamesService['validateGame'] = async () => {
        //         return true;
        //     }; // modifier ce stub pour qqlch qui a lair plus sinon
        //     expect(gamesService.addGame(testGame)).to.eventually.be.rejectedWith(Error);
        // });

        it('should throw an error if we try to get a specific game times on a closed connection', async () => {
            await client.close();
            expect(recordTimesService.getGameTimes(testGameRecordTimes.name)).to.eventually.be.rejectedWith(Error);
        });
        //A revoir
        it('should throw an HTTP exception when trying to add default times to a new game', async () => {
            const addDefaultTimesStub = sinon.stub(recordTimesService, 'addNewGameDefaultTimes').callsFake(async () => {
                throw new HttpException('Failed to insert game and default times');
            });
            expect(recordTimesService.addNewGameDefaultTimes('Test game 2')).to.eventually.be.rejectedWith(HttpException);
            expect(addDefaultTimesStub.calledOnce);
        });

        it('should throw an error if we try to delete a game record times on a closed connection', async () => {
            await client.close();
            expect(recordTimesService.deleteGameRecordTimes('Test game')).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to reset a game record times on a closed connection', async () => {
            await client.close();
            expect(recordTimesService.resetGameRecordTimes('Test game')).to.eventually.be.rejectedWith(Error);
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

        // it("should throw an error if we try to get an invalid game's times", async () => {
        //     expect(gamesService.getGameTimes('Invalid name')).to.eventually.be.rejectedWith(Error);
        // });
    });
});
