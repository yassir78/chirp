import {Component, inject, OnInit} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
import {AuthFacade} from "../../facades/auth.facade";
import {Observable} from "rxjs";
import {User} from "../../models/user";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {FormBuilder, Validators} from "@angular/forms";
import {ChirpFacade} from "../../facades/chirp.facade";

@Component({
  selector: 'app-add-chirp',
  templateUrl: './add-chirp.component.html',
  styleUrls: ['./add-chirp.component.scss'],
})
export class AddChirpComponent implements OnInit {
  auth = inject(AuthFacade);
  formBuilder = inject(FormBuilder);
  chirpFacade = inject(ChirpFacade);
  loadingController = inject(LoadingController);
  chirpForm = this.formBuilder.group({
    content: ['', Validators.required],
  });

  isImageUploading: Observable<Boolean> | undefined;
  imageUrl: string | null = null;
  defaultAvatar = 'https://miro.medium.com/max/441/1*9EBHIOzhE1XfMYoKz1JcsQ.gif';
  connectedUser: Observable<User> | undefined;
  isAddLoading$: Observable<Boolean> | undefined;
  currentChirpVisibility = 'public';

  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.connectedUser = this.auth.getCurrentUser();
    this.isImageUploading = this.chirpFacade.getIsImageUploading();
    this.isAddLoading$ = this.chirpFacade.getIsAddLoading();
  }

  return() {
    console.log('return')
    return this.modalCtrl.dismiss(null, 'return');
  }

  get content() {
    return this.chirpForm.get('content');
  }

  removeImage() {
    this.imageUrl = null;
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

  async onSubmit() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();
    await this.chirpFacade.save({
      createdAt: new Date(),
      content: this.chirpForm.value.content!,
      imageUrl: this.imageUrl || '',
    });
    await loading.dismiss();
    return this.modalCtrl.dismiss(null, 'success');
  }

}
