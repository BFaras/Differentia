import { Component } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    // à mettre dans le fichier des constantes
    readonly title: string = 'Jeu de Difference';
    readonly buttonName: String[] = ['Mode classique', 'Temps limité', 'Administration'];
    //

    constructor(public socketService: SocketClientService) { }

    // serverMessage: string = "";
    // serverClock: Date;
  
    // wordInput = "";
    // serverValidationResult = "";
    // messageToServer = "";
  
    // broadcastMessage = "";
    // serverMessages: string[] = [];
  
    // roomMessage = "";
    // roomMessages: string[] = [];
  
  
    get socketId() {
      return this.socketService.socket.id ? this.socketService.socket.id : "";
    }
  
    ngOnInit(): void {
      this.socketService.connect();
      this.configureBaseSocketFeatures();
    }
  
    configureBaseSocketFeatures() {
      this.socketService.on("connect", () => {
        console.log(`Connexion par WebSocket sur le socket ${this.socketId}`);
      });
      // Afficher le message envoyé lors de la connexion avec le serveur
      this.socketService.on("hello", (message: string) => {
        console.log(message);
      });
    }

    //   // Afficher le message envoyé à chaque émission de l'événement "clock" du serveur
    //   this.socketService.on("clock", (time: Date) => {
    //     this.serverClock = time;
    //   });
  
    //   // Gérer l'événement envoyé par le serveur : afficher le résultat de validation
    //   this.socketService.on('wordValidated', (isValid: boolean) => {
    //     const validationString = `Le mot est ${isValid ? "valide" : "invalide"}`;
    //     this.serverValidationResult = validationString;
    //   });
  
    //   // Gérer l'événement envoyé par le serveur : afficher le message envoyé par un client connecté
    //   this.socketService.on('massMessage', (broadcastMessage: string) => {
    //     this.serverMessages.push(broadcastMessage);
    //   });
  
    //   // Gérer l'événement envoyé par le serveur : afficher le message envoyé par un membre de la salle
    //   this.socketService.on('roomMessage', (roomMessage: string) => {
    //     this.roomMessages.push(roomMessage);
    //   });
    // }
  
    // sendWordValidation() {
    //   this.socketService.send('validate', this.wordInput);
    //   this.wordInput = "";
    // }
  
    // sendToServer() {
    //   this.socketService.send('message', this.messageToServer);
    //   this.messageToServer = "";
    // }
  
    // broadcastMessageToAll() {
    //   this.socketService.send('broadcastAll', this.broadcastMessage);
    //   this.broadcastMessage = "";
    // }
  
    // joinRoom() {
    //   this.socketService.send("joinRoom");
    // }
  
    // sendToRoom() {
    //   this.socketService.send('roomMessage', this.roomMessage);
    //   this.roomMessage = "";
    // }
}
