import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  private currentUser$: BehaviorSubject<User> = new BehaviorSubject({});
  set currentUser(user: User) {
    this.currentUser$.next(user);
  }

  getCurrentUser(): Observable<User> {
    return this.currentUser$.asObservable();
  }
}
