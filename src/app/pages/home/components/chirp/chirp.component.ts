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

  getDate(date: any) {
    const d = new Date(date.seconds * 1000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}
