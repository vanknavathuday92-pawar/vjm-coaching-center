import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';

import {
  getAuth,
  onAuthStateChanged
} from 'firebase/auth';

import { db, app } from '../firebase';


// =====================================================
// INTERFACES
// =====================================================

interface VideoTopic {
  title: string;
  description: string;
  videoUrl: string;
}

interface VideoSubject {
  name: string;
  icon: string;
  topics: VideoTopic[];
}

interface Student {
  id: string;

  studentName?: string;
  registrationNumber?: string;
  email?: string;
  mobile?: string;

  course?: string;

  paymentStatus?: string;
  videoAccess?: boolean;

  paymentId?: string;
}


// =====================================================
// COMPONENT
// =====================================================

@Component({
  selector: 'app-video',

  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './video.html',

  styleUrl: './video.scss'
})


export class Video implements OnInit {


  // =====================================================
  // PAGE STATE
  // =====================================================

  isLoading = true;

  isCheckingAccess = true;

  hasAccess = false;

  errorMessage = '';

  studentName = '';

  studentCourse = '';

  registrationNumber = '';


  // =====================================================
  // VIDEO PLAYER
  // =====================================================

  selectedSubject = '';

  selectedTopic = '';

  selectedTitle = '';

  selectedVideoUrl = '';

  showVideoPlayer = false;


  // =====================================================
  // COURSE
  // =====================================================

  selectedCourse = 'Navodaya';


  // =====================================================
  // AUTH
  // =====================================================

  private auth = getAuth(app);


  // =====================================================
  // NAVODAYA SYLLABUS
  // Taken from the syllabus supplied by you
  // =====================================================

  navodayaSubjects: VideoSubject[] = [

    // ---------------------------------------------------
    // MENTAL ABILITY
    // ---------------------------------------------------

    {
      name: 'Mental Ability Test',
      icon: '🧠',

      topics: [

        {
          title: 'Odd-Man Out',
          description:
            'Classification and identifying the item that does not belong.',
          videoUrl: ''
        },

        {
          title: 'Figure Matching',
          description:
            'Identify matching figures and visual patterns.',
          videoUrl: ''
        },

        {
          title: 'Pattern Completion',
          description:
            'Complete incomplete visual patterns.',
          videoUrl: ''
        },

        {
          title: 'Figure Series Completion',
          description:
            'Find the missing figure in a sequence.',
          videoUrl: ''
        },

        {
          title: 'Analogy',
          description:
            'Understand relationships between figures and concepts.',
          videoUrl: ''
        },

        {
          title: 'Geometrical Figure Completion',
          description:
            'Complete geometrical figures and visual relationships.',
          videoUrl: ''
        },

        {
          title: 'Mirror Image',
          description:
            'Solve mirror-image based reasoning questions.',
          videoUrl: ''
        },

        {
          title: 'Punched Hole Pattern',
          description:
            'Understand folding, punching and unfolding patterns.',
          videoUrl: ''
        },

        {
          title: 'Space Visualisation',
          description:
            'Develop spatial visualization and mental rotation skills.',
          videoUrl: ''
        },

        {
          title: 'Embedded Figure',
          description:
            'Identify hidden figures inside complex figures.',
          videoUrl: ''
        }

      ]
    },


    // ---------------------------------------------------
    // ARITHMETIC
    // ---------------------------------------------------

    {
      name: 'Arithmetic Test',
      icon: '📐',

      topics: [

        {
          title: 'Number and Numeric System',
          description:
            'Numbers and basic number-system concepts.',
          videoUrl: ''
        },

        {
          title: 'Four Fundamental Operations on Whole Numbers',
          description:
            'Addition, subtraction, multiplication and division.',
          videoUrl: ''
        },

        {
          title: 'Fractional Number and Fundamental Operations',
          description:
            'Fractions and operations involving fractions.',
          videoUrl: ''
        },

        {
          title: 'Decimals and Fundamental Operations on Them',
          description:
            'Decimals and arithmetic operations with decimals.',
          videoUrl: ''
        },

        {
          title: 'Factors and Multiples Including Their Properties',
          description:
            'Factors, multiples and their properties.',
          videoUrl: ''
        },

        {
          title: 'LCM and HCF of Numbers',
          description:
            'Least Common Multiple and Highest Common Factor.',
          videoUrl: ''
        },

        {
          title: 'Simplification of Numerical Expressions',
          description:
            'Simplification of numerical expressions.',
          videoUrl: ''
        },

        {
          title: 'Ratio',
          description:
            'Understanding and solving ratio problems.',
          videoUrl: ''
        },

        {
          title: 'Average',
          description:
            'Finding and solving problems involving averages.',
          videoUrl: ''
        },

        {
          title: 'Profit and Loss',
          description:
            'Basic profit and loss calculations.',
          videoUrl: ''
        },

        {
          title: 'Measurement',
          description:
            'Measurement and related numerical problems.',
          videoUrl: ''
        },

        {
          title: 'Area and Perimeter',
          description:
            'Area and perimeter of basic figures.',
          videoUrl: ''
        },

        {
          title: 'Types of Angle and its Simple Applications',
          description:
            'Types of angles and simple applications.',
          videoUrl: ''
        },

        {
          title: 'Data Analysis',
          description:
            'Read, understand and analyze basic data.',
          videoUrl: ''
        }

      ]
    },


    // ---------------------------------------------------
    // LANGUAGE
    // ---------------------------------------------------

    {
      name: 'Language Test (English)',
      icon: '📖',

      topics: [

        {
          title: 'Synonym, Antonym and Word-Meaning / Parts of Speech',
          description:
            'Vocabulary, word meanings and parts of speech.',
          videoUrl: ''
        },

        {
          title: 'Comprehension',
          description:
            'Reading comprehension and answering questions.',
          videoUrl: ''
        }

      ]
    }

  ];


