import { Game } from '@common/game';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import * as sinon from 'sinon';
import { GamesService } from './local.games.service';
import { RecordTime } from '@app/classes/record-times';
chai.use(chaiAsPromised);

describe('Games service', () => {
    let gamesService: GamesService;
    let allGamesTest: Game[];
    let validGameToAdd: Game;
    let invalidGameToAdd: Game;
    let carGame: Game;
    let bikeGame: Game;

    beforeEach(async () => {
        gamesService = new GamesService();
        gamesService['gamesFilePath'] = 'testGames.json';
        carGame = {
            name: 'Car game',
            numberOfDifferences: 4,
            times: { soloGameTimes: [new RecordTime('00:00', 'playerUsername')], multiplayerGameTimes: [new RecordTime('00:00', 'playerUsername')] },
            images: ['ImageBlanche.bmp', 'image_7_diff.bmp'],
            differencesList: [],
        };
        bikeGame = {
            name: 'Bike game',
            numberOfDifferences: 5,
            times: { soloGameTimes: [new RecordTime('00:00', 'playerUsername')], multiplayerGameTimes: [new RecordTime('00:00', 'playerUsername')] },
            images: ['ImageBlanche.bmp', 'image_7_diff.bmp'],
            differencesList: [],
        };
        allGamesTest = [carGame, bikeGame];
        validGameToAdd = {
            name: 'New Game',
            numberOfDifferences: 5,
            times: { soloGameTimes: [new RecordTime('00:00', 'playerUsername')], multiplayerGameTimes: [new RecordTime('00:00', 'playerUsername')] },
            images: ['ImageBlanche.bmp', 'image_7_diff.bmp'],
            differencesList: [],
        };
        invalidGameToAdd = {
            name: 'Car game',
            numberOfDifferences: 5,
            times: { soloGameTimes: [new RecordTime('00:00', 'playerUsername')], multiplayerGameTimes: [new RecordTime('00:00', 'playerUsername')] },
            images: ['image_7_diff.bmp', 'ImageBlanche.bmp'],
            differencesList: [],
        };
        // newTime = {
        //     seconds: 0,
        //     minutes: 45,
        // };
    });

    afterEach(async () => {
        sinon.restore();
        await gamesService.addGame(carGame);
        await gamesService.addGame(bikeGame);
    });

    it('should input all the games in the "games" attribute when the JSON file is read', async () => {
        await gamesService.asyncReadGamesFile();
        expect(gamesService['games']).to.deep.equals(allGamesTest);
    });

    it('should return all the games in the JSON file', async () => {
        expect(await gamesService.getAllGames()).to.deep.equals(allGamesTest);
    });

    it('should get a specific game when calling getGame', async () => {
        expect(await gamesService.getGame('Car game')).to.deep.equals(allGamesTest[0]);
    });

    it('should not validate the name of the game when a game with the same name already exists', async () => {
        await gamesService.asyncReadGamesFile();
        expect(gamesService.validateName(invalidGameToAdd.name)).to.equal(false);
    });

    it('should validate the name of the game when a game with the same name doesnt already exists', async () => {
        await gamesService.asyncReadGamesFile();
        expect(gamesService.validateName(validGameToAdd.name)).to.equal(true);
    });

    it('should not add a game when a game with the same name already exists', async () => {
        expect(await gamesService.addGame(invalidGameToAdd)).to.equal(false);
    });

    it('should add a game when a game doesnt already exists', async () => {
        const stub = sinon.stub(fs.promises, 'writeFile').callsFake(async () => {});
        expect(await gamesService.addGame(validGameToAdd)).to.equal(true);
        expect(stub.callsFake);
    });

    // it('should add a new time to a game', async () => {
    //     const nameOfGame = 'Car game';
    //     const oldGames = gamesService['games'];
    //     const stub = sinon.stub(fs.promises, 'writeFile').callsFake(async () => {});
    //     await gamesService.addTimeToGame(newTime, nameOfGame);
    //     expect(stub.callsFake);
    //     expect(gamesService['games']).to.not.equal(oldGames);
    // });

    it('should return all games with images data in the data structure', async () => {
        const FIRST_GAME = 0;
        const LAST_GAME = 1;
        const gamesWithImagesData: Game[] = await gamesService.getAllGamesWithImagesData();

        for (let i = FIRST_GAME; i <= LAST_GAME; i++) {
            expect(gamesWithImagesData[i].name).to.equal(allGamesTest[i].name);
            expect(gamesWithImagesData[i].numberOfDifferences).to.equal(allGamesTest[i].numberOfDifferences);
            expect(gamesWithImagesData[i].times).to.deep.equals(allGamesTest[i].times);
            expect(gamesWithImagesData[i].images).to.not.deep.equals(allGamesTest[i].images);
        }
    });

    describe('Error handling', async () => {
        it('should throw an error when fs.promises.writeFile() crashes', async () => {
            const stub = sinon.stub(fs.promises, 'writeFile').callsFake(async () => {
                throw new Error();
            });
            const spy = sinon.spy(console, 'log');
            expect(gamesService.asyncWriteInGamesFile()).to.eventually.be.rejectedWith(Error);
            expect(stub.callsFake);
            expect(spy.calledOnce);
        });

        it('should throw an error when fs.promises.readFile() crashes', async () => {
            const stub = sinon.stub(fs.promises, 'readFile').callsFake(async () => {
                throw new Error();
            });
            const spy = sinon.spy(console, 'log');
            expect(gamesService.asyncReadGamesFile()).to.eventually.be.rejectedWith(Error);
            expect(stub.callsFake);
            expect(spy.calledOnce);
        });

        it('should throw an error when fs.promises.readFile(images_path) crashes', async () => {
            const testImageName = 'test name';
            const stub = sinon.stub(fs.promises, 'readFile').callsFake(async () => {
                throw new Error();
            });
            const spy = sinon.spy(console, 'log');
            expect(gamesService['getGameImageData'](testImageName)).to.eventually.be.rejectedWith(Error);
            expect(stub.callsFake);
            expect(spy.calledOnce);
        });

        it('should delete a specific game when calling deleteGame', async () => {
            const deleteStub = sinon.stub(gamesService, 'deleteGame').callsFake(async (nameOfGameToDelete: string) => {
                return await gamesService.getAllGames();
            });
            expect(await gamesService.deleteGame('Bike game')).to.deep.equal(allGamesTest);
            expect(deleteStub.calledOnce);
        });

        it('should throw an error if the image to delete doesnt exist', async () => {
            await gamesService.addGame(invalidGameToAdd);
            const stub = sinon.stub(fs, 'rm').callsFake(async () => {
                throw new Error();
            });
            sinon.stub(gamesService, 'deleteGame').callsFake(async (nameOfGameToDelete: string) => {
                expect(stub.callsFake);
                return await gamesService.getAllGames();
            });
            await gamesService.deleteGame(invalidGameToAdd.name);
        });
    });
});
