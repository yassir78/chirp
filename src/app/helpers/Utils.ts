import {AbstractControl} from "@angular/forms";

export class Utils {

  private static readonly PASSWORD_MIN_LENGTH_ERROR = 'Firebase: Password should be at least 6 characters (auth/weak-password).';
  private static readonly WRONG_PASSWORD_ERROR = 'Firebase: Error (auth/wrong-password).';
  private static readonly USER_NOT_FOUND_ERROR = 'Firebase: Error (auth/user-not-found).';
  static getErrorMessage(error: string): string {
    const errorMessages = {
      [Utils.PASSWORD_MIN_LENGTH_ERROR]: 'Password should be at least 6 characters',
      [Utils.WRONG_PASSWORD_ERROR]: 'Wrong password',
      [Utils.USER_NOT_FOUND_ERROR]: 'User not found'
    }
    // @ts-ignore
    return errorMessages[error] || error;

  }

  static stringTypeCheck(control: any): boolean{
    return typeof control.value === 'string';
  }
}
