import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AlertController, isPlatform, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";
import {getErrorMessage, showAlert} from "../../../../helpers/Utils";
import {AuthFacade} from "../../../../facades/auth.facade";
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import {sendPasswordResetEmail} from "@angular/fire/auth";

const emailValidators = [Validators.required, Validators.email];
const passwordValidators = Validators.required;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  credentials = this.fb.group({
    email: ['', emailValidators],
    password: ['', passwordValidators]
  });

  constructor(private fb: FormBuilder,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private authFacade: AuthFacade,
              private router: Router,
  ) {
    if (!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }
  }

  async googleSignup() {
    const googleUser = await GoogleAuth.signIn();
    await this.authFacade.googleLogin(googleUser);
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();
    const response = await this.authFacade.login(this.email!.value!, this.password!.value!);
    await loading.dismiss();
    this.cleanForm();
    !response.error ?
      await this.router.navigateByUrl('/app') :
      await showAlert("Ops", getErrorMessage(response.error), this.alertController);
  }

  async signUp() {
    await this.router.navigateByUrl('/auth/register');
  }

  async forgotPassword() {
    await this.authFacade.handleForgotPassword()
  }

  private cleanForm() {
    this.credentials.reset();

  }

  ngOnInit() {
  }


}
