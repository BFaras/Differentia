import { Game } from '@common/game';
import { Time } from '@common/time';
import { expect } from 'chai';
import * as fs from 'fs';
import * as sinon from 'sinon';
import { GamesService } from './local.games.service';

describe('Games service', () => {
    let gamesService: GamesService;
    let allGames: Game[];
    let validGameToAdd: Game;
    let unvalidGameToAdd: Game;
    let newTime: Time;

    beforeEach(async () => {
        gamesService = new GamesService();
        allGames = [
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
            {
                name: 'House game',
                numberOfDifferences: 6,
                times: [],
                images: ['ImageBlanche.bmp', 'image_7_diff.bmp'],
            },
            {
                name: 'Plane game',
                numberOfDifferences: 7,
                times: [],
                images: ['ImageBlanche.bmp', 'image_7_diff.bmp'],
            },
            {
                name: 'TV game',
                numberOfDifferences: 8,
                times: [],
                images: ['ImageBlanche.bmp', 'image_7_diff.bmp'],
            },
            {
                name: 'Table game',
                numberOfDifferences: 9,
                times: [],
                images: ['ImageBlanche.bmp', 'image_7_diff.bmp'],
            },
            {
                name: 'Chair game',
                numberOfDifferences: 9,
                times: [],
                images: ['ImageBlanche.bmp', 'image_7_diff.bmp'],
            },
            {
                name: 'Clown game',
                numberOfDifferences: 9,
                times: [],
                images: ['ImageBlanche.bmp', 'image_7_diff.bmp'],
            },
            {
                name: 'Dog game',
                numberOfDifferences: 9,
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
        unvalidGameToAdd = {
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
        await gamesService.asyncReadFile();
        expect(gamesService.games).to.deep.equals(allGames);
    });

    it('should return all the games in the JSON file', async () => {
        expect(await gamesService.getAllGames()).to.deep.equals(allGames);
    });

    it('should not validate the name of the game when a game with the same name already exists', async () => {
        await gamesService.asyncReadFile();
        expect(gamesService.validateName(unvalidGameToAdd.name)).to.be.false;
    });

    it('should validate the name of the game when a game with the same name doesnt already exists', async () => {
        await gamesService.asyncReadFile();
        expect(gamesService.validateName(validGameToAdd.name)).to.be.true;
    });

    it('should not add a game when a game with the same name already exists', async () => {
        expect(await gamesService.addGame(unvalidGameToAdd)).to.be.false;
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

    describe('Error handling', async () => {
        it('should throw an error when fs.promises.writeFile() crashes', async () => {
            const stub = sinon.stub(fs.promises, 'writeFile').callsFake(async () => {
                throw new Error();
            });
            const spy = sinon.spy(console, 'log');
            expect(gamesService.asyncWriteFile()).to.eventually.rejectedWith(Error);
            expect(stub.callsFake);
            expect(spy.calledOnce);
        });

        it('should throw an error when fs.promises.readFile() crashes', async () => {
            const stub = sinon.stub(fs.promises, 'readFile').callsFake(async () => {
                throw new Error();
            });
            const spy = sinon.spy(console, 'log');
            expect(gamesService.asyncReadFile()).to.eventually.rejectedWith(Error);
            expect(stub.callsFake);
            expect(spy.calledOnce);
        });
    });
});
