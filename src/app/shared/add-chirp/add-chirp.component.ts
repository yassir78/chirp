import {Component, inject, Inject, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {AuthFacade} from "../../facades/auth.facade";
import {Observable} from "rxjs";
import {User} from "../../models/user";

@Component({
  selector: 'app-add-chirp',
  templateUrl: './add-chirp.component.html',
  styleUrls: ['./add-chirp.component.scss'],
})
export class AddChirpComponent implements OnInit {
  auth = inject(AuthFacade);
  modalCtrl = Inject(ModalController);
  connectedUser: Observable<User> | undefined;

  currentChirpVisibility = 'public';

  constructor() {
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss("hey", 'confirm');
  }

  ngOnInit() {
    this.connectedUser = this.auth.getCurrentUser();

  }

}
