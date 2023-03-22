import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Chirp} from "../models/chirp";

@Injectable({
  providedIn: 'root'
})
export class ChirpState {

  private chirps$: BehaviorSubject<Chirp[]> = new BehaviorSubject<Chirp[]>([]);
  private chirpsWhereConnectedUserIsCreator$: BehaviorSubject<Chirp[]> = new BehaviorSubject<Chirp[]>([]);
  private chirpsWhereConnectedUserIsReaderOrWriter$: BehaviorSubject<Chirp[]> = new BehaviorSubject<Chirp[]>([]);
  private isImageUploading$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  private isAddLoading$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  private isLoading$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  private isChirpsWhereConnectedUserIsCreatorLoading$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  private isChirpsWhereConnectedUserIsReaderOrWriterLoading$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  private chirpDetail$: BehaviorSubject<Chirp> = new BehaviorSubject<Chirp>({});

  private isChirpDetailLoading$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  getChirpDetail(): Observable<Chirp> {
    return this.chirpDetail$.asObservable();
  }

  set chirpDetail(chirp: Chirp) {
    this.chirpDetail$.next(chirp);
  }

  getIsChirpDetailLoading(): Observable<Boolean> {
    return this.isChirpDetailLoading$.asObservable();
  }

  set isChirpDetailLoading(value: Boolean) {
    this.isChirpDetailLoading$.next(value);
  }

  getChirpsWhereConnectedUserIsCreator(): Observable<Chirp[]> {
    return this.chirpsWhereConnectedUserIsCreator$.asObservable();
  }

  set chirpsWhereConnectedUserIsCreator(chirps: Chirp[]) {
    this.chirpsWhereConnectedUserIsCreator$.next(chirps);
  }

  getChirpsWhereConnectedUserIsReaderOrWriter(): Observable<Chirp[]> {
    return this.chirpsWhereConnectedUserIsReaderOrWriter$.asObservable();
  }

  set chirpsWhereConnectedUserIsReaderOrWriter(chirps: Chirp[]) {
    this.chirpsWhereConnectedUserIsReaderOrWriter$.next(chirps);
  }
  getIsChirpsWhereConnectedUserIsReaderOrWriterLoading(): Observable<Boolean> {
    return this.isChirpsWhereConnectedUserIsReaderOrWriterLoading$.asObservable();
  }

  set isChirpsWhereConnectedUserIsReaderOrWriterLoading(value: Boolean) {
    this.isChirpsWhereConnectedUserIsReaderOrWriterLoading$.next(value);
  }

  getIsChirpsWhereConnectedUserIsCreatorLoading(): Observable<Boolean> {
    return this.isChirpsWhereConnectedUserIsCreatorLoading$.asObservable();
  }


  set isChirpsWhereConnectedUserIsCreatorLoading(value: Boolean) {
    this.isChirpsWhereConnectedUserIsCreatorLoading$.next(value);
  }

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
