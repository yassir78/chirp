import {inject, Injectable} from '@angular/core';
import {getDownloadURL, ref, Storage, uploadString} from "@angular/fire/storage";
import {Photo} from "@capacitor/camera";
import {createNewDocumentWithoutId, updateDocument} from "../helpers/Utils";
import {
  arrayUnion,
  collection,
  collectionData,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  orderBy
} from "@angular/fire/firestore";
import {switchMap} from "rxjs";
import {User} from "../models/user";
import {query} from "@firebase/firestore";


@Injectable({
  providedIn: 'root'
})
export class ChirpService {

  private storage = inject(Storage);

  private fr = inject(Firestore);

  async uploadImage(cameraFile: Photo) {
    const path = `chirps/${Date.now()}.png`;
    const storageRef = ref(this.storage, path);
    try {
      await uploadString(storageRef, cameraFile.base64String!, 'base64');
      return await getDownloadURL(storageRef);
    } catch (e: any) {
      return e.message;
    }
  }

  async save(param: { imageUrl: string; content: string; createdAt: Date }, uid: string | undefined,writers:User[],readers:User[]) {

    const userRef = doc(this.fr, `users/${uid}`);
    const writersRef = writers.map(writer => doc(this.fr, `users/${writer.id}`));
    const readersRef = readers.map(reader => doc(this.fr, `users/${reader.id}`));
    const updatedParams = {
      ...param,
      creator: userRef,
      writers: writersRef,
      readers: readersRef
    }
    return await createNewDocumentWithoutId('chirps', updatedParams, this.fr);
  }

  async addChirpToUserChirps(uid: any, chirpRef: DocumentReference<any>) {
    await updateDocument(`users`, uid, {chirps: arrayUnion(chirpRef)}, this.fr);
  }

  findAllChirps() {
    const collectionRef = collection(this.fr, 'chirps');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    const collectionData$ = collectionData(q, {idField: 'id'});
    return collectionData$.pipe(
      switchMap(async (chirps) => {
        return this.mapChirpsWithCreator(chirps);
      })
    );
  }

  private async mapChirpsWithCreator(chirps: DocumentData[]) {
    return await Promise.all(chirps.map(async (chirp) => {
      const path = chirp['creator'].path;
      const chirpDoc = await getDoc(doc(this.fr, path));
      const creator = await chirpDoc.data() as User;
      return {
        ...chirp,
        creator
      };
    }));
  }

}
