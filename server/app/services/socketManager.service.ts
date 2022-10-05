import { GamesService } from '@app/services/local.games.service';
import { MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { Position } from '@common/position';
import * as http from 'http';
import * as io from 'socket.io';
import { clearInterval } from 'timers';
import Container from 'typedi';
import { ChronometerService } from './chronometer.service';
import { DifferenceDetectorService } from './difference-detector.service';
import { MouseHandlerService } from './mouse-handler.service';

export class SocketManager {
    private sio: io.Server;
    // private room: string = "serverRoom";
    public socket: io.Socket;
    private timeInterval: NodeJS.Timer;
    private chronometerService: ChronometerService = new ChronometerService();
    private mouseHandlerService = Container.get(MouseHandlerService);
    private gamesService = new GamesService();

    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] }, maxHttpBufferSize: 1e7 });
    }

    public handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            this.socket = socket;
            // message initial
            socket.emit('hello', 'Hello World!');

            socket.on('message', (message: string) => {
                console.log(message);
            });

            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });

            socket.on('game page', async (message: string) => {
                console.log(message);
                socket.emit('classic mode');
                socket.emit('The game is', message);
                this.timeInterval = setInterval(() => {
                    this.emitTime(socket);
                }, 1000);

                await this.sendImagesToClient(message, socket);
            });

            socket.on('username is', (username: string) => {
                socket.emit('show the username', username);
                console.log(username);
            });

            socket.on('kill the timer', () => {
                this.endTimer();
            });

            socket.on('detect images difference', (imagesData: ImageDataToCompare) => {
                const differenceDetector = new DifferenceDetectorService(imagesData);
                socket.emit('game creation difference array', differenceDetector.getDifferentPixelsArrayWithOffset());
                socket.emit('game creation nb of differences', differenceDetector.getNbDifferences());
            });

            socket.on('image data to begin game', (imagesData: ImageDataToCompare) => {
                this.mouseHandlerService.resetData();
                this.mouseHandlerService.updateImageData(imagesData);
            });

            socket.on('Verify position', (position) => {
                this.clickResponse(socket, position);
            });

            socket.on('Check if game is finished', () => {
                if (this.mouseHandlerService.differencesNumberFound.length === this.mouseHandlerService.nbDifferencesTotal) {
                    this.mouseHandlerService.resetData();
                    this.endTimer();
                    socket.emit('End game');
                }
            });
        });
    }

    private emitTime(socket: io.Socket) {
        this.chronometerService.increaseTime();
        socket.emit('time', this.chronometerService.time);
    }

    private clickResponse(socket: io.Socket, mousePosition: Position) {
        const clickAnswer = this.mouseHandlerService.isValidClick(mousePosition);
        socket.emit('Valid click', clickAnswer);
    }

    private async sendImagesToClient(gameName: string, socket: io.Socket) {
        const gameImagesData: string[] = await this.gamesService.getGameImagesData(gameName);

        socket.emit('classic solo images', [gameImagesData[ORIGINAL_IMAGE_POSITION], gameImagesData[MODIFIED_IMAGE_POSITION]]);
    }

    private endTimer() {
        clearInterval(this.timeInterval);
        this.chronometerService.resetChrono();
    }
}
