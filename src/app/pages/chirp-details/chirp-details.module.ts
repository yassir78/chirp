import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChirpDetailsComponent} from "./chirp-details.component";
import {RouterModule} from "@angular/router";
import {ChirpCommentComponent} from "./components/chirp-comment/chirp-comment.component";
import {IonicModule} from "@ionic/angular";
import {ChirpCommentReplyComponent} from "./components/chirp-comment-reply/chirp-comment-reply.component";

@NgModule({
  declarations: [
    ChirpCommentComponent,
    ChirpCommentReplyComponent
  ],
  exports: [
    ChirpCommentComponent,
    ChirpCommentReplyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChirpDetailsComponent
      }
    ]),
    IonicModule
  ]
})
export class ChirpDetailsModule {
}
