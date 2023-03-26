import {Component, inject, OnInit} from '@angular/core';
import {Chirp} from "../../models/chirp";
import {ChirpFacade} from "../../facades/chirp.facade";
import {ActivatedRoute, Router} from "@angular/router";
import {combineLatest, map, Observable, switchMap} from "rxjs";
import {User} from "../../models/user";
import {AuthState} from "../../states/auth.state";
import {AlertController, ToastController} from "@ionic/angular";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {UserFacade} from "../../facades/user.facade";

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

  private userFacade = inject(UserFacade);
  chirpId: string = '';
  defaultAvatar = 'https://miro.medium.com/max/441/1*9EBHIOzhE1XfMYoKz1JcsQ.gif';
  imageUrl: string | undefined;

  text: string = '';
  users$: Observable<User[]> | undefined;

  private route:ActivatedRoute = inject(ActivatedRoute);

  public readerUsers: User[] = [];
  public writerUsers: User[] = [];

  constructor() {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('ngOnInit()');
      this.userFacade.getAllUsers();
      this.chirpId = params['id'];
      this.chirpFacade.getChirpById(this.chirpId);
      this.chirp$ = this.chirpFacade.getChirpDetail();
      this.loading$ = this.chirpFacade.getIsChirpDetailLoading();
      this.connectedUser$ = this.authState.getCurrentUser();
      this.chirp$.subscribe(chirp => {
        console.log('chirp subscribe')
        this.imageUrl = chirp?.imageUrl;
        this.text = chirp?.content ?? '';
      })
      this.users$ = this.chirp$.pipe(
        switchMap(chirp => {
            const creator = chirp?.creator;
            return this.userFacade.getUsers().pipe(
              map(users => {
                return users.filter(user => user.email !== creator?.email);
              })
            )
          }
        ));
      this.chirp$.subscribe(chirp => {
        if (chirp?.readers === undefined || chirp?.writers === undefined) {
          this.readerUsers = [];
          this.writerUsers = [];
          return;
        }
        this.readerUsers = chirp?.readers ?? [];
        this.writerUsers = chirp?.writers ?? [];
      });
      const chirpAndConnectedUser$ = combineLatest([this.chirp$, this.connectedUser$]);
      chirpAndConnectedUser$.subscribe(([chirp, connectedUser]) => {
        console.log('chirpAndConnectedUser$ subscribe')
        console.log('chirp:', chirp);
        console.log('connectedUser:', connectedUser)
        if (chirp?.creator?.email && connectedUser?.email) {
          if (chirp.creator.email === connectedUser.email) {
            this.isEditor = true;
            console.log('Chirp creator and connected user have the same email:', chirp.creator.email);
          } else if (chirp.writers!.map(writer => writer.email).includes(connectedUser.email)) {
            this.isEditor = true;
          } else {
            this.isEditor = false;
            console.log('Chirp creator and connected user have different emails:', chirp.creator.email);
          }
        } else {
          console.log('Chirp or connected user is null or undefined');
        }
      });



    })

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

  async update(chirp: Chirp) {
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
              imageUrl: this.imageUrl,
              writers: this.writerUsers,
              readers: this.readerUsers,
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
        message: 'Chirp updated successfully',
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

  addToReaders(user: any) {
    if (this.readerUsers.find(u => u.email === user.email)) {
      return;
    }
    this.readerUsers = [...this.readerUsers, user];
  }

  removeFromReaders(user: any) {
    this.readerUsers = this.readerUsers.filter(u => u.email !== user.email);
  }

  addToWriters(user: any) {
    if (this.writerUsers.find(u => u.email === user.email)) return;
    this.writerUsers = [...this.writerUsers, user];
  }

  removeFromWriters(user: any) {
    this.writerUsers = this.writerUsers.filter(u => u.email !== user.email);
  }
}
