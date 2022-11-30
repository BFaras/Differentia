import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInputComponent } from '@app/components/dialog-input/dialog-input.component';
import { PopDialogResetComponent } from '@app/components/pop-dialogs/pop-dialog-reset/pop-dialog-reset.component';
import {
    DEFAULT_INITIAL_TIME,
    DEFAULT_PENALTY_TIME,
    DEFAULT_SAVED_TIME,
    HEIGHT_POP_ADMIN,
    INPUT_TYPE,
    STANDARD_POP_UP_HEIGHT,
    STANDARD_POP_UP_WIDTH,
    TIME_PLACEHOLDER_INPUT1,
    TIME_PLACEHOLDER_INPUT2,
    TIME_PLACEHOLDER_INPUT3,
    TIME_SETTING_INPUT1,
    TIME_SETTING_INPUT2,
    TIME_SETTING_INPUT3,
} from '@app/const/client-consts';
import { GameTimeSetting } from '@app/interfaces/game-time-setting';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    private gameTimeSettings: GameTimeSetting[] = [
        { inputName: TIME_SETTING_INPUT1, defaultTime: DEFAULT_INITIAL_TIME, placeHolder: TIME_PLACEHOLDER_INPUT1, valueUnit: INPUT_TYPE },
        { inputName: TIME_SETTING_INPUT2, defaultTime: DEFAULT_PENALTY_TIME, placeHolder: TIME_PLACEHOLDER_INPUT2, valueUnit: INPUT_TYPE },
        { inputName: TIME_SETTING_INPUT3, defaultTime: DEFAULT_SAVED_TIME, placeHolder: TIME_PLACEHOLDER_INPUT3, valueUnit: INPUT_TYPE },
    ];
    constructor(public dialog: MatDialog) {}
    nameOfPage: string = 'Admin';

    openDialog() {
        this.dialog.open(DialogInputComponent, {
            height: HEIGHT_POP_ADMIN,
            width: STANDARD_POP_UP_WIDTH,
            disableClose: true,
            data: this.gameTimeSettings,
        });
    }

    openResetDialog() {
        this.dialog.open(PopDialogResetComponent, {
            height: STANDARD_POP_UP_HEIGHT,
            width: STANDARD_POP_UP_WIDTH,
            disableClose: true,
        });
    }
}
