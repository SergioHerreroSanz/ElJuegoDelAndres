import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, Subscription, take } from 'rxjs';
import { EjdaFirebaseService } from '../../shared/firebase/firebase.service';

@Component({
  selector: 'ejda-user-logout',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-logout.component.html',
  styleUrl: './user-logout.component.scss',
})
export class EjdaUserLogoutComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(private readonly firebaseService: EjdaFirebaseService) {
    this.isLoggedIn$ = this.firebaseService.user$.pipe(
      map((user) => !!user?.email)
    );
  }

  logout() {
    this.firebaseService.logout();
  }
}
