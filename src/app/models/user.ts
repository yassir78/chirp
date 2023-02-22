export interface User {
  id?: number;
  nom?: String;
  prenom?: String;
  login?: String;
  email?: String;
  password?: String;
  phoneNumber?: String;
  c_password?: String;
  image_profile?: String;
  storeCode?:String;
  num_tel?: String;
  active?: boolean;
  token?: String;
  uid?: string;
  notificationToken?: String;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
}
