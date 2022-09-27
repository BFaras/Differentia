import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CommunicationService } from '@app/services/communication.service';
import { Game } from '@common/game';
import { Message } from '@common/message';
// import { StatusCodes } from 'http-status-codes';

describe('CommunicationService', () => {
    let httpMock: HttpTestingController;
    let service: CommunicationService;
    let baseUrl: string;
    let allGames: Game[] = [{   
        name: "Car game",
        numberOfDifferences: 4,
        times: [],
        images: []
    },
    {
        name: "Bike game",
        numberOfDifferences: 5,
        times: [],
        images: []
    },
    {
        name: "House game",
        numberOfDifferences: 6,
        times: [],
        images: []
    },
    {
        name: "Plane game",
        numberOfDifferences: 7,
        times: [],
        images: []
    },
    {
        name: "TV game",
        numberOfDifferences: 8,
        times: [],
        images: []
    },
    {
        name: "Table game",
        numberOfDifferences: 9,
        times: [],
        images: []
    },
    {
        name: "Chair game",
        numberOfDifferences: 9,
        times: [],
        images: []
    },
    {
        name: "Clown game",
        numberOfDifferences: 9,
        times: [],
        images: []
    },
    {
        name: "Dog game",
        numberOfDifferences: 9,
        times: [],
        images: []
    }];
    let validGameToAdd: Game = {
        name: "New Game",
        numberOfDifferences: 5,
        times: [],
        images: ["image1", "image2"]
    };
    let unvalidGameToAdd: Game = {
        name: "Car game",
        numberOfDifferences: 5,
        times: [],
        images: ["image3", "image4"]
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

    it('should return expected message (HttpClient called once)', () => {
        const expectedMessage: Message = { body: 'Hello', title: 'World' };

        // check the content of the mocked call
        service.basicGet().subscribe({
            next: (response: Message) => {
                expect(response.title).toEqual(expectedMessage.title);
                expect(response.body).toEqual(expectedMessage.body);
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/example`);
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(expectedMessage);
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

    // Je devrais vérifier si sa donne un certain code HTTP mais la réponse est le jeu qui est en paramètre ==> changer logique?
    it('should return a CREATED http Status code when sending a POST request with a valid game (HttpClient called once)', () => {
        // subscribe to the mocked call
        service.addGame(validGameToAdd).subscribe({
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(`${baseUrl}/games/newGame`);
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(validGameToAdd);
    });

    // Je devrais vérifier si sa donne un certain code HTTP mais la réponse est le jeu qui est en paramètre ==> changer logique?
    it('should return a BAD REQUEST http Status code when sending a POST request with an unvalid game (HttpClient called once)', () => {
        // subscribe to the mocked call
        service.addGame(unvalidGameToAdd).subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(`${baseUrl}/games/newGame`);
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(unvalidGameToAdd);
    });

    it('should not return any message when sending a POST request (HttpClient called once)', () => {
        const sentMessage: Message = { body: 'Hello', title: 'World' };
        // subscribe to the mocked call
        service.basicPost(sentMessage).subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(`${baseUrl}/example/send`);
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(sentMessage);
    });

    // peut-être changer avec une requête HTTP qu'on connait
    it('should handle http error safely', () => {
        service.basicGet().subscribe({
            next: (response: Message) => {
                expect(response).toBeUndefined();
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/example`);
        expect(req.request.method).toBe('GET');
        req.error(new ProgressEvent('Random error occurred'));
    });


});
