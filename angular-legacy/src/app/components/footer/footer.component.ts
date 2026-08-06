import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer>
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <a href="#" class="brand">
              <svg class="brand-mark" viewBox="0 0 36 36" fill="none">
                <path d="M6 6L18 18L6 30" stroke="#14B8A6" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 6L26 18L14 30" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
              </svg>
              <span class="brand-name">Krest<strong>kore</strong></span>
            </a>
            <p class="brand-tagline">Empowering Tomorrow Through Innovation.</p>
            <p class="brand-sub">Lagos, Nigeria · &#64;krestkore</p>
            <div class="social-icons">
              <a *ngFor="let s of socials" [href]="s.url" target="_blank" rel="noopener noreferrer"
                class="social-icon" [attr.aria-label]="s.name">
                <span [innerHTML]="s.svg"></span>
              </a>
            </div>
          </div>

          <div class="footer-links" *ngFor="let col of links">
            <h4>{{ col.title }}</h4>
            <ul>
              <li *ngFor="let l of col.items">
                <a [href]="l.href" [target]="l.external ? '_blank' : '_self'" [rel]="l.external ? 'noopener noreferrer' : ''">{{ l.label }}</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ year }} Krestkore Solutions Limited. All rights reserved.</p>
          <p class="built-with">Built with precision. Delivered with purpose.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer { border-top: 1px solid var(--border); padding: 4rem 0 2rem; }
    .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
    .brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; margin-bottom: 1rem; }
    .brand-mark { width: 30px; height: 30px; }
    .brand-name { font-family: var(--font-display); font-size: 1.1rem; font-weight: 400; color: var(--white); }
    .brand-name strong { color: var(--teal); font-weight: 700; }
    .brand-tagline { font-size: 0.85rem; color: var(--muted); line-height: 1.5; margin-bottom: 0.3rem; font-style: italic; }
    .brand-sub { font-size: 0.78rem; color: var(--muted); opacity: 0.6; margin-bottom: 1.2rem; }

    .social-icons { display: flex; gap: 0.75rem; }
    .social-icon {
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; color: var(--muted);
      transition: border-color 0.2s, color 0.2s, transform 0.2s;
      text-decoration: none;
    }
    .social-icon:hover { border-color: var(--teal); color: var(--teal); transform: translateY(-2px); }
    .social-icon ::ng-deep svg { width: 16px; height: 16px; fill: currentColor; }

    .footer-links h4 { font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--white); margin-bottom: 1.2rem; }
    .footer-links ul { list-style: none; display: flex; flex-direction: column; gap: 0.65rem; }
    .footer-links a { font-size: 0.875rem; color: var(--muted); text-decoration: none; transition: color 0.2s; }
    .footer-links a:hover { color: var(--teal); }

    .footer-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 2rem; border-top: 1px solid var(--border); }
    .footer-bottom p { font-size: 0.78rem; color: var(--muted); opacity: 0.7; }
    .built-with { font-style: italic; }

    @media (max-width: 900px) { .footer-top { grid-template-columns: 1fr 1fr; } .footer-bottom { flex-direction: column; gap: 0.5rem; text-align: center; } }
    @media (max-width: 500px) { .footer-top { grid-template-columns: 1fr; } }
  `]
})
export class FooterComponent implements OnInit {
  year = new Date().getFullYear();

  // Changing the type definition of 'svg' to hold the sanitized SafeHtml structural object instead of a string
  socials: Array<{ name: string; url: string; svg: SafeHtml; }> = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/krestkore',
      svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    },
    {
      name: 'X / Twitter',
      url: 'https://x.com/Krestkore',
      svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.732-8.867-8.16-10.633H8.12l4.241 5.612 5.883-5.612Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/></svg>`,
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/krestkore',
      svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/krestkore-solution-3a5363410',
      svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@krestkore',
      svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75c0-.414-.336-.75-.75-.75h-2.25v2.25c0 .414-.336.75-.75.75s-.75-.336-.75-.75V8.25h2.25c1.243 0 2.25-1.007 2.25-2.25S13.243 3.25 12 3.25z"/></svg>`,
    }
  ];

  links = [
    {
      title: 'Services',
      items: [
        { label: 'Hardware & Infrastructure', href: '#services', external: false },
        { label: 'Networking', href: '#services', external: false },
        { label: 'Software Development', href: '#services', external: false },
        { label: 'Security Systems', href: '#services', external: false },
      ]
    },
    {
      title: 'Company',
      items: [
        { label: 'About Us', href: '#about', external: false },
        { label: 'The Tribe', href: '#about', external: false },
        { label: 'Our Edge', href: '#edge', external: false },
        { label: 'Contact', href: '#contact', external: false },
      ]
    },
    {
      title: 'Connect',
      items: [
        { label: 'Instagram', href: 'https://www.instagram.com/krestkore', external: true },
        { label: 'Twitter / X', href: 'https://x.com/Krestkore', external: true },
        { label: 'Facebook', href: 'https://www.facebook.com/krestkore', external: true },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/krestkore-solution-3a5363410', external: true },
        { label: 'TikTok', href: 'https://www.tiktok.com/@krestkore', external: true },
      ]
    },
  ];

  // Inject DomSanitizer in the constructor
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // Sanitize the raw SVG strings into SafeHtml when the component initializes
    this.socials = this.socials.map(social => ({
      ...social,
      svg: this.sanitizer.bypassSecurityTrustHtml(social.svg as string)
    }));
  }
}