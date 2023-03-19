import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserState {

  private users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  private isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getUsers$(): Observable<User[]> {
    return this.users$.asObservable();
  }

  set users(users: User[]) {
    this.users$.next(users);
  }

  get isLoading() {
    return this.isLoading$.getValue();
  }

  set isLoading(isLoading: boolean) {
    this.isLoading$.next(isLoading);
  }


}
