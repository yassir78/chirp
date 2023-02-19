import {User} from "../models/user";

export class LoginResponseDto {

  private _user: any | undefined;
  private _error: string | undefined;


  constructor() {

  }

  get user(): any {
    return this._user;
  }

  set user(value: any) {
    this._user = value;
  }

  get error(): string {
    return <string>this._error;
  }

  set error(value: string) {
    this._error = value;
  }

}
