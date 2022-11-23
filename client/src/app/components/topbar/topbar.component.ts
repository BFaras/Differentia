import { Component, Input, OnInit } from '@angular/core';
import { EMPTY_PLAYER_NAME } from '@app/client-consts';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeService } from '@app/services/time.service';
import { ClueInformations } from '@common/clue-informations';
import { CLUE_AMOUNT_DEFAULT } from '@common/const';

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

    constructor(public timeService: TimeService, private socketService: SocketClientService) {}

    ngOnInit(): void {
        this.clueAmountLeft = CLUE_AMOUNT_DEFAULT;
        this.configureTopBarSocket();
    }

    //To test Raph
    sendClueEventToServer() {
        this.socketService.send('get clue for player');
    }

    //To test Raph
    private configureTopBarSocket() {
        this.socketService.on('Clue with quadrant of difference', (clueInformations: ClueInformations) => {
            this.clueAmountLeft = clueInformations.clueAmountLeft - 1;
        });
        this.socketService.on('Clue with difference pixels', () => {
            this.clueAmountLeft = 0;
        });

        //To test Seb
        this.socketService.on('Other player abandonned LM', (username: string) => {
            if (this.playerNames[0] === username) {
                this.playerNames[0] = EMPTY_PLAYER_NAME;
                this.indexPlayerLeft = 1;
            } else {
                this.playerNames[1] = EMPTY_PLAYER_NAME;
            }
        });
    }
}
