import {inject, Injectable} from "@angular/core";
import {AuthState} from "../states/auth.state";
import {AuthService} from "../services/auth.service";
import {combineLatest, map, Observable, of, Subscriber, Subscription, switchMap, take} from "rxjs";
import {Router} from "@angular/router";
import {RegisterRequestDto} from "../dtos/request/RegisterRequestDto";
import {
  Auth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signOut,
} from "@angular/fire/auth";
import {User} from "../models/user";
import {debug, generateFromEmail} from "../helpers/Utils";
import {ToastController} from "@ionic/angular";
import {Firestore} from "@angular/fire/firestore";
import {UserFacade} from "./user.facade";
import {ChirpFacade} from "./chirp.facade";

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private auth = inject(Auth);
  private = inject(Firestore);
  private userFacade = inject(UserFacade);
  private chirpFacade = inject(ChirpFacade);
  private toastController = inject(ToastController);
  subscriber: Subscription;
  googleSubscriber: Subscription | undefined;

  constructor(private authService: AuthService, private authState: AuthState, private router: Router) {
    this.subscriber = new Observable((subscriber) => {
      onAuthStateChanged(this.auth, (user) => {
          subscriber.next(user);
        }
      )
    }).pipe(
      switchMap((user: any) => this.getFireStoreUser(user?.email!).pipe(
        map((fireStoreUser: User) => {
            return {
              ...user,
              ...fireStoreUser
            }
          }
        )
      ))).subscribe(async (user) => {
      combineLatest([this.getIsDoneRegister(), this.getIsDoneLogin()]).subscribe(async ([isDoneRegister, isDoneLogin]) => {
        console.log('ana henna')
        await this.handleUserVerification(user, isDoneRegister, isDoneLogin);
      });
    });

  }

  getFireStoreUser(email: string): Observable<User> {
    if (email === undefined) {
      return of({} as User)
    } else {
      console.log('email: ', email);
      return this.authService.getUserByEmail(email);

    }
  }

  async login(email: string, password: string) {
    await signOut(this.auth);
    this.setIsDoneLogin(false);
    const result = await this.authService.login(email, password);
    this.setIsDoneLogin(true);
    return result;
  }

  getIsDoneLogin(): Observable<Boolean> {
    return this.authState.getisDoneLogin();
  }


  setIsDoneGoogleRegister(value: Boolean) {
    this.authState.isDoneGoogleRegister = value;
  }

  setIsDoneLogin(value: Boolean) {
    this.authState.isDoneLogin = value;
  }

  async register(registerRequest: RegisterRequestDto) {
    this.setIsDoneRegister(false);
    const result = await this.authService.register(registerRequest);
    this.setIsDoneRegister(true);
    return result;
  }

  setCurrentUser(user: User) {
    this.authState.currentUser = user;
  }

  getCurrentUser(): Observable<User> {
    return this.authState.getCurrentUser();
  }


  async handleUserVerification(user: any, isDoneRegister: Boolean, isDoneLogin: Boolean) {
    console.log('logged user: ', user);
    console.log('isDoneRegister: ', isDoneRegister);
    console.log('isDoneLogin: ', isDoneLogin);
    if (!user.email || !isDoneRegister || !isDoneLogin) {
      return;
    }
    const {creationTime, lastSignInTime} = this.auth.currentUser!.metadata;
    const isFirstLogin = Date.parse(creationTime!) === Date.parse(lastSignInTime!);
    const isEmailNotVerified = !this.auth.currentUser!.emailVerified;
    if (isEmailNotVerified) {
      const url = isFirstLogin ? '/auth/welcome' : '/auth/login';
      await this.router.navigate([url]);
      if (!isFirstLogin) {
        await this.handleEmailIsNotVerified(user);
      }
      await signOut(this.auth);
    } else {
      this.setCurrentUser(user);
      await this.router.navigate(['/app/home']);
    }
  }


  getIsDoneRegister(): Observable<Boolean> {
    return this.authState.getisDoneRegister();
  }

  setIsDoneRegister(value: Boolean) {
    this.authState.isDoneRegister = value;
  }

  async logout() {
    //this.subscriber.unsubscribe();
    this.userFacade.unsubscribe();
    this.chirpFacade.unsubscribe();
    if(this.googleSubscriber !== undefined) {
      this.googleSubscriber.unsubscribe();
    }
    await this.authService.logout();
    await this.router.navigate(['/auth/login']);
  }

  async googleLogin(googleUser: any) {
    this.setIsDoneGoogleRegister(false);
    const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
    const {user} = await signInWithCredential(this.auth, credential);
    try {
      await this.authService.isUserExistsByEmail(googleUser.email);
      console.log('%c Auth Facade/GoogleAuth : google user exists by email', 'background: #222; color: #bada55');
    } catch (e: any) {
      debug('Facade/GoogleAuth', 'google user does not exist by email');
      console.log('%c Auth Facade/GoogleAuth : google user does not exist by email', 'background: #222; color: #bada55');
      await this.authService.createNewUser(user.uid, {
        email: googleUser.email ?? '',
        firstname: googleUser.givenName ?? '',
        lastname: googleUser.familyName ?? '',
        photoUrl: googleUser.imageUrl ?? '',
        username: generateFromEmail(googleUser.email ?? '')
      });
      this.setIsDoneGoogleRegister(true);
    }
    this.googleSubscriber = this.getFireStoreUser(user?.email!).pipe(
      map((fireStoreUser: User) => {
          return {
            ...user,
            ...fireStoreUser
          }
        }
      )
    ).subscribe(async (user) => {
      combineLatest([this.getIsDoneRegister().pipe(take(1)), this.getIsDoneLogin().pipe(take(1))]).subscribe(async ([isDoneRegister, isDoneLogin]) => {
        await this.handleUserVerification(user, isDoneRegister, isDoneLogin);
        await this.router.navigate(['/app/home']);
      });
    });
  }

  async handleForgotPassword(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }

  private async handleEmailIsNotVerified(user: any) {
    const toast = await this.toastController.create({
      message: `Your email ${user.email} is not verified`,
      duration: 7000,
      position: 'bottom',
      buttons: [
        {
          text: 'Resend',
          role: 'info',
          handler: async () => {
            await sendEmailVerification(user);
          }
        }
      ]
    });

    await toast.present();
  }


  async updateUser({
                     firstname,
                     lastname,
                     username,
                     email,
                   }: { firstname: any, lastname: any, username: any, email: any }) {
    const user = await this.getCurrentUser().pipe(take(1)).toPromise();
    const id = user!.id;
    return await this.authService.updateUser({firstname, lastname, username, email, id});


  }
}
