import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-input',
    templateUrl: './dialog-input.component.html',
    styleUrls: ['./dialog-input.component.scss'],
})
export class DialogInputComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public datas: any) {}

    ngOnInit(): void {}
}
