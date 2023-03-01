import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {compareStrings} from "../Utils";

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = control.get('password')!;
    const confirmPasswordControl = control.get('confirmPassword')!;
    if (!compareStrings(passwordControl.value, confirmPasswordControl.value)) {
      confirmPasswordControl.setErrors({passwordMismatch: true});
      return {passwordMismatch: true};
    } else {
      confirmPasswordControl.setErrors(null);
      return null;
    }
  };
}
