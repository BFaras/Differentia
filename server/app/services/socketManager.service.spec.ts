import { Server } from "app/server";
import { SocketManager } from "./socketManager.service";
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { ChronometerService } from './chronometer.service';

// À switch dans le fichier des constantes
const RESPONSE_DELAY = 200;

describe('SocketManager service tests', () => {
    let service: SocketManager;
    let server: Server;
    let clientSocket: Socket;
    let chronometerService: ChronometerService = new ChronometerService();

    const urlString = 'http://localhost:3000';
    beforeEach(async () => {
        server = Container.get(Server);
        server.init();
        service = server['socketManager'];
        clientSocket = ioClient(urlString);
    });

    afterEach(() => {
        clientSocket.close();
        service['sio'].close();
        sinon.restore();
    });

    it('should handle a message event print it to console', (done) => {
        const spy = sinon.spy(console, 'log');
        const testMessage = 'Hello World';
        clientSocket.emit('message', testMessage);
        setTimeout(() => {
            assert(spy.called);
            assert(spy.calledWith(testMessage))
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a kill the timer event and stop the chronometer', (done) => {
        const spy = sinon.spy(chronometerService, 'resetChrono');
        clientSocket.emit('kill the timer');
        setTimeout(() => {
            expect(spy.calledOnce);
            expect(chronometerService.time.minutes).to.equal(0);
            expect(chronometerService.time.seconds).to.equal(0);
            done();
        }, RESPONSE_DELAY);
    });
    
    it('should handle a game page event and return the game of the name that was launched', (done) => {
        const gameName = "Car game";
        clientSocket.emit('game page', gameName);
        clientSocket.on('The game is', (nameOfGame: string) => {
            expect(nameOfGame).to.equal(gameName);
            done();
        });
    });
    
    it('should call emitTime on game page event', (done) => {
        const gameName = "Car game";
        const spy = sinon.spy(service, <any>'emitTime');
        clientSocket.emit('game page', gameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });
})