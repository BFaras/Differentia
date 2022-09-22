/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-imports */
import { Time } from '../../../../../common/time';
import { Component } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeService } from '@app/services/time.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {

    constructor(public socketService: SocketClientService, private timeService: TimeService) {}

    ngOnInit() {
        this.socketService.connect();
        this.configureGamePageSocketFeatures();
    }

    ngOnDestroy() {
        this.socketService.send("kill the timer");
    }

    configureGamePageSocketFeatures() {
        this.socketService.on("classic mode", (message: string) => {
            this.timeService.classicMode();
        })
        this.socketService.on("time", (time: Time) => {
            this.timeService.changeTime(time);
        });
        this.socketService.on("recu", (message: string) => {
            console.log(message);
        });
    }
}
