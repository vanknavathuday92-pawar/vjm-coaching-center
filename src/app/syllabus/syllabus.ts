import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Topic {
  name: string;
  description: string;
}

interface Subject {
  name: string;
  icon: string;
  topics: Topic[];
}

interface ExamRow {
  section: string;
  questions: string;
  marks: string;
}

interface Course {
  name: string;
  icon: string;
  title: string;
  subtitle: string;
  subjects: Subject[];
  examPattern: {
    duration: string;
    questionType: string;
    totalQuestions: string;
    totalMarks: string;
    sections: ExamRow[];
    note?: string;
  };
}

@Component({
  selector: 'app-syllabus',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './syllabus.html',
  styleUrl: './syllabus.scss'
})
export class Syllabus {

  selectedCourse = 'Navodaya';

  courses: Course[] = [

    // =========================================================
    // NAVODAYA
    // =========================================================

    {
      name: 'Navodaya',
      icon: '🎓',
      title: 'Navodaya Entrance Coaching',
      subtitle: 'Syllabus and examination pattern',

      subjects: [

        {
          name: 'Mental Ability Test',
          icon: '🧠',

          topics: [
            {
              name: 'Odd-Man Out',
              description: 'Identify the figure or object that is different from the others.'
            },
            {
              name: 'Figure Matching',
              description: 'Match and identify similar figures.'
            },
            {
              name: 'Pattern Completion',
              description: 'Complete incomplete patterns using logical observation.'
            },
            {
              name: 'Figure Series Completion',
              description: 'Find the next figure in a sequence.'
            },
            {
              name: 'Analogy',
              description: 'Identify relationships between figures and objects.'
            },
            {
              name: 'Geometrical Figure Completion',
              description: 'Complete geometrical figures and patterns.'
            },
            {
              name: 'Mirror Image',
              description: 'Understand and identify mirror images.'
            },
            {
              name: 'Punched Hole Pattern',
              description: 'Identify the final pattern after folding and punching.'
            },
            {
              name: 'Space Visualisation',
              description: 'Develop spatial understanding and visual reasoning.'
            },
            {
              name: 'Embedded Figure',
              description: 'Find a hidden figure within a larger figure.'
            }
          ]
        },

        {
          name: 'Arithmetic Test',
          icon: '📐',

          topics: [
            {
              name: 'Number and Numeric System',
              description: 'Understanding numbers and basic numerical concepts.'
            },
            {
              name: 'Four Fundamental Operations on Whole Numbers',
              description: 'Addition, subtraction, multiplication and division.'
            },
            {
              name: 'Fractional Number and Fundamental Operations',
              description: 'Fractions and basic operations involving fractions.'
            },
            {
              name: 'Decimals and Fundamental Operations on Them',
              description: 'Decimal numbers and operations with decimals.'
            },
            {
              name: 'Factors and Multiples Including Their Properties',
              description: 'Factors, multiples and their properties.'
            },
            {
              name: 'LCM and HCF of Numbers',
              description: 'Lowest Common Multiple and Highest Common Factor.'
            },
            {
              name: 'Simplification of Numerical Expressions',
              description: 'Simplification of numerical expressions.'
            },
            {
              name: 'Ratio',
              description: 'Basic ratio concepts and applications.'
            },
            {
              name: 'Average',
              description: 'Average and simple numerical problems.'
            },
            {
              name: 'Profit and Loss',
              description: 'Basic profit and loss calculations.'
            },
            {
              name: 'Measurement',
              description: 'Basic units and measurement concepts.'
            },
            {
              name: 'Area and Perimeter',
              description: 'Area and perimeter of basic shapes.'
            },
            {
              name: 'Types of Angle and its Simple Applications',
              description: 'Types of angles and their simple applications.'
            },
            {
              name: 'Data Analysis',
              description: 'Understanding and analysing simple data.'
            }
          ]
        },

        {
          name: 'Language Test (English)',
          icon: '📖',

          topics: [
            {
              name: 'Synonym, Antonym and Word Meaning / Parts of Speech',
              description: 'Vocabulary, meanings, synonyms, antonyms and parts of speech.'
            },
            {
              name: 'Comprehension',
              description: 'Reading passages and answering comprehension questions.'
            }
          ]
        }
      ],

      examPattern: {
        duration: '2 Hours',
        questionType: 'Objective Type / MCQ',
        totalQuestions: '80',
        totalMarks: '100',

        sections: [
          {
            section: 'Mental Ability Test',
            questions: '40',
            marks: '50'
          },
          {
            section: 'Arithmetic Test',
            questions: '20',
            marks: '25'
          },
          {
            section: 'Language Ability Test',
            questions: '20',
            marks: '25'
          },
          {
            section: 'Total',
            questions: '80',
            marks: '100'
          }
        ],

        note: 'The examination is of two hours. The question paper is divided into three sections and the questions are objective type.'
      }
    },



    // =========================================================
    // SAINIK SCHOOL
    // =========================================================

    {
      name: 'Sainik School',
      icon: '🏫',
      title: 'Sainik School Entrance Coaching',
      subtitle: 'Syllabus and examination pattern',

      subjects: [

        {
          name: 'Mathematics',
          icon: '📐',

          topics: [
            {
              name: 'Number System',
              description: 'Numbers, place value and basic numerical concepts.'
            },
            {
              name: 'Arithmetic Operations',
              description: 'Addition, subtraction, multiplication and division.'
            },
            {
              name: 'Fractions and Decimals',
              description: 'Basic operations involving fractions and decimals.'
            },
            {
              name: 'Factors and Multiples',
              description: 'Factors, multiples and related concepts.'
            },
            {
              name: 'Ratio and Proportion',
              description: 'Basic ratio and proportion problems.'
            },
            {
              name: 'Percentage',
              description: 'Basic percentage calculations and applications.'
            },
            {
              name: 'Geometry',
              description: 'Lines, angles, shapes and basic geometrical concepts.'
            },
            {
              name: 'Area and Perimeter',
              description: 'Area and perimeter of basic geometrical figures.'
            },
            {
              name: 'Measurement',
              description: 'Units and basic measurement problems.'
            },
            {
              name: 'Data Interpretation',
              description: 'Reading and understanding simple data.'
            }
          ]
        },

        {
          name: 'Language',
          icon: '📖',

          topics: [
            {
              name: 'Vocabulary',
              description: 'Word meanings and basic vocabulary.'
            },
            {
              name: 'Grammar',
              description: 'Basic grammar concepts.'
            },
            {
              name: 'Comprehension',
              description: 'Reading passages and answering questions.'
            },
            {
              name: 'Sentence Formation',
              description: 'Understanding and constructing simple sentences.'
            }
          ]
        },

        {
          name: 'Intelligence',
          icon: '🧠',

          topics: [
            {
              name: 'Analogy',
              description: 'Identify relationships between objects and figures.'
            },
            {
              name: 'Classification',
              description: 'Identify groups and find the odd item.'
            },
            {
              name: 'Series',
              description: 'Number, alphabet and figure series.'
            },
            {
              name: 'Logical Reasoning',
              description: 'Basic logical thinking and reasoning problems.'
            },
            {
              name: 'Pattern Recognition',
              description: 'Identify and complete patterns.'
            }
          ]
        },

        {
          name: 'General Knowledge',
          icon: '🌍',

          topics: [
            {
              name: 'Current Awareness',
              description: 'Basic awareness of the world around us.'
            },
            {
              name: 'Science and Environment',
              description: 'Basic science and environmental awareness.'
            },
            {
              name: 'India',
              description: 'Basic knowledge about India.'
            },
            {
              name: 'Sports and Important Events',
              description: 'Basic awareness of sports and important events.'
            }
          ]
        }
      ],

      examPattern: {
        duration: 'As per the applicable Sainik School entrance examination notification',
        questionType: 'Objective Type / MCQ',
        totalQuestions: 'Refer to the applicable examination notification',
        totalMarks: 'Refer to the applicable examination notification',

        sections: [
          {
            section: 'Mathematics',
            questions: 'As applicable',
            marks: 'As applicable'
          },
          {
            section: 'Language',
            questions: 'As applicable',
            marks: 'As applicable'
          },
          {
            section: 'Intelligence',
            questions: 'As applicable',
            marks: 'As applicable'
          },
          {
            section: 'General Knowledge',
            questions: 'As applicable',
            marks: 'As applicable'
          }
        ],

        note: 'The exact question distribution, marks and duration may vary according to the class and examination year.'
      }
    },



    // =========================================================
    // GURUKULA
    // =========================================================

    {
      name: 'Gurukula',
      icon: '📚',
      title: 'Gurukula Entrance Coaching',
      subtitle: 'Syllabus and examination pattern',

      subjects: [

        {
          name: 'Mathematics',
          icon: '📐',

          topics: [
            {
              name: 'Number System',
              description: 'Numbers and basic numerical concepts.'
            },
            {
              name: 'Basic Operations',
              description: 'Basic addition, subtraction, multiplication and division.'
            },
            {
              name: 'Fractions',
              description: 'Understanding and solving basic fraction problems.'
            },
            {
              name: 'Simple Geometry',
              description: 'Basic shapes, lines and geometrical concepts.'
            },
            {
              name: 'Perimeter',
              description: 'Understanding and calculating perimeter.'
            },
            {
              name: 'Area',
              description: 'Understanding and calculating area of basic shapes.'
            }
          ]
        },

        {
          name: 'Environmental Science / Science',
          icon: '🌱',

          topics: [
            {
              name: 'Environment',
              description: 'Basic concepts about our environment.'
            },
            {
              name: 'Body Organs',
              description: 'Basic knowledge about human body organs.'
            },
            {
              name: 'Food Habits',
              description: 'Food, nutrition and healthy food habits.'
            },
            {
              name: 'Plants',
              description: 'Basic knowledge about plants and their importance.'
            },
            {
              name: 'Local Resources',
              description: 'Understanding resources available in our surroundings.'
            }
          ]
        },

        {
          name: 'Telugu / Regional Language',
          icon: '📝',

          topics: [
            {
              name: 'Basic Grammar',
              description: 'Fundamental grammar concepts.'
            },
            {
              name: 'Vocabulary',
              description: 'Basic words and their meanings.'
            },
            {
              name: 'Reading Comprehension',
              description: 'Reading passages and understanding their meaning.'
            }
          ]
        },

        {
          name: 'English',
          icon: '🔤',

          topics: [
            {
              name: 'Alphabet',
              description: 'Basic English alphabet knowledge.'
            },
            {
              name: 'Basic Grammar',
              description: 'Fundamental English grammar.'
            },
            {
              name: 'Plurals',
              description: 'Singular and plural forms of words.'
            },
            {
              name: 'Opposites',
              description: 'Words with opposite meanings.'
            },
            {
              name: 'Simple Sentences',
              description: 'Understanding and forming simple sentences.'
            }
          ]
        },

        {
          name: 'Mental Ability / Reasoning',
          icon: '🧠',

          topics: [
            {
              name: 'Logical Patterns',
              description: 'Identify simple logical patterns.'
            },
            {
              name: 'Shapes',
              description: 'Identify and understand basic shapes.'
            },
            {
              name: 'Series',
              description: 'Simple number, figure and logical series.'
            },
            {
              name: 'Puzzles',
              description: 'Basic logical puzzles and problem solving.'
            }
          ]
        }
      ],

      examPattern: {
        duration: 'As specified for the applicable Gurukula entrance examination',
        questionType: 'Multiple Choice Questions (MCQs)',
        totalQuestions: 'Not specified in the provided reference',
        totalMarks: '100',

        sections: [
          {
            section: 'Mathematics',
            questions: 'Not specified',
            marks: 'Not specified'
          },
          {
            section: 'Environmental Science / Science',
            questions: 'Not specified',
            marks: 'Not specified'
          },
          {
            section: 'Telugu / Regional Language',
            questions: 'Not specified',
            marks: 'Not specified'
          },
          {
            section: 'English',
            questions: 'Not specified',
            marks: 'Not specified'
          },
          {
            section: 'Mental Ability / Reasoning',
            questions: 'Not specified',
            marks: 'Not specified'
          },
          {
            section: 'Total',
            questions: 'Not specified',
            marks: '100'
          }
        ],

        note: 'The provided reference states that the entrance test consists of MCQs adding up to 100 marks across five main areas. It does not specify the exact question/mark distribution for each subject.'
      }
    }

  ];



  // =========================================================
  // SELECT COURSE
  // =========================================================

  selectCourse(courseName: string): void {
    this.selectedCourse = courseName;

    // Scroll smoothly to the course content.
    setTimeout(() => {
      const element = document.getElementById('course-content');

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 50);
  }



  // =========================================================
  // CURRENT COURSE
  // =========================================================

  get currentCourse(): Course {
    return (
      this.courses.find(
        course => course.name === this.selectedCourse
      ) || this.courses[0]
    );
  }



  // =========================================================
  // BACK TO TOP
  // =========================================================

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}