/* eslint-disable prettier/prettier */

import { Component, Input, OnInit } from '@angular/core';
import { MouseDetectionService } from '@app/services/mouse-detection.service';
import { TimeService } from '@app/services/time.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
    @Input() nbrDifferencesFound: number;
    @Input() usernames: string[];

    constructor(public readonly timeService: TimeService, public mouseDetection: MouseDetectionService) {}

    ngOnInit(): void {}
}
