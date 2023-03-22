import {Component, inject, Input, OnInit} from '@angular/core';
import {Chirp} from "../../models/chirp";
import {ChirpFacade} from "../../facades/chirp.facade";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'chirp-details',
  templateUrl: './chirp-details.component.html',
  styleUrls: ['./chirp-details.component.scss'],
})
export class ChirpDetailsComponent implements OnInit {

  @Input() chirp: any;
  isEditor: boolean = true;
  canEdit: boolean = true;
  private chirpFacade = inject(ChirpFacade);
  private activeRouterSnapshot = inject(ActivatedRoute).snapshot;

  loading$: Observable<Boolean> | undefined;


  // @ts-ignore
  chirp: Chirp;

  constructor() {
  }

  async ngOnInit() {
    this.chirp = this.chirpFacade.getChirpDetail();
    this.loading$ = this.chirpFacade.getIsChirpDetailLoading();
    await this.chirpFacade.getChirpById(this.activeRouterSnapshot.params['id']);
    this.chirp = {
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
