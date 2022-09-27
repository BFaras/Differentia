/* eslint-disable prettier/prettier */

import { Component, Input, OnInit } from '@angular/core';
import { TimeService } from '@app/services/time.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

export class TopbarComponent implements OnInit {

  @Input() numberOfDifferences: number;

  constructor(public readonly timeService: TimeService) {}

  ngOnInit(): void {};
}
