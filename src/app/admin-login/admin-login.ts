import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import {
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth';

import { app } from '../firebase';

@Component({
  selector: 'app-admin-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss'
})
export class AdminLogin {

  loginForm: FormGroup;

  isLoggingIn = false;

  errorMessage = '';

  private auth = getAuth(app);


  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        Validators.required
      ]

    });

  }


  async login(): Promise<void> {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }

    this.isLoggingIn = true;

    this.errorMessage = '';


    const email =
      this.loginForm.value.email;

    const password =
      this.loginForm.value.password;


    try {

      await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );


      console.log(
        'Admin login successful'
      );


      await this.router.navigate([
        '/admin-dashboard'
      ]);

} catch (error: any) {

  console.error('Login error:', error);
  console.error('Firebase error code:', error.code);
  console.error('Firebase error message:', error.message);

  this.errorMessage =
    error.message || 'Unable to login. Please try again.';

} finally {

      this.isLoggingIn = false;

    }

  }

}