import {inject, Injectable} from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification, sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut, updateCurrentUser, updateEmail,
  updatePassword
} from '@angular/fire/auth';
import {LoginResponseDto} from "../dtos/response/LoginResponseDto";
import {RegisterRequestDto} from "../dtos/request/RegisterRequestDto";
import {RegisterResponseDto} from "../dtos/response/RegisterResponseDto";
import {collectionData, doc, DocumentReference, Firestore, getDoc, getDocs, updateDoc} from "@angular/fire/firestore";
import {createNewDocument, isEntityExistsBy, isNotEntityExistsBy} from "../helpers/Utils";
import {collection, query, where} from "@angular/fire/firestore";
import {from, switchMap} from "rxjs";
import {User} from "../models/user";
import {Chirp} from "../models/chirp";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fr = inject(Firestore);

  private auth = inject(Auth);

  async register(registerRequest: RegisterRequestDto): Promise<RegisterResponseDto> {
    const response = new RegisterResponseDto();
    try {
      await this.validate(registerRequest);
      const userCredential = await createUserWithEmailAndPassword(this.auth, registerRequest.email, registerRequest.password);
      const uid = userCredential.user?.uid;
      console.log('uid: ', uid)
      await this.createNewUser(uid, {
        ...registerRequest,
      })
      await sendEmailVerification(userCredential.user);
      console.log('mail send successfully to: ', userCredential.user?.email)
      response.user = {
        id: uid,
        ...registerRequest
      }
    } catch (e: any) {
      response.error = e.message;
    }
    return response;
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const response = new LoginResponseDto();
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (e: any) {
      response.error = e.message;
    }
    return response;

  }


  get currentUser() {
    const user = this.auth.currentUser;
    return doc(this.fr, `users/${user!.uid}`);
  }

  getUserByEmail(email: string) {
    const collectionRef = collection(this.fr, 'users');
    const q = query(collectionRef, where('email', '==', email));
    const collectionData$ = collectionData(q, {idField: 'id'});
    return collectionData$.pipe(
      switchMap((users: User[]) => {
        return users.filter((user: User) => user.email === email);
      })
    )
  }

  private mapUser(userWithReferences: any): User {
    const chirps: Chirp[] = [];
    userWithReferences.chirps.forEach(async (chirpRef: DocumentReference) => {
      const path = chirpRef.path;
      const chirpDoc = await getDoc(doc(this.fr, path));
      const chirp = chirpDoc.data() as Chirp;
      chirps.push(chirp);
    });
    return {
      id: userWithReferences.id,
      username: userWithReferences.username,
      email: userWithReferences.email,
      password: userWithReferences.password,
      firstname: userWithReferences.firstname,
      lastname: userWithReferences.lastname,
      photoUrl: userWithReferences.photoUrl,
      chirps: chirps
    }
  }

  private async validate(registerRequest: RegisterRequestDto) {
    await isEntityExistsBy('users', 'username', registerRequest.username, this.fr);
    await isEntityExistsBy('users', 'email', registerRequest.email, this.fr);

  }

  isUserExistsByEmail(email: string) {
    return isNotEntityExistsBy('users', 'email', email, this.fr);
  }

  async createNewUser(id: string, data: any) {
    await createNewDocument('users', id, data, this.fr);
  }


  logout() {
    return signOut(this.auth)
  }


  async updateUser(param: { firstname: any; email: any; lastname: any; username: any, id: any }) {
    console.log('param: ', param)
    const user = this.auth.currentUser;
    await this.updateUserInFirestore(param);
    if (param.email !== user?.email) {
      console.log('email changed: ', param.email)
      await updateEmail(user!, param.email);
      await sendPasswordResetEmail(this.auth, param.email)
    }
    await updateEmail(user!, param.email)
  }

  private async updateUserInFirestore(param: { firstname: any; email: any; lastname: any; username: any, id: any }) {
    const userRef = doc(this.fr, `users/${param.id}`);
    await updateDoc(userRef, {
      firstname: param.firstname,
      lastname: param.lastname,
      username: param.username,
      email: param.email,
    });

  }
}
