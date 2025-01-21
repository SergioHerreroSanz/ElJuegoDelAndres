import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { EjdaFirebaseService } from '../shared/firebase/firebase.service';

export const authGuard: CanActivateFn = (route, state) => {
  const service: EjdaFirebaseService = inject(EjdaFirebaseService);
  const router: Router = inject(Router);

  return service.user$.pipe(
    filter((u) => u !== undefined),
    map((user) => {
      const isLoggedIn = !!user?.email;

      !isLoggedIn && router.navigate(['login']);
      return isLoggedIn;
    })
  );
};
