import { TestBed } from '@angular/core/testing';
import { CommunicationService } from './communication.service';
import { FormService } from './form.service';

describe('FormService', () => {
    let service: FormService;
    let communicationSpy: jasmine.SpyObj<CommunicationService>;

    beforeEach(() => {
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['getGames']);
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
        setTimeout(() => {
            service.receiveGameInformations();
            expect(parseInfoSpy).toHaveBeenCalled();
        }, 1000);
    });

    it('should fill game name list', () => {
        const listGameNameSpy = spyOn(service, 'fillListGameName');
        setTimeout(() => {
            service.receiveGameInformations();
            expect(listGameNameSpy).toHaveBeenCalled();
        }, 1000);
    });

    it('should fill game image list', () => {
        const listGameImageSpy = spyOn(service, 'fillListGameImage');
        setTimeout(() => {
            service.receiveGameInformations();
            expect(listGameImageSpy).toHaveBeenCalled();
        }, 1000);
    });

    it('should initialize gameForm structure', () => {
        const gameFormSpy = spyOn(service, 'initializeGameForm');
        setTimeout(() => {
            service.receiveGameInformations();
            expect(gameFormSpy).toHaveBeenCalled();
        }, 1000);
    });
});