  // =====================================================
  // GURUKULA SYLLABUS
  // Based on the Gurukula structure supplied by you
  // =====================================================

  gurukulaSubjects: VideoSubject[] = [

    {
      name: 'Mathematics',
      icon: '📐',

      topics: [

        {
          title: 'Mathematics',
          description:
            'Number system, basic operations, fractions, simple geometry, perimeter and area.',
          videoUrl: ''
        }

      ]
    },


    {
      name: 'Environmental Science / Science',
      icon: '🌱',

      topics: [

        {
          title: 'Environmental Science / Science',
          description:
            'Basic concepts about our environment, body organs, food habits, plants and local resources.',
          videoUrl: ''
        }

      ]
    },


    {
      name: 'Telugu / Regional Language',
      icon: 'తెలుగు',

      topics: [

        {
          title: 'Telugu / Regional Language',
          description:
            'Basic grammar, vocabulary and reading comprehension.',
          videoUrl: ''
        }

      ]
    },


    {
      name: 'English',
      icon: '📖',

      topics: [

        {
          title: 'English',
          description:
            'Alphabet, basic grammar, plurals, opposites and simple sentences.',
          videoUrl: ''
        }

      ]
    },


    {
      name: 'Mental Ability / Reasoning',
      icon: '🧠',

      topics: [

        {
          title: 'Mental Ability / Reasoning',
          description:
            'Simple logical patterns, shapes, series and puzzles.',
          videoUrl: ''
        }

      ]
    }

  ];


  // =====================================================
  // SAINIK SCHOOL
  // =====================================================

  sainikSubjects: VideoSubject[] = [

    {
      name: 'Mathematics',
      icon: '📐',

      topics: [

        {
          title: 'Number System',
          description:
            'Basic numbers and arithmetic concepts.',
          videoUrl: ''
        },

        {
          title: 'Fractions and Decimals',
          description:
            'Fractions, decimals and examination problems.',
          videoUrl: ''
        }

      ]
    },


    {
      name: 'Intelligence',
      icon: '🧠',

      topics: [

        {
          title: 'Logical Reasoning',
          description:
            'Reasoning and logical thinking.',
          videoUrl: ''
        },

        {
          title: 'Series and Patterns',
          description:
            'Identify patterns and sequences.',
          videoUrl: ''
        }

      ]
    },


    {
      name: 'Language',
      icon: '📖',

      topics: [

        {
          title: 'English Grammar',
          description:
            'Grammar and vocabulary preparation.',
          videoUrl: ''
        }

      ]
    }

  ];


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      const course =
        params['course'];

