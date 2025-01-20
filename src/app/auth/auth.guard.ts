import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EjdaFirebaseService } from '../shared/firebase/firebase.service';

export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(EjdaFirebaseService);
  const router = inject(Router);

  // TODO: Add persistency
  if (!service.getUserEmail()) {
    router.navigate(['login']);
    return false;
  }
  return true;
};
