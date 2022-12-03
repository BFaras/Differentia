import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameFormDescription } from '@app/classes/game-form-description';
import { PopDialogUsernameComponent } from '@app/components/pop-dialogs/pop-dialog-username/pop-dialog-username.component';
import { PopDialogWarningComponent } from '@app/components/pop-dialogs/pop-dialog-warning/pop-dialog-warning.component';
import {
    ADMIN_GAME_FORMS_BUTTON,
    CLASSIC_FLAG,
    CREATE_FLAG,
    DISABLE_CLOSE,
    JOIN_FLAG,
    MULTIPLAYER_MODE,
    SELECTION_GAME_FORMS_BUTTON,
    SOMEBODY_IS_WAITING,
    STANDARD_POP_UP_HEIGHT,
    STANDARD_POP_UP_WIDTH,
} from '@app/const/client-consts';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-game-form',
    templateUrl: './game-form.component.html',
    styleUrls: ['./game-form.component.scss'],
})
export class GameFormComponent {
    @Input() gameForm: GameFormDescription;
    @Input() buttonPage: string;
    @Output() newItemEvent = new EventEmitter<string>();
    adminGameFormsButton = ADMIN_GAME_FORMS_BUTTON;
    selectionGameFormsButton = SELECTION_GAME_FORMS_BUTTON;
    multiplayerFlag = MULTIPLAYER_MODE;
    isPlayerWaiting: boolean = !SOMEBODY_IS_WAITING;
    joinFlag: boolean = !JOIN_FLAG;
    createFlag: boolean = !CREATE_FLAG;
    constructor(public dialog: MatDialog, private socketService: SocketClientService) {}

    ngOnInit(): void {
        this.configureGameFormSocketFeatures();
        this.socketService.send('is there someone waiting', this.gameForm.gameName);
    }

    openDialog(multiplayerFlag: boolean): void {
        console.log(multiplayerFlag);
        this.dialog.open(PopDialogUsernameComponent, {
            height: STANDARD_POP_UP_HEIGHT,
            width: STANDARD_POP_UP_WIDTH,
            disableClose: DISABLE_CLOSE,
            data: {
                nameGame: this.gameForm.gameName,
                classicFlag: CLASSIC_FLAG,
                multiFlag: multiplayerFlag,
                joinFlag: this.joinFlag,
                createFlag: this.createFlag,
                isPlayerWaiting: this.isPlayerWaiting,
            },
        });
    }

    deleteGameForm(value: string) {
        this.openWarningDialog('supprimer le jeu');
        this.socketService.on('Delete or reset applied on gameForm', () => {
            this.newItemEvent.emit(value);
        });
    }

    resetTimesBoard(value: string) {
        this.openWarningDialog('réinitialiser le temps du jeu');
        this.socketService.on('Delete or reset applied on gameForm', () => {
            this.socketService.send('Reset records time board', value);
        });
    }

    setJoinFlag(): void {
        this.joinFlag = JOIN_FLAG;
        this.createFlag = !CREATE_FLAG;
    }

    setCreateFlag(): void {
        this.createFlag = CREATE_FLAG;
        this.joinFlag = !JOIN_FLAG;
    }

    resetFlags(): void {
        this.createFlag = !JOIN_FLAG;
        this.joinFlag = !CREATE_FLAG;
    }

    private openWarningDialog(value: string) {
        this.dialog.open(PopDialogWarningComponent, {
            height: STANDARD_POP_UP_HEIGHT,
            width: STANDARD_POP_UP_WIDTH,
            disableClose: DISABLE_CLOSE,
            data: value,
        });
    }

    private configureGameFormSocketFeatures(): void {
        this.socketService.connect();
        if (this.gameForm.gameName) {
            this.socketService.on(`${this.gameForm.gameName} let me tell you if someone is waiting`, (response: boolean) => {
                this.isPlayerWaiting = response;
            });

            this.socketService.on(`${this.gameForm.gameName} nobody is waiting no more`, () => {
                this.isPlayerWaiting = !SOMEBODY_IS_WAITING;
            });

            this.socketService.on('reconnect', () => {
                this.ngOnInit();
            });
        }
    }
}
