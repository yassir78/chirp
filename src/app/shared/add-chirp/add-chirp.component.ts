import {Component, inject, OnInit} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
import {AuthFacade} from "../../facades/auth.facade";
import {Observable} from "rxjs";
import {User} from "../../models/user";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {FormBuilder, Validators} from "@angular/forms";
import {ChirpFacade} from "../../facades/chirp.facade";
import {UserFacade} from "../../facades/user.facade";

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
  modalCtrl = inject(ModalController);
  userFacade = inject(UserFacade);
  chirpForm = this.formBuilder.group({
    content: ['', Validators.required],
  });

  isImageUploading: Observable<Boolean> | undefined;
  imageUrl: string | null = null;
  defaultAvatar = 'https://miro.medium.com/max/441/1*9EBHIOzhE1XfMYoKz1JcsQ.gif';
  connectedUser: Observable<User> | undefined;
  isAddLoading$: Observable<Boolean> | undefined;

  users$: Observable<User[]> | undefined;

  visibilityValue: string = 'private';
  public readerUsers: User[] = [];
  public writerUsers: User[] = [];

  ngOnInit() {
    this.userFacade.getAllUsers();
    this.connectedUser = this.auth.getCurrentUser();
    this.isImageUploading = this.chirpFacade.getIsImageUploading();
    this.isAddLoading$ = this.chirpFacade.getIsAddLoading();
    this.users$ = this.userFacade.getUsers();
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
      writers: this.writerUsers,
      readers: this.readerUsers,
    });
    await loading.dismiss();
    return this.modalCtrl.dismiss(null, 'success');
  }

  handleVisibilityChange(e: any) {
    this.visibilityValue = e.detail.value;
    this.readerUsers = [];
    this.writerUsers = [];
  }

  addToReaders(user: User) {
    if(this.readerUsers.find(u => u.id === user.id)) return;
    this.readerUsers = [...this.readerUsers, user];
  }

  removeFromReaders(user: User) {
    this.readerUsers = this.readerUsers.filter(u => u.id !== user.id);
  }

  addToWriters(user: User) {
    console.log('add to writers')
    if(this.writerUsers.find(u => u.id === user.id)) return;
    this.writerUsers = [...this.writerUsers, user];
  }

  removeFromWriters(user: User) {
    this.writerUsers = this.writerUsers.filter(u => u.id !== user.id);
  }
}
