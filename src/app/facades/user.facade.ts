import {inject, Injectable, OnDestroy} from '@angular/core';
import {UserState} from "../states/user.state";
import {UserService} from "../services/user.service";
import {map, Subscription, switchMap} from "rxjs";
import {AuthFacade} from "./auth.facade";
import {authState} from "@angular/fire/auth";
import {AuthState} from "../states/auth.state";

@Injectable({
  providedIn: 'root'
})
export class UserFacade  {

  private userService = inject(UserService);
  private userState = inject(UserState);

  private subscription: Subscription | undefined;

  private authState = inject(AuthState);

  getAllUsers() {
    this.userState.isLoading = true;
    this.subscription = this.authState.getCurrentUser().pipe(
      switchMap(currentUser => {
        return this.userService.findAllUsers().pipe(
          map(users => users.filter(user => user['email'] !== currentUser.email))
        );
      })
    ).subscribe(users => {
      this.userState.users = users;
      this.userState.isLoading = false;
    });
  }

  unsubscribe() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  getUsers() {
    return this.userState.getUsers$();
  }
}
