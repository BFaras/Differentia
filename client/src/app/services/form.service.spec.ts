import { TestBed } from '@angular/core/testing';
import { GameFormDescription } from '@app/classes/game-form-description';
import { RecordTimesBoard } from '@app/classes/record-times-board';
import { Game } from '@common/game';
import { CommunicationService } from './communication.service';
import { FormService } from './form.service';

describe('FormService', () => {
    let service: FormService;
    let communicationSpy: jasmine.SpyObj<CommunicationService>;
    let listName: string[] = [];
    let listImage: string[] = [];
    let gameList: Game[] = [{ name: 'bike', numberOfDifferences: 2, times: [], images: ['img1'], differencesList: [][0] }];

    beforeEach(() => {
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['getGames']);
        TestBed.configureTestingModule({
            providers: [{ provide: CommunicationService, useValue: communicationSpy }],
        });
        service = TestBed.inject(FormService);
        service['listName'] = listName;
        service['listImage'] = listImage;
    });

    afterEach(() => {
        listImage = [];
        listName = [];
        TestBed.resetTestingModule();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should receive info', async () => {
        await service.receiveGameInformations();
        expect(communicationSpy.getGames).toHaveBeenCalled();
    });

    it('should have correct number of names in list ', () => {
        service['fillListGameName']('Max', listName);
        service['fillListGameName']('Tom', listName);
        expect(service['listName']).toEqual(['Max', 'Tom']);
    });

    it('should have correct number of images in list', () => {
        service['fillListGameName']('img1', listImage);
        service['fillListGameName']('img2', listImage);
        expect(service['listImage']).toEqual(['img1', 'img2']);
    });

    it('should not parse game list', () => {
        const listGameNameSpy = spyOn(service, <any>'fillListGameName');
        const listGameImageSpy = spyOn(service, <any>'fillListGameImage');
        service['gamelist'] = [];
        service['parseGameList']();
        expect(listGameNameSpy).not.toHaveBeenCalled();
        expect(listGameImageSpy).not.toHaveBeenCalled();
    });

    it('should parse game list and fill the list for images and names ', () => {
        const listGameNameSpy = spyOn(service, <any>'fillListGameName');
        const listGameImageSpy = spyOn(service, <any>'fillListGameImage');
        service['gamelist'] = gameList;
        service['parseGameList']();
        expect(listGameNameSpy).toHaveBeenCalled();
        expect(listGameImageSpy).toHaveBeenCalled();
    });

    it('should fill game name list', () => {
        const listGameNameSpy = spyOn(service, <any>'fillListGameName');
        service['gamelist'] = gameList;
        service['parseGameList']();
        expect(listGameNameSpy).toHaveBeenCalled();
    });

    it('should fill game image list', () => {
        const listGameImageSpy = spyOn(service, <any>'fillListGameImage');
        service['gamelist'] = gameList;
        service['parseGameList']();
        expect(listGameImageSpy).toHaveBeenCalled();
    });

    it('should initialize gameForm structure', () => {
        const gameFormSpy = spyOn(service, <any>'initializeGameForm');
        service['gamelist'] = gameList;
        service['parseGameList']();
        expect(gameFormSpy).toHaveBeenCalled();
    });

    it('should reset the game form', () => {
        const gameList: GameFormDescription = new GameFormDescription('Bike Game', 'img1', new RecordTimesBoard([], []));
        service.gameForms.push(gameList);
        service['resetGameForms']();
        expect(service.gameForms).toEqual([]);
        expect(service['gamelist']).toEqual([]);
        expect(service['listImage']).toEqual([]);
        expect(service['listName']).toEqual([]);
    });
});