      if (
        course === 'Navodaya' ||
        course === 'Sainik School' ||
        course === 'Gurukula'
      ) {

        this.selectedCourse = course;

      }

    });


    this.checkStudentAccess();

  }


  // =====================================================
  // GET SUBJECTS FOR SELECTED COURSE
  // =====================================================

  get subjects(): VideoSubject[] {

    if (
      this.selectedCourse === 'Gurukula'
    ) {

      return this.gurukulaSubjects;

    }


    if (
      this.selectedCourse === 'Sainik School'
    ) {

      return this.sainikSubjects;

    }


    return this.navodayaSubjects;

  }


  // =====================================================
  // CHANGE COURSE
  // =====================================================

  changeCourse(
    course: string
  ): void {

    this.selectedCourse = course;

    this.closeVideo();

  }


  // =====================================================
  // CHECK STUDENT PAYMENT ACCESS
  // =====================================================

  async checkStudentAccess(): Promise<void> {

    this.isLoading = true;

    this.isCheckingAccess = true;

    this.errorMessage = '';

    this.hasAccess = false;


    try {

      // -------------------------------------------------
      // FIRST: GET REGISTRATION NUMBER
      // -------------------------------------------------

      const storedRegistration =
        localStorage.getItem(
          'vjmRegistrationNumber'
        );


      this.registrationNumber =
        storedRegistration || '';


      // -------------------------------------------------
      // GET FIREBASE USER
      // -------------------------------------------------

      const user =
        this.auth.currentUser;


      // -------------------------------------------------
      // IF NO LOGIN AND NO REGISTRATION NUMBER
      // -------------------------------------------------

      if (
        !user &&
        !this.registrationNumber
      ) {

        this.router.navigate(
          ['/student-login'],
          {
            queryParams: {
              returnUrl: '/video'
            }
          }
        );

        return;

      }


      let student: Student | null = null;


      // -------------------------------------------------
      // SEARCH BY REGISTRATION NUMBER
      // -------------------------------------------------

      if (
        this.registrationNumber
      ) {

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


        if (
          !snapshot.empty
        ) {

          const docData =
            snapshot.docs[0];


          student = {
            id: docData.id,
            ...docData.data()
          } as Student;

        }

      }


      // -------------------------------------------------
      // FALLBACK: SEARCH BY EMAIL
      // -------------------------------------------------

      if (
        !student &&
        user?.email
      ) {

        const studentsRef =
          collection(
            db,
            'students'
          );


        const studentQuery =
          query(
            studentsRef,
            where(
              'email',
              '==',
              user.email
            )
          );


        const snapshot =
          await getDocs(
            studentQuery
          );


        if (
          !snapshot.empty
        ) {

          const docData =
            snapshot.docs[0];


          student = {
            id: docData.id,
            ...docData.data()
          } as Student;

        }

      }


      // -------------------------------------------------
      // STUDENT NOT FOUND
      // -------------------------------------------------

      if (!student) {

        this.hasAccess = false;

        this.errorMessage =
          'Student account could not be found. Please login again.';

        return;

      }


      // -------------------------------------------------
      // STORE STUDENT INFORMATION
      // -------------------------------------------------

      this.studentName =
        student.studentName || 'Student';


      this.studentCourse =
        student.course || '';


      this.registrationNumber =
        student.registrationNumber || '';


      if (
        student.registrationNumber
      ) {

        localStorage.setItem(
          'vjmRegistrationNumber',
          student.registrationNumber
        );

      }


      // -------------------------------------------------
      // IMPORTANT:
      // VIDEO ACCESS ONLY AFTER PAYMENT IS VERIFIED
      // -------------------------------------------------

      const paymentPaid =
        student.paymentStatus === 'Paid';


      const videoAllowed =
        student.videoAccess === true;


      if (
        paymentPaid &&
        videoAllowed
      ) {

        this.hasAccess = true;

      } else {

        this.hasAccess = false;

      }

    }

    catch (error) {

      console.error(
        'Video access error:',
        error
      );


      this.hasAccess = false;


      this.errorMessage =
        'Unable to verify your payment status. Please try again.';

    }

    finally {

      this.isLoading = false;

      this.isCheckingAccess = false;

    }

  }


  // =====================================================
  // WATCH VIDEO
  // =====================================================

  watchVideo(
    subject: VideoSubject,
    topic: VideoTopic
  ): void {

    // -------------------------------------------------
    // SECURITY CHECK
    // -------------------------------------------------

    if (!this.hasAccess) {

      this.router.navigate(
        ['/payment']
      );

      return;

    }


    // -------------------------------------------------
    // SET SELECTED VIDEO
    // -------------------------------------------------

    this.selectedSubject =
      subject.name;


    this.selectedTopic =
      topic.title;


    this.selectedTitle =
      `${this.selectedCourse} - ${subject.name} - ${topic.title}`;


    this.selectedVideoUrl =
      topic.videoUrl;


    this.showVideoPlayer =
      true;


    // -------------------------------------------------
    // SCROLL TO PLAYER
    // -------------------------------------------------

    setTimeout(() => {

      const player =
        document.getElementById(
          'video-player'
        );


      if (player) {

        player.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      }

    }, 100);

  }


  // =====================================================
  // CLOSE VIDEO
  // =====================================================

  closeVideo(): void {

    this.showVideoPlayer =
      false;

    this.selectedSubject =
      '';

    this.selectedTopic =
      '';

    this.selectedTitle =
      '';

    this.selectedVideoUrl =
      '';

  }


  // =====================================================
  // GO TO PAYMENT
  // =====================================================

  goToPayment(): void {

    this.router.navigate(
      ['/payment']
    );

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    localStorage.removeItem(
      'vjmRegistrationNumber'
    );


    this.auth.signOut()
      .finally(() => {

        this.router.navigate(
          ['/student-login']
        );

      });

  }

}