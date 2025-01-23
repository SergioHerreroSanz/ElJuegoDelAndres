import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { EjdaFirebaseService } from '../shared/firebase/firebase.service';
import { EjdaFirebaseAuthService } from '../shared/firebase/firebase-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const service: EjdaFirebaseAuthService = inject(EjdaFirebaseAuthService);
  const router: Router = inject(Router);

  return service.isLogedIn$.pipe(
    filter((u) => u !== null),
    map((isLoggedIn) => {
      if (isLoggedIn == false) router.navigate(['login']);
      return isLoggedIn;
    })
  );
};
