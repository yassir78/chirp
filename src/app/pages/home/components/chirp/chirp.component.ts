import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'chirp',
  templateUrl: './chirp.component.html',
  styleUrls: ['./chirp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChirpComponent implements OnInit {
  @Input() chirp: any;
  constructor() { }

  ngOnInit() {
  }

}
