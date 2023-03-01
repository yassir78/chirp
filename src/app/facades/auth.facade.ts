import {inject, Injectable} from "@angular/core";
import {AuthState} from "../states/auth.state";
import {AuthService} from "../services/auth.service";
import {map, Observable, switchMap} from "rxjs";
import {Router} from "@angular/router";
import {RegisterRequestDto} from "../dtos/request/RegisterRequestDto";
import {RegisterResponseDto} from "../dtos/response/RegisterResponseDto";
import {Auth, onAuthStateChanged} from "@angular/fire/auth";
import {collectionData, Firestore} from "@angular/fire/firestore";
import {collection} from "@firebase/firestore";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private auth = inject(Auth);
  private fr = inject(Firestore);

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
      ))).subscribe((user) => {
      this.setCurrentUser(user);
    });
  }

  getFireStoreUser(email: string): Observable<User> {
    const collectionRef = collection(this.fr, 'users');
    const collectionData$ = collectionData(collectionRef, {idField: 'id'});
    return collectionData$.pipe(
      switchMap((users: User[]) => {
        return users.filter((user: User) => user.email === email);
      })
    )
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
    await this.router.navigateByUrl('/auth/login')
  }


}
