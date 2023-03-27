import {Component, inject, Input, OnInit} from '@angular/core';
import {Comment} from "../../../../models/comment";
import {CommentFacade} from "../../../../facades/comment.facade";
import {AlertController, ToastController} from "@ionic/angular";

@Component({
  selector: 'chirp-comment',
  templateUrl: './chirp-comment.component.html',
  styleUrls: ['./chirp-comment.component.scss'],
})
export class ChirpCommentComponent implements OnInit {
  @Input() comment: Comment | undefined;
  @Input() isEditor: boolean = true;
  canEdit: boolean = false;

  private alertCtrl = inject(AlertController);
  private commentFacade = inject(CommentFacade);

  private toastCtrl = inject(ToastController);

  constructor() {
  }

  ngOnInit() {
    console.log(this.comment)
  }


  async toggleEdit() {
    this.canEdit = !this.canEdit;
  }

  async deleteComment(comment: Comment) {
    const alert = await this.alertCtrl.create({
      header: 'Do you want to delete this comment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: async () => {
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            await this.commentFacade.delete(comment);
          },
        },
      ],
    });

    await alert.present();
    const {role} = await alert.onDidDismiss();
    if (role === 'confirm') {
      const toast = await this.toastCtrl.create({
        message: 'Comment deleted successfully',
        duration: 2000
      });
      await toast.present();
    }
  }

  getDate(date: any) {
    if (date === undefined) return '';
    const d = new Date(date.seconds * 1000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  async validateEdit(value: any, comment: any) {
    const alert = await this.alertCtrl.create({
      header: 'Do you want to edit this comment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: async () => {
            await this.toggleEdit();
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            await this.commentFacade.update({
              ...comment,
              comment: value
            });
            await this.toggleEdit();
          },
        },
      ],
    });

    await alert.present();
    const {role} = await alert.onDidDismiss();
    if (role === 'confirm') {
      const toast = await this.toastCtrl.create({
        message: 'Comment updated successfully',
        duration: 2000
      });
      await toast.present();
    }

  }

}
