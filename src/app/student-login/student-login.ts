import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

import { app } from '../firebase';


@Component({
  selector: 'app-student-login',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './student-login.html',

  styleUrl: './student-login.scss'
})


export class StudentLogin {

  // =====================================================
  // LOGIN FORM
  // =====================================================

  loginForm: FormGroup;


  // =====================================================
  // STATUS
  // =====================================================

  isSubmitting = false;

  loginSuccess = false;

  errorMessage = '';

  successMessage = '';


  // =====================================================
  // PASSWORD VISIBILITY
  // =====================================================

  showPassword = false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {

    this.loginForm = this.fb.group({

      // -------------------------------------------------
      // EMAIL
      // -------------------------------------------------

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      // -------------------------------------------------
      // PASSWORD
      // -------------------------------------------------

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });

  }


  // =====================================================
  // TOGGLE PASSWORD
  // =====================================================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }


  // =====================================================
  // CLEAR MESSAGES
  // =====================================================

  clearMessages(): void {

    this.errorMessage = '';

    this.successMessage = '';

    this.loginSuccess = false;

  }


  // =====================================================
  // STUDENT LOGIN
  // =====================================================

  async login(): Promise<void> {

    // ---------------------------------------------------
    // CLEAR PREVIOUS MESSAGES
    // ---------------------------------------------------

    this.clearMessages();


    // ---------------------------------------------------
    // VALIDATE FORM
    // ---------------------------------------------------

    if (
      this.loginForm.invalid
    ) {

      this.loginForm.markAllAsTouched();

      return;

    }


    // ---------------------------------------------------
    // PREVENT DOUBLE CLICK
    // ---------------------------------------------------

    if (
      this.isSubmitting
    ) {

      return;

    }


    this.isSubmitting = true;


    try {

      // =================================================
      // GET FORM VALUES
      // =================================================

      const email =
        String(
          this.loginForm.value.email
        )
          .trim()
          .toLowerCase();


      const password =
        String(
          this.loginForm.value.password
        );


      console.log(
        'Student login started:',
        email
      );


      // =================================================
      // GET FIREBASE AUTH
      // =================================================

      const auth =
        getAuth(app);


      // =================================================
      // FIREBASE LOGIN
      // =================================================

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );


      const user =
        userCredential.user;


      console.log(
        'Student login successful:',
        user.uid
      );


      // =================================================
      // SAVE LOGIN INFORMATION
      // =================================================

      localStorage.setItem(
        'studentLoggedIn',
        'true'
      );


      localStorage.setItem(
        'studentUid',
        user.uid
      );


      localStorage.setItem(
        'studentEmail',
        user.email || email
      );


      // =================================================
      // SUCCESS
      // =================================================

      this.loginSuccess = true;

      this.successMessage =
        'Login successful. Redirecting to payment...';


      console.log(
        'Redirecting student to payment page...'
      );


      // =================================================
      // GO TO PAYMENT PAGE
      // =================================================

      await this.router.navigate(
        ['/payment']
      );


    }

    catch (error: any) {

      console.error(
        'Student login error:',
        error
      );


      // =================================================
      // INVALID EMAIL
      // =================================================

      if (
        error?.code ===
        'auth/invalid-email'
      ) {

        this.errorMessage =
          'Please enter a valid email address.';

      }


      // =================================================
      // INVALID CREDENTIALS
      // =================================================

      else if (
        error?.code ===
        'auth/invalid-credential'
      ) {

        this.errorMessage =
          'Incorrect email or password. Please try again.';

      }


      // =================================================
      // WRONG PASSWORD
      // =================================================

      else if (
        error?.code ===
        'auth/wrong-password'
      ) {

        this.errorMessage =
          'Incorrect password. Please try again.';

      }


      // =================================================
      // USER NOT FOUND
      // =================================================

      else if (
        error?.code ===
        'auth/user-not-found'
      ) {

        this.errorMessage =
          'No student account was found with this email address.';

      }


      // =================================================
      // USER DISABLED
      // =================================================

      else if (
        error?.code ===
        'auth/user-disabled'
      ) {

        this.errorMessage =
          'This student account has been disabled. Please contact VJM Coaching Center.';

      }


      // =================================================
      // TOO MANY REQUESTS
      // =================================================

      else if (
        error?.code ===
        'auth/too-many-requests'
      ) {

        this.errorMessage =
          'Too many login attempts. Please wait and try again later.';

      }


      // =================================================
      // NETWORK ERROR
      // =================================================

      else if (
        error?.code ===
        'auth/network-request-failed'
      ) {

        this.errorMessage =
          'Network error. Please check your internet connection.';

      }


      // =================================================
      // GENERAL ERROR
      // =================================================

      else {

        this.errorMessage =
          'Unable to login. Please check your email and password and try again.';

      }


      // ---------------------------------------------------
      // REMOVE LOGIN STATE IF LOGIN FAILED
      // ---------------------------------------------------

      localStorage.removeItem(
        'studentLoggedIn'
      );

      localStorage.removeItem(
        'studentUid'
      );

      localStorage.removeItem(
        'studentEmail'
      );

    }

    finally {

      // =================================================
      // VERY IMPORTANT
      // =================================================
      //
      // This guarantees that the button does not remain
      // stuck on "Logging in..."
      //
      // =================================================

      this.isSubmitting = false;

    }

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  async logout(): Promise<void> {

    try {

      const auth =
        getAuth(app);


      await signOut(auth);


      localStorage.removeItem(
        'studentLoggedIn'
      );

      localStorage.removeItem(
        'studentUid'
      );

      localStorage.removeItem(
        'studentEmail'
      );


      await this.router.navigate(
        ['/student-login']
      );

    }

    catch (error) {

      console.error(
        'Logout error:',
        error
      );

    }

  }

}