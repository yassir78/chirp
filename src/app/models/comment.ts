import {User} from "./user";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;
import {Chirp} from "./chirp";

export interface Comment {
  id?: string;
  comment?: string;
  chirp?: Chirp;
  creator?: User;
  createdAt?: Timestamp;
}
