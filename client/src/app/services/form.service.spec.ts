import { TestBed } from '@angular/core/testing';
import { Game } from '@common/game';
import { Subject } from 'rxjs';
import { CommunicationService } from './communication.service';
import { FormService } from './form.service';

describe('FormService', () => {
    let service: FormService;
    let communicationSpy: jasmine.SpyObj<CommunicationService>;
    let formsSubject: Subject<Game[]>;
    let allGames: Game[] = [
        {
            name: 'Car game',
            numberOfDifferences: 4,
            times: [],
            images: [],
            differencesList: [],
        },
        {
            name: 'Bike game',
            numberOfDifferences: 5,
            times: [],
            images: [],
            differencesList: [],
        },
    ];

    beforeEach(() => {
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['getGames']);
        formsSubject = new Subject();
        communicationSpy.getGames.and.returnValue(formsSubject);
        TestBed.configureTestingModule({
            providers: [{ provide: CommunicationService, useValue: communicationSpy }],
        });
        service = TestBed.inject(FormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should receive info', () => {
        const parseInfoSpy = spyOn(service, 'parseGameList');
        service.receiveGameInformations();
        formsSubject.next(allGames);
        expect(parseInfoSpy).toHaveBeenCalled();
    });

    it('should fill game name list', () => {
        const listGameNameSpy = spyOn(service, 'fillListGameName');
        service.receiveGameInformations();
        formsSubject.next(allGames);
        expect(listGameNameSpy).toHaveBeenCalled();
    });

    it('should fill game image list', () => {
        const listGameImageSpy = spyOn(service, 'fillListGameImage');
        service.receiveGameInformations();
        formsSubject.next(allGames);
        expect(listGameImageSpy).toHaveBeenCalled();
    });

    it('should initialize gameForm structure', () => {
        const gameFormSpy = spyOn(service, 'initializeGameForm');
        service.receiveGameInformations();
        formsSubject.next(allGames);
        expect(gameFormSpy).toHaveBeenCalled();
    });
});
