import { Component } from '@angular/core';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'Jeu de Difference';
    readonly buttonName: String[] = ['Mode classique', 'Temps limité', 'Administration'];

    constructor() {}
}
