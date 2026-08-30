import { Component } from '@angular/core';

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

@Component({
  selector: 'app-register',

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './register.html',

  styleUrl: './register.scss'
})
export class Register {

  registrationForm: FormGroup;

  isSubmitting = false;

  constructor(private fb: FormBuilder) {

    this.registrationForm = this.fb.group({

      // Student Details
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

      // Course
      course: [
        '',
        Validators.required
      ],

      // Parent Details
      parentName: [
        '',
        Validators.required
      ],

      relationship: [
        '',
        Validators.required
      ],

      // Contact Details
      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9]\d{9}$/)
        ]
      ],

      whatsapp: [
        '',
        Validators.pattern(/^[6-9]\d{9}$/)
      ],

      email: [
        '',
        Validators.email
      ],

      // Address
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

      // Additional Information
      performance: [
        ''
      ],

      reference: [
        ''
      ]

    });

  }


  async submitForm(): Promise<void> {

    // Check form validation
    if (this.registrationForm.invalid) {

      this.registrationForm.markAllAsTouched();

      return;
    }


    // Prevent multiple submissions
    if (this.isSubmitting) {

      return;
    }


    this.isSubmitting = true;


    try {

      // Get form values
      const formData = this.registrationForm.value;


      // Student data to save in Firebase
      const studentData = {

        studentName: formData.studentName,

        dateOfBirth: formData.dateOfBirth,

        gender: formData.gender,

        class: formData.class,

        schoolName: formData.schoolName,

        course: formData.course,

        parentName: formData.parentName,

        relationship: formData.relationship,

        mobile: formData.mobile,

        whatsapp: formData.whatsapp,

        email: formData.email,

        address: formData.address,

        village: formData.village,

        district: formData.district,

        performance: formData.performance,

        reference: formData.reference,

        // IMPORTANT:
        // Firebase server timestamp
        createdAt: serverTimestamp()

      };


      console.log(
        'Saving student to Firebase:',
        studentData
      );


      // Add student to Firestore
      const docRef = await addDoc(
        collection(db, 'students'),
        studentData
      );


      console.log(
        'Student Registration Saved Successfully'
      );

      console.log(
        'Firebase Document ID:',
        docRef.id
      );


      // Success message
      alert(
        'Student registration submitted successfully!'
      );


      // Reset form
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

      this.isSubmitting = false;

    }

  }

}