import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { EjdaFirebaseService } from '../../shared/firebase/firebase.service';

@Component({
  selector: 'ejda-user-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss',
})
export class EjdaUserLoginComponent {
  isLogin = true;
  readonly registerForm;
  readonly nicknameControl = new FormControl();

  constructor(
    private readonly firebaseService: EjdaFirebaseService,
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({ nickname: ['', Validators.required] });
  }

  loginWithCredentials() {}

  loginWithGoogle() {
    this.firebaseService
      .loginWithGoogle()
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['scores']);
      });
  }

  registerNewAccount() {
    if (this.nicknameControl.value) {
      this.firebaseService
        .registerWithGoogle(this.nicknameControl.value)
        .pipe(take(1))
        .subscribe(() => {
          this.router.navigate(['scores']);
        });
    }
  }

  toggleAccountRegistration() {
    this.isLogin = !this.isLogin;
  }
}
