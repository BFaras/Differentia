import { Game } from '@common/game';
import { Time } from '@common/time';
import { expect } from 'chai';
import * as fs from 'fs';
import * as sinon from 'sinon';
import { GamesService } from './local.games.service';

describe('Games service', () => {
    let gamesService: GamesService;
    let allGamesTest: Game[];
    let validGameToAdd: Game;
    let invalidGameToAdd: Game;
    let newTime: Time;

    beforeEach(async () => {
        gamesService = new GamesService();
        gamesService.gamesFilePath = 'testGames.json';
        allGamesTest = [
            {
                name: 'Car game',
                numberOfDifferences: 4,
                times: [],
                images: ['ImageBlanche.bmp', 'image_7_diff.bmp'],
            },
            {
                name: 'Bike game',
                numberOfDifferences: 5,
                times: [],
                images: ['ImageBlanche.bmp', 'image_7_diff.bmp'],
            },
        ];
        validGameToAdd = {
            name: 'New Game',
            numberOfDifferences: 5,
            times: [],
            images: ['image1', 'image2'],
        };
        invalidGameToAdd = {
            name: 'Car game',
            numberOfDifferences: 5,
            times: [],
            images: ['image1', 'image2'],
        };
        newTime = {
            seconds: 0,
            minutes: 45,
        };
    });

    afterEach(async () => {
        sinon.restore();
    });

    it('should input all the games in the "games" attribute when the JSON file is read', async () => {
        await gamesService.asyncReadGamesFile();
        expect(gamesService.games).to.deep.equals(allGamesTest);
    });

    it('should return all the games in the JSON file', async () => {
        expect(await gamesService.getAllGames()).to.deep.equals(allGamesTest);
    });

    it('should not validate the name of the game when a game with the same name already exists', async () => {
        await gamesService.asyncReadGamesFile();
        expect(gamesService.validateName(invalidGameToAdd.name)).to.be.false;
    });

    it('should validate the name of the game when a game with the same name doesnt already exists', async () => {
        await gamesService.asyncReadGamesFile();
        expect(gamesService.validateName(validGameToAdd.name)).to.be.true;
    });

    it('should not add a game when a game with the same name already exists', async () => {
        expect(await gamesService.addGame(invalidGameToAdd)).to.be.false;
    });

    it('should add a game when a game with the same name doesnt already exists', async () => {
        const stub = sinon.stub(fs.promises, 'writeFile').callsFake(async () => {});
        expect(await gamesService.addGame(validGameToAdd)).to.be.true;
        expect(stub.callsFake);
    });

    it('should add a new time to a game', async () => {
        const nameOfGame = 'Car game';
        const oldGames = gamesService.games;
        const stub = sinon.stub(fs.promises, 'writeFile').callsFake(async () => {});
        await gamesService.addTimeToGame(newTime, nameOfGame);
        expect(stub.callsFake);
        expect(gamesService.games).to.not.equal(oldGames);
    });

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
            expect(gamesService.asyncWriteInGamesFile()).to.eventually.rejectedWith(Error);
            expect(stub.callsFake);
            expect(spy.calledOnce);
        });

        it('should throw an error when fs.promises.readFile() crashes', async () => {
            const stub = sinon.stub(fs.promises, 'readFile').callsFake(async () => {
                throw new Error();
            });
            const spy = sinon.spy(console, 'log');
            expect(gamesService.asyncReadGamesFile()).to.eventually.rejectedWith(Error);
            expect(stub.callsFake);
            expect(spy.calledOnce);
        });
    });
});
