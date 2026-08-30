import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = async () => {

  const router = inject(Router);

  const { getAuth } = await import('firebase/auth');
  const { app } = await import('./firebase');

  const auth = getAuth(app);

  if (auth.currentUser) {
    return true;
  }

  return router.createUrlTree(['/admin-login']);
};