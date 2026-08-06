import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="services" id="services">
      <div class="container">
        <header class="section-header">
          <span class="section-label">What We Do</span>
          <h2 class="section-title">Full-Spectrum<br><em>IT Solutions</em></h2>
          <p class="section-sub">We bridge the gap between complex technical requirements and real business outcomes.</p>
        </header>
        <div class="services-grid">
          <article class="service-card" *ngFor="let s of services; let i = index" [style.animation-delay]="(i * 0.1) + 's'">
            <div class="card-accent"></div>
            <div class="card-header">
              <div class="card-icon">{{ s.icon }}</div>
              <span class="card-category">{{ s.category }}</span>
            </div>
            <h3 class="card-title">{{ s.title }}</h3>
            <p class="card-desc">{{ s.desc }}</p>
            <ul class="card-items">
              <li *ngFor="let item of s.items">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#14B8A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ item }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .services { padding: 7rem 0; position: relative; }
    .services::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--teal), transparent); }
    .section-header { max-width: 520px; margin-bottom: 4rem; }
    .section-title { font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1rem; }
    .section-title em { font-style: normal; color: var(--teal); }
    .section-sub { font-size: 1rem; line-height: 1.7; color: var(--muted); }
    .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5px; background: var(--border); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
    .service-card { background: var(--dark); padding: 2.4rem; position: relative; overflow: hidden; transition: background 0.3s; animation: fadeUp 0.6s var(--ease-out-expo) both; }
    .service-card:hover { background: var(--surface); }
    .service-card:hover .card-accent { opacity: 1; }
    .card-accent { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--teal), transparent); opacity: 0; transition: opacity 0.3s; }
    .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.4rem; }
    .card-icon { font-size: 1.8rem; line-height: 1; }
    .card-category { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--teal); background: var(--teal-glow); padding: 0.3rem 0.7rem; border-radius: 20px; }
    .card-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; margin-bottom: 0.8rem; line-height: 1.3; }
    .card-desc { font-size: 0.875rem; line-height: 1.65; color: var(--muted); margin-bottom: 1.4rem; }
    .card-items { list-style: none; display: flex; flex-direction: column; gap: 0.55rem; }
    .card-items li { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.82rem; color: var(--muted); line-height: 1.4; }
    .card-items li svg { flex-shrink: 0; margin-top: 2px; }
    @media (max-width: 900px) { .services-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 600px) { .services-grid { grid-template-columns: 1fr; } }
  `]
})
export class ServicesComponent {
  services = [
    { icon: '🖥️', category: 'Infrastructure', title: 'Hardware Procurement & Maintenance', desc: 'Sourcing and maintaining high-end IT equipment tailored to your operational requirements.', items: ['Hardware sourcing & repairs', 'Upgrades & optimization', 'Asset lifecycle management'] },
    { icon: '🌐', category: 'Infrastructure', title: 'Networking & Deployment', desc: 'Designing and implementing robust network architectures for high-speed, secure connectivity.', items: ['LAN/WAN design', 'Wireless infrastructure', 'VPN & firewall setup'] },
    { icon: '☁️', category: 'Infrastructure', title: 'Server Infrastructure', desc: 'Deploying scalable server solutions for maximum uptime, on-premises and in the cloud.', items: ['On-prem server deployment', 'Cloud migrations', 'Backup & disaster recovery'] },
    { icon: '🔐', category: 'Security', title: 'Security Systems', desc: 'Procurement, installation, and maintenance of physical and digital security solutions.', items: ['CCTV installation', 'Access control systems', 'Biometric solutions'] },
    { icon: '💻', category: 'Software', title: 'Custom Software Development', desc: 'Bespoke, responsive software solutions, web platforms, mobile apps, and internal tools.', items: ['Web & mobile apps', 'UI/UX-focused design', 'API integrations'] },
    { icon: '📊', category: 'Intelligence', title: 'Data Analysis & IT Consultation', desc: 'Transforming raw data into actionable insights and guiding long-term digital strategy.', items: ['Business intelligence', 'Digital transformation', 'Technical training'] },
  ];
}
