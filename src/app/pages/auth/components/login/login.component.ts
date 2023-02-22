import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AlertController, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";
import {Utils} from "../../../../helpers/Utils";
import {AuthFacade} from "../../../../facades/auth.facade";
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import {isPlatform} from "@ionic/angular";

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
    console.log("before google auth")
    const googleUser = await GoogleAuth.signIn();
    console.log("googleUser")
    console.log(googleUser);
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
    response.user ?
      await this.router.navigateByUrl('/tabs') :
      await this.showAlert("Ops", Utils.getErrorMessage(response.error));
  }

  async signUp() {
    await this.router.navigateByUrl('/auth/register');
  }
  
  async forgotPassword() {
    await this.router.navigateByUrl('/auth/register');
  }

  private cleanForm() {
    this.credentials.reset();

  }

  ngOnInit() {
  }

  private async showAlert(invalidCredentials: string, pleaseCheckYourEmailAndPassword: string) {
    const alert = await this.alertController.create({
      header: invalidCredentials,
      message: pleaseCheckYourEmailAndPassword,
      buttons: ['OK']
    });
    await alert.present();
  }
}
