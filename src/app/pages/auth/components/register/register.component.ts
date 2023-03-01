import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {passwordMatchValidator} from "../../../../helpers/Validators/CompareValdator";
import {AlertController, LoadingController} from "@ionic/angular";
import {AuthFacade} from "../../../../facades/auth.facade";
import {RegisterResponseDto} from "../../../../dtos/response/RegisterResponseDto";
import {getErrorMessage, isEmptyObject, showAlert} from "../../../../helpers/Utils";

const emailValidators = [Validators.required, Validators.email];
const usernameValidators = Validators.required;
const firstnameValidators = Validators.required;
const lastnameValidators = Validators.required;
const passwordValidators = [Validators.required, Validators.minLength(4)];
const confirmPasswordValidators = [Validators.required, Validators.minLength(4)];

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private router: Router,
              private loadingController: LoadingController,
              private authFacade: AuthFacade,
              private alertController: AlertController
  ) {
  }

  credentials = this.fb.group({
    email: ['', emailValidators],
    password: ['', passwordValidators],
    confirmPassword: ['', confirmPasswordValidators],
    username: ['', usernameValidators],
    firstname: ['', firstnameValidators],
    lastname: ['', lastnameValidators],
  });


  ngOnInit() {
    this.credentials.addValidators(
      passwordMatchValidator()
    )
  }


  get email() {
    return this.credentials.get('email');
  }


  get password() {
    return this.credentials.get('password');
  }

  get confirmPassword() {
    return this.credentials.get('confirmPassword');
  }


  get username() {
    return this.credentials.get('username');
  }

  get firstname() {
    return this.credentials.get('firstname');
  }

  get lastname() {
    return this.credentials.get('lastname');
  }


  async register() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();
    const response: RegisterResponseDto = await this.authFacade.register({
      email: this.email!.value!,
      password: this.password!.value!,
      username: this.username!.value!,
      firstname: this.firstname!.value!,
      lastname: this.lastname!.value!,
    });
    console.log(response)
    await loading.dismiss();
    this.cleanForm();
    !isEmptyObject(response.user) ?
      await this.router.navigateByUrl('/tabs') :
      await showAlert("Ops", getErrorMessage(response.error), this.alertController);
  }

  async signIn() {
    await this.router.navigateByUrl('/auth/login');
  }

  private cleanForm() {
    this.credentials.reset();
  }
}
