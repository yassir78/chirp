import {inject, Injectable} from '@angular/core';
import {collection, collectionData, Firestore} from "@angular/fire/firestore";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TweetsService {

  private fr = inject(Firestore);

  constructor() {
  }

  getAll():Observable<any[]> {
    const collectionRef = collection(this.fr, 'tweets');
    return collectionData(collectionRef, {idField: 'id'})
  }
}
