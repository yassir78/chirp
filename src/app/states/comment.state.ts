import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommentState {

  private isAddLoading :BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getIsAddLoading(){
    return this.isAddLoading.asObservable();
  }

  setIsAddLoading(isAddLoading: boolean){
    this.isAddLoading.next(isAddLoading);
  }

}
