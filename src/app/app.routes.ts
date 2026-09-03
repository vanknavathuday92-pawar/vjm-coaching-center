import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./home/home').then(m => m.Home)
  },

  {
    path: 'student-login',
    loadComponent: () =>
      import('./student-login/student-login').then(m => m.StudentLogin)
  },

  {
    path: 'payment',
    loadComponent: () =>
      import('./payment/payment').then(m => m.Payment)
  },

  {
    path: 'syllabus',
    loadComponent: () =>
      import('./syllabus/syllabus').then(m => m.Syllabus)
  },
{
  path: 'register',
  loadComponent: () =>
    import('./register/register')
      .then(m => m.Register)
},
  {
    path: 'video',
    loadComponent: () =>
      import('./video/video').then(m => m.Video)
  },

  {
    path: '**',
    redirectTo: ''
  }
];