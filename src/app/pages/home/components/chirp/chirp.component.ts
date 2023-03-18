import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import {Chirp} from "../../../../models/chirp";

@Component({
  selector: 'chirp',
  templateUrl: './chirp.component.html',
  styleUrls: ['./chirp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChirpComponent implements OnInit {
  // @ts-ignore
  @Input() chirp: Chirp ;
  constructor() { }

  ngOnInit() {
    console.log(this.chirp)
  }

}
