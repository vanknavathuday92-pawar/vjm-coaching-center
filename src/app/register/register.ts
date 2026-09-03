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
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser
} from 'firebase/auth';

import { db, app } from '../firebase';

import jsPDF from 'jspdf';


@Component({
  selector: 'app-register',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './register.html',

  styleUrl: './register.scss'
})


export class Register {

  // =====================================================
  // REGISTRATION FORM
  // =====================================================

  registrationForm: FormGroup;


  // =====================================================
  // SUBMISSION STATUS
  // =====================================================

  isSubmitting = false;

  registrationSuccess = false;


  // =====================================================
  // PASSWORD VISIBILITY
  // =====================================================

  showPassword = false;


  // =====================================================
  // REGISTRATION NUMBER
  // =====================================================

  registrationNumber = '';


  // =====================================================
  // DATA FOR PDF
  // =====================================================

  studentDataForPdf: any = null;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private fb: FormBuilder
  ) {

    this.registrationForm = this.fb.group({

      // =================================================
      // STUDENT DETAILS
      // =================================================

      studentName: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      dateOfBirth: [
        '',
        Validators.required
      ],

      gender: [
        '',
        Validators.required
      ],

      class: [
        '',
        Validators.required
      ],

      schoolName: [
        ''
      ],


      // =================================================
      // COURSE
      // =================================================

      course: [
        '',
        Validators.required
      ],


      // =================================================
      // PARENT DETAILS
      // =================================================

      parentName: [
        '',
        Validators.required
      ],

      relationship: [
        '',
        Validators.required
      ],


      // =================================================
      // CONTACT DETAILS
      // =================================================

      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9]\d{9}$/)
        ]
      ],

      whatsapp: [
        '',
        [
          Validators.pattern(/^[6-9]\d{9}$/)
        ]
      ],

      // =================================================
      // EMAIL
      // EMAIL IS NOW COMPULSORY
      // =================================================

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],


      // =================================================
      // PASSWORD
      // =================================================

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],


      // =================================================
      // ADDRESS
      // =================================================

      address: [
        '',
        Validators.required
      ],

      village: [
        '',
        Validators.required
      ],

      district: [
        '',
        Validators.required
      ],


      // =================================================
      // ADDITIONAL INFORMATION
      // =================================================

      performance: [
        ''
      ],

      reference: [
        ''
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
  // SUBMIT REGISTRATION
  // =====================================================

  async submitForm(): Promise<void> {

    // ---------------------------------------------------
    // RESET SUCCESS MESSAGE
    // ---------------------------------------------------

    this.registrationSuccess = false;


    // ---------------------------------------------------
    // CLEAR OLD PDF DATA
    // ---------------------------------------------------

    this.studentDataForPdf = null;


    // ---------------------------------------------------
    // VALIDATE FORM
    // ---------------------------------------------------

    if (
      this.registrationForm.invalid
    ) {

      this.registrationForm.markAllAsTouched();

      return;

    }


    // ---------------------------------------------------
    // PREVENT DOUBLE SUBMISSION
    // ---------------------------------------------------

    if (
      this.isSubmitting
    ) {

      return;

    }


    this.isSubmitting = true;


    let firebaseUser: any = null;


    try {

      // =================================================
      // GET FORM DATA
      // =================================================

      const formData =
        this.registrationForm.value;


      // =================================================
      // CLEAN MOBILE NUMBER
      // =================================================

      const mobile =
        String(
          formData.mobile
        )
          .trim();


      // =================================================
      // CLEAN EMAIL
      // =================================================

      const email =
        String(
          formData.email
        )
          .trim()
          .toLowerCase();


      // =================================================
      // GET PASSWORD
      // =================================================

      const password =
        String(
          formData.password
        );


      // =================================================
      // EMAIL VALIDATION
      // =================================================

      if (!email) {

        alert(
          'Email address is required.'
        );

        this.isSubmitting = false;

        return;

      }


      // =================================================
      // PASSWORD VALIDATION
      // =================================================

      if (
        !password ||
        password.length < 6
      ) {

        alert(
          'Password must contain at least 6 characters.'
        );

        this.isSubmitting = false;

        return;

      }


      // =================================================
      // EMAIL FORMAT VALIDATION
      // =================================================

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (
        !emailPattern.test(email)
      ) {

        alert(
          'Please enter a valid email address.'
        );

        this.isSubmitting = false;

        return;

      }


      console.log(
        'Creating Firebase student account with:',
        email
      );


      // =================================================
      // FIREBASE AUTH
      // =================================================

      const auth =
        getAuth(app);


      // =================================================
      // CREATE STUDENT AUTH ACCOUNT
      //
      // IMPORTANT:
      //
      // Firebase now uses the REAL STUDENT EMAIL.
      //
      // Example:
      //
      // udaypawar160521@gmail.com
      //
      // NOT:
      //
      // 7893029517@vjmstudent.com
      // =================================================

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );


      firebaseUser =
        userCredential.user;


      console.log(
        'Student Firebase account created:',
        firebaseUser.uid
      );


      // =================================================
      // UPDATE FIREBASE DISPLAY NAME
      // =================================================

      try {

        await updateProfile(
          firebaseUser,
          {
            displayName:
              formData.studentName
          }
        );

      } catch (profileError) {

        console.warn(
          'Unable to update Firebase profile:',
          profileError
        );

      }


      // =================================================
      // GENERATE REGISTRATION NUMBER
      // =================================================

      this.registrationNumber =
        'VJM-2026-' +
        Date.now()
          .toString()
          .slice(-6) +
        Math.random()
          .toString(36)
          .substring(2, 5)
          .toUpperCase();


      // =================================================
      // SAVE REGISTRATION NUMBER LOCALLY
      // =================================================

      localStorage.setItem(
        'vjmRegistrationNumber',
        this.registrationNumber
      );


      // =================================================
      // STUDENT DATA FOR FIRESTORE
      // =================================================

      const studentData = {

        // -------------------------------------------------
        // FIREBASE AUTH INFORMATION
        // -------------------------------------------------

        uid:
          firebaseUser.uid,

        // Real email used for Firebase login

        loginEmail:
          email,


        // -------------------------------------------------
        // REGISTRATION INFORMATION
        // -------------------------------------------------

        registrationNumber:
          this.registrationNumber,

        registrationStatus:
          'Pending',


        // -------------------------------------------------
        // PAYMENT INFORMATION
        // -------------------------------------------------

        paymentStatus:
          'Pending',

        courseFee:
          6000,

        paymentId:
          '',

        paymentDate:
          null,


        // -------------------------------------------------
        // VIDEO ACCESS
        // -------------------------------------------------

        /*
          New students cannot access
          online coaching videos until
          payment/admin verification is completed.
        */

        videoAccess:
          false,


        // -------------------------------------------------
        // STUDENT DETAILS
        // -------------------------------------------------

        studentName:
          formData.studentName,

        dateOfBirth:
          formData.dateOfBirth,

        gender:
          formData.gender,

        class:
          formData.class,

        schoolName:
          formData.schoolName || '',


        // -------------------------------------------------
        // COURSE
        // -------------------------------------------------

        course:
          formData.course,


        // -------------------------------------------------
        // PARENT DETAILS
        // -------------------------------------------------

        parentName:
          formData.parentName,

        relationship:
          formData.relationship,


        // -------------------------------------------------
        // CONTACT DETAILS
        // -------------------------------------------------

        mobile:
          mobile,

        whatsapp:
          formData.whatsapp || '',

        // Real student email

        email:
          email,


        // -------------------------------------------------
        // ADDRESS
        // -------------------------------------------------

        address:
          formData.address,

        village:
          formData.village,

        district:
          formData.district,


        // -------------------------------------------------
        // ADDITIONAL INFORMATION
        // -------------------------------------------------

        performance:
          formData.performance || '',

        reference:
          formData.reference || '',


        // -------------------------------------------------
        // CREATED DATE
        // -------------------------------------------------

        createdAt:
          serverTimestamp()

      };


      /*
        IMPORTANT:

        PASSWORD IS NOT SAVED IN FIRESTORE.

        Firebase Authentication securely manages
        the password.
      */


      console.log(
        'Saving student information to Firestore:',
        studentData
      );


      // =================================================
      // SAVE STUDENT TO FIRESTORE
      // =================================================

      const docRef =
        await addDoc(
          collection(
            db,
            'students'
          ),
          studentData
        );


      console.log(
        'Student registration saved successfully.'
      );


      console.log(
        'Firestore Document ID:',
        docRef.id
      );


      // =================================================
      // STORE DATA FOR PDF
      // =================================================

      this.studentDataForPdf = {

        ...studentData,

        firebaseId:
          docRef.id

      };


      // =================================================
      // SHOW SUCCESS SCREEN
      // =================================================

      this.registrationSuccess =
        true;


      // =================================================
      // RESET FORM
      // =================================================

      this.registrationForm.reset();


      // =================================================
      // RESET PASSWORD VISIBILITY
      // =================================================

      this.showPassword = false;


    } catch (error: any) {

      console.error(
        'Registration Error:',
        error
      );


      // =================================================
      // EMAIL ALREADY REGISTERED
      // =================================================

      if (
        error?.code ===
        'auth/email-already-in-use'
      ) {

        alert(
          'This email address is already registered. Please use Student Login or Forgot Password.'
        );

      }


      // =================================================
      // INVALID EMAIL
      // =================================================

      else if (
        error?.code ===
        'auth/invalid-email'
      ) {

        alert(
          'Please enter a valid email address.'
        );

      }


      // =================================================
      // WEAK PASSWORD
      // =================================================

      else if (
        error?.code ===
        'auth/weak-password'
      ) {

        alert(
          'Password is too weak. Please use at least 6 characters.'
        );

      }


      // =================================================
      // NETWORK ERROR
      // =================================================

      else if (
        error?.code ===
        'auth/network-request-failed'
      ) {

        alert(
          'Network error. Please check your internet connection and try again.'
        );

      }


      // =================================================
      // OPERATION NOT ALLOWED
      // =================================================

      else if (
        error?.code ===
        'auth/operation-not-allowed'
      ) {

        alert(
          'Email/password authentication is not enabled in Firebase.'
        );

      }


      // =================================================
      // FIREBASE TOO MANY REQUESTS
      // =================================================

      else if (
        error?.code ===
        'auth/too-many-requests'
      ) {

        alert(
          'Too many requests. Please wait and try again later.'
        );

      }


      // =================================================
      // OTHER ERROR
      // =================================================

      else {

        /*
          If Firebase Authentication succeeded
          but Firestore failed, remove the newly
          created Firebase account.

          This prevents an incomplete registration.
        */

        if (
          firebaseUser
        ) {

          try {

            await deleteUser(
              firebaseUser
            );

            console.log(
              'Incomplete Firebase account removed.'
            );

          } catch (deleteError) {

            console.warn(
              'Unable to remove incomplete Firebase account:',
              deleteError
            );

          }

        }


        alert(
          'Unable to complete registration. Please try again.'
        );

      }


    } finally {

      this.isSubmitting =
        false;

    }

  }


  // =====================================================
  // DOWNLOAD REGISTRATION PDF
  // =====================================================

  downloadRegistrationPdf(): void {

    if (
      !this.studentDataForPdf
    ) {

      alert(
        'Registration details are not available.'
      );

      return;

    }


    this.generateRegistrationPDF(

      this.studentDataForPdf,

      this.registrationNumber

    );

  }


  // =====================================================
  // GENERATE REGISTRATION PDF
  // =====================================================

  generateRegistrationPDF(
    formData: any,
    registrationNumber: string
  ): void {

    const pdf =
      new jsPDF();


    // =================================================
    // PAGE SETTINGS
    // =================================================

    const pageWidth =
      pdf.internal.pageSize.getWidth();

    const pageHeight =
      pdf.internal.pageSize.getHeight();

    let y = 20;


    // =================================================
    // HEADER
    // =================================================

    pdf.setFont(
      'helvetica',
      'bold'
    );

    pdf.setFontSize(
      20
    );


    pdf.text(
      'VJM COACHING CENTER',
      pageWidth / 2,
      y,
      {
        align: 'center'
      }
    );


    y += 9;


    pdf.setFont(
      'helvetica',
      'normal'
    );

    pdf.setFontSize(
      11
    );


    pdf.text(
      'Student Registration Form',
      pageWidth / 2,
      y,
      {
        align: 'center'
      }
    );


    y += 10;


    // =================================================
    // LINE
    // =================================================

    pdf.line(
      15,
      y,
      pageWidth - 15,
      y
    );


    y += 12;


    // =================================================
    // REGISTRATION NUMBER
    // =================================================

    pdf.setFont(
      'helvetica',
      'bold'
    );

    pdf.setFontSize(
      13
    );


    pdf.text(
      `Registration No: ${registrationNumber}`,
      15,
      y
    );


    y += 12;


    // =================================================
    // STUDENT DETAILS
    // =================================================

    y =
      this.addPDFSectionTitle(
        pdf,
        'STUDENT DETAILS',
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Student Name',
        formData.studentName,
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Date of Birth',
        formData.dateOfBirth,
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Gender',
        formData.gender,
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Class',
        formData.class,
        y
      );


    y =
      this.addPDFField(
        pdf,
        'School Name',
        formData.schoolName || '-',
        y
      );


    // =================================================
    // COURSE
    // =================================================

    y += 5;


    y =
      this.addPDFSectionTitle(
        pdf,
        'COURSE DETAILS',
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Selected Course',
        formData.course,
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Course Fee',
        'INR 6,000',
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Payment Status',
        formData.paymentStatus || 'Pending',
        y
      );


    // =================================================
    // PARENT DETAILS
    // =================================================

    y += 5;


    y =
      this.addPDFSectionTitle(
        pdf,
        'PARENT / GUARDIAN DETAILS',
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Parent / Guardian Name',
        formData.parentName,
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Relationship',
        formData.relationship,
        y
      );


    // =================================================
    // CONTACT DETAILS
    // =================================================

    y += 5;


    y =
      this.addPDFSectionTitle(
        pdf,
        'CONTACT DETAILS',
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Mobile Number',
        formData.mobile,
        y
      );


    y =
      this.addPDFField(
        pdf,
        'WhatsApp Number',
        formData.whatsapp || '-',
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Email',
        formData.email || '-',
        y
      );


    // =================================================
    // ADDRESS
    // =================================================

    y += 5;


    y =
      this.addPDFSectionTitle(
        pdf,
        'ADDRESS',
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Address',
        formData.address,
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Village',
        formData.village,
        y
      );


    y =
      this.addPDFField(
        pdf,
        'District',
        formData.district,
        y
      );


    // =================================================
    // ADDITIONAL INFORMATION
    // =================================================

    y += 5;


    y =
      this.addPDFSectionTitle(
        pdf,
        'ADDITIONAL INFORMATION',
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Previous Performance',
        formData.performance || '-',
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Reference',
        formData.reference || '-',
        y
      );


    // =================================================
    // REGISTRATION DATE
    // =================================================

    y += 7;


    const today =
      new Date().toLocaleDateString(
        'en-IN'
      );


    pdf.setFont(
      'helvetica',
      'bold'
    );

    pdf.setFontSize(
      10
    );


    pdf.text(
      `Registration Date: ${today}`,
      15,
      y
    );


    // =================================================
    // FOOTER
    // =================================================

    y += 15;


    if (
      y > pageHeight - 20
    ) {

      pdf.addPage();

      y = 25;

    }


    pdf.setFont(
      'helvetica',
      'normal'
    );

    pdf.setFontSize(
      9
    );


    pdf.text(
      'Thank you for registering with VJM Coaching Center.',
      pageWidth / 2,
      y,
      {
        align: 'center'
      }
    );


    y += 5;


    pdf.text(
      'Please keep this registration document for future reference.',
      pageWidth / 2,
      y,
      {
        align: 'center'
      }
    );


    // =================================================
    // DOWNLOAD PDF
    // =================================================

    pdf.save(
      `VJM-Registration-${registrationNumber}.pdf`
    );

  }


  // =====================================================
  // PDF SECTION TITLE
  // =====================================================

  addPDFSectionTitle(
    pdf: jsPDF,
    title: string,
    y: number
  ): number {

    const pageWidth =
      pdf.internal.pageSize.getWidth();


    pdf.setFont(
      'helvetica',
      'bold'
    );

    pdf.setFontSize(
      11
    );


    pdf.text(
      title,
      15,
      y
    );


    pdf.line(
      15,
      y + 2,
      pageWidth - 15,
      y + 2
    );


    return y + 9;

  }


  // =====================================================
  // PDF FIELD
  // =====================================================

  addPDFField(
    pdf: jsPDF,
    label: string,
    value: string,
    y: number
  ): number {

    pdf.setFont(
      'helvetica',
      'bold'
    );

    pdf.setFontSize(
      10
    );


    pdf.text(
      `${label}:`,
      18,
      y
    );


    pdf.setFont(
      'helvetica',
      'normal'
    );


    const text =
      value || '-';


    const lines =
      pdf.splitTextToSize(
        text,
        125
      );


    pdf.text(
      lines,
      70,
      y
    );


    return y +
      Math.max(
        7,
        lines.length * 5
      );

  }

}