import {Injectable} from "@angular/core";
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import {LoginResponseDto} from "../dtos/LoginResponseDto";
import firebase from "firebase/compat";
import FirebaseError = firebase.FirebaseError;


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private auth: Auth) {
  }

  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(
      this.auth,
      email,
      password);
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const response = new LoginResponseDto();
    try {
      const {user} = await signInWithEmailAndPassword(this.auth, email, password);
      response.user = user;
    } catch (e: any) {
      response.error = e.message;
      response.user = null;
    }
    return response;

  }

  logout() {
    return signOut(this.auth)
  }
}
