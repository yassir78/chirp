import {inject, Injectable} from '@angular/core';
import {ChirpState} from "../states/chirp.state";
import {ChirpService} from "../services/chirp.service";
import {Photo} from "@capacitor/camera";
import {AuthState} from "../states/auth.state";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class ChirpFacade {

  private chirpState = inject(ChirpState);
  private authState = inject(AuthState);
  private chirpService = inject(ChirpService);

  async save({content, imageUrl, createdAt,writers,readers}: { content: string, imageUrl: string, createdAt: Date ,writers:User[],readers:User[]}) {
    const user = this.authState.getCurrentUserValue();
    const chirpRef = await this.chirpService.save({content, imageUrl, createdAt}, user.uid,writers,readers);
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

  getChirps() {
    return this.chirpState.getChirps();
  }

  getIsLoading() {
    return this.chirpState.getIsLoading();
  }

  getAllChirps() {
    this.chirpState.isLoading = true;
    this.chirpService.findAllChirps().subscribe(chirps => {
      this.chirpState.chirps = chirps;
      this.chirpState.isLoading = false;
    })
  }
}
