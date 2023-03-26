import {Component, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {AuthFacade} from 'src/app/facades/auth.facade';
import {User} from 'src/app/models/user';
import {AlertController, LoadingController, ToastController} from "@ionic/angular";

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {

  auth = inject(AuthFacade);
  connectedUser: Observable<User> | undefined;

  toastController = inject(ToastController);

  userFacade = inject(AuthFacade);
  loadingController = inject(LoadingController);

  // @ts-ignore
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.connectedUser = this.auth.getCurrentUser();
    this.connectedUser.subscribe(user => {
      this.profileForm = this.fb.group({
        firstname: [user?.firstname ?? '', Validators.required],
        lastname: [user?.lastname ?? '', Validators.required],
        email: [user?.email ?? '', [Validators.required, Validators.email]],
        username: [user?.username ?? '', Validators.required],
      });
    });
  }


  async onSubmit() {

      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
      await loading.present();
      await this.userFacade.updateUser({
        firstname: this.profileForm.controls['firstname'].value,
        lastname: this.profileForm.controls['lastname'].value,
        username: this.profileForm.controls['username'].value,
        email: this.profileForm.controls['email'].value,
      });
      await loading.dismiss();

      const toast = await this.toastController.create({
        message: 'Profile updated successfully',
        duration: 2000
      });

      await toast.present();

  }


}
