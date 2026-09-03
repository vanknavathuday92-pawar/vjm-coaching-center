import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { getAuth } from 'firebase/auth';

import {
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';

import { app, db } from './firebase';


export const studentVideoGuard = async () => {

  const router = inject(Router);

  const auth = getAuth(app);


  // =====================================================
  // CHECK FIREBASE LOGIN
  // =====================================================

  if (!auth.currentUser) {

    return router.createUrlTree([
      '/student-login'
    ]);

  }


  // =====================================================
  // GET SAVED REGISTRATION NUMBER
  // =====================================================

  const registrationNumber =
    localStorage.getItem(
      'vjmRegistrationNumber'
    );


  // =====================================================
  // REGISTRATION NUMBER NOT FOUND
  // =====================================================

  if (!registrationNumber) {

    return router.createUrlTree([
      '/student-login'
    ]);

  }


  console.log(
    'Student video guard:',
    registrationNumber
  );


  try {

    // =====================================================
    // FIND STUDENT IN FIRESTORE
    // =====================================================

    const studentsRef =
      collection(
        db,
        'students'
      );


    const studentQuery =
      query(
        studentsRef,
        where(
          'registrationNumber',
          '==',
          registrationNumber
        )
      );


    const snapshot =
      await getDocs(
        studentQuery
      );


    // =====================================================
    // STUDENT NOT FOUND
    // =====================================================

    if (snapshot.empty) {

      console.log(
        'Student not found'
      );

      return router.createUrlTree([
        '/student-login'
      ]);

    }


    // =====================================================
    // STUDENT EXISTS
    // =====================================================

    console.log(
      'Student login verified'
    );


    /*
     IMPORTANT:

     We DO NOT check payment here.

     Even if payment is pending,
     the student should be allowed to enter
     the video page.

     video.ts will decide whether to:

     1. Show the video
     OR
     2. Show the payment box
    */


    return true;


  }

  catch (error) {

    console.error(
      'Student video guard error:',
      error
    );


    return router.createUrlTree([
      '/student-login'
    ]);

  }

};