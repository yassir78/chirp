import {Injectable} from "@angular/core";
import {AuthState} from "../states/auth.state";
import {AuthService} from "../services/auth.service";
import {Observable} from "rxjs";
import {LoginResponseDto} from "../dtos/LoginResponseDto";
import {User} from "../models/user";
import {AbstractControl, ValidationErrors} from "@angular/forms";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {

  constructor(private authService: AuthService, private authState: AuthState, private router: Router) {
  }


  async login(email: string, password: string) {
    const response: LoginResponseDto = await this.authService.login(email, password);
    const {user} = response;
    this.setCurrentUser?.({
      email: user?.email ?? '',
      photoURL: user?.photoURL,
      phoneNumber: user?.phoneNumber,
      displayName: user?.displayName
    });
    return response;
  }

  setCurrentUser(user: User) {
    this.authState.currentUser = user;
  }

  getCurrentUser(): Observable<User> {
    return this.authState.getCurrentUser();
  }

  async logout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/auth/login')
  }


}
