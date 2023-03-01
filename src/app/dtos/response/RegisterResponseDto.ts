import {User} from "../../models/user";

export class RegisterResponseDto {
  private _error: string | undefined;
  private _user: User = {} as User;

  get error(): string {
    return <string>this._error;
  }

  set error(value: string | undefined) {
    this._error = value;
  }

  get user(): User  {
    return this._user;
  }

  set user(value: User ) {
    this._user = value;
  }

}
