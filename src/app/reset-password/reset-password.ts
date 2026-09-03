import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import {
  getAuth,
  sendPasswordResetEmail
} from 'firebase/auth';

import { app } from '../firebase';

@Component({
  selector: 'app-reset-password',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './reset-password.html',

  styleUrl: './reset-password.scss'
})
export class ResetPassword {

  // ==========================================
  // FORM
  // ==========================================

  resetForm: FormGroup;

  // ==========================================
  // STATUS
  // ==========================================

  isSubmitting = false;

  resetSuccess = false;

  errorMessage = '';

  successMessage = '';

  constructor(
    private fb: FormBuilder
  ) {

    this.resetForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]

    });

  }


  // ==========================================
  // SEND PASSWORD RESET EMAIL
  // ==========================================

  async sendResetEmail(): Promise<void> {

    // Clear previous messages

    this.errorMessage = '';

    this.successMessage = '';

    this.resetSuccess = false;


    // ========================================
    // CHECK FORM
    // ========================================

    if (this.resetForm.invalid) {

      this.resetForm.markAllAsTouched();

      return;

    }


    // ========================================
    // PREVENT DOUBLE CLICK
    // ========================================

    if (this.isSubmitting) {

      return;

    }


    this.isSubmitting = true;


    try {

      // ======================================
      // GET EMAIL
      // ======================================

      const email = String(
        this.resetForm.value.email
      )
        .trim()
        .toLowerCase();


      console.log(
        'Sending password reset email to:',
        email
      );


      // ======================================
      // FIREBASE AUTH
      // ======================================

      const auth = getAuth(app);


      // ======================================
      // SEND RESET EMAIL
      // ======================================

      await sendPasswordResetEmail(
        auth,
        email
      );


      // ======================================
      // SUCCESS
      // ======================================

      this.resetSuccess = true;

      this.successMessage =
        'A password reset link has been sent to your registered email address.';


      console.log(
        'Password reset email sent successfully.'
      );


      // Optional: clear form

      this.resetForm.reset();


    } catch (error: any) {

      console.error(
        'Password reset error:',
        error
      );


      // ======================================
      // USER NOT FOUND
      // ======================================

      if (
        error?.code ===
        'auth/user-not-found'
      ) {

        this.errorMessage =
          'No student account was found with this email address. Please use the email used during registration.';

      }


      // ======================================
      // INVALID EMAIL
      // ======================================

      else if (
        error?.code ===
        'auth/invalid-email'
      ) {

        this.errorMessage =
          'Please enter a valid email address.';

      }


      // ======================================
      // TOO MANY REQUESTS
      // ======================================

      else if (
        error?.code ===
        'auth/too-many-requests'
      ) {

        this.errorMessage =
          'Too many reset requests. Please wait for some time and try again.';

      }


      // ======================================
      // NETWORK ERROR
      // ======================================

      else if (
        error?.code ===
        'auth/network-request-failed'
      ) {

        this.errorMessage =
          'Network error. Please check your internet connection and try again.';

      }


      // ======================================
      // OPERATION NOT ALLOWED
      // ======================================

      else if (
        error?.code ===
        'auth/operation-not-allowed'
      ) {

        this.errorMessage =
          'Email/password authentication is not enabled in Firebase.';

      }


      // ======================================
      // OTHER ERROR
      // ======================================

      else {

        this.errorMessage =
          'Unable to send the password reset email. Please check the email address and try again.';

      }

    } finally {

      this.isSubmitting = false;

    }

  }

}