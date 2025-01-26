import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { EjdaFirebaseAuthService } from '../firebase/firebase-auth.service';

export const notAuthGuard: CanActivateFn = (route, state) => {
  const service: EjdaFirebaseAuthService = inject(EjdaFirebaseAuthService);
  const router: Router = inject(Router);

  return service.isLoggedIn$.pipe(
    filter((li) => li !== null),
    take(1),
    map((isLoggedIn) => {
      if (isLoggedIn === true) router.navigate(['scores']);
      return !isLoggedIn;
    })
  );
};
