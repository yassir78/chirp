import {inject, Injectable} from '@angular/core';
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  updateDoc
} from "@angular/fire/firestore";
import {createNewDocumentWithoutId, updateDocument} from "../helpers/Utils";
import {Comment} from "../models/comment";
import {serverTimestamp} from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private fr = inject(Firestore);

  constructor() {
  }

  async create(comment: string, chirpId: string, uid: string | undefined) {
    const userRef = doc(this.fr, `users/${uid}`);
    const chirpRef = doc(this.fr, `chirps/${chirpId}`);
    const params = {
      comment,
      chirp: chirpRef,
      creator: userRef,
      createdAt: new Date()
    }
    return await createNewDocumentWithoutId('comments', params, this.fr);
  }

  async addCommentToChirp(chirpId: string, commentRef: DocumentReference<any>) {
    await updateDocument(`chirps`, chirpId, {comments: arrayUnion(commentRef)}, this.fr);
  }

  update(comment: Comment) {
    const updatedParams = {
      comment: comment.comment,
      updatedAt: serverTimestamp()
    }
    return updateDoc(doc(this.fr, `comments/${comment.id}`), updatedParams);
  }

  async delete(comment: Comment) {
    await updateDoc(doc(this.fr, `chirps/${comment.chirp!.id}`), {
      comments: arrayRemove(doc(this.fr, `comments/${comment.id}`))
    });
    await deleteDoc(doc(this.fr, `comments/${comment.id}`));
  }

}
