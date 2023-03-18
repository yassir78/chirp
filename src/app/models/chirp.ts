import {User} from "./user";

export interface Chirp {
  id?: string;
  content?: string;
  imageUrl?: string;

  creator?: User;
  createdAt?: Date;
}
