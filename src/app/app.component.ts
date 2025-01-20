import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { EjdaUserLoginComponent } from './auth/user-login/user-login.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {}
}
