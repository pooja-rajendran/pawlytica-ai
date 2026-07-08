import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const token =
  localStorage.getItem('token');

  if(token){

    return true;

  }

  return false;

};
