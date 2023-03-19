import {inject, Injectable} from '@angular/core';
import {UserState} from "../states/user.state";
import {UserService} from "../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class UserFacade {

  private userService = inject(UserService);
  private userState = inject(UserState);

  getAllUsers() {
    this.userState.isLoading = true;
    this.userService.findAllUsers().subscribe(users => {
      this.userState.users = users;
      this.userState.isLoading = false;
    })
  }

  getUsers() {
    return this.userState.getUsers$();
  }
}
