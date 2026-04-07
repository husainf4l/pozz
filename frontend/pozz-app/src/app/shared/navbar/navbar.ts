import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle';
import { LangSwitcherComponent } from '../lang-switcher/lang-switcher';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ThemeToggleComponent, LangSwitcherComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {}
