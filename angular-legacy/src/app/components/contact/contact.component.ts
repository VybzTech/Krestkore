import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="contact" id="contact">
      <div class="container">
        <div class="contact-inner">
          <div class="contact-info">
            <span class="section-label">Partner With Us</span>
            <h2 class="contact-title">Let's Build Your<br><em>Digital Future</em></h2>
            <p class="contact-sub">Whether you're a Lagos-based startup or a multinational requiring a comprehensive digital overhaul, Krestkore Solutions is ready to lead the way.</p>
            <div class="info-items">
              <div class="info-item" *ngFor="let item of infoItems">
                <div class="info-icon">{{ item.icon }}</div>
                <div>
                  <div class="info-label">{{ item.label }}</div>
                  <div class="info-value">{{ item.value }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-container">
            <!-- Success state -->
            <div class="success-card" *ngIf="status() === 'success'">
              <div class="success-icon">✓</div>
              <h3>Message Sent!</h3>
              <p>Thanks for reaching out. Kris and the Krestkore team will get back to you shortly.</p>
              <button class="btn-reset" (click)="reset()">Send Another Message</button>
            </div>

            <!-- Error state -->
            <div class="error-banner" *ngIf="status() === 'error'">
              <span>⚠️ Something went wrong. Please try again or email us directly at info&#64;krestkore.com</span>
            </div>

            <form class="contact-form" (ngSubmit)="onSubmit()" *ngIf="status() !== 'success'">
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Full Name</label>
                  <input id="name" type="text" [(ngModel)]="form.name" name="name" placeholder="John Doe" required>
                </div>
                <div class="form-group">
                  <label for="email">Email Address</label>
                  <input id="email" type="email" [(ngModel)]="form.email" name="email" placeholder="john@company.com" required>
                </div>
              </div>
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input id="phone" type="tel" [(ngModel)]="form.phone" name="phone" placeholder="+234 000 000 0000">
              </div>
              <div class="form-group">
                <label for="service">Service Interest</label>
                <select id="service" [(ngModel)]="form.service" name="service">
                  <option value="">Select a service...</option>
                  <option value="Hardware Procurement">Hardware Procurement</option>
                  <option value="Networking & Infrastructure">Networking & Infrastructure</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Security Systems">Security Systems</option>
                  <option value="Data Analysis">Data Analysis</option>
                  <option value="IT Consultation">IT Consultation</option>
                </select>
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" [(ngModel)]="form.message" name="message" rows="5" placeholder="Tell us about your project or requirements..." required></textarea>
              </div>
              <button type="submit" class="btn-submit" [disabled]="status() === 'sending'">
                <span *ngIf="status() !== 'sending'">
                  Send Message
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
                <span *ngIf="status() === 'sending'" class="sending-state">
                  <span class="spinner"></span> Sending...
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact { padding: 7rem 0; position: relative; }
    .contact::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--teal), transparent); }
    .contact-inner { display: grid; grid-template-columns: 1fr 1.2fr; gap: 5rem; align-items: start; }
    .contact-title { font-family: var(--font-display); font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 1rem; }
    .contact-title em { font-style: normal; color: var(--teal); }
    .contact-sub { font-size: 0.95rem; line-height: 1.75; color: var(--muted); margin-bottom: 2.5rem; }
    .info-items { display: flex; flex-direction: column; gap: 1.5rem; }
    .info-item { display: flex; align-items: center; gap: 1rem; }
    .info-icon { width: 44px; height: 44px; background: var(--teal-glow); border: 1px solid var(--border); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
    .info-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.15rem; }
    .info-value { font-size: 0.9rem; font-weight: 500; }

    .form-container { position: relative; }
    .contact-form { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 2.5rem; display: flex; flex-direction: column; gap: 1.2rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    label { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.04em; color: var(--muted); }
    input, select, textarea {
      background: rgba(255,255,255,0.04); border: 1px solid var(--border);
      border-radius: 6px; padding: 0.75rem 1rem;
      font-family: var(--font-body); font-size: 0.9rem; color: var(--white);
      width: 100%; transition: border-color 0.2s, box-shadow 0.2s; resize: none;
    }
    input::placeholder, textarea::placeholder { color: var(--muted); }
    input:focus, select:focus, textarea:focus { outline: none; border-color: var(--teal); box-shadow: 0 0 0 3px rgba(20,184,166,0.1); }
    select option { background: var(--navy); }
    .btn-submit {
      width: 100%; padding: 0.95rem; background: var(--teal); color: var(--navy);
      border: none; border-radius: 6px; font-family: var(--font-body);
      font-size: 0.95rem; font-weight: 700; cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    }
    .btn-submit span { display: flex; align-items: center; gap: 0.5rem; }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(20,184,166,0.4); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

    .spinner {
      width: 16px; height: 16px;
      border: 2px solid var(--navy);
      border-top-color: transparent;
      border-radius: 50%;
      display: inline-block;
      animation: spinSlow 0.7s linear infinite;
    }

    .success-card {
      background: var(--surface); border: 1px solid var(--teal);
      border-radius: 14px; padding: 3rem 2.5rem;
      text-align: center; animation: chatPop 0.5s var(--ease-out-expo) both;
    }
    .success-icon {
      width: 64px; height: 64px;
      background: var(--teal); color: var(--navy);
      border-radius: 50%; font-size: 1.8rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.2rem;
    }
    .success-card h3 { font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.75rem; }
    .success-card p { font-size: 0.9rem; color: var(--muted); line-height: 1.6; margin-bottom: 1.5rem; }
    .btn-reset {
      padding: 0.7rem 1.8rem; background: none; border: 1px solid var(--teal);
      border-radius: 6px; color: var(--teal); font-family: var(--font-body);
      font-size: 0.85rem; font-weight: 600; cursor: pointer;
      transition: background 0.2s;
    }
    .btn-reset:hover { background: var(--teal-glow); }

    .error-banner {
      background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
      border-radius: 8px; padding: 1rem; margin-bottom: 1rem;
      font-size: 0.85rem; color: #fca5a5; line-height: 1.5;
    }

    @media (max-width: 900px) {
      .contact-inner { grid-template-columns: 1fr; gap: 3rem; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactComponent {
  status = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
  form = { name: '', email: '', phone: '', service: '', message: '' };

  infoItems = [
    { icon: '📍', label: 'Location', value: 'Lagos, Nigeria' },
    { icon: '📧', label: 'Email', value: 'info@krestkore.com' },
    { icon: '📞', label: 'Phone', value: '0705 045 8935' },
  ];

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.form.name || !this.form.email || !this.form.message) return;
    this.status.set('sending');

    const payload = {
      name: this.form.name,
      email: this.form.email,
      phone: this.form.phone,
      service: this.form.service,
      message: this.form.message,
    };

    const headers = new HttpHeaders({ 'Accept': 'application/json' });

    this.http.post('https://formspree.io/f/xeewealy', payload, { headers })
      .subscribe({
        next: () => this.status.set('success'),
        error: () => this.status.set('error'),
      });
  }

  reset() {
    this.form = { name: '', email: '', phone: '', service: '', message: '' };
    this.status.set('idle');
  }
}
