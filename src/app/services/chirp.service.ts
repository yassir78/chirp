import {inject, Injectable} from '@angular/core';
import {getDownloadURL, ref, Storage, uploadString} from "@angular/fire/storage";
import {Photo} from "@capacitor/camera";
import {createNewDocumentWithoutId, updateDocument} from "../helpers/Utils";
import {
  arrayUnion,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  orderBy,
  updateDoc
} from "@angular/fire/firestore";
import {combineLatest, map, Observable, of, switchMap} from "rxjs";
import {User} from "../models/user";
import {query, where} from "@firebase/firestore";
import {Chirp} from "../models/chirp";
import {Comment} from "../models/comment";
import {serverTimestamp} from "@angular/fire/database";


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

  async save(param: { imageUrl: string; content: string; createdAt: Date }, uid: string | undefined, writers: User[], readers: User[]) {

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

  findAllChirpsWhereUserIsCreator(uid: string) {
    const collectionRef = collection(this.fr, 'chirps');
    const q = query(collectionRef,
      where('creator', '==', doc(this.fr, `users/${uid}`)),
      orderBy('createdAt', 'desc')
    );
    const collectionData$ = collectionData(q, {idField: 'id'});
    return collectionData$.pipe(
      switchMap(async (chirps) => {
          return this.mapChirpsWithCreator(chirps);
        }
      ));
  }

  findAllChirpsWhereUserIsWriterOrReader(uid: string) {
    const collectionRef = collection(this.fr, 'chirps');
    const q1 = query(collectionRef,
      where('readers', 'array-contains', doc(this.fr, `users/${uid}`)),
      where('creator', '!=', doc(this.fr, `users/${uid}`)),
    );
    const q2 = query(collectionRef,
      where('writers', 'array-contains', doc(this.fr, `users/${uid}`)),
      where('creator', '!=', doc(this.fr, `users/${uid}`))
    );


    const collectionData$1 = collectionData(q1, {idField: 'id'});
    const collectionData$2 = collectionData(q2, {idField: 'id'});

    return combineLatest([collectionData$1, collectionData$2]).pipe(
      switchMap(async ([chirps1, chirps2]) => {
          return this.mapChirpsWithCreator([...chirps1, ...chirps2]);
        }
      )
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


  private async mapChirpWithWritersAndReaders(chirp: DocumentData | undefined) {
    const writers = await Promise.all(chirp!['writers'].map(async (writer: DocumentReference) => {
      const path = writer.path;
      const writerDoc = await getDoc(doc(this.fr, path));
      return writerDoc.data() as User;
    }));
    const readers = await Promise.all(chirp!['readers'].map(async (reader: DocumentReference) => {
      const path = reader.path;
      const readerDoc = await getDoc(doc(this.fr, path));
      return readerDoc.data() as User;
    }));
    return {
      ...chirp,
      writers,
      readers
    };
  }

  /*
  const collectionRef = collection(this.fr, 'chirps');
    const q = query(collectionRef,
      where('creator', '==', doc(this.fr, `users/${uid}`)),
      orderBy('createdAt', 'desc')
    );
    const collectionData$ = collectionData(q, {idField: 'id'});
    return collectionData$.pipe(
      switchMap(async (chirps) => {
          return this.mapChirpsWithCreator(chirps);
        }
      ));
  * */
  private mapChirpWithCreator(chirp: DocumentData | undefined): Observable<User> {
    const path = chirp!['creator'].path;
    return docData(doc(this.fr, path));
  }

  private mapCommentWithCreator(comment: DocumentData | undefined): Observable<User> {
    if (comment && comment['creator']) {
      const path = comment['creator'].path;
      return docData(doc(this.fr, path));
    } else {
      return of({} as User);
    }
  }

  private mapChirpWithComments(chirp: DocumentData | undefined): Observable<Comment[]> {
    const commentsRef = chirp!['comments'];
    if (chirp && commentsRef && commentsRef.length > 0) {
      const comments$: Comment[] = commentsRef
        .map((commentRef: DocumentReference) => {
          return docData<Comment>(commentRef).pipe(
            switchMap((comment) => {
              if (!comment) {
                return of({} as Comment);
              }
              return this.mapCommentWithCreator(comment).pipe(
                map((creator) => {
                  return {
                    id: commentRef.id, // add id property to comment
                    ...comment,
                    creator
                  };
                })
              )
            })
          );
        });
      return combineLatest(comments$).pipe(
        map((comments: Comment[]) => {
          return comments.sort((a, b) => b.createdAt!.seconds - a.createdAt!.seconds);
        })
      );
    } else {
      return of([]);
    }

  }

  findChirpById(id: string): Observable<any> {
    const collectionRef = collection(this.fr, 'chirps');
    const docRef = doc(collectionRef, id);
    return docData<Chirp>(docRef).pipe(
      switchMap((chirp) => {
        return combineLatest([
          this.mapChirpWithComments(chirp),
          this.mapReaders(chirp),
          this.mapReaders(chirp),
          this.mapChirpWithCreator(chirp)]).pipe(
          map(([comments, readers, writers, creator]) => {
            console.log('readers', readers);
            console.log('creator', creator)
            return {
              ...chirp,
              comments,
              readers,
              writers,
              creator
            };
          })
        );
      })
    );
  }

  updateChirp(chirp: Chirp) {
    const updatedParams = {
      content: chirp.content,
      imageUrl: chirp.imageUrl,
      updatedAt: serverTimestamp()
    }
    console.log('updatedParams', updatedParams);
    return updateDoc(doc(this.fr, `chirps/${chirp.id}`), updatedParams);
  }

  async deleteChirp(chirp: Chirp, chirpId: string) {
    chirp!.comments!.forEach((comment) => {
      this.deleteComment(comment);
    });
    await deleteDoc(doc(this.fr, `chirps/${chirpId}`));
  }

  private deleteComment(comment: Comment) {
    return deleteDoc(doc(this.fr, `comments/${comment.id}`));
  }

  private mapReaders(chirp: Chirp): Observable<User[]> {
    const readersRef = chirp!['readers'];
    if (chirp && readersRef && readersRef.length > 0) {
      // @ts-ignore
      const readers$: User[] = readersRef
        // @ts-ignore
        .map((readerRef: DocumentReference) => {
          return docData<User>(readerRef);
        });
      return combineLatest(readers$);
    } else {
      console.log('no readers');
      return of([]);
    }
  }

  private mapWriters(chirp: Chirp): Observable<User[]> {
    const writersRef = chirp!['writers'];
    if (chirp && writersRef && writersRef.length > 0) {
      // @ts-ignore
      const writers$: User[] = writersRef
        // @ts-ignore
        .map((writersRef: DocumentReference) => {
          return docData<User>(writersRef);
        });
      return combineLatest(writers$);
    } else {
      console.log('no writers');
      return of([]);
    }
  }

}
