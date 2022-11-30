import { Component, Input, OnInit } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeService } from '@app/services/time.service';
import { ClueInformations } from '@common/clue-informations';
import { CLUE_AMOUNT_DEFAULT, LOCAL_PLR_USERNAME_POS } from '@common/const';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
    @Input() nbrDifferencesFound: number[];
    @Input() playerNames: string[];
    @Input() gameMode: string;
    @Input() isMultiplayer: boolean;
    indexPlayerLeft: number = 0;
    clueAmountLeft: number;
    readonly localPlayerUsernamePos = LOCAL_PLR_USERNAME_POS;

    constructor(public timeService: TimeService, private socketService: SocketClientService) {}

    ngOnInit(): void {
        this.clueAmountLeft = CLUE_AMOUNT_DEFAULT;
        this.configureTopBarSocket();
    }

    ngOnDestroy(): void {
        this.timeService.resetTime();
        this.socketService.disconnect();
    }

    sendClueEventToServer() {
        this.socketService.send('get clue for player');
    }

    private configureTopBarSocket() {
        this.socketService.on('Clue with quadrant of difference', (clueInformations: ClueInformations) => {
            this.clueAmountLeft = clueInformations.clueAmountLeft - 1;
        });
        this.socketService.on('Clue with difference pixels', () => {
            this.clueAmountLeft = 0;
        });
    }
}
