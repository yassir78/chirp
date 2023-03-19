import {inject, Injectable} from '@angular/core';
import {collectionData, Firestore, orderBy, query} from "@angular/fire/firestore";
import {collection} from "@firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private fr = inject(Firestore);

  findAllUsers() {
    const collectionRef = collection(this.fr, 'users');
    const q = query(collectionRef,orderBy('firstname', 'asc'));
    return collectionData(q, {idField: 'id'});
  }

}
