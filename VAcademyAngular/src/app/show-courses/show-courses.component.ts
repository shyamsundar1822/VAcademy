import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { teacherCourse } from '../services/teacherCourse.service';
import { studentCourse } from '../services/studentCourse.service';

@Component({
  selector: 'app-show-courses',
  templateUrl: './show-courses.component.html',
  styleUrls: ['./show-courses.component.css']
})
export class ShowCoursesComponent implements OnInit {

  courses: any;
  errorMessage = '';

  flag: boolean;

  courseDetails: any;
  role: String;

  isCourse: boolean = false;
  showModalCourseDetails: boolean = false;

  isStudent = false;
  isTeacher = false;

  studentId: any;
  studentName: any;

  constructor(private tokenStorage: TokenStorageService,
    private teacherCourseService: teacherCourse,
    private studentCourseService: studentCourse
  ) { }

  ngOnInit(): void {
    this.role = this.tokenStorage.getUser().role;
    this.teacherCourseService.getCourses().subscribe(
      data => {
        this.courses = data;
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );

    if(this.role == 'student') {
      this.isStudent = true;
    }
    if(this.role == 'teacher') {
      this.isTeacher = true;
    }
  }

  openCourse(id) {
    this.isCourse = true;
    this.showModalCourseDetails = true;
    console.log(id);
    this.teacherCourseService.getCourseById(id).subscribe(
      data => {
        this.courseDetails = data;
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }

  hideModal()
  {
    this.showModalCourseDetails = false;
    this.isCourse = false;
  }

  registerStudent(courseId, courseName) {
    this.studentId = this.tokenStorage.getUser().id;
    this.studentName = this.tokenStorage.getUser().name;
    this.studentCourseService.addStudentCourse(courseId, courseName, this.studentId, this.studentName).subscribe(
      data => {
        this.courseDetails = data;
        alert("Added!");
      },
      err => {
        this.errorMessage = err.error.message;
        alert(this.errorMessage);
      }
    );
    this.hideModal();
  }

}
