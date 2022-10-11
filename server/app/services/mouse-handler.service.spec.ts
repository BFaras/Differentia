import { Game } from '@common/game';
import { Position } from '@common/position';
import { expect } from 'chai';
import * as sinon from 'sinon';
import Container from 'typedi';
import { HashmapConverterService } from './hashmap-converter.service';
import { GamesService } from './local.games.service';
import { MouseHandlerService } from './mouse-handler.service';

describe('MouseHandlerService', () => {
    const testGameName = 'name';
    const testGame: Game = {
        name: 'test',
        numberOfDifferences: 2,
        times: [],
        images: ['image1', 'image2'],
        differencesList: [
            [599, 666],
            [899, 951],
        ],
    };

    let mouseService: MouseHandlerService;
    let position: Position = { x: 0, y: 0 };

    beforeEach(async () => {
        //we need a mock of a local games service which will return a game by default
        mouseService = new MouseHandlerService();
        mouseService.generateDifferencesInformations('new game');
        mouseService.differencesHashmap.set(0, 1);
        position = { x: 0, y: 0 };
    });

    it('should call generateDifferencesInformations on updateImageData', () => {
        const spy = sinon.spy(mouseService, <any>'generateDifferencesInformations');
        expect(spy.called);
    });

    it('should set the differences list at the right value when generateDifferencesInformations() is called', async () => {
        const gamesService: GamesService = Container.get(GamesService);
        const stub = sinon.stub(gamesService, 'getGame').callsFake(async (gameName: string) => {
            testGame.name = gameName;
            return Promise.resolve(testGame);
        });

        await mouseService.generateDifferencesInformations(testGameName);
        expect(mouseService.differencesList).to.deep.equals(testGame.differencesList);
        expect(stub.callsFake);
    });

    it('should change the differencesMap value when generateDifferencesInformations() is called', async () => {
        const gamesService: GamesService = Container.get(GamesService);
        const originalDifferencesMap = mouseService.differencesHashmap;
        const stub = sinon.stub(gamesService, 'getGame').callsFake(async (gameName: string) => {
            testGame.name = gameName;
            console.log('called');
            return Promise.resolve(testGame);
        });

        await mouseService.generateDifferencesInformations(testGameName);
        expect(mouseService.differencesHashmap).to.not.deep.equals(originalDifferencesMap);
        expect(stub.callsFake);
    });

    it('should call convertNumber2DArrayToNumberMap() from hashmapConverter when generateDifferencesInformations() is called', async () => {
        const gamesService: GamesService = Container.get(GamesService);
        const hashmapConverter: HashmapConverterService = Container.get(HashmapConverterService);
        const spy = sinon.spy(hashmapConverter, 'convertNumber2DArrayToNumberMap');

        const stub = sinon.stub(gamesService, 'getGame').callsFake(async (gameName: string) => {
            testGame.name = gameName;
            return Promise.resolve(testGame);
        });

        await mouseService.generateDifferencesInformations(testGameName);
        expect(spy.called);
        expect(stub.callsFake);
    });

    it('should return false if difference is already found ', () => {
        mouseService.differencesNumberFound = [1];
        expect(mouseService.isValidClick(position)).to.be.false;
    });

    it('should return true if difference is not already found ', () => {
        expect(mouseService.isValidClick(position)).to.be.true;
    });

    it('should return false if pixel is not a difference ', () => {
        position = { x: 2, y: 2 };
        expect(mouseService.isValidClick(position)).to.be.false;
    });

    it('should reset differencesHashmap and differencesFound array', () => {
        let differencesHashmapTest: Map<number, number> = new Map<number, number>();
        let differencesNumberFoundTest: number[] = [];

        mouseService.differencesNumberFound = [1, 2, 3];
        mouseService.resetData();
        expect(mouseService.differencesHashmap).to.deep.equals(differencesHashmapTest);
        expect(mouseService.differencesNumberFound).to.deep.equals(differencesNumberFoundTest);
    });
});
