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
import { EjdaFirebaseAuthService } from '../../shared/firebase/firebase-auth.service';

@Component({
  selector: 'ejda-user-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss',
})
export class EjdaUserLoginComponent {
  isLogin = true;
  readonly loginForm;
  readonly registerForm;
  readonly nicknameControl = new FormControl('', Validators.required);

  constructor(
    private readonly firebaseAuthService: EjdaFirebaseAuthService,
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.registerForm = this.fb.group({
      nickname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginWithCredentials() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.firebaseAuthService
        .loginWithEmail(email!, password!)
        .pipe(take(1))
        .subscribe(() => {
          this.router.navigate(['scores']);
        });
    }
  }

  loginWithGoogle() {
    this.firebaseAuthService
      .loginWithGoogle()
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['scores']);
      });
  }

  registerWithEmail() {
    console.log('registerWithCredentials', this.registerForm.value);

    if (this.registerForm.valid) {
      const { email, password, nickname } = this.registerForm.value;
      this.firebaseAuthService
        .registerWithEmail(email!, password!, nickname!)
        .pipe(take(1))
        .subscribe(() => {
          this.router.navigate(['scores']);
        });
    }
  }

  registerWithGoogle() {
    if (this.nicknameControl.valid) {
      this.firebaseAuthService
        .registerWithGoogle(this.nicknameControl.value!)
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
