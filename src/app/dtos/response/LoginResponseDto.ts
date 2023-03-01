
export class LoginResponseDto {

  private _error: string | undefined;

  constructor() {

  }

  get error(): string {
    return <string>this._error;
  }

  set error(value: string) {
    this._error = value;
  }

}
