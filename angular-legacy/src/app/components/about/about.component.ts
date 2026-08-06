import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about" id="about">
      <div class="container">
        <div class="edge-block" id="edge">
          <span class="section-label">The Krestkore Edge</span>
          <h2 class="section-title">Three Pillars of<br><em>Uncompromising Excellence</em></h2>
          <div class="pillars">
            <div class="pillar" *ngFor="let p of pillars">
              <div class="pillar-number">{{ p.num }}</div>
              <h3>{{ p.title }}</h3>
              <p>{{ p.desc }}</p>
            </div>
          </div>
        </div>
        <div class="tribe-block">
          <div class="tribe-text">
            <span class="section-label">The Krestkore Tribe</span>
            <h2 class="tribe-title">Young. Passionate.<br><em>Expert.</em></h2>
            <p class="tribe-desc">A dedicated collective of innovative product managers, engineers, developers, and analysts united by a shared goal of technical excellence. We operate with the agility of a boutique agency and the expertise to manage enterprise-level challenges.</p>
            <a href="#contact" class="btn-primary">Partner With Us</a>
          </div>
          <div class="tribe-visual">
            <div class="tribe-card" *ngFor="let r of roles; let i = index" [style.animation-delay]="(i*0.1)+'s'">
              <span class="role-icon">{{ r.icon }}</span>
              <span class="role-name">{{ r.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about { padding: 4rem 0; position: relative; }
    .edge-block { margin-bottom: 3rem; }
    .section-title { font-family: var(--font-display); font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 3rem; }
    .section-title em { font-style: normal; color: var(--teal); }
    .pillars { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; }
    .pillar { padding: 2rem; border: 1px solid var(--border); border-radius: 10px; transition: border-color 0.3s, transform 0.3s; }
    .pillar:hover { border-color: var(--teal); transform: translateY(-4px); }
    .pillar-number { font-family: var(--font-display); font-size: 4rem; font-weight: 800; color: rgba(20,184,166,0.08); line-height: 1; margin-bottom: 1rem; }
    .pillar h3 { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--teal); }
    .pillar p { font-size: 0.9rem; line-height: 1.65; color: var(--muted); }
    .tribe-block { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
    .tribe-title { font-family: var(--font-display); font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1.2rem; }
    .tribe-title em { font-style: normal; color: var(--teal); }
    .tribe-desc { font-size: 1rem; line-height: 1.75; color: var(--muted); margin-bottom: 2rem; }
    .btn-primary { display: inline-block; padding: 0.85rem 2rem; background: var(--teal); color: var(--navy); border-radius: 5px; font-size: 0.9rem; font-weight: 700; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(20,184,166,0.4); }
    .tribe-visual { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .tribe-card { display: flex; flex-direction: column; align-items: center; gap: 0.7rem; padding: 1.5rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; text-align: center; transition: border-color 0.3s, transform 0.3s; animation: fadeUp 0.5s var(--ease-out-expo) both; }
    .tribe-card:hover { border-color: var(--teal); transform: translateY(-3px); }
    .role-icon { font-size: 1.8rem; }
    .role-name { font-size: 0.8rem; font-weight: 600; color: var(--muted); }
    @media (max-width: 900px) { .pillars { grid-template-columns: 1fr; } .tribe-block { grid-template-columns: 1fr; } }
  `]
})
export class AboutComponent {
  pillars = [
    { num: '01', title: 'Innovation', desc: 'We don\'t just follow trends, we leverage the latest technology to provide our clients with a distinct competitive advantage in their markets.' },
    { num: '02', title: 'Customer Centricity', desc: 'Your specific business goals are the foundational blueprint for every technical design and solution we build. Your success is our success.' },
    { num: '03', title: 'Excellence Driven', desc: 'Uncompromisingly high standards across procurement, installation, and ongoing support. We take no shortcuts ever.' },
  ];
  roles = [
    { icon: '🧠', name: 'Product Managers' },
    { icon: '⚙️', name: 'Engineers' },
    { icon: '💻', name: 'Developers' },
    { icon: '📈', name: 'Data Analysts' },
  ];
}
