import { Component, Input } from '@angular/core';
import { GameFormDescription } from '@app/classes/game-form-description';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { GameSelectionComponent } from '@app/pages/game-selection/game-selection.component';

@Component({
    selector: 'app-game-form',
    templateUrl: './game-form.component.html',
    styleUrls: ['./game-form.component.scss'],
})
export class GameFormComponent {
    @Input() gameForm: GameFormDescription;
    @Input() selectionButton: GameSelectionComponent;
    @Input() adminButton: AdminPageComponent;
    constructor() {}
}
