import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EjdaFirebaseService {
  readonly app: FirebaseApp;

  constructor(private readonly router: Router) {
    this.app = initializeApp(environment.firebaseConfig);
  }
}
