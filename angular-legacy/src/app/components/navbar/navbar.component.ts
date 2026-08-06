import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav [class.scrolled]="scrolled()">
      <div class="nav-inner container">
        <a href="#" class="brand" aria-label="Krestkore Home">
          <svg class="brand-mark" viewBox="0 0 36 36" fill="none">
            <path d="M6 6L18 18L6 30" stroke="#14B8A6" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 6L26 18L14 30" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
          </svg>
          <span class="brand-name">Krest<strong>kore</strong></span>
        </a>
        <ul class="nav-links" [class.open]="menuOpen()">
          <li><a href="#services" (click)="closeMenu()">Services</a></li>
          <li><a href="#about" (click)="closeMenu()">About</a></li>
          <li><a href="#testimonials" (click)="closeMenu()">Clients</a></li>
          <li><a href="#contact" (click)="closeMenu()">Contact</a></li>
          <li class="nav-cta"><a href="#contact" class="btn-nav" (click)="closeMenu()">Get Started</a></li>
        </ul>
        <button class="menu-toggle" (click)="toggleMenu()" [attr.aria-expanded]="menuOpen()" aria-label="Toggle menu">
          <span [class.open]="menuOpen()"></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      padding: 1.4rem 0;
      transition: padding 0.4s var(--ease-out-expo), background 0.4s ease;
      animation: fadeIn 0.6s ease both;
    }
    nav.scrolled {
      padding: 0.8rem 0;
      background: rgba(6,14,30,0.9);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; }
    .brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; }
    .brand-mark { width: 36px; height: 36px; }
    .brand-name { font-family: var(--font-display); font-size: 1.15rem; font-weight: 400; color: var(--white); }
    .brand-name strong { color: var(--teal); font-weight: 700; }
    .nav-links { display: flex; align-items: center; gap: 2.5rem; list-style: none; }
    .nav-links a {
      font-size: 0.875rem; font-weight: 500; color: var(--muted);
      text-decoration: none; transition: color 0.2s; position: relative;
    }
    .nav-links a::after {
      content: ''; position: absolute; bottom: -3px; left: 0;
      width: 0; height: 1px; background: var(--teal);
      transition: width 0.3s var(--ease-out-expo);
    }
    .nav-links a:hover { color: var(--white); }
    .nav-links a:hover::after { width: 100%; }
    .btn-nav {
      display: inline-block; padding: 0.55rem 1.4rem;
      background: var(--teal); color: var(--navy) !important;
      border-radius: 4px; font-weight: 700 !important; font-size: 0.82rem !important;
      transition: transform 0.2s, box-shadow 0.2s !important;
    }
    .btn-nav::after { display: none !important; }
    .btn-nav:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(20,184,166,0.35); }
    .menu-toggle { display: none; flex-direction: column; background: none; border: none; cursor: pointer; padding: 4px; }
    .menu-toggle span, .menu-toggle span::before, .menu-toggle span::after {
      display: block; width: 24px; height: 2px; background: var(--white);
      transition: transform 0.3s, opacity 0.3s; position: relative;
    }
    .menu-toggle span::before, .menu-toggle span::after { content: ''; position: absolute; }
    .menu-toggle span::before { top: -8px; }
    .menu-toggle span::after  { top: 8px; }
    .menu-toggle span.open { background: transparent; }
    .menu-toggle span.open::before { transform: rotate(45deg); top: 0; }
    .menu-toggle span.open::after  { transform: rotate(-45deg); top: 0; }
    @media (max-width: 768px) {
      .menu-toggle { display: flex; }
      .nav-links {
        position: fixed; top: 0; right: -100%; width: 75%; max-width: 300px; height: 100vh;
        background: var(--surface); border-left: 1px solid var(--border);
        flex-direction: column; align-items: flex-start; padding: 5rem 2rem 2rem;
        gap: 2rem; transition: right 0.4s var(--ease-out-expo);
      }
      .nav-links.open { right: 0; }
    }
  `]
})
export class NavbarComponent {
  scrolled = signal(false);
  menuOpen = signal(false);
  @HostListener('window:scroll') onScroll() { this.scrolled.set(window.scrollY > 40); }
  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu()  { this.menuOpen.set(false); }
}
