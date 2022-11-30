import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopDialogEndgameComponent } from '@app/components/pop-dialogs/pop-dialog-endgame/pop-dialog-endgame.component';
import {
    CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE,
    CLASSIC_MULTIPLAYER_LOST_MESSAGE,
    CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE,
    CLASSIC_SOLO_END_GAME_MESSAGE,
    DISABLE_CLOSE,
    LOSING_FLAG,
    STANDARD_POP_UP_HEIGHT,
    STANDARD_POP_UP_WIDTH,
    WIN_FLAG,
} from '@app/const/client-consts';
import { EndGameInformations } from '@common/end-game-informations';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class EndGameHandlerService {
    constructor(private socketService: SocketClientService, private dialog: MatDialog) {}

    private openEndGameDialog(messageToDisplay: string, winFlag: boolean) {
        this.dialog.open(PopDialogEndgameComponent, {
            height: STANDARD_POP_UP_HEIGHT,
            width: STANDARD_POP_UP_WIDTH,
            data: {
                message: messageToDisplay,
                winFlag,
            },
            disableClose: DISABLE_CLOSE,
        });
    }

    configureSocket() {
        this.socketService.on('End game', (endGameInfos: EndGameInformations) => {
            let endGameMessage = CLASSIC_SOLO_END_GAME_MESSAGE;
            let winFlag = WIN_FLAG;
            if (endGameInfos.isMultiplayer && endGameInfos.isGameWon && !endGameInfos.isAbandon) {
                endGameMessage = CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE;
            } else if (endGameInfos.isMultiplayer && endGameInfos.isAbandon) {
                endGameMessage = CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE;
            } else if (!endGameInfos.isGameWon) {
                endGameMessage = CLASSIC_MULTIPLAYER_LOST_MESSAGE;
                winFlag = LOSING_FLAG;
            }
            this.openEndGameDialog(endGameMessage, winFlag);
        });
    }
}