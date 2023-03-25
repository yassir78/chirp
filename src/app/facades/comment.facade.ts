import {inject, Injectable} from '@angular/core';
import {CommentService} from "../services/comment.service";
import {AuthState} from "../states/auth.state";
import {CommentState} from "../states/comment.state";
import {Comment} from "../models/comment";

@Injectable({
  providedIn: 'root'
})
export class CommentFacade {

  private commentService = inject(CommentService);
  private authState = inject(AuthState);
  private commentState = inject(CommentState);

  async create({comment, chirpId}: { comment: string, chirpId: string }) {
    console.log(comment);
    this.setIsAddLoading(true);
    const user = this.authState.getCurrentUserValue();
    const commentRef = await this.commentService.create(comment, chirpId, user.uid);
    this.setIsAddLoading(false);
    return this.commentService.addCommentToChirp(chirpId, commentRef);
  }

  async update(comment: Comment) {
    return this.commentService.update(comment);
  }


  delete(comment: Comment) {
    return this.commentService.delete(comment);
  }

  setIsAddLoading(isAddLoading: boolean) {
    this.commentState.setIsAddLoading(isAddLoading);
  }
}
