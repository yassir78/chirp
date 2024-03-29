import {Chirp} from "./chirp";

export interface User {
  id?: string;
  nom?: String;
  prenom?: String;
  login?: String;
  email?: string;
  password?: String;
  phoneNumber?: String;
  c_password?: String;
  image_profile?: String;
  storeCode?:String;
  username?: String;
  firstname?: String;
  lastname?: String;
  num_tel?: String;
  active?: boolean;
  chirps?: Chirp[];
  token?: String;
  uid?: string;
  notificationToken?: String;
  displayName?: string;
  photoUrl?: string;
  emailVerified?: boolean;
}
