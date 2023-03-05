import {inject, Injectable} from "@angular/core";
import {AuthState} from "../states/auth.state";
import {AuthService} from "../services/auth.service";
import {map, Observable, switchMap, tap} from "rxjs";
import {Router} from "@angular/router";
import {RegisterRequestDto} from "../dtos/request/RegisterRequestDto";
import {RegisterResponseDto} from "../dtos/response/RegisterResponseDto";
import {Auth, onAuthStateChanged, signInWithCredential} from "@angular/fire/auth";
import {User} from "../models/user";
import {GoogleAuthProvider} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private auth = inject(Auth);

  constructor(private authService: AuthService, private authState: AuthState, private router: Router) {
    new Observable((subscriber) => {
      onAuthStateChanged(this.auth, (user) => {
          subscriber.next(user);
        }
      )
    }).pipe(
      switchMap((user: any) => this.getFireStoreUser(user?.email!).pipe(
        map((fireStoreUser: User) => {
            return {
              ...user,
              ...fireStoreUser
            }
          }
        )
      ))).subscribe(async (user) => {
      this.setCurrentUser?.(user);
      await this.router.navigate(['/app/home']);
    });
  }

  getFireStoreUser(email: string): Observable<User> {
    return this.authService.getUserByEmail(email);
  }

  async login(email: string, password: string) {
    return await this.authService.login(email, password);
  }

  async register(registerRequest: RegisterRequestDto) {
    const response: RegisterResponseDto = await this.authService.register(registerRequest);
    const {user} = response;
    this.setCurrentUser?.(user);
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
    await this.router.navigate(['/auth/login']);
  }

  async googleLogin(googleUser: any) {
    const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
    const {user} = await signInWithCredential(this.auth, credential);
    try {
      await this.authService.isUserExistsByEmail(googleUser.email);
    } catch (e: any) {
      await this.authService.createNewDocument('users', user.uid, {
        email: googleUser.email ?? '',
        firstname: googleUser.givenName ?? '',
        lastname: googleUser.familyName ?? '',
        photoUrl: googleUser.imageUrl ?? '',
      });
    }
  }
}
