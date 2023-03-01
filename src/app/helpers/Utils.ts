import {collection, query, Firestore, where} from '@firebase/firestore';

import {AlertController} from "@ionic/angular";
import {getDocs} from "@angular/fire/firestore";

const PASSWORD_MIN_LENGTH_ERROR = 'Firebase: Password should be at least 6 characters (auth/weak-password).';
const WRONG_PASSWORD_ERROR = 'Firebase: Error (auth/wrong-password).';
const USER_NOT_FOUND_ERROR = 'Firebase: Error (auth/user-not-found).';

export function getErrorMessage(error: string): string {
  const errorMessages = {
    [PASSWORD_MIN_LENGTH_ERROR]: 'Password should be at least 6 characters',
    [WRONG_PASSWORD_ERROR]: 'Wrong password',
    [USER_NOT_FOUND_ERROR]: 'User not found'
  };
  // @ts-ignore
  return errorMessages[error] || error;
}

export function compareStrings(string: string, string2: string): boolean {
  return string === string2;
}

export async function isEntityExistsBy(collectionName: string, param: string, value: string, fr: Firestore) {
  // @ts-ignore
  const foundedUser = await getDocs(collection(fr, collectionName), where(param, '==', value));
  console.log({param, value, foundedUser});
  if (!isEmpty(foundedUser.docs)) {
    throw new Error(`User with ${param} : ${value} already exists`);
  }
}

export async function getDocumentBy(collectionName: string, param: string, value: string, fr: Firestore) {
  const entityRef = collection(fr, collectionName);
  const q = query(entityRef, where(param, "==", value));
  const docSnap = await getDocs(q);
  console.log(docSnap.docs[0])
  console.log(docSnap.docs[0].data());
  return docSnap.docs[0].data();
}

export function isEmpty(array: any[]) {
  return array.length === 0;
}

export function isEmptyObject(object: any) {
  return object !== null && Object.keys(object).length === 0;
}

export async function showAlert(invalidCredentials: string, pleaseCheckYourEmailAndPassword: string, alertCtrl: AlertController) {
  const alert = await alertCtrl.create({
    header: invalidCredentials,
    message: pleaseCheckYourEmailAndPassword,
    buttons: ['OK']
  });
  await alert.present();
}
