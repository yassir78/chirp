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

  ngOnInit() {
    this.chirp ={
      img: "https://i.pravatar.cc/150?img=2",
      name: "Jane Smith",
      handle: "janesmith",
      // timestamp
      date: Date.now(),
      text: "Praesent ac ex id mi sagittis sollicitudin eget et nulla.",
      attachment: "https://picsum.photos/200/300",
      liked: true,
    }
  }

  async toggleEdit() {
    this.canEdit = !this.canEdit;
  }

  async validateEdit() {
    // TODO: get value from textarea and update chirp
  }

}
