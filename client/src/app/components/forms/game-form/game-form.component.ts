import { Component, Input } from '@angular/core';
import { GameFormDescription } from '@app/classes/game-form-description';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-game-form',
    templateUrl: './game-form.component.html',
    styleUrls: ['./game-form.component.scss'],
})
export class GameFormComponent {
    @Input() gameForm: GameFormDescription;
    @Input() buttonPage: string;
    adminGameFormsButton = ['Supprimer', 'Réinitialiser'];
    selectionGameFormsButton = ['Créer', 'Jouer'];
    constructor(private socketService: SocketClientService) {}

    gamePage() {
        console.log('cliqué');
        this.socketService.send('game page', this.gameForm.gameName);
    }
}
