import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

const emailValidators = [Validators.required, Validators.email];
const usernameValidators = Validators.required;
const firstnameValidators = Validators.required;
const lastnameValidators = Validators.required;
const passwordValidators = [Validators.required,Validators.minLength(4)];
const confirmPasswordValidators = [Validators.required, Validators.minLength(4)];

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder,private router: Router) {}

  ngOnInit() {}

  credentials = this.fb.group({
    email: ['', emailValidators],
    password: ['', passwordValidators],
    confirmPassword: ['', confirmPasswordValidators],
    username: ['', usernameValidators],
    firstname: ['', firstnameValidators],
    lastname: ['', lastnameValidators],
  });


  async register() {
    
  }

  async signIn() {
    await this.router.navigateByUrl('/auth/register');
  }
}
