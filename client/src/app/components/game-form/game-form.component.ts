import { Component, OnInit } from '@angular/core';
import { FormDescription } from '@app/interfaces/form-description';
import { RecordTime } from '@app/interfaces/record-time';

@Component({
    selector: 'app-game-form',
    templateUrl: './game-form.component.html',
    styleUrls: ['./game-form.component.scss'],
})
export class GameFormComponent implements OnInit {
    form: FormDescription = {
        gameName: 'Racing car',
        gameImage: 'I M A G E',
        recordTimeSolo: [
            {
                time: '2:14',
                playerName: 'Max',
            },
            {
                time: '2:27',
                playerName: 'Carlo',
            },
            {
                time: '2:56',
                playerName: 'Lola',
            },
        ],
        recordTimeVersus: [
            {
                time: '1:14',
                playerName: 'Levi',
            },
            {
                time: '2:57',
                playerName: 'Eren',
            },
            {
                time: '3:56',
                playerName: 'Reiner',
            },
        ],
    };

    records: RecordTime;
    constructor() {}

    ngOnInit(): void {}
}
