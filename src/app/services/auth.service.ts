import {inject, Injectable} from "@angular/core";
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import {LoginResponseDto} from "../dtos/response/LoginResponseDto";
import {RegisterRequestDto} from "../dtos/request/RegisterRequestDto";
import {RegisterResponseDto} from "../dtos/response/RegisterResponseDto";
import {doc, Firestore, setDoc} from "@angular/fire/firestore";
import {getDocumentBy, isEntityExistsBy} from "../helpers/Utils";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fr = inject(Firestore);

  private auth = inject(Auth);

  async register(registerRequest: RegisterRequestDto): Promise<RegisterResponseDto> {
    const response = new RegisterResponseDto();
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, registerRequest.email, registerRequest.password);
      await this.validate(registerRequest);
      const uid = userCredential.user?.uid;
      console.log('register request ');
      console.log(registerRequest)
      await this.createNewDocument('users', uid, registerRequest);
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
    console.log(user)
    const userDocRef = doc(this.fr, `users/${user!.uid}`);
    console.log(userDocRef)
    return userDocRef;
  }


  private async validate(registerRequest: RegisterRequestDto) {
    await isEntityExistsBy('users', 'username', registerRequest.username, this.fr);
    await isEntityExistsBy('users', 'email', registerRequest.email, this.fr);

  }

  private async createNewDocument(collection: string, id: string, data: any) {
    return setDoc(doc(this.fr, collection, id), data);
  }


  logout() {
    return signOut(this.auth)
  }

  async getFireStoreUser(email: string) {
    return await getDocumentBy('users', 'email', email, this.fr)
  }
}
