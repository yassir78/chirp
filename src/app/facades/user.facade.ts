import {inject, Injectable, OnDestroy} from '@angular/core';
import {UserState} from "../states/user.state";
import {UserService} from "../services/user.service";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserFacade  {

  private userService = inject(UserService);
  private userState = inject(UserState);

  private subscription: Subscription | undefined;

  getAllUsers() {
    this.userState.isLoading = true;
    this.subscription = this.userService.findAllUsers().subscribe(users => {
      this.userState.users = users;
      this.userState.isLoading = false;
    })
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
