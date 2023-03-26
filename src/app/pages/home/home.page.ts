import {Component, inject, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../../models/user";
import {AuthFacade} from "../../facades/auth.facade";
import {ModalController, ToastController} from "@ionic/angular";
import {AddChirpComponent} from "../../shared/add-chirp/add-chirp.component";
import {ChirpFacade} from "../../facades/chirp.facade";
import {ChirpService} from "../../services/chirp.service";
import {Chirp} from "../../models/chirp";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  segment = 'home';

  auth = inject(AuthFacade);
  chirpFacade = inject(ChirpFacade);
  modalCtrl = inject(ModalController);
  toastCtrl = inject(ToastController);
  connectedUser: Observable<User> | undefined;

  isLoadingChirpsWhereConnectedUserIsReaderOrWriter$: Observable<Boolean> | undefined;
  isLoadingChirpsWhereConnectedUserIsCreator$: Observable<Boolean> | undefined;
  chirpsWhereConnectedUserIsReaderOrWriter: Observable<Chirp[]> | undefined;
  chirpsWhereConnectedUserIsCreator: Observable<Chirp[]> | undefined;
  chirps: Observable<Chirp> | undefined;

  route = inject(ActivatedRoute);

  router = inject(Router);

  constructor() {
  }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.chirpFacade.getAllChirpsWhereConnectedUserIsReaderOrWriter();
    this.chirpFacade.getAllChirpsWhereConnectedUserIsCreator();
    this.connectedUser = this.auth.getCurrentUser();
    this.isLoadingChirpsWhereConnectedUserIsReaderOrWriter$ = this.chirpFacade.getIsChirpsWhereConnectedUserIsReaderOrWriterLoading();
    this.isLoadingChirpsWhereConnectedUserIsCreator$ = this.chirpFacade.getIsChirpsWhereConnectedUserIsCreatorLoading();
    this.chirpsWhereConnectedUserIsReaderOrWriter = this.chirpFacade.getChirpsWhereConnectedUserIsReaderOrWriter();
    this.chirpsWhereConnectedUserIsCreator = this.chirpFacade.getChirpsWhereConnectedUserIsCreator();
  }


  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddChirpComponent,
    });
    await modal.present();
    const {role} = await modal.onWillDismiss();
    if (role === 'return') {
      await modal.dismiss();
    }
    if (role === 'success') {
      const toast = await this.toastCtrl.create({
        message: 'Chirp added successfully!',
        duration: 3000,
        color: 'success'
      });
      await toast.present();
    }
  }


  segmentChanged($event: any) {

  }
}
