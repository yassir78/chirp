import {Component, inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Chirp} from "../../../../models/chirp";
import {Router} from "@angular/router";

@Component({
  selector: 'chirp',
  templateUrl: './chirp.component.html',
  styleUrls: ['./chirp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChirpComponent implements OnInit {
  // @ts-ignore
  @Input() chirp: Chirp;
  private router = inject(Router);

  constructor() {
  }

  ngOnInit() {
  }

  async details() {
    await this.router.navigate(['app/chirp-details', this.chirp.id]);

  }
}
