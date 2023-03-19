import {Component, inject, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../../models/user";
import {AuthFacade} from "../../facades/auth.facade";
import {ModalController, ToastController} from "@ionic/angular";
import {AddChirpComponent} from "../../shared/add-chirp/add-chirp.component";
import {ChirpFacade} from "../../facades/chirp.facade";
import {ChirpService} from "../../services/chirp.service";
import {Chirp} from "../../models/chirp";

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
  chirps$: Observable<Chirp[]> | undefined;
  isLoading$: Observable<Boolean> | undefined;
  chirps: Observable<Chirp> | undefined;
  chirpTest = {
    img: "https://i.pravatar.cc/150?img=1",
    name: "John Doe",
    handle: "johndoe",
    date: "2022-10-01",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    rechirp: true
  };

  constructor() {
  }

  ngOnInit() {
    this.chirpFacade.getAllChirps();
    this.connectedUser = this.auth.getCurrentUser();
    this.isLoading$ = this.chirpFacade.getIsLoading();
    this.chirps$ = this.chirpFacade.getChirps();
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


}
