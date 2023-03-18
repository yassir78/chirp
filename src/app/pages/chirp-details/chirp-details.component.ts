import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'chirp-details',
  templateUrl: './chirp-details.component.html',
  styleUrls: ['./chirp-details.component.scss'],
})
export class ChirpDetailsComponent implements OnInit {

  @Input() chirp: any;
  isEditor: boolean = true;
  canEdit: boolean = true;
  

  constructor() { }

  ngOnInit() {}

  async toggleEdit() {
    this.canEdit = !this.canEdit;
  }

  async validateEdit() {
    // TODO: get value from textarea and update chirp
  }

}
