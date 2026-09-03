import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';


@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './home.html',

  styleUrl: './home.scss'
})


export class Home implements OnInit, OnDestroy {


  // =====================================================
  // MOBILE MENU
  // =====================================================

  mobileMenuOpen = false;


  // =====================================================
  // CURRENT YEAR
  // =====================================================

  currentYear = new Date().getFullYear();


  // =====================================================
  // INITIALIZATION
  // =====================================================

  ngOnInit(): void {

    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });

  }


  // =====================================================
  // OPEN MOBILE MENU
  // =====================================================

  toggleMenu(): void {

    this.mobileMenuOpen =
      !this.mobileMenuOpen;

  }


  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  closeMenu(): void {

    this.mobileMenuOpen = false;

  }


  // =====================================================
  // CLEANUP
  // =====================================================

  ngOnDestroy(): void {

    this.mobileMenuOpen = false;

  }

}