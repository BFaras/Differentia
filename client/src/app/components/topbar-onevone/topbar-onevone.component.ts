import { Component, Input, OnInit } from '@angular/core';
import { MouseDetectionService } from '@app/services/mouse-detection.service';
import { TimeService } from '@app/services/time.service';

@Component({
    selector: 'app-topbar-onevone',
    templateUrl: './topbar-onevone.component.html',
    styleUrls: ['./topbar-onevone.component.scss'],
})
export class TopbarOnevoneComponent implements OnInit {
    @Input() nbrDifferencesFound: number;
    @Input() usernames: string[];
    constructor(public readonly timeService: TimeService, public mouseDetection: MouseDetectionService) {}

    ngOnInit(): void {}
}
