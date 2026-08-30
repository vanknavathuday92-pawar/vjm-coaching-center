import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Register } from './register/register';
import { AdminLogin } from './admin-login/admin-login';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'admin-login',
    component: AdminLogin
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboard
  }

];