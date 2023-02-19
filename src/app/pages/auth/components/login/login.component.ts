import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertController, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {Utils} from "../../../../helpers/Utils";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  credentials = this.fb.group({
    email: ['',Validators.compose([Validators.required,Validators.email])],
    password: ['',Validators.required]
  });
  constructor(private fb:FormBuilder,
              private loadingController:LoadingController,
              private alertController:AlertController,
              private router:Router,
              private authService:AuthService

              ) { }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    // @ts-ignore
    const response = await this.authService.login(this.email.value,this.password!.value);
    await loading.dismiss();
    response.user ?
      await this.router.navigateByUrl('/tabs') :
      await this.showAlert("Oups", Utils.getErrorMessage(response.error));
  }

  ngOnInit() {}

  private async showAlert(invalidCredentials: string, pleaseCheckYourEmailAndPassword: string) {
    const alert = await this.alertController.create({
      header: invalidCredentials,
      message: pleaseCheckYourEmailAndPassword,
      buttons: ['OK']
    });
    await alert.present();
  }
}
