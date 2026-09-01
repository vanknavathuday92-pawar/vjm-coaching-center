import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

import {
  getAuth,
  signOut
} from 'firebase/auth';

import {
  db,
  app
} from '../firebase';


// ======================================================
// STUDENT INTERFACE
// ======================================================

interface Student {

  id: string;

  // ====================================================
  // REGISTRATION
  // ====================================================

  registrationNumber?: string;

  registrationStatus?:
    | 'Pending'
    | 'Approved'
    | 'Rejected';


  // ====================================================
  // STUDENT DETAILS
  // ====================================================

  studentName: string;

  dateOfBirth: string;

  gender: string;

  class: string;

  schoolName: string;

  course: string;


  // ====================================================
  // PARENT DETAILS
  // ====================================================

  parentName: string;

  relationship: string;


  // ====================================================
  // CONTACT DETAILS
  // ====================================================

  mobile: string;

  whatsapp: string;

  email: string;


  // ====================================================
  // ADDRESS
  // ====================================================

  address: string;

  village: string;

  district: string;


  // ====================================================
  // ADDITIONAL INFORMATION
  // ====================================================

  performance: string;

  reference: string;


  // ====================================================
  // PAYMENT
  // ====================================================

  courseFee?: number;

  paymentStatus?:
    | 'Pending'
    | 'Paid'
    | 'Rejected';

  paymentId?: string;

  paymentDate?: any;


  // ====================================================
  // VIDEO ACCESS
  // ====================================================

  videoAccess?: boolean;


  // ====================================================
  // CREATED DATE
  // ====================================================

  createdAt?: any;

}



// ======================================================
// COMPONENT
// ======================================================

@Component({

  selector: 'app-admin-dashboard',

  imports: [
    FormsModule
  ],

  templateUrl: './admin-dashboard.html',

  styleUrl: './admin-dashboard.scss'

})


// ======================================================
// ADMIN DASHBOARD CLASS
// ======================================================

