import { Application } from '@app/app';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('ImagesController', () => {
    const testEmptyFileReq = {};
    let expressApp: Express.Application;

    beforeEach(async () => {
        const app = Container.get(Application);
        expressApp = app.app;
    });

    it('should return a Created status code', async () => {
        return await supertest(expressApp)
            .post('/images')
            .field('Content-Type', 'multipart/form-data')
            .attach('file', './assets/images/Chair game_1_image_7_diff.bmp')
            .then((response) => {
                expect(response.status).to.deep.equal(StatusCodes.CREATED);
            });
    });

    it('should return bad request status code', async () => {
        return await supertest(expressApp)
            .post('/images')
            .send(testEmptyFileReq)
            .then((response) => {
                expect(response.status).to.deep.equal(StatusCodes.BAD_REQUEST);
            });
    });
});
