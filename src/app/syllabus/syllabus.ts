import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-syllabus',
  imports: [RouterLink],
  templateUrl: './syllabus.html',
  styleUrl: './syllabus.scss'
})
export class Syllabus {

  selectedCourse = 'Navodaya';

  constructor(private router: Router) {}

  selectCourse(course: string) {
    this.selectedCourse = course;
  }

  /*
   * Supports BOTH:
   *
   * 1. watchVideo(title, videoUrl)
   *
   * 2. watchVideo(course, subject, topic, title, videoUrl)
   */

  watchVideo(
    first: string,
    second: string,
    third?: string,
    fourth?: string,
    fifth?: string
  ) {

    let course = '';
    let subject = '';
    let topic = '';
    let title = '';
    let videoUrl = '';

    // 5-argument version
    if (fifth !== undefined) {

      course = first;
      subject = second;
      topic = third ?? '';
      title = fourth ?? topic;
      videoUrl = fifth;

    }

    // 2-argument version
    else {

      title = first;
      videoUrl = second;

      course = this.selectedCourse;
      subject = '';
      topic = title;

    }

    this.router.navigate(['/video'], {
      queryParams: {
        course: course,
        subject: subject,
        topic: topic,
        title: title,
        video: videoUrl
      }
    });

  }

}