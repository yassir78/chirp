import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Chirp} from "../models/chirp";

@Injectable({
  providedIn: 'root'
})
export class ChirpState {

  private chirps$: BehaviorSubject<Chirp[]> = new BehaviorSubject<Chirp[]>([]);
  private isImageUploading$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  private isAddLoading$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  private isLoading$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  set isImageUploading(value: Boolean) {
    this.isImageUploading$.next(value);
  }

  set isLoading(value: Boolean) {
    this.isLoading$.next(value);
  }

  getIsLoading(): Observable<Boolean> {
    return this.isLoading$.asObservable();
  }
  set isAddLoading(value: Boolean) {
    this.isAddLoading$.next(value);
  }

  set chirps(chirps: Chirp[]) {
    this.chirps$.next(chirps);
  }

  getChirps(): Observable<Chirp[]> {
    return this.chirps$.asObservable();
  }

  getisAddLoading(): Observable<Boolean> {
    return this.isAddLoading$.asObservable();
  }

  getisImageUploading(): Observable<Boolean> {
    return this.isImageUploading$.asObservable();
  }

  constructor() {
  }
}
