import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { map, Observable } from 'rxjs';
import { EjdaFirebaseAuthService } from '../../../shared/services/firebase/firebase-auth.service';

@Component({
  selector: 'ejda-user-logout',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslocoPipe],
  templateUrl: './user-logout.component.html',
  styleUrl: './user-logout.component.scss',
})
export class EjdaUserLogoutComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(private readonly firebaseAuthService: EjdaFirebaseAuthService) {
    this.isLoggedIn$ = this.firebaseAuthService.user$.pipe(
      map((user) => !!user?.email)
    );
  }

  logout() {
    this.firebaseAuthService.logout();
  }
}
