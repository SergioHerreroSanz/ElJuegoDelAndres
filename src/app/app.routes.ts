import { Routes } from '@angular/router';

import { EjdaUserLoginComponent } from './components/auth/user-login/user-login.component';
import { EjdaScoreListComponent } from './components/score-list/score-list.component';
import { authGuard } from './shared/guards/auth.guard';
import { notAuthGuard } from './shared/guards/not-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: EjdaUserLoginComponent,
    canActivate: [notAuthGuard],
  },
  {
    path: 'scores',
    component: EjdaScoreListComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'scores',
    pathMatch: 'full',
  },
];
