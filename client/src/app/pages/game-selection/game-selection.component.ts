import { Component, OnInit} from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-game-selection',
    templateUrl: './game-selection.component.html',
    styleUrls: ['./game-selection.component.scss'],
})
export class GameSelectionComponent implements OnInit {
    readonly nameOfPage: string = 'GameSelection';
    constructor(private socketService: SocketClientService) {}

    ngOnInit(): void {
        this.socketService.connect();
        this.configureGameSelectionSocketFeatures();
    }

    private configureGameSelectionSocketFeatures(): void {
        this.socketService.on('reconnect', () => {
            this.socketService.disconnect();
            this.ngOnInit();
        });
    }
}
