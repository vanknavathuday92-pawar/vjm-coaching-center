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
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

import {
  getAuth,
  signOut
} from 'firebase/auth';

import { db, app } from '../firebase';


interface Student {

  id: string;

  studentName: string;
  dateOfBirth: string;
  gender: string;
  class: string;
  schoolName: string;
  course: string;

  parentName: string;
  relationship: string;

  mobile: string;
  whatsapp: string;
  email: string;

  address: string;
  village: string;
  district: string;

  performance: string;
  reference: string;

  createdAt?: any;

}


@Component({
  selector: 'app-admin-dashboard',
  imports: [FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})


export class AdminDashboard implements OnInit {


  // ==========================================
  // STUDENTS
  // ==========================================

  students: Student[] = [];


  // ==========================================
  // LOADING / ERROR
  // ==========================================

  isLoading = true;

  errorMessage = '';


  // ==========================================
  // STATISTICS
  // ==========================================

  totalStudents = 0;

  navodayaStudents = 0;

  sainikStudents = 0;

  gurukulaStudents = 0;

  tuitionStudents = 0;


  // ==========================================
  // VIEW STUDENT POPUP
  // ==========================================

  selectedStudent: Student | null = null;

  showStudentModal = false;

// Edit student status
isEditingStudent = false;
  // ==========================================
  // FIREBASE AUTH
  // ==========================================

  private auth = getAuth(app);


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
  private router: Router,
  private cdr: ChangeDetectorRef
) {}

  // ==========================================
  // INITIALIZE
  // ==========================================

  ngOnInit(): void {

    console.log(
      'ADMIN DASHBOARD STARTED'
    );

    this.loadStudents();

  }


  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  async loadStudents(): Promise<void> {

    this.isLoading = true;

    this.errorMessage = '';


    try {

      console.log(
        'START: Loading students'
      );


      // Get students collection
      const studentsRef =
        collection(
          db,
          'students'
        );


      // Get all students
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


      // Convert Firestore documents
      this.students =
        snapshot.docs.map(
          studentDoc => {

            const data =
              studentDoc.data();


            return {

              id: studentDoc.id,

              ...data

            } as Student;

          }
        );


      // Sort newest registrations first
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


      console.log(
        'Students:',
        this.students
      );


      // Calculate statistics
      this.calculateStatistics();


      console.log(
        'Statistics calculated'
      );


    } catch (error) {

      console.error(
        'Error loading students:',
        error
      );


      this.errorMessage =
        'Unable to load student registrations. Please check Firebase permissions.';


      // Clear students if loading fails
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


  // ==========================================
  // GET CREATED TIME
  // ==========================================

  private getCreatedTime(
    createdAt: any
  ): number {

    if (!createdAt) {

      return 0;

    }


    // Firestore Timestamp
    if (
      typeof createdAt.toMillis ===
      'function'
    ) {

      return createdAt.toMillis();

    }


    // JavaScript Date
    if (
      createdAt instanceof Date
    ) {

      return createdAt.getTime();

    }


    // Number
    if (
      typeof createdAt === 'number'
    ) {

      return createdAt;

    }


    return 0;

  }


  // ==========================================
  // REFRESH STUDENTS
  // ==========================================

  async refreshStudents(): Promise<void> {

    console.log(
      'REFRESH BUTTON CLICKED'
    );

    await this.loadStudents();

  }


  // ==========================================
  // STATISTICS
  // ==========================================

  calculateStatistics(): void {


    this.totalStudents =
      this.students.length;


    this.navodayaStudents =
      this.students.filter(
        student =>
          this.normalizeCourse(
            student.course
          ) === 'navodaya'
      ).length;


    this.sainikStudents =
      this.students.filter(
        student =>
          this.normalizeCourse(
            student.course
          ) === 'sainik school'
      ).length;


    this.gurukulaStudents =
      this.students.filter(
        student =>
          this.normalizeCourse(
            student.course
          ) === 'gurukula'
      ).length;


    this.tuitionStudents =
      this.students.filter(
        student =>
          this.normalizeCourse(
            student.course
          ) === 'school tuition'
      ).length;


  }


  // ==========================================
  // NORMALIZE COURSE NAME
  // ==========================================

  private normalizeCourse(
    course: string
  ): string {

    return (
      course || ''
    )
      .trim()
      .toLowerCase();

  }


  // ==========================================
  // VIEW STUDENT
  // ==========================================

 viewStudent(student: Student): void {
  this.selectedStudent = student;
  this.showStudentModal = true;
  this.isEditingStudent = false;
}
// ==========================================
// EDIT STUDENT
// ==========================================

editStudent(): void {

  if (!this.selectedStudent) {
    return;
  }

  // Create a copy so editing does not immediately change
  // the student displayed in the table
  this.selectedStudent = {
    ...this.selectedStudent
  };

  this.isEditingStudent = true;

}
// ==========================================
// SAVE STUDENT CHANGES
// ==========================================

// ==========================================
// SAVE STUDENT CHANGES
// ==========================================

async saveStudentChanges(): Promise<void> {

  if (!this.selectedStudent) {
    return;
  }

  try {

    const student = this.selectedStudent;

    await updateDoc(
      doc(
        db,
        'students',
        student.id
      ),
      {
        studentName: student.studentName,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        class: student.class,
        schoolName: student.schoolName,
        course: student.course,

        parentName: student.parentName,
        relationship: student.relationship,

        mobile: student.mobile,
        whatsapp: student.whatsapp,
        email: student.email,

        address: student.address,
        village: student.village,
        district: student.district,

        performance: student.performance,
        reference: student.reference
      }
    );

    alert('Student information updated successfully.');

    this.isEditingStudent = false;

    // Reload from Firebase
    await this.loadStudents();

    // Find the updated student again
    const updatedStudent =
      this.students.find(
        s => s.id === student.id
      );

    if (updatedStudent) {
      this.selectedStudent = updatedStudent;
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
// ==========================================
// START EDIT STUDENT
// ==========================================

startEditStudent(): void {

  this.editStudent();

}

// ==========================================
// CANCEL EDIT
// ==========================================

// ==========================================
// CANCEL EDIT
// ==========================================

cancelEditStudent(): void {

  if (!this.selectedStudent) {
    return;
  }

  this.isEditingStudent = false;

}
  // ==========================================
  // CLOSE STUDENT POPUP
  // ==========================================

  closeStudentModal(): void {

  this.showStudentModal = false;

  this.selectedStudent = null;

  this.isEditingStudent = false;

}


  // ==========================================
  // CALL STUDENT / PARENT
  // ==========================================

  callStudent(
    mobile: string
  ): void {

    if (!mobile) {

      return;

    }


    window.location.href =
      `tel:${mobile}`;

  }


  // ==========================================
  // WHATSAPP
  // ==========================================

  openWhatsApp(
    number: string
  ): void {

    if (!number) {

      return;

    }


    const cleanNumber =
      number.replace(
        /\D/g,
        ''
      );


    const whatsappNumber =
      cleanNumber.length === 10
        ? `91${cleanNumber}`
        : cleanNumber;


    window.open(
      `https://wa.me/${whatsappNumber}`,
      '_blank'
    );

  }


  // ==========================================
  // DELETE STUDENT
  // ==========================================

  async deleteStudent(
    student: Student
  ): Promise<void> {


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


      await deleteDoc(
        doc(
          db,
          'students',
          student.id
        )
      );


      alert(
        'Student deleted successfully.'
      );


      // Close popup
      this.closeStudentModal();


      // Reload students
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


  // ==========================================
  // LOGOUT
  // ==========================================

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