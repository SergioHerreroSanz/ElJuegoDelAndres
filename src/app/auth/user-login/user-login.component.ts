import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
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
  private readonly subscription = new Subscription();

  constructor(
    private readonly firebaseService: EjdaFirebaseService,
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({ nickname: ['', Validators.required] });
  }

  loginWithGoogle() {
    this.subscription.add(
      this.firebaseService
        .loginWithGoogle()
        .pipe(take(1))
        .subscribe(() => {
          this.router.navigate(['scores']);
        })
    );
  }

  registerNewAccount() {
    if (this.registerForm.valid && this.registerForm.value.nickname) {
      this.subscription.add(
        this.firebaseService
          .registerWithGoogle(this.registerForm.value.nickname)
          .pipe(take(1))
          .subscribe(() => {
            this.router.navigate(['scores']);
          })
      );
    }
  }

  toggleAccountRegistration() {
    this.isLogin = !this.isLogin;
  }
}
