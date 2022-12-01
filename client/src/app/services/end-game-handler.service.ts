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
    RECORD_END_GAME_MESSAGE_PART_ONE,
    RECORD_END_GAME_MESSAGE_PART_THREE,
    RECORD_END_GAME_MESSAGE_PART_TWO,
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
    private localPlayerUsername: string;
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

    //To test
    private generateRecordMessage(playerRanking: number): string {
        const endGameWithRecordMessage: string =
            RECORD_END_GAME_MESSAGE_PART_ONE +
            this.localPlayerUsername +
            RECORD_END_GAME_MESSAGE_PART_TWO +
            playerRanking +
            RECORD_END_GAME_MESSAGE_PART_THREE;

        return endGameWithRecordMessage;
    }

    //To test
    private generateEndGameMessage(endGameInfos: EndGameInformations) {
        if (endGameInfos.hasNewRecord) return this.generateRecordMessage(endGameInfos.playerRanking);
        else if (!endGameInfos.hasNewRecord && !endGameInfos.isMultiplayer) return CLASSIC_SOLO_END_GAME_MESSAGE;
        else if (!endGameInfos.hasNewRecord && endGameInfos.isMultiplayer) return CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE;
        else return;
    }

    configureSocket() {
        // To test
        this.socketService.on('show the username', (username: string) => {
            this.localPlayerUsername = username;
        });

        // Test to change
        this.socketService.on('End game', (endGameInfos: EndGameInformations) => {
            let endGameMessage: string;
            let winFlag = WIN_FLAG;

            if (endGameInfos.isGameWon && !endGameInfos.isAbandon) {
                endGameMessage = this.generateEndGameMessage(endGameInfos)!;
            } else if (endGameInfos.isMultiplayer && endGameInfos.isAbandon) {
                endGameMessage = CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE;
            } else if (!endGameInfos.isGameWon) {
                endGameMessage = CLASSIC_MULTIPLAYER_LOST_MESSAGE;
                winFlag = LOSING_FLAG;
            }
            this.openEndGameDialog(endGameMessage!, winFlag);
        });
    }
}
