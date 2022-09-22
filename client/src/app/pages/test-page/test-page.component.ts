import { Component, OnInit } from '@angular/core';
import { Image } from 'canvas';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {
  const originalImage: Image ;
  const diffImage: Image;
  let finalDifferencesImage: Image;

  constructor() { }

  ngOnInit(): void {
  }

}
