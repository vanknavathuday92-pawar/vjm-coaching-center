import { Routes } from '@angular/router';
import { PaymentGuard } from './payment-guard';
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
  path: 'admin-login',
  loadComponent: () =>
    import('./admin-login/admin-login').then(m => m.AdminLogin)
},
  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
  },
 {
  path: 'payment',
  canActivate: [PaymentGuard],
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
  path: 'reset-password',
  loadComponent: () =>
    import('./reset-password/reset-password')
      .then(m => m.ResetPassword)
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