import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaymentGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const studentLoggedIn = localStorage.getItem('studentLoggedIn');

    if (studentLoggedIn === 'true') {
      // Student is logged in
      return true;
    }

    // Student is not logged in
    this.router.navigate(['/student-login'], {
      queryParams: {
        returnUrl: state.url
      }
    });

    return false;
  }
}