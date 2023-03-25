import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthFacade } from 'src/app/facades/auth.facade';
import { User } from 'src/app/models/user';

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {

  auth = inject(AuthFacade);
  connectedUser: Observable<User> | undefined;

  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.connectedUser = this.auth.getCurrentUser();

    this.profileForm = this.fb.group({
      firstname: [this.connectedUser?.firstname ?? '', Validators.required],
      lastname: [this.connectedUser?.lastname ?? '', Validators.required],
      email: [this.connectedUser?.email ?? '', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: [''],
    });
  }

  ngOnInit() {
  }


  onSubmit() {  
    // @ts-ignore
    if (this.profileForm.controls.password.value !== this.profileForm.controls.confirmPassword.value) {
      alert('Passwords do not match');
      return;
    }

    // TODO: Update the user's account details with the new profile information
    alert('Profile updated successfully');
  }

}
