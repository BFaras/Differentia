import { Component, Input } from '@angular/core';
import { CLASSIC_MODE, LIMITED_TIME_MODE } from '@common/const';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    @Input() numberOfDifferences: number;
    @Input() gameName: string;
    @Input() gameMode: string;
    @Input() clueTimePenalty: number;
    @Input() isMultiplayer: boolean;
    readonly classicMode = CLASSIC_MODE;
    readonly limitedTimeMode = LIMITED_TIME_MODE;

}
