import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-steplife',
  templateUrl: './steplife.component.html',
  styleUrls: ['./steplife.component.scss']
})
export class SteplifeComponent implements OnInit {
  path: string;

  constructor(location: Location) {
    this.path = location.path();
  }

  ngOnInit() {
  }

}
