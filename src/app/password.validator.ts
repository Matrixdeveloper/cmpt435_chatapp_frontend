import {AbstractControl } from '@angular/forms'


// this require pass the entire form control to the validator
// not the single control field

export function 
passwordValidator(control: AbstractControl):
{[key:string]:boolean} | null{
  const password = control.get('password');
  const confirmPassword = control.get('confirm');

  if(password.pristine || confirmPassword.pristine){
    return null
  }

  return password && confirmPassword && password.value !== confirmPassword.value ? {'misMatch':true} : null;

}