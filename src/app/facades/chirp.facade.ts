import {inject, Injectable} from '@angular/core';
import {ChirpState} from "../states/chirp.state";
import {ChirpService} from "../services/chirp.service";
import {Photo} from "@capacitor/camera";
import {AuthState} from "../states/auth.state";
import {User} from "../models/user";
import {Subscription} from "rxjs";
import {Chirp} from "../models/chirp";

@Injectable({
  providedIn: 'root'
})
export class ChirpFacade {

  private chirpState = inject(ChirpState);
  private authState = inject(AuthState);
  private chirpService = inject(ChirpService);
  getAllChirpsWhereConnectedUserIsCreatorSubscription: Subscription | undefined;
  getAllChirpsWhereConnectedUserIsReaderOrWriterSubscription: Subscription | undefined;

  authSubscription1: Subscription | undefined;
  authSubscription2: Subscription | undefined;


  async save({
               content,
               imageUrl,
               createdAt,
               writers,
               readers
             }: { content: string, imageUrl: string, createdAt: Date, writers: User[], readers: User[] }) {
    const user = this.authState.getCurrentUserValue();
    const chirpRef = await this.chirpService.save({content, imageUrl, createdAt}, user.uid, writers, readers);
    return this.chirpService.addChirpToUserChirps(user.uid, chirpRef);
  }

  async uploadImage(cameraFile: Photo) {
    this.chirpState.isImageUploading = true;
    const result = await this.chirpService.uploadImage(cameraFile);
    this.chirpState.isImageUploading = false;
    return result;
  }

  getIsImageUploading() {
    return this.chirpState.getisImageUploading();
  }

  getIsAddLoading() {
    return this.chirpState.getisAddLoading();
  }

  getChirpsWhereConnectedUserIsReaderOrWriter() {
    return this.chirpState.getChirpsWhereConnectedUserIsReaderOrWriter();
  }

  getChirpsWhereConnectedUserIsCreator() {
    return this.chirpState.getChirpsWhereConnectedUserIsCreator();
  }

  getIsChirpsWhereConnectedUserIsReaderOrWriterLoading() {
    return this.chirpState.getIsChirpsWhereConnectedUserIsReaderOrWriterLoading();
  }

  getIsChirpsWhereConnectedUserIsCreatorLoading() {
    return this.chirpState.getIsChirpsWhereConnectedUserIsCreatorLoading();
  }


  getAllChirpsWhereConnectedUserIsReaderOrWriter() {
    this.authSubscription1 = this.authState.getCurrentUser().subscribe(user => {
      if (!user) return;
      this.chirpState.isChirpsWhereConnectedUserIsReaderOrWriterLoading = true;
      this.getAllChirpsWhereConnectedUserIsReaderOrWriterSubscription = this.chirpService.findAllChirpsWhereUserIsWriterOrReader(user!.id!).subscribe(chirps => {
        this.chirpState.chirpsWhereConnectedUserIsReaderOrWriter = chirps;
        this.chirpState.isChirpsWhereConnectedUserIsReaderOrWriterLoading = false;
      })
    });

  }

  getAllChirpsWhereConnectedUserIsCreator() {
    this.authSubscription2 = this.authState.getCurrentUser().subscribe(user => {
      this.chirpState.isChirpsWhereConnectedUserIsCreatorLoading = true;
      this.getAllChirpsWhereConnectedUserIsCreatorSubscription = this.chirpService.findAllChirpsWhereUserIsCreator(user!.id!).subscribe(chirps => {
        this.chirpState.chirpsWhereConnectedUserIsCreator = chirps;
        this.chirpState.isChirpsWhereConnectedUserIsCreatorLoading = false;
      })
    });

  }


  getChirpById(id: string) {
    this.chirpService.findChirpById(id).subscribe(chirp => {
      this.chirpState.isChirpDetailLoading = true;
      this.chirpState.chirpDetail = <Chirp>chirp;
      this.chirpState.isChirpDetailLoading = false;
    });
  }

  async deleteChirp(chirp: Chirp, chirpId: string) {
    await this.chirpService.deleteChirp(chirp, chirpId);
  }

  async updateChirp(chirp: Chirp) {
    await this.chirpService.updateChirp(chirp);
  }

  getChirpDetail() {
    return this.chirpState.getChirpDetail();
  }

  getIsChirpDetailLoading() {
    return this.chirpState.getIsChirpDetailLoading();
  }

  unsubscribe() {
    if (this.getAllChirpsWhereConnectedUserIsReaderOrWriterSubscription) {
      this.getAllChirpsWhereConnectedUserIsReaderOrWriterSubscription.unsubscribe();
    }
    if (this.getAllChirpsWhereConnectedUserIsCreatorSubscription) {
      this.getAllChirpsWhereConnectedUserIsCreatorSubscription.unsubscribe();
    }
    if (this.authSubscription1) {
      this.authSubscription1.unsubscribe();
    }

    if (this.authSubscription2) {
      this.authSubscription2.unsubscribe();
    }
  }
}
