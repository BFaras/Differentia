import { Component } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-game-selection',
    templateUrl: './game-selection.component.html',
    styleUrls: ['./game-selection.component.scss'],
})
export class GameSelectionComponent {
    constructor(private socketService: SocketClientService) {}
    nameOfPage: string = 'GameSelection';

    ngOnInit(): void {
        this.socketService.connect();
    }
}
