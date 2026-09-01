import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';

import {
  db
} from '../firebase';


@Component({
  selector: 'app-video',

  imports: [
    RouterLink
  ],

  templateUrl: './video.html',

  styleUrl: './video.scss'
})


export class Video implements OnInit {


  // ==========================================
  // VIDEO INFORMATION
  // ==========================================

  videoTitle =
    'VJM Learning Video';

  videoUrl =
    '';

  course =
    '';

  subject =
    '';

  topic =
    '';


  // ==========================================
  // PAYMENT / VIDEO ACCESS
  // ==========================================

  videoAccess =
    false;

  paymentStatus:
    'Pending' |
    'Paid' |
    'Rejected' =
    'Pending';


  // ==========================================
  // STUDENT INFORMATION
  // ==========================================

  registrationNumber =
    '';

  studentName =
    '';


  // ==========================================
  // LOADING
  // ==========================================

  isCheckingAccess =
    true;

  accessError =
    '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private route: ActivatedRoute
  ) {}


  // ==========================================
  // INITIALIZE
  // ==========================================

  ngOnInit(): void {

    // ------------------------------------------
    // GET VIDEO PARAMETERS
    // ------------------------------------------

    this.route.queryParamMap.subscribe(
      async params => {

        const title =
          params.get('title');

        const video =
          params.get('video');

        const course =
          params.get('course');

        const subject =
          params.get('subject');

        const topic =
          params.get('topic');


        // ------------------------------------------
        // SET VIDEO INFORMATION
        // ------------------------------------------

        if (title) {

          this.videoTitle =
            title;

        }


        if (video) {

          this.videoUrl =
            video;

        }


        if (course) {

          this.course =
            course;

        }


        if (subject) {

          this.subject =
            subject;

        }


        if (topic) {

          this.topic =
            topic;

        }


        // ------------------------------------------
        // CHECK STUDENT ACCESS
        // ------------------------------------------

        await this.checkVideoAccess();

      }
    );

  }


  // ==========================================
  // CHECK VIDEO ACCESS
  // ==========================================

  async checkVideoAccess(): Promise<void> {

    this.isCheckingAccess =
      true;

    this.accessError =
      '';


    try {

      // ------------------------------------------
      // GET REGISTRATION NUMBER
      // ------------------------------------------

      const savedRegistrationNumber =
        localStorage.getItem(
          'vjmRegistrationNumber'
        );


      if (!savedRegistrationNumber) {

        this.videoAccess =
          false;

        this.paymentStatus =
          'Pending';

        this.accessError =
          'Student registration not found. Please register first.';

        return;

      }


      this.registrationNumber =
        savedRegistrationNumber;


      console.log(
        'Checking video access for:',
        this.registrationNumber
      );


      // ------------------------------------------
      // SEARCH FIRESTORE
      // ------------------------------------------

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
            this.registrationNumber
          )
        );


      const snapshot =
        await getDocs(
          studentQuery
        );


      // ------------------------------------------
      // STUDENT NOT FOUND
      // ------------------------------------------

      if (snapshot.empty) {

        this.videoAccess =
          false;

        this.paymentStatus =
          'Pending';

        this.accessError =
          'Student registration could not be found.';

        return;

      }


      // ------------------------------------------
      // GET STUDENT
      // ------------------------------------------

      const studentDoc =
        snapshot.docs[0];

      const studentData =
        studentDoc.data();


      this.studentName =
        studentData['studentName'] ||
        'Student';


      // ------------------------------------------
      // PAYMENT STATUS
      // ------------------------------------------

      const firebasePaymentStatus =
        studentData['paymentStatus'];


      if (
        firebasePaymentStatus ===
        'Paid'
      ) {

        this.paymentStatus =
          'Paid';

      }

      else if (
        firebasePaymentStatus ===
        'Rejected'
      ) {

        this.paymentStatus =
          'Rejected';

      }

      else {

        this.paymentStatus =
          'Pending';

      }


      // ------------------------------------------
      // VIDEO ACCESS
      // ------------------------------------------

      this.videoAccess =
        studentData['videoAccess'] === true;


      console.log(
        'Student:',
        this.studentName
      );

      console.log(
        'Payment Status:',
        this.paymentStatus
      );

      console.log(
        'Video Access:',
        this.videoAccess
      );


      // ------------------------------------------
      // SECURITY CHECK
      // ------------------------------------------

      if (
        this.paymentStatus ===
        'Paid' &&
        this.videoAccess ===
        true
      ) {

        console.log(
          'VIDEO ACCESS GRANTED'
        );

      }

      else {

        console.log(
          'VIDEO ACCESS DENIED'
        );

        // Important:
        // Remove the video URL from the page
        // when access is not granted.

        this.videoUrl =
          '';

      }

    }

    catch (error) {

      console.error(
        'Error checking video access:',
        error
      );


      this.videoAccess =
        false;

      this.paymentStatus =
        'Pending';

      this.videoUrl =
        '';

      this.accessError =
        'Unable to verify video access. Please try again.';

    }

    finally {

      this.isCheckingAccess =
        false;

    }

  }

}