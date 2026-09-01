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

import { db } from '../firebase';

import jsPDF from 'jspdf';


@Component({
  selector: 'app-register',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './register.html',

  styleUrl: './register.scss'
})


export class Register {

  // ============================================
  // REGISTRATION FORM
  // ============================================

  registrationForm: FormGroup;


  // ============================================
  // SUBMISSION STATUS
  // ============================================

  isSubmitting = false;

  registrationSuccess = false;


  // ============================================
  // REGISTRATION NUMBER
  // ============================================

  registrationNumber = '';


  // ============================================
  // DATA FOR PDF
  // ============================================

  studentDataForPdf: any = null;


  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(
    private fb: FormBuilder
  ) {

    this.registrationForm =
      this.fb.group({

        // ============================================
        // STUDENT DETAILS
        // ============================================

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


        // ============================================
        // COURSE
        // ============================================

        course: [
          '',
          Validators.required
        ],


        // ============================================
        // PARENT DETAILS
        // ============================================

        parentName: [
          '',
          Validators.required
        ],


        relationship: [
          '',
          Validators.required
        ],


        // ============================================
        // CONTACT DETAILS
        // ============================================

        mobile: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[6-9]\d{9}$/
            )
          ]
        ],


        whatsapp: [
          '',
          Validators.pattern(
            /^[6-9]\d{9}$/
          )
        ],


        email: [
          '',
          Validators.email
        ],


        // ============================================
        // ADDRESS
        // ============================================

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


        // ============================================
        // ADDITIONAL INFORMATION
        // ============================================

        performance: [
          ''
        ],


        reference: [
          ''
        ]

      });

  }


  // ============================================
  // SUBMIT REGISTRATION
  // ============================================

  async submitForm(): Promise<void> {

    // ============================================
    // VALIDATE FORM
    // ============================================

    if (
      this.registrationForm.invalid
    ) {

      this.registrationForm.markAllAsTouched();

      return;

    }


    // ============================================
    // PREVENT DOUBLE SUBMISSION
    // ============================================

    if (
      this.isSubmitting
    ) {

      return;

    }


    this.isSubmitting = true;


    try {

      // ============================================
      // GET FORM DATA
      // ============================================

      const formData =
        this.registrationForm.value;


      // ============================================
      // GENERATE REGISTRATION NUMBER
      // ============================================

      this.registrationNumber =
        'VJM-2026-' +
        Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();
localStorage.setItem(
  'vjmRegistrationNumber',
  this.registrationNumber
);

      // ============================================
      // STUDENT DATA
      // ============================================

      const studentData = {

        // ============================================
        // REGISTRATION
        // ============================================

        registrationNumber:
          this.registrationNumber,

        registrationStatus:
          'Pending',


        // ============================================
        // PAYMENT
        // ============================================

        paymentStatus:
          'Pending',

        courseFee:
          6000,
        videoAccess:false,
        paymentId:
          '',

        paymentDate:
          null,


        // ============================================
        // VIDEO ACCESS
        // ============================================

      

        // ============================================
        // STUDENT DETAILS
        // ============================================

        studentName:
          formData.studentName,

        dateOfBirth:
          formData.dateOfBirth,

        gender:
          formData.gender,

        class:
          formData.class,

        schoolName:
          formData.schoolName,


        // ============================================
        // COURSE
        // ============================================

        course:
          formData.course,


        // ============================================
        // PARENT DETAILS
        // ============================================

        parentName:
          formData.parentName,

        relationship:
          formData.relationship,


        // ============================================
        // CONTACT DETAILS
        // ============================================

        mobile:
          formData.mobile,

        whatsapp:
          formData.whatsapp,

        email:
          formData.email,


        // ============================================
        // ADDRESS
        // ============================================

        address:
          formData.address,

        village:
          formData.village,

        district:
          formData.district,


        // ============================================
        // ADDITIONAL INFORMATION
        // ============================================

        performance:
          formData.performance,

        reference:
          formData.reference,


        // ============================================
        // CREATED DATE
        // ============================================

        createdAt:
          serverTimestamp()

      };


      // ============================================
      // CONSOLE LOG
      // ============================================

      console.log(
        'Saving student to Firebase:',
        studentData
      );


      // ============================================
      // SAVE TO FIREBASE
      // ============================================

      const docRef =
        await addDoc(
          collection(
            db,
            'students'
          ),
          studentData
        );


      console.log(
        'Student Registration Saved Successfully'
      );


      console.log(
        'Firebase Document ID:',
        docRef.id
      );


      // ============================================
      // STORE DATA FOR PDF
      // ============================================

      this.studentDataForPdf = {

        ...studentData,

        firebaseId:
          docRef.id

      };


      // ============================================
      // SHOW SUCCESS SCREEN
      // ============================================

      this.registrationSuccess =
        true;


      // ============================================
      // RESET FORM
      // ============================================

      this.registrationForm.reset();


    } catch (error) {

      console.error(
        'Error saving student registration:',
        error
      );


      alert(
        'Unable to submit registration. Please check your internet connection and try again.'
      );


    } finally {

      this.isSubmitting =
        false;

    }

  }


  // ============================================
  // DOWNLOAD REGISTRATION PDF
  // ============================================

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


  // ============================================
  // GENERATE REGISTRATION PDF
  // ============================================

  generateRegistrationPDF(
    formData: any,
    registrationNumber: string
  ): void {

    const pdf =
      new jsPDF();


    // ============================================
    // PAGE SETTINGS
    // ============================================

    const pageWidth =
      pdf.internal.pageSize.getWidth();

    const pageHeight =
      pdf.internal.pageSize.getHeight();

    let y = 20;


    // ============================================
    // HEADER
    // ============================================

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


    pdf.setFontSize(
      11
    );

    pdf.setFont(
      'helvetica',
      'normal'
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


    // ============================================
    // HORIZONTAL LINE
    // ============================================

    pdf.line(
      15,
      y,
      pageWidth - 15,
      y
    );


    y += 12;


    // ============================================
    // REGISTRATION NUMBER
    // ============================================

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


    // ============================================
    // STUDENT DETAILS
    // ============================================

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


    // ============================================
    // COURSE DETAILS
    // ============================================

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


    // ============================================
    // COURSE FEE
    // ============================================

    y =
      this.addPDFField(
        pdf,
        'Course Fee',
        '₹6,000',
        y
      );


    y =
      this.addPDFField(
        pdf,
        'Payment Status',
        formData.paymentStatus || 'Pending',
        y
      );


    // ============================================
    // PARENT DETAILS
    // ============================================

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


    // ============================================
    // CONTACT DETAILS
    // ============================================

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


    // ============================================
    // ADDRESS
    // ============================================

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


    // ============================================
    // ADDITIONAL INFORMATION
    // ============================================

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


    // ============================================
    // REGISTRATION DATE
    // ============================================

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


    // ============================================
    // FOOTER
    // ============================================

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


    // ============================================
    // DOWNLOAD PDF
    // ============================================

    pdf.save(
      `VJM-Registration-${registrationNumber}.pdf`
    );

  }


  // ============================================
  // PDF SECTION TITLE
  // ============================================

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


  // ============================================
  // PDF FIELD
  // ============================================

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