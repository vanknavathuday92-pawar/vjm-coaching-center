import { Routes } from '@angular/router';

import { authGuard } from './auth-guard';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./home/home')
        .then(m => m.Home)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./register/register')
        .then(m => m.Register)
  },

  {
    path: 'admin-login',
    loadComponent: () =>
      import('./admin-login/admin-login')
        .then(m => m.AdminLogin)
  },
{
    path: 'syllabus',
    loadComponent: () =>
      import('./syllabus/syllabus').then(m => m.Syllabus)
  },
  {
  path: 'payment',
  loadComponent: () =>
    import('./payment/payment').then(m => m.Payment)
},
 {
    path: 'video',
    loadComponent: () =>
      import('./video/video').then(m => m.Video)
  },
  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboard),

    canActivate: [authGuard]
  },
   {
    path: '**',
    redirectTo: ''
  }

];