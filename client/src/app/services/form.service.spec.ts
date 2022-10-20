import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Game } from '@common/game';
import { firstValueFrom } from 'rxjs';
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
        service.listImage = listImage;
        service.listName = listName;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should receive info', fakeAsync(async () => {
        const result = await firstValueFrom(communicationSpy.getGames());
        tick(1000);
        await service.receiveGameInformations();
        expect(result).toHaveBeenCalled();
    }));

    it('should not parse game list', fakeAsync(() => {
        const listGameNameSpy = spyOn(service, 'fillListGameName');
        const listGameImageSpy = spyOn(service, 'fillListGameImage');
        tick(2000);
        service.parseGameList([]);
        expect(listGameNameSpy).not.toHaveBeenCalled();
        expect(listGameImageSpy).not.toHaveBeenCalled();
    }));

    it('should parse game list', fakeAsync(() => {
        const listGameNameSpy = spyOn(service, 'fillListGameName');
        const listGameImageSpy = spyOn(service, 'fillListGameImage');
        tick(2000);
        service.parseGameList(gameList);
        expect(listGameNameSpy).not.toHaveBeenCalled();
        expect(listGameImageSpy).not.toHaveBeenCalled();
    }));

    it('should fill game name list', fakeAsync(() => {
        const listGameNameSpy = spyOn(service, 'fillListGameName');
        tick(1000);
        service.receiveGameInformations();
        expect(listGameNameSpy).toHaveBeenCalled();
    }));

    it('should fill game image list', fakeAsync(() => {
        const listGameImageSpy = spyOn(service, 'fillListGameImage');
        tick(1000);
        service.receiveGameInformations();
        expect(listGameImageSpy).toHaveBeenCalled();
    }));

    it('should initialize gameForm structure', fakeAsync(() => {
        const gameFormSpy = spyOn(service, 'initializeGameForm');
        tick(1000);
        service.receiveGameInformations();
        expect(gameFormSpy).toHaveBeenCalled();
    }));

    it('should have correct number of names in list ', () => {
        service.fillListGameName('Max', listName);
        service.fillListGameName('Tom', listName);
        expect(service.listName).toEqual(['Max', 'Tom']);
    });

    it('should have correct number of images in list', () => {
        service.fillListGameName('im1', listImage);
        service.fillListGameName('im2', listImage);
        expect(service.listImage).toEqual(['im1', 'im2']);
    });
});
