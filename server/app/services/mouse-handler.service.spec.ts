import { NO_DIFFERENCE_FOUND_ARRAY } from '@common/const';
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
    const gamesService: GamesService = Container.get(GamesService);
    const hashmapConverter: HashmapConverterService = Container.get(HashmapConverterService);

    let mouseService: MouseHandlerService;
    let position: Position = { x: 0, y: 0 };

    before(() => {
        sinon.stub(gamesService, 'getGame').callsFake(async (gameName: string) => {
            testGame.name = gameName;
            return Promise.resolve(testGame);
        });
    });

    beforeEach(async () => {
        //we need a mock of a local games service which will return a game by default
        mouseService = new MouseHandlerService();
        mouseService.generateDifferencesInformations('new game');
        mouseService.differencesHashmap.set(0, 1);
        position = { x: 0, y: 0 };
    });

    after(() => {
        sinon.restore();
    });

    it('should call generateDifferencesInformations on updateImageData', () => {
        const spy = sinon.spy(mouseService, <any>'generateDifferencesInformations');
        expect(spy.called);
    });

    it('should set the differences list at the right value when generateDifferencesInformations() is called', async () => {
        await mouseService.generateDifferencesInformations(testGameName);
        expect(mouseService.differencesList).to.deep.equals(testGame.differencesList);
    });

    it('should change the differencesMap value when generateDifferencesInformations() is called', async () => {
        const originalDifferencesMap = mouseService.differencesHashmap;
        await mouseService.generateDifferencesInformations(testGameName);
        expect(mouseService.differencesHashmap).to.not.deep.equals(originalDifferencesMap);
    });

    it('should call convertNumber2DArrayToNumberMap() from hashmapConverter when generateDifferencesInformations() is called', async () => {
        const spy = sinon.spy(hashmapConverter, 'convertNumber2DArrayToNumberMap');
        await mouseService.generateDifferencesInformations(testGameName);
        expect(spy.called);
    });

    it('should return an empty array if difference is already found ', () => {
        mouseService.differencesNumberFound = [1];
        expect(mouseService.isValidClick(position)).to.be.deep.equals(NO_DIFFERENCE_FOUND_ARRAY);
    });

    it('should not return an empty array if difference is not already found ', () => {
        expect(mouseService.isValidClick(position)).to.not.be.deep.equals(NO_DIFFERENCE_FOUND_ARRAY);
    });

    it('should return an empty array if pixel is not a difference ', () => {
        position = { x: 2, y: 2 };
        expect(mouseService.isValidClick(position)).to.be.deep.equals(NO_DIFFERENCE_FOUND_ARRAY);
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
