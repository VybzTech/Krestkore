import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero" id="home">
      <div class="bg-grid"></div>
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
      <div class="scan-line"></div>
      <div class="container hero-inner">
        <div class="hero-content">
          <span class="section-label">Lagos · Nigeria</span>
          <h1 class="hero-title">
            <span class="line">Empowering</span>
            <span class="line accent">Tomorrow</span>
            <span class="line">Through Innovation</span>
          </h1>
          <p class="hero-sub">Krestkore Solutions is the digital backbone organisations trust, from hardware procurement to custom software, data intelligence, and enterprise networking.</p>
          <div class="hero-actions">
            <a href="#services" class="btn-primary">Explore Solutions</a>
            <a href="#contact" class="btn-ghost">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Talk to us
            </a>
          </div>
          <div class="hero-stats">
            <div class="stat" *ngFor="let s of stats">
              <span class="stat-value">{{ s.value }}</span>
              <span class="stat-label">{{ s.label }}</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="visual-ring ring-outer"></div>
          <div class="visual-ring ring-mid"></div>
          <div class="visual-ring ring-inner"></div>
          <div class="visual-core">
            <svg viewBox="0 0 80 80" fill="none" class="core-icon">
              <path d="M16 16L40 40L16 64" stroke="#14B8A6" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M32 16L56 40L32 64" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
            </svg>
          </div>
          <div class="orbit-dot dot-1"></div>
          <div class="orbit-dot dot-2"></div>
          <div class="orbit-dot dot-3"></div>
          <div class="floating-cards">
            <div class="fcard" *ngFor="let c of floatingCards; let i = index" [style.animation-delay]="(i * 0.15) + 's'">
              <span class="fcard-icon">{{ c.icon }}</span>
              <span class="fcard-text">{{ c.text }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="scroll-hint">
        <span>Scroll</span>
        <div class="scroll-line"></div>
      </div>
    </section>
  `,
  styles: [`
    .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden; padding: 7rem 0 4rem; }
    .bg-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(20,184,166,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.04) 1px, transparent 1px); background-size: 48px 48px; animation: gridPulse 6s ease-in-out infinite; }
    .bg-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
    .orb-1 { width: 600px; height: 600px; top: -200px; right: -100px; background: radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%); animation: floatBall 10s ease-in-out infinite; }
    .orb-2 { width: 400px; height: 400px; bottom: -100px; left: -50px; background: radial-gradient(circle, rgba(10,31,68,0.8) 0%, transparent 70%); }
    .scan-line { position: absolute; top: 30%; left: 0; width: 200px; height: 1px; background: linear-gradient(90deg, transparent, rgba(20,184,166,0.6), transparent); animation: scanLine 8s linear infinite; pointer-events: none; }
    .hero-inner { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 4rem; position: relative; z-index: 1; }
    .hero-title { font-family: var(--font-display); font-size: clamp(2.6rem, 5vw, 4.2rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 1.6rem; }
    .hero-title .line { display: block; animation: fadeUp 0.8s var(--ease-out-expo) both; }
    .hero-title .line:nth-child(1) { animation-delay: 0.15s; }
    .hero-title .line:nth-child(2) { animation-delay: 0.25s; }
    .hero-title .line:nth-child(3) { animation-delay: 0.35s; }
    .hero-title .accent { color: var(--teal); }
    .hero-sub { font-size: 1.05rem; line-height: 1.75; color: var(--muted); max-width: 480px; margin-bottom: 2.4rem; animation: fadeUp 0.8s var(--ease-out-expo) 0.45s both; }
    .hero-actions { display: flex; align-items: center; gap: 1.4rem; margin-bottom: 3rem; animation: fadeUp 0.8s var(--ease-out-expo) 0.55s both; }
    .btn-primary { display: inline-block; padding: 0.85rem 2rem; background: var(--teal); color: var(--navy); border-radius: 5px; font-size: 0.9rem; font-weight: 700; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(20,184,166,0.4); }
    .btn-ghost { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; font-weight: 500; color: var(--muted); text-decoration: none; transition: color 0.2s; }
    .btn-ghost:hover { color: var(--white); }
    .hero-stats { display: flex; gap: 2.5rem; animation: fadeUp 0.8s var(--ease-out-expo) 0.65s both; }
    .stat { display: flex; flex-direction: column; gap: 0.2rem; }
    .stat-value { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--white); }
    .stat-label { font-size: 0.72rem; font-weight: 500; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
    .hero-visual { position: relative; display: flex; align-items: center; justify-content: center; min-height: 460px; animation: fadeIn 1.2s ease 0.3s both; }
    .visual-ring { position: absolute; border-radius: 50%; border: 1px solid var(--border); animation: borderGlow 4s ease-in-out infinite, spinSlow linear infinite; }
    .ring-outer { width: 380px; height: 380px; animation-duration: 4s, 30s; }
    .ring-mid { width: 280px; height: 280px; border-style: dashed; animation-duration: 4s, 20s; animation-direction: normal, reverse; }
    .ring-inner { width: 180px; height: 180px; animation-duration: 4s, 14s; }
    .visual-core { width: 110px; height: 110px; background: var(--surface); border-radius: 50%; border: 2px solid var(--teal); display: flex; align-items: center; justify-content: center; position: relative; z-index: 2; box-shadow: 0 0 48px rgba(20,184,166,0.25), inset 0 0 24px rgba(20,184,166,0.08); }
    .core-icon { width: 56px; height: 56px; }
    .orbit-dot { position: absolute; width: 10px; height: 10px; background: var(--teal); border-radius: 50%; box-shadow: 0 0 10px var(--teal); }
    .dot-1 { top: 50%; left: 50%; transform: translate(-50%, -190px); }
    .dot-2 { top: 50%; left: 50%; transform: translate(135px, 60px); }
    .dot-3 { top: 50%; left: 50%; transform: translate(-135px, 60px); opacity: 0.5; }
    .floating-cards { position: absolute; inset: 0; pointer-events: none; }
    .fcard { position: absolute; display: flex; align-items: center; gap: 0.5rem; background: rgba(12,26,54,0.9); border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 500; color: var(--white); backdrop-filter: blur(10px); animation: fadeUp 0.6s var(--ease-out-expo) both, floatBall 6s ease-in-out infinite; white-space: nowrap; }
    .fcard:nth-child(1) { top: 10%; left: -5%; }
    .fcard:nth-child(2) { top: 20%; right: -8%; }
    .fcard:nth-child(3) { bottom: 25%; left: -8%; }
    .fcard:nth-child(4) { bottom: 12%; right: -5%; }
    .fcard-icon { font-size: 1rem; }
    .fcard-text { color: var(--muted); }
    .scroll-hint { position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 0.6rem; z-index: 1; animation: fadeIn 1s ease 1.2s both; }
    .scroll-hint span { font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
    .scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, var(--muted), transparent); }
    @media (max-width: 900px) {
      .hero-inner { grid-template-columns: 1fr; text-align: center; }
      .hero-sub { margin: 0 auto 2.4rem; }
      .hero-actions { justify-content: center; }
      .hero-stats { justify-content: center; }
      .hero-visual { min-height: 300px; }
      .ring-outer { width: 260px; height: 260px; }
      .ring-mid { width: 190px; height: 190px; }
      .ring-inner { width: 120px; height: 120px; }
      .fcard { display: none; }
    }
  `]
})
export class HeroComponent {
  stats = [
    { value: '1+', label: 'Years Active' },
    { value: '10+', label: 'Clients Served' },
    { value: '100%', label: 'Commitment' },
  ];
  floatingCards = [
    { icon: '🖥️', text: 'Hardware Procurement' },
    { icon: '🌐', text: 'Network Architecture' },
    { icon: '📊', text: 'Data Intelligence' },
    { icon: '🔒', text: 'Cybersecurity' },
  ];
}
