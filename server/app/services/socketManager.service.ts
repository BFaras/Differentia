import { ImageDataToCompare } from '@common/image-data-to-compare';
import * as http from 'http';
import * as io from 'socket.io';
import { ChronometerService } from './chronometer.service';
import { DifferenceDetectorService } from './difference-detector.service';

export class SocketManager {
    private sio: io.Server;
    // private room: string = "serverRoom";
    public socket: io.Socket;
    private timeInterval: NodeJS.Timer;
    private chronometerService: ChronometerService = new ChronometerService();
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

            // socket.on('validate', (word: string) => {
            //     const isValid = word.length > 5;
            //     socket.emit('wordValidated', isValid);
            // })

            // socket.on('broadcastAll', (message: string) => {
            //     this.sio.sockets.emit("massMessage", `${socket.id} : ${message}`)
            // })

            // socket.on('joinRoom', () => {
            //     socket.join(this.room);
            // });

            // socket.on('roomMessage', (message: string) => {
            //     // Seulement un membre de la salle peut envoyer un message aux autres
            //     if (socket.rooms.has(this.room)) {
            //         this.sio.to(this.room).emit("roomMessage", `${socket.id} : ${message}`);
            //     }
            // });

            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });

            socket.on('game page', (message: string) => {
                console.log(message);
                socket.emit('classic mode', 'bet');
                socket.emit('The game is', message);
                this.timeInterval = setInterval(() => {
                    this.emitTime(socket);
                }, 1000);
            });

            socket.on('kill the timer', () => {
                clearInterval(this.timeInterval);
                this.chronometerService.resetChrono();
            });

            socket.on('detect images difference', (imagesData: ImageDataToCompare) => {
                const differenceDetector = new DifferenceDetectorService(imagesData, imagesData.offSet);
                socket.emit('game creation difference array', differenceDetector.getDifferentPixelsArrayWithOffset());
                socket.emit('game creation nb of differences', differenceDetector.getNbDifferences());
            });
        });
    }

    private emitTime(socket: io.Socket) {
        this.chronometerService.increaseTime();
        console.log(this.chronometerService.time); // Là que pour debug
        socket.emit('time', this.chronometerService.time);
    }
}
