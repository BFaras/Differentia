import { Position } from '@common/position';
import * as http from 'http';
import * as io from 'socket.io';
import { ChronometerService } from './chronometer.service';
import { MouseHandlerService } from './mouse-handler.service';


export class SocketManager {

    private sio: io.Server;
    private room: string = "serverRoom";
    public socket: io.Socket;
    private timeInterval: NodeJS.Timer;
    private chronometerService: ChronometerService = new ChronometerService();
    private mouseHandlerService: MouseHandlerService;
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ["GET", "POST"] } });
    }

    public handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`)
            this.socket = socket;
            // message initial
            socket.emit("hello", "Hello World!");

            socket.on('message', (message: string) => {
                console.log(message);
            });

            socket.on('validate', (word: string) => {
                const isValid = word.length > 5;
                socket.emit('wordValidated', isValid);
            })

            socket.on('broadcastAll', (message: string) => {
                this.sio.sockets.emit("massMessage", `${socket.id} : ${message}`)
            })

            socket.on('joinRoom', () => {
                socket.join(this.room);
            });

            socket.on('roomMessage', (message: string) => {
                // Seulement un membre de la salle peut envoyer un message aux autres
                if (socket.rooms.has(this.room)) {
                    this.sio.to(this.room).emit("roomMessage", `${socket.id} : ${message}`);
                }
            });


            socket.on("disconnect", (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`)
            });

            socket.on("game page", (message) => {
                console.log(message);
                socket.emit("recu", "ferme la");
                socket.emit("classic mode", "bet");
                socket.emit("The game is", message)
                this.timeInterval = setInterval(() => {
                    this.emitTime(socket);
                }, 1000);
            });

            socket.on("kill the timer", () => {
                clearInterval(this.timeInterval);
                this.chronometerService.resetChrono();
            });

            socket.on("Verify position", (position) => {
                console.log(position);
                this.clickResponse(socket,position);
            });

        });
        
    }

    private emitTime(socket: io.Socket) {
        this.chronometerService.increaseTime();
        console.log(this.chronometerService.time); // Là que pour debug
        socket.emit("time", this.chronometerService.time);
    }

    private clickResponse(socket: io.Socket, mousePosition:Position) {
        const clickAnswer = this.mouseHandlerService.isValidClick(mousePosition);
        socket.emit("Valid click", clickAnswer);
    }
}