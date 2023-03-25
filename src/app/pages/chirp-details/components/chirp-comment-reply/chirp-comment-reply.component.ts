import {Component, inject, Input, OnInit} from '@angular/core';
import {AuthState} from "../../../../states/auth.state";
import {Observable} from "rxjs";
import {User} from "../../../../models/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommentFacade} from "../../../../facades/comment.facade";
import {sendEmailVerification} from "@angular/fire/auth";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'chirp-comment-reply',
  templateUrl: './chirp-comment-reply.component.html',
  styleUrls: ['./chirp-comment-reply.component.scss'],
})
export class ChirpCommentReplyComponent implements OnInit {

  @Input() id: string = '';
  private fb: FormBuilder = inject(FormBuilder);
  commentForm: FormGroup = this.fb.group({
    comment: ['',Validators.required],
  });
  private authState = inject(AuthState);
  private commentFacade = inject(CommentFacade);

  private toastController = inject(ToastController);

  currentUser$: Observable<User> | undefined;

  get comment() {
    return this.commentForm.get('comment');
  }

  async submit() {
    await this.commentFacade.create({comment: this.comment?.value,chirpId: this.id});
    this.commentForm.reset();
    const toast = await this.toastController.create({
      message: `Comment added successfully`,
      duration: 2000,
      color: 'success'
    });

    await toast.present();

  }
  ngOnInit() {
    this.currentUser$ = this.authState.getCurrentUser();
  }

}
