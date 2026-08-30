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
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboard),

    canActivate: [authGuard]
  }

];