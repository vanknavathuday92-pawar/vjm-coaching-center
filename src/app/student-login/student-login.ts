import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth';

import { app } from '../firebase';


@Component({
  selector: 'app-student-login',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './student-login.html',

  styleUrl: './student-login.scss'
})


export class StudentLogin implements OnInit {


  // =====================================================
  // LOGIN FIELDS
  // =====================================================

  mobile: string = '';

  password: string = '';


  // =====================================================
  // STATUS
  // =====================================================

  isLoading: boolean = false;

  errorMessage: string = '';

  successMessage: string = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private router: Router,
    private ngZone: NgZone
  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    // Always keep fields empty
    // when student login page opens

    this.mobile = '';

    this.password = '';

    this.errorMessage = '';

    this.successMessage = '';

    this.isLoading = false;

  }


  // =====================================================
  // STUDENT LOGIN
  // =====================================================

  async login(): Promise<void> {


    // ===================================================
    // CLEAR PREVIOUS MESSAGES
    // ===================================================

    this.errorMessage = '';

    this.successMessage = '';


    // ===================================================
    // MOBILE VALIDATION
    // ===================================================

    const cleanMobile =
      String(this.mobile || '').trim();


    if (!cleanMobile) {

      this.errorMessage =
        'Please enter your registered mobile number.';

      return;

    }


    // ===================================================
    // VALIDATE INDIAN MOBILE NUMBER
    // ===================================================

    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {

      this.errorMessage =
        'Please enter a valid 10-digit mobile number.';

      return;

    }


    // ===================================================
    // PASSWORD VALIDATION
    // ===================================================

    if (!this.password || this.password.length === 0) {

      this.errorMessage =
        'Please enter your password.';

      return;

    }


    // ===================================================
    // PASSWORD MINIMUM LENGTH
    // ===================================================

    if (this.password.length < 6) {

      this.errorMessage =
        'Password must contain at least 6 characters.';

      return;

    }


    // ===================================================
    // PREVENT DOUBLE LOGIN
    // ===================================================

    if (this.isLoading) {

      return;

    }


    this.isLoading = true;


    try {


      console.log(
        'Student login attempt:',
        cleanMobile
      );


      // =================================================
      // IMPORTANT
      //
      // THIS MUST BE EXACTLY THE SAME EMAIL FORMAT
      // USED IN register.ts
      //
      // register.ts:
      //
      // mobile@vjmstudent.com
      //
      // =================================================

      const studentEmail =
  `${cleanMobile}@vjmstudent.com`;


      console.log(
        'Firebase login email:',
        studentEmail
      );


      // =================================================
      // GET FIREBASE AUTH
      // =================================================

      const auth =
        getAuth(app);


      // =================================================
      // SIGN IN WITH EMAIL + PASSWORD
      // =================================================

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          studentEmail,
          this.password
        );


      // =================================================
      // GET LOGGED-IN USER
      // =================================================

      const user =
        userCredential.user;


      console.log(
        'Student login successful:',
        user.uid
      );


      // =================================================
      // SAVE STUDENT LOGIN STATUS
      // =================================================

      localStorage.setItem(
        'studentLoggedIn',
        'true'
      );


      localStorage.setItem(
        'studentMobile',
        cleanMobile
      );


      localStorage.setItem(
        'studentUid',
        user.uid
      );


      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      this.ngZone.run(() => {

        this.successMessage =
          'Login successful! Redirecting to syllabus...';

        this.errorMessage = '';

        this.isLoading = false;

      });


      // =================================================
      // REDIRECT TO SYLLABUS
      // =================================================

     
setTimeout(() => {

  this.router.navigateByUrl('/payment');

}, 700);


    } catch (error: any) {


      // =================================================
      // LOG FIREBASE ERROR
      // =================================================

      console.error(
        'Student login error:',
        error
      );


      // =================================================
      // HANDLE ERROR
      // =================================================

      this.ngZone.run(() => {


        this.isLoading = false;

        this.successMessage = '';


        // ===============================================
        // WRONG PASSWORD / INVALID CREDENTIAL
        // ===============================================

        if (
          error?.code === 'auth/wrong-password'
        ) {

          this.errorMessage =
            'Wrong password. Please enter the correct password.';

        }


        // ===============================================
        // FIREBASE NEWER VERSION
        //
        // Firebase often returns invalid-credential
        // instead of wrong-password.
        // ===============================================

        else if (
          error?.code === 'auth/invalid-credential'
        ) {

          this.errorMessage =
            'Incorrect mobile number or password. Please check your details and try again.';

        }


        // ===============================================
        // USER NOT FOUND
        // ===============================================

        else if (
          error?.code === 'auth/user-not-found'
        ) {

          this.errorMessage =
            'No student account found with this mobile number. Please register first.';

        }


        // ===============================================
        // INVALID EMAIL
        // ===============================================

        else if (
          error?.code === 'auth/invalid-email'
        ) {

          this.errorMessage =
            'Invalid mobile number. Please check your mobile number.';

        }


        // ===============================================
        // TOO MANY LOGIN ATTEMPTS
        // ===============================================

        else if (
          error?.code === 'auth/too-many-requests'
        ) {

          this.errorMessage =
            'Too many unsuccessful login attempts. Please try again later.';

        }


        // ===============================================
        // ACCOUNT DISABLED
        // ===============================================

        else if (
          error?.code === 'auth/user-disabled'
        ) {

          this.errorMessage =
            'This student account has been disabled. Please contact VJM Coaching Center.';

        }


        // ===============================================
        // NETWORK ERROR
        // ===============================================

        else if (
          error?.code === 'auth/network-request-failed'
        ) {

          this.errorMessage =
            'Network error. Please check your internet connection and try again.';

        }


        // ===============================================
        // OPERATION NOT ALLOWED
        // ===============================================

        else if (
          error?.code === 'auth/operation-not-allowed'
        ) {

          this.errorMessage =
            'Student login is not enabled in Firebase Authentication. Please contact the administrator.';

        }


        // ===============================================
        // DEFAULT ERROR
        // ===============================================

        else {

          this.errorMessage =
            'Unable to login. Please check your mobile number and password.';

        }

      });

    }

  }


  // =====================================================
  // CLEAR ERROR / SUCCESS MESSAGES
  //
  // YOUR HTML USES:
  //
  // (input)="clearMessages()"
  //
  // This method fixes the Angular TS2339 error.
  // =====================================================

  clearMessages(): void {

    this.errorMessage = '';

    this.successMessage = '';

  }


  // =====================================================
  // CLEAR LOGIN FORM
  // =====================================================

  clearForm(): void {

    this.mobile = '';

    this.password = '';

    this.errorMessage = '';

    this.successMessage = '';

  }

}