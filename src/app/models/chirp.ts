import {User} from "./user";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;
import {Comment} from "./comment";

export interface Chirp {
  id?: string;
  content?: string;
  imageUrl?: string;

  creator?: User;
  createdAt?: Timestamp;
  comments?: Comment[];

  readers?: User[];
  writers?: User[];
}
