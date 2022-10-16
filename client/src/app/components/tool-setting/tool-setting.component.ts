import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tool-setting',
  templateUrl: './tool-setting.component.html',
  styleUrls: ['./tool-setting.component.scss']
})
export class ToolSettingComponent implements OnInit {
  widths = [1,2,3,4,5]
  constructor() { }

  ngOnInit(): void {
  }

}
