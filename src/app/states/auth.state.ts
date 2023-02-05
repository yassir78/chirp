import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class AuthState {
  private updating$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private currentUser$: BehaviorSubject<any> = new BehaviorSubject(null);

  isUpdating$() {
    return this.updating$.asObservable();
  }

  setUpdating(updating: boolean) {
    this.updating$.next(updating);
  }

  getCurrentUser$() {
    return this.currentUser$.asObservable();
  }

  setCurrentUser(user: any) {
    this.currentUser$.next(user);
  }
}
