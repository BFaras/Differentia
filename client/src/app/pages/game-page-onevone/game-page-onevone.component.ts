import { Component, OnInit } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-game-page-onevone',
    templateUrl: './game-page-onevone.component.html',
    styleUrls: ['./game-page-onevone.component.scss'],
})
export class GamePageOnevoneComponent implements OnInit {
    nbDifferences: number = 0;
    gameName: string = 'defaultGameName';
    userName: string = 'defaultUserName';
    images: HTMLImageElement[];
    nbDifferencesFoundPlayerA: number = 0;
    nbDifferencesFoundPlayerB: number = 0;

    constructor(public socketService: SocketClientService /*private timeService: TimeService, private communicationService: CommunicationService*/) {
        this.images = [new Image(640, 480), new Image(640, 480)];
    }

    ngOnInit(): void {
        this.socketService.connect();
    }

    ngOnDestroy() {
        this.socketService.send('kill the game');
        this.socketService.disconnect();
    }
}
