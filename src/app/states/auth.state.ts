import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  private currentUser$: BehaviorSubject<User> = new BehaviorSubject({});
  private isEmailNotVerified$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  private isDoneRegister$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);

  private isDoneGoogleRegister$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);

  private isDoneLogin$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);

  set currentUser(user: User) {
    this.currentUser$.next(user);
  }

  set isEmailNotVerified(value: Boolean) {
    this.isEmailNotVerified$.next(value);
  }

  set isDoneGoogleRegister(value: Boolean) {
    this.isDoneGoogleRegister$.next(value);
  }

  getIsDoneGoogleRegister(): Observable<Boolean> {
    return this.isDoneGoogleRegister$.asObservable();
  }

  set isDoneRegister(value: Boolean) {
    this.isDoneRegister$.next(value);
  }

  set isDoneLogin(value: Boolean) {
    this.isDoneLogin$.next(value);
  }

  getCurrentUserValue(): User {
    return this.currentUser$.getValue();
  }

  getisDoneLogin(): Observable<Boolean> {
    return this.isDoneLogin$.asObservable();
  }

  getisDoneRegister(): Observable<Boolean> {
    return this.isDoneRegister$.asObservable();
  }


  getisEmailNotVerified(): Observable<Boolean> {
    return this.isEmailNotVerified$.asObservable();
  }

  getCurrentUser(): Observable<User> {
    return this.currentUser$.asObservable();
  }
}