export class AdminDashboard
  implements OnInit {


  // ====================================================
  // STUDENTS
  // ====================================================

  students: Student[] = [];


  // ====================================================
  // LOADING / ERROR
  // ====================================================

  isLoading = true;

  errorMessage = '';


  // ====================================================
  // COURSE STATISTICS
  // ====================================================

  totalStudents = 0;

  navodayaStudents = 0;

  sainikStudents = 0;

  gurukulaStudents = 0;

  tuitionStudents = 0;


  // ====================================================
  // PAYMENT STATISTICS
  // ====================================================

  paidStudents = 0;

  pendingPayments = 0;

  rejectedPayments = 0;


  // ====================================================
  // STUDENT MODAL
  // ====================================================

  selectedStudent:
    Student | null = null;

  showStudentModal = false;


  // ====================================================
  // EDIT MODE
  // ====================================================

  isEditingStudent = false;


  // ====================================================
  // FIREBASE AUTH
  // ====================================================

  private auth =
    getAuth(app);


  // ====================================================
  // CONSTRUCTOR
  // ====================================================

  constructor(

    private router: Router,

    private cdr: ChangeDetectorRef

  ) {}


  // ====================================================
  // INITIALIZE
  // ====================================================

  ngOnInit(): void {

    console.log(
      'ADMIN DASHBOARD STARTED'
    );

    this.loadStudents();

  }


  // ====================================================
  // LOAD STUDENTS
  // ====================================================

  async loadStudents(): Promise<void> {

    this.isLoading = true;

    this.errorMessage = '';


    try {

      console.log(
        'START: Loading students'
      );


      // ------------------------------------------------
      // STUDENTS COLLECTION
      // ------------------------------------------------

      const studentsRef =
        collection(
          db,
          'students'
        );


      // ------------------------------------------------
      // GET DOCUMENTS
      // ------------------------------------------------

      const snapshot =
        await getDocs(
          studentsRef
        );


      console.log(
        'Firestore response received'
      );


      console.log(
        'Number of students:',
        snapshot.size
      );


      // ------------------------------------------------
      // CONVERT FIRESTORE DOCUMENTS
      // ------------------------------------------------

      this.students =
        snapshot.docs.map(
          studentDoc => {

            const data =
              studentDoc.data();


            return {

              id:
                studentDoc.id,

              ...data

            } as Student;

          }
        );


      // ------------------------------------------------
      // SORT NEWEST FIRST
      // ------------------------------------------------

      this.students.sort(
        (a, b) => {

          const timeA =
            this.getCreatedTime(
              a.createdAt
            );


          const timeB =
            this.getCreatedTime(
              b.createdAt
            );


          return timeB - timeA;

        }
      );


      // ------------------------------------------------
      // CALCULATE STATISTICS
      // ------------------------------------------------

      this.calculateStatistics();


      console.log(
        'Students:',
        this.students
      );


    } catch (error) {

      console.error(
        'Error loading students:',
        error
      );


      this.errorMessage =
        'Unable to load student registrations. Please check Firebase permissions.';


      this.students = [];


      this.calculateStatistics();


    } finally {

      this.isLoading = false;


      this.cdr.detectChanges();


      console.log(
        'FINISHED loading students'
      );

    }

  }


  // ====================================================
  // GET CREATED TIME
  // ====================================================

  private getCreatedTime(
    createdAt: any
  ): number {

    if (!createdAt) {

      return 0;

    }


    // ------------------------------------------------
    // FIRESTORE TIMESTAMP
    // ------------------------------------------------

    if (
      typeof createdAt.toMillis ===
      'function'
    ) {

      return createdAt.toMillis();

    }


    // ------------------------------------------------
    // FIREBASE TIMESTAMP-LIKE OBJECT
    // ------------------------------------------------

    if (
      createdAt.seconds !== undefined
    ) {

      return (
        createdAt.seconds * 1000
      );

    }


    // ------------------------------------------------
    // JAVASCRIPT DATE
    // ------------------------------------------------

    if (
      createdAt instanceof Date
    ) {

      return createdAt.getTime();

    }


    // ------------------------------------------------
    // NUMBER
    // ------------------------------------------------

    if (
      typeof createdAt === 'number'
    ) {

      return createdAt;

    }


    // ------------------------------------------------
    // STRING DATE
    // ------------------------------------------------

    if (
      typeof createdAt === 'string'
    ) {

      const parsed =
        new Date(
          createdAt
        ).getTime();


      return isNaN(parsed)
        ? 0
        : parsed;

    }


    return 0;

  }


  // ====================================================
  // REFRESH STUDENTS
  // ====================================================

  async refreshStudents(): Promise<void> {

    console.log(
      'REFRESH BUTTON CLICKED'
    );


    await this.loadStudents();

  }


  // ====================================================
  // CALCULATE STATISTICS
  // ====================================================

  calculateStatistics(): void {

    // ------------------------------------------------
    // TOTAL
    // ------------------------------------------------

    this.totalStudents =
      this.students.length;


    // ------------------------------------------------
    // NAVODAYA
    // ------------------------------------------------

    this.navodayaStudents =
      this.students.filter(
        student => {

          const course =
            this.normalizeCourse(
              student.course
            );


          return (

            course ===
            'navodaya'

            ||

            course ===
            'navodaya entrance coaching'

          );

        }
      ).length;


    // ------------------------------------------------
    // SAINIK SCHOOL
    // ------------------------------------------------

    this.sainikStudents =
      this.students.filter(
        student => {

          const course =
            this.normalizeCourse(
              student.course
            );


          return (

            course ===
            'sainik school'

            ||

            course ===
            'sainik school entrance coaching'

          );

        }
      ).length;


    // ------------------------------------------------
    // GURUKULA
    // ------------------------------------------------

    this.gurukulaStudents =
      this.students.filter(
        student => {

          const course =
            this.normalizeCourse(
              student.course
            );


          return (

            course ===
            'gurukula'

            ||

            course ===
            'gurukula entrance coaching'

          );

        }
      ).length;


    // ------------------------------------------------
    // SCHOOL TUITION
    // ------------------------------------------------

    this.tuitionStudents =
      this.students.filter(
        student => {

          const course =
            this.normalizeCourse(
              student.course
            );


          return (
            course ===
            'school tuition'
          );

        }
      ).length;


    // ==================================================
    // PAYMENT STATISTICS
    // ==================================================

    // ------------------------------------------------
    // PAID
    // ------------------------------------------------

    this.paidStudents =
      this.students.filter(
        student =>
          student.paymentStatus ===
          'Paid'
      ).length;


    // ------------------------------------------------
    // PENDING
    // ------------------------------------------------

    this.pendingPayments =
      this.students.filter(
        student =>

          !student.paymentStatus

          ||

          student.paymentStatus ===
          'Pending'

      ).length;


    // ------------------------------------------------
    // REJECTED
    // ------------------------------------------------

    this.rejectedPayments =
      this.students.filter(
        student =>
          student.paymentStatus ===
          'Rejected'
      ).length;

  }


  // ====================================================
  // NORMALIZE COURSE NAME
  // ====================================================

  private normalizeCourse(
    course: string
  ): string {

    return (
      course || ''
    )
      .trim()
      .toLowerCase();

  }


  // ====================================================
  // VIEW STUDENT
  // ====================================================

  viewStudent(
    student: Student
  ): void {

    this.selectedStudent =
      student;


    this.showStudentModal =
      true;


    this.isEditingStudent =
      false;

  }


  // ====================================================
  // EDIT STUDENT
  // ====================================================

  editStudent(): void {

    if (
      !this.selectedStudent
    ) {

      return;

    }


    // ------------------------------------------------
    // CREATE COPY
    // ------------------------------------------------

    this.selectedStudent = {

      ...this.selectedStudent

    };


    this.isEditingStudent =
      true;

  }


  // ====================================================
  // START EDIT
  // ====================================================

  startEditStudent(): void {

    this.editStudent();

  }


  // ====================================================
  // CANCEL EDIT
  // ====================================================

  cancelEditStudent(): void {

    this.isEditingStudent =
      false;

  }


  // ====================================================
  // SAVE STUDENT CHANGES
  // ====================================================

  async saveStudentChanges(): Promise<void> {

    if (
      !this.selectedStudent
    ) {

      return;

    }


    try {

      const student =
        this.selectedStudent;


      // ------------------------------------------------
      // UPDATE FIREBASE
      // ------------------------------------------------

      await updateDoc(

        doc(
          db,
          'students',
          student.id
        ),

        {

          studentName:
            student.studentName,

          dateOfBirth:
            student.dateOfBirth,

          gender:
            student.gender,

          class:
            student.class,

          schoolName:
            student.schoolName,

          course:
            student.course,


          parentName:
            student.parentName,

          relationship:
            student.relationship,


          mobile:
            student.mobile,

          whatsapp:
            student.whatsapp,

          email:
            student.email,


          address:
            student.address,

          village:
            student.village,

          district:
            student.district,


          performance:
            student.performance,

          reference:
            student.reference

        }

      );


      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

      alert(
        'Student information updated successfully.'
      );


      this.isEditingStudent =
        false;


      // ------------------------------------------------
      // RELOAD
      // ------------------------------------------------

      await this.loadStudents();


      // ------------------------------------------------
      // FIND UPDATED STUDENT
      // ------------------------------------------------

      const updatedStudent =
        this.students.find(
          s =>
            s.id ===
            student.id
        );


      if (
        updatedStudent
      ) {

        this.selectedStudent =
          updatedStudent;

      }

    } catch (error) {

      console.error(
        'Error updating student:',
        error
      );


      alert(
        'Unable to update student. Please try again.'
      );

    }

  }


  // ====================================================
  // VERIFY PAYMENT
  // ====================================================

  async verifyPayment(
    student: Student
  ): Promise<void> {

    if (
      !student.id
    ) {

      return;

    }


    // ------------------------------------------------
    // CONFIRM PAYMENT
    // ------------------------------------------------

    const confirmed =
      confirm(
        `Verify ₹6,000 payment for ${student.studentName}?`
      );


    if (!confirmed) {

      return;

    }


    try {

      // ------------------------------------------------
      // UPDATE FIREBASE
      // ------------------------------------------------

      await updateDoc(

        doc(
          db,
          'students',
          student.id
        ),

        {

          courseFee:
            6000,

          paymentStatus:
            'Paid',

          paymentDate:
            new Date(),

          videoAccess:
            true

        }

      );


      // ------------------------------------------------
      // UPDATE LOCAL DATA
      // ------------------------------------------------

      student.courseFee =
        6000;


      student.paymentStatus =
        'Paid';


      student.paymentDate =
        new Date();


      student.videoAccess =
        true;


      // ------------------------------------------------
      // RECALCULATE
      // ------------------------------------------------

      this.calculateStatistics();


      this.cdr.detectChanges();


      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

      alert(
        `Payment verified successfully.\n\n${student.studentName} can now access the videos.`
      );


    } catch (error) {

      console.error(
        'Payment verification error:',
        error
      );


      alert(
        'Unable to verify payment. Please try again.'
      );

    }

  }


  // ====================================================
  // REJECT PAYMENT
  // ====================================================

  async rejectPayment(
    student: Student
  ): Promise<void> {

    if (
      !student.id
    ) {

      return;

    }


    // ------------------------------------------------
    // CONFIRM
    // ------------------------------------------------

    const confirmed =
      confirm(
        `Reject payment for ${student.studentName}?`
      );


    if (!confirmed) {

      return;

    }


    try {

      await updateDoc(

        doc(
          db,
          'students',
          student.id
        ),

        {

          paymentStatus:
            'Rejected',

          videoAccess:
            false

        }

      );


      // ------------------------------------------------
      // UPDATE LOCAL
      // ------------------------------------------------

      student.paymentStatus =
        'Rejected';


      student.videoAccess =
        false;


      // ------------------------------------------------
      // RECALCULATE
      // ------------------------------------------------

      this.calculateStatistics();


      this.cdr.detectChanges();


      alert(
        'Payment marked as rejected.'
      );


    } catch (error) {

      console.error(
        'Payment rejection error:',
        error
      );


      alert(
        'Unable to reject payment.'
      );

    }

  }


  // ====================================================
  // LOCK VIDEO ACCESS
  // ====================================================

  async lockVideoAccess(
    student: Student
  ): Promise<void> {

    if (
      !student.id
    ) {

      return;

    }


    const confirmed =
      confirm(
        `Remove video access from ${student.studentName}?`
      );


    if (!confirmed) {

      return;

    }


    try {

      await updateDoc(

        doc(
          db,
          'students',
          student.id
        ),

        {

          videoAccess:
            false

        }

      );


      student.videoAccess =
        false;


      this.cdr.detectChanges();


      alert(
        'Video access has been locked.'
      );


    } catch (error) {

      console.error(
        'Error locking video access:',
        error
      );


      alert(
        'Unable to lock video access.'
      );

    }

  }


  // ====================================================
  // UNLOCK VIDEO ACCESS
  // ====================================================

  async unlockVideoAccess(
    student: Student
  ): Promise<void> {

    if (
      !student.id
    ) {

      return;

    }


    const confirmed =
      confirm(
        `Give video access to ${student.studentName}?`
      );


    if (!confirmed) {

      return;

    }


    try {

      await updateDoc(

        doc(
          db,
          'students',
          student.id
        ),

        {

          videoAccess:
            true

        }

      );


      student.videoAccess =
        true;


      this.cdr.detectChanges();


      alert(
        'Video access unlocked.'
      );


    } catch (error) {

      console.error(
        'Error unlocking video access:',
        error
      );


      alert(
        'Unable to unlock video access.'
      );

    }

  }


  // ====================================================
  // CALL STUDENT / PARENT
  // ====================================================

  callStudent(
    mobile: string
  ): void {

    if (!mobile) {

      return;

    }


    window.location.href =
      `tel:${mobile}`;

  }


  // ====================================================
  // WHATSAPP
  // ====================================================

  openWhatsApp(
    number: string
  ): void {

    if (!number) {

      return;

    }


    // ------------------------------------------------
    // REMOVE NON-NUMERIC CHARACTERS
    // ------------------------------------------------

    const cleanNumber =
      number.replace(
        /\D/g,
        ''
      );


    // ------------------------------------------------
    // ADD INDIA COUNTRY CODE
    // ------------------------------------------------

    const whatsappNumber =
      cleanNumber.length === 10
        ? `91${cleanNumber}`
        : cleanNumber;


    // ------------------------------------------------
    // OPEN WHATSAPP
    // ------------------------------------------------

    window.open(
      `https://wa.me/${whatsappNumber}`,
      '_blank'
    );

  }


  // ====================================================
  // DELETE STUDENT
  // ====================================================

  async deleteStudent(
    student: Student
  ): Promise<void> {

    // ------------------------------------------------
    // CONFIRM DELETE
    // ------------------------------------------------

    const confirmed =
      confirm(
        `Are you sure you want to delete ${student.studentName}?`
      );


    if (!confirmed) {

      return;

    }


    try {

      console.log(
        'Deleting student:',
        student.id
      );


      // ------------------------------------------------
      // DELETE FROM FIREBASE
      // ------------------------------------------------

      await deleteDoc(

        doc(
          db,
          'students',
          student.id
        )

      );


      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

      alert(
        'Student deleted successfully.'
      );


      // ------------------------------------------------
      // CLOSE MODAL
      // ------------------------------------------------

      this.closeStudentModal();


      // ------------------------------------------------
      // RELOAD
      // ------------------------------------------------

      await this.loadStudents();


    } catch (error) {

      console.error(
        'Error deleting student:',
        error
      );


      alert(
        'Unable to delete student. Please try again.'
      );

    }

  }


  // ====================================================
  // CLOSE STUDENT MODAL
  // ====================================================

  closeStudentModal(): void {

    this.showStudentModal =
      false;


    this.selectedStudent =
      null;


    this.isEditingStudent =
      false;

  }


  // ====================================================
  // LOGOUT
  // ====================================================

  async logout(): Promise<void> {

    try {

      await signOut(
        this.auth
      );


      await this.router.navigate([
        '/admin-login'
      ]);


    } catch (error) {

      console.error(
        'Logout error:',
        error
      );

    }

  }

}