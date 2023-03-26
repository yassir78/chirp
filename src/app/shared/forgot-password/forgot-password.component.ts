import {Component, inject, OnInit} from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {AuthFacade} from "../../facades/auth.facade";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  authFacade = inject(AuthFacade);
  formBuilder = inject(FormBuilder);
  altertCtrl = inject(AlertController);
  forgotPasswordForm = this.formBuilder.group({
    email: ['',[Validators.required,Validators.email]]
  });

  get email() {
    return this.forgotPasswordForm.get('email');
  }
  constructor() {
  }

  private modalCtrl = inject(ModalController);

  ngOnInit() {
  }

  async return() {
    await this.modalCtrl.dismiss({
      role: 'return'
    });
  }

  async sendEmail() {

    const alert = await this.altertCtrl.create({
      header: 'Loading',
      message: 'Please Wait',
    });
    await alert.present();
    await this.authFacade.handleForgotPassword(this.email?.value!);
    await alert.dismiss();
    await this.modalCtrl.dismiss({
      role: 'success'
    });
  }


}
