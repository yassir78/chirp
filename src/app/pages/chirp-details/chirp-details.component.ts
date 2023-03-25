import {Component, inject, OnInit} from '@angular/core';
import {Chirp} from "../../models/chirp";
import {ChirpFacade} from "../../facades/chirp.facade";
import {ActivatedRoute, Router} from "@angular/router";
import {combineLatest, Observable} from "rxjs";
import {User} from "../../models/user";
import {AuthState} from "../../states/auth.state";
import {AlertController, ToastController} from "@ionic/angular";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";

@Component({
  selector: 'chirp-details',
  templateUrl: './chirp-details.component.html',
  styleUrls: ['./chirp-details.component.scss'],
})
export class ChirpDetailsComponent implements OnInit {

  isEditor: boolean = false;
  canEdit: boolean = false;
  private chirpFacade = inject(ChirpFacade);
  private activeRouterSnapshot = inject(ActivatedRoute).snapshot;
  private authState = inject(AuthState);

  private alertCtrl = inject(AlertController);
  loading$: Observable<Boolean> | undefined;
  chirp$: Observable<Chirp> | undefined;
  connectedUser$: Observable<User> | undefined;

  private router = inject(Router);

  private toastCtrl = inject(ToastController);
  chirpId: string = '';
  defaultAvatar = 'https://miro.medium.com/max/441/1*9EBHIOzhE1XfMYoKz1JcsQ.gif';
  imageUrl: string | undefined;

  text: string = '';

  constructor() {
  }

  ngOnInit() {
    this.chirpId = this.activeRouterSnapshot.params['id'];
    this.chirpFacade.getChirpById(this.chirpId);
    this.chirp$ = this.chirpFacade.getChirpDetail();
    this.loading$ = this.chirpFacade.getIsChirpDetailLoading();
    this.connectedUser$ = this.authState.getCurrentUser();
    this.chirp$.subscribe(chirp => {
      this.imageUrl = chirp?.imageUrl;
    })

    const chirpAndConnectedUser$ = combineLatest([this.chirp$, this.connectedUser$]);
    chirpAndConnectedUser$.subscribe(([chirp, connectedUser]) => {
      console.log('chirp:', chirp);
      console.log('connectedUser:', connectedUser)
      if (chirp?.creator?.email && connectedUser?.email) {
        if (chirp.creator.email === connectedUser.email) {
          this.isEditor = true;
          console.log('Chirp creator and connected user have the same email:', chirp.creator.email);
        } else if (chirp.writers!.map(writer => writer.email).includes(connectedUser.email)) {
          this.isEditor = true;
        }
      } else {
        console.log('Chirp or connected user is null or undefined');
      }
    });

  }


  async toggleEdit() {
    this.canEdit = !this.canEdit;
  }

  async deleteChirp(chirp: Chirp) {
    const alert = await this.alertCtrl.create({
      header: 'Do you want to delete this chirp?',
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
            await this.chirpFacade.deleteChirp(chirp, this.chirpId);
            await this.router.navigate(['/app/home']);
          },
        },
      ],
    });

    await alert.present();
    const {role} = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
    if (role === 'confirm') {
      const toast = await this.toastCtrl.create({
        message: 'Chirp deleted successfully',
        duration: 2000
      });
      await toast.present();
    }
  }

  async validateEdit(value: any) {
    this.text = value;
  }

  async update(chirp:Chirp){
    const alert = await this.alertCtrl.create({
      header: 'Do you want to edit this chirp?',
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
            await this.chirpFacade.updateChirp({
              ...chirp,
              id: this.chirpId,
              content: this.text,
              imageUrl: this.imageUrl
            });
            await this.toggleEdit();
          },
        },
      ],
    });

    await alert.present();
    const {role} = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
    if (role === 'confirm') {
      const toast = await this.toastCtrl.create({
        message: 'Chirp updated successfully',
        duration: 2000
      });
      await toast.present();
    }
  }

  getDate(date: any) {
    console.log(new Date(date.seconds * 1000));
    console.log(date.nanoseconds)
  }

  async return() {
    await this.router.navigate(['/app/home']);
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    })
    this.imageUrl = await this.chirpFacade.uploadImage(image);
  }
}
