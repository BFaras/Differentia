import { Application } from '@app/app';
import { RecordTime } from '@app/classes/record-times';
import { RecordTimesService } from '@app/services/database.games.service';
import { GamesService } from '@app/services/local.games.service';
import { Game } from '@common/game';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';
import sinon = require('sinon');

describe('GamesController', () => {
    const baseGame = {
        name: 'Car game',
        numberOfDifferences: 8,
        times: { soloGameTimes: [new RecordTime('00:00', 'playerUsername')], multiplayerGameTimes: [new RecordTime('00:00', 'playerUsername')] },
        images: ['image 1', 'image 2'],
        differencesList: [],
    } as Game;
    const newValidGame = {
        name: 'Valid game',
        numberOfDifferences: 5,
        times: { soloGameTimes: [new RecordTime('00:00', 'playerUsername')], multiplayerGameTimes: [new RecordTime('00:00', 'playerUsername')] },
        images: ['image 3', 'image 4'],
        differencesList: [],
    } as Game;
    let gamesService: SinonStubbedInstance<GamesService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        gamesService = createStubInstance(GamesService);
        gamesService.getAllGamesWithImagesData.resolves([baseGame]);
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
                expect(response.status).to.deep.equal(StatusCodes.BAD_REQUEST);
            });
    });

    it('should return a code 200 on valid post request to /newGame ', async (done) => {
        const spyTime = sinon.stub(RecordTimesService.prototype, 'addNewGameDefaultTimes').callsFake(async () => {});
        gamesService.addGame.resolves(true);

        expect(spyTime.calledOnceWith(newValidGame.name));
        supertest(expressApp)
            .post('/games/newGame')
            .send(newValidGame)
            .then((response) => {
                expect(response.statusType).to.deep.equal(StatusCodes.CREATED);
            });
        done();
    });

    it('should delete a specify game on delete request to /:gameName ', async (done) => {
        const spyTime = sinon.spy(RecordTimesService.prototype, 'deleteGameRecordTimes');
        const spyGame = sinon.spy(GamesService.prototype, 'deleteGame');

        gamesService.deleteGame.resolves([baseGame]);
        expect(spyTime.calledOnceWith(baseGame.name));
        expect(spyGame.calledOnce);

        supertest(expressApp)
            .delete('/games/:gameName')
            .send(baseGame.name)
            .then((response) => {});
        done();
    });
});
