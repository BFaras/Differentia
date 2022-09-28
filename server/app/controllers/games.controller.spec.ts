import { Application } from '@app/app';
import { GamesService } from '@app/services/local.games.service';
import { Game } from '@common/game';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('GamesController', () => {
    const baseGame = {
        name: "Car game",
        numberOfDifferences: 8,
        times: [],
        images: ["image1", "image2"]  
    } as Game;
    const newValidGame = {
        name: "Valid game",
        numberOfDifferences: 5,
        times: [],
        images: ["image3", "image4"]
    } as Game;
    let gamesService: SinonStubbedInstance<GamesService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        gamesService = createStubInstance(GamesService);
        gamesService.getAllGames.resolves([baseGame]);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['gamesController'], 'gamesService', { value: gamesService });
        expressApp = app.app;
    });

    it('should return all the games from games service on valid get request to root', async () => {
        return supertest(expressApp)
            .get('/games')
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal([baseGame]);
            });
    });

    it('should return a code 400 on unvalid post request to /newGame', async () => {
        gamesService.addGame.resolves(false);
        return supertest(expressApp)
            .post('/games/newGame')
            .send(baseGame)
            .then((response) => {
                expect(response.body).to.deep.equal(StatusCodes.BAD_REQUEST);
            });
    });

    it('should return a code 200 on valid post request to /newGame ', async () => {
        gamesService.addGame.resolves(true);
        return supertest(expressApp)
            .post('/games/newGame')
            .send(newValidGame)
            .then((response) => {
                expect(response.body).to.deep.equal(StatusCodes.CREATED);
            });
    });
});
