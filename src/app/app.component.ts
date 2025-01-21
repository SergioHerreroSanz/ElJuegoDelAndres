import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { EjdaUserLoginComponent } from './auth/user-login/user-login.component';
import { EjdaUserLogoutComponent } from './auth/user-logout/user-logout.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, EjdaUserLogoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {}
}
