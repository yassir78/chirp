import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'chirp-comment',
  templateUrl: './chirp-comment.component.html',
  styleUrls: ['./chirp-comment.component.scss'],
})
export class ChirpCommentComponent implements OnInit {
  isEditor: boolean = true;
  canEdit: boolean = true;

  constructor() { }

  ngOnInit() {}

  async deleteComment() {
    // TODO: delete this comment
  }

  async toggleEdit() {
    this.canEdit = !this.canEdit;
  }

  async validateEdit() {
    // TODO: get value from textarea and update chirp
  }

}
