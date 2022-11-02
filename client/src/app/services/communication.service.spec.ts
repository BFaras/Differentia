import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CommunicationService } from '@app/services/communication.service';
import { Game } from '@common/game';
import { StatusCodes } from 'http-status-codes';
// import { StatusCodes } from 'http-status-codes';

describe('CommunicationService', () => {
    let httpMock: HttpTestingController;
    let service: CommunicationService;
    let baseUrl: string;
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
        {
            name: 'House game',
            numberOfDifferences: 6,
            times: [],
            images: [],
            differencesList: [],
        },
        {
            name: 'Plane game',
            numberOfDifferences: 7,
            times: [],
            images: [],
            differencesList: [],
        },
        {
            name: 'TV game',
            numberOfDifferences: 8,
            times: [],
            images: [],
            differencesList: [],
        },
        {
            name: 'Table game',
            numberOfDifferences: 9,
            times: [],
            images: [],
            differencesList: [],
        },
        {
            name: 'Chair game',
            numberOfDifferences: 9,
            times: [],
            images: [],
            differencesList: [],
        },
        {
            name: 'Clown game',
            numberOfDifferences: 9,
            times: [],
            images: [],
            differencesList: [],
        },
        {
            name: 'Dog game',
            numberOfDifferences: 9,
            times: [],
            images: [],
            differencesList: [],
        },
    ];
    let validGameToAdd: Game = {
        name: 'New Game',
        numberOfDifferences: 5,
        times: [],
        images: ['image1', 'image2'],
        differencesList: [],
    };
    let unvalidGameToAdd: Game = {
        name: 'Car game',
        numberOfDifferences: 5,
        times: [],
        images: ['image3', 'image4'],
        differencesList: [],
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(CommunicationService);
        httpMock = TestBed.inject(HttpTestingController);
        // eslint-disable-next-line dot-notation -- baseUrl is private and we need access for the test
        baseUrl = service['baseUrl'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return all games (HttpClient called once)', () => {
        // check the content of the mocked call
        service.getGames().subscribe({
            next: (response: Game[]) => {
                expect(response).toEqual(allGames);
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/games`);
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(allGames);
    });

    it('should return a OK http Status code when sending a POST request with a valid game (HttpClient called once)', () => {
        // subscribe to the mocked call
        service.addGame(validGameToAdd).subscribe({
            next: (res: any) => {
                expect(res.status).toEqual(StatusCodes.OK);
            },
            error: fail,
        });
        const req = httpMock.expectOne(`${baseUrl}/games/newGame`);
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(validGameToAdd);
    });

    // Je devrais vérifier si sa donne un certain code HTTP mais la réponse est le jeu qui est en paramètre ==> changer logique?
    it('should return an undefined response when sending a POST request with an unvalid game (HttpClient called once)', () => {
        // subscribe to the mocked call
        service.addGame(unvalidGameToAdd).subscribe({
            next: (res: any) => {
                expect(res).toBeFalsy();
            },
            error: fail,
        });
        const req = httpMock.expectOne(`${baseUrl}/games/newGame`);
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(unvalidGameToAdd);
    });

    it('should return the games without the deleted game', () => {
        const games = allGames.slice(0, -2);
        const gameToDelete = 'Dog game';
        service.deleteGame(gameToDelete).subscribe({
            next: (response: Game[]) => {
                expect(response).toEqual(games);
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/games/${gameToDelete}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(games);
    });
});
