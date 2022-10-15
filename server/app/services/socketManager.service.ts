import { GamesService } from '@app/services/local.games.service';
import { MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';
import { DifferencesInformations } from '@common/differences-informations';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { Position } from '@common/position';
import * as http from 'http';
import * as io from 'socket.io';
import Container from 'typedi';
import { ChronometerService } from './chronometer.service';
import { DifferenceDetectorService } from './difference-detector.service';
import { MouseHandlerService } from './mouse-handler.service';

export class SocketManager {
    private sio: io.Server;
    // private room: string = "serverRoom";
    public socket: io.Socket;
    readonly timeIntervals: Map<string, NodeJS.Timer> = new Map<string, NodeJS.Timer>();
    readonly chronometerServices: Map<string, ChronometerService> = new Map<string, ChronometerService>();
    readonly mouseHandlerServices: Map<string, MouseHandlerService> = new Map<string, MouseHandlerService>();
    private gamesService = Container.get(GamesService);

    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] }, maxHttpBufferSize: 1e7 });
    }

    public handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            this.socket = socket;

            socket.on('message', (message: string) => {
                console.log(message);
            });

            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });

            socket.on('game page', async (gameName: string) => {
                console.log(gameName);
                socket.emit('classic mode');
                socket.emit('The game is', gameName);
                await this.beginSoloGame(socket, gameName);
            });

            socket.on('username is', (username: string) => {
                socket.emit('show the username', username);
            });

            socket.on('detect images difference', (imagesData: ImageDataToCompare) => {
                const differenceDetector = new DifferenceDetectorService(imagesData);
                const differencesInformations: DifferencesInformations = {
                    differencesList: differenceDetector.generateDifferencesList(),
                    nbOfDifferences: differenceDetector.getNbDifferences(),
                };
                socket.emit('game creation differences informations', differencesInformations);
            });

            socket.on('Verify position', (position: Position) => {
                this.clickResponse(socket, position);
            });

            socket.on('Check if game is finished', () => {
                const mouseHandler: MouseHandlerService = this.mouseHandlerServices.get(socket.id)!;
                if (mouseHandler.differencesNumberFound.length === mouseHandler.nbDifferencesTotal) {
                    mouseHandler.resetData();
                    this.endGame(socket);
                    socket.emit('End game');
                }
            });
        });
    }

    private async beginSoloGame(socket: io.Socket, gameName: string) {
        const mouseHandler: MouseHandlerService = new MouseHandlerService();
        const chronometerService: ChronometerService = new ChronometerService();
        this.timeIntervals.set(
            socket.id,
            setInterval(() => {
                this.emitTime(socket, chronometerService);
            }, 1000),
        );

        this.chronometerServices.set(socket.id, chronometerService);
        this.mouseHandlerServices.set(socket.id, mouseHandler);

        await mouseHandler.generateDifferencesInformations(gameName);
        await this.sendImagesToClient(gameName, socket);
    }

    private emitTime(socket: io.Socket, chronometerService: ChronometerService) {
        chronometerService.increaseTime();
        socket.emit('time', chronometerService.time);
    }

    private clickResponse(socket: io.Socket, mousePosition: Position) {
        const clickAnswer = this.mouseHandlerServices.get(socket.id)!.isValidClick(mousePosition);
        socket.emit('Valid click', clickAnswer);
    }

    private async sendImagesToClient(gameName: string, socket: io.Socket) {
        const gameImagesData: string[] = await this.gamesService.getGameImagesData(gameName);

        socket.emit('classic solo images', [gameImagesData[ORIGINAL_IMAGE_POSITION], gameImagesData[MODIFIED_IMAGE_POSITION]]);
    }

    private endGame(socket: io.Socket) {
        this.chronometerServices.delete(socket.id);
        this.mouseHandlerServices.delete(socket.id);
        this.timeIntervals.delete(socket.id);
    }
}
