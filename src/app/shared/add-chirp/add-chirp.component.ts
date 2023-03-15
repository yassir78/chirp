import {Component, Inject, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-add-chirp',
  templateUrl: './add-chirp.component.html',
  styleUrls: ['./add-chirp.component.scss'],
})
export class AddChirpComponent implements OnInit {

  modalCtrl = Inject(ModalController);
  constructor() { }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss("hey", 'confirm');
  }
  ngOnInit() {}

}
