import {collection, query, Firestore, where} from '@firebase/firestore';

import {AlertController} from "@ionic/angular";
import {addDoc, doc, getDocs, setDoc, updateDoc} from "@angular/fire/firestore";

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

export function debug(module:string,message:string){
  console.log(`'%c Auth ${module} : ${message}`,'background: #222; color: #bada55');
}
export function compareStrings(string: string, string2: string): boolean {
  return string === string2;
}
export async function createNewDocument(collection: string, id: string , data: any,fr:Firestore) {
  return setDoc(doc(fr, collection, id), data);
}

export async function createNewDocumentWithoutId(collectionName: string, data: any,fr:Firestore) {
  return addDoc(collection(fr, collectionName), data);
}

export async function updateDocument(collectionName: string, id: string, data: any,fr:Firestore) {
  const docRef = doc(fr, collectionName, String(id));
  return updateDoc(docRef, data);
}
export async function isEntityExistsBy(collectionName: string, param: string, value: string, fr: Firestore) {
  const entityRef = collection(fr, collectionName);
  const q = query(entityRef, where(param, "==", value));
  const docSnap = await getDocs(q);
  if (!isEmpty(docSnap.docs)) {
    throw new Error(`User with ${param} : ${value} already exists`);
  }
}

export async function isNotEntityExistsBy(collectionName: string, param: string, value: string, fr: Firestore) {
  const entityRef = collection(fr, collectionName);
  const q = query(entityRef, where(param, "==", value));
  const docSnap = await getDocs(q);
  if (isEmpty(docSnap.docs)) {
    throw new Error(`User with ${param} : ${value} not exists`);
  }
}

export async function getDocumentBy(collectionName: string, param: string, value: string, fr: Firestore) {
  const entityRef = collection(fr, collectionName);
  const q = query(entityRef, where(param, "==", value));
  const docSnap = await getDocs(q);
  return docSnap.docs[0].data();
}

export function isEmpty(array: any[]) {
  return array.length === 0;
}

export function isEmptyObject(object: any) {
  return object !== null && Object.keys(object).length === 0;
}

export function generateFromEmail(email: string) {
  return email.split('@')[0];
}
export async function showAlert(invalidCredentials: string, pleaseCheckYourEmailAndPassword: string, alertCtrl: AlertController) {
  const alert = await alertCtrl.create({
    header: invalidCredentials,
    message: pleaseCheckYourEmailAndPassword,
    buttons: ['OK']
  });
  await alert.present();
}
