import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { authGuard } from './auth/auth.guard';
import { EjdaUserLoginComponent } from './auth/user-login/user-login.component';
import { EjdaScoreListComponent } from './score-list/score-list.component';

export const routes: Routes = [
  {
    path: 'login',
    component: EjdaUserLoginComponent,
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
