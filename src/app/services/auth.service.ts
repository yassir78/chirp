import {inject, Injectable} from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import {LoginResponseDto} from "../dtos/response/LoginResponseDto";
import {RegisterRequestDto} from "../dtos/request/RegisterRequestDto";
import {RegisterResponseDto} from "../dtos/response/RegisterResponseDto";
import {collectionData, doc, Firestore, setDoc} from "@angular/fire/firestore";
import {createNewDocument, getDocumentBy, isEntityExistsBy, isNotEntityExistsBy} from "../helpers/Utils";
import {collection} from "@firebase/firestore";
import {switchMap, tap} from "rxjs";
import {User} from "../models/user";


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
      await this.createNewUser( uid, registerRequest);
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
    const collectionData$ = collectionData(collectionRef, {idField: 'id'});
    return collectionData$.pipe(
      switchMap((users: User[]) => {
        return users.filter((user: User) => user.email === email);
      })
    )
  }

  private async validate(registerRequest: RegisterRequestDto) {
    await isEntityExistsBy('users', 'username', registerRequest.username, this.fr);
    await isEntityExistsBy('users', 'email', registerRequest.email, this.fr);

  }

  isUserExistsByEmail(email: string) {
    return isNotEntityExistsBy('users', 'email', email, this.fr);
  }

  async createNewUser( id: string, data: any) {
    await createNewDocument('users', id, data, this.fr);
  }


  logout() {
    return signOut(this.auth)
  }


}
