import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="testimonials" id="testimonials">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Client Stories</span>
          <h2 class="section-title">What Our Clients<br><em>Say About Us</em></h2>
        </div>

        <div class="carousel-wrapper">
          <div class="carousel-track">
            <div class="testimonial-card"
              *ngFor="let t of testimonials; let i = index"
              [class.active]="i === activeIndex()"
              [class.prev]="i === prevIndex()"
              [class.next]="i === nextIndex()">
              <div class="card-inner">
                <div class="quote-mark">"</div>
                <p class="testimonial-text">{{ t.text }}</p>
                <div class="testimonial-author">
                  <div class="author-avatar">
                    <img [src]="t.image" [alt]="t.name" loading="lazy">
                  </div>
                  <div class="author-info">
                    <span class="author-name">{{ t.name }}</span>
                    <div class="stars">
                      <span *ngFor="let s of [1,2,3,4,5]">★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="carousel-controls">
            <button class="ctrl-btn" (click)="prev()" aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="dots">
              <button class="dot" *ngFor="let t of testimonials; let i = index"
                [class.active]="i === activeIndex()"
                (click)="goTo(i)"
                [attr.aria-label]="'Go to testimonial ' + (i+1)">
              </button>
            </div>
            <button class="ctrl-btn" (click)="next()" aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>

        <!-- Side thumbnails -->
        <div class="thumb-row">
          <div class="thumb" *ngFor="let t of testimonials; let i = index"
            [class.active]="i === activeIndex()"
            (click)="goTo(i)">
            <img [src]="t.image" [alt]="t.name">
            <span>{{ t.name }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonials { padding: 4rem 0 4rem; position: relative; }
    .testimonials::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--teal), transparent); }
    .testimonials::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--teal), transparent); }
    .section-header { max-width: 520px; margin-bottom: 3.5rem; }
    .section-title { font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1rem; }
    .section-title em { font-style: normal; color: var(--teal); }

    .carousel-wrapper { position: relative; overflow: hidden; }
    .carousel-track { position: relative; height: 320px; }

    .testimonial-card {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transform: translateX(80px) scale(0.95);
      transition: all 0.6s var(--ease-out-expo);
      pointer-events: none;
    }
    .testimonial-card.active {
      opacity: 1; transform: translateX(0) scale(1);
      pointer-events: all; z-index: 2;
    }
    .testimonial-card.prev {
      opacity: 0; transform: translateX(-80px) scale(0.95);
    }

    .card-inner {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2.5rem 3rem;
      max-width: 720px;
      width: 100%;
      position: relative;
      overflow: hidden;
    }
    .card-inner::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, var(--teal), transparent);
    }
    .quote-mark {
      font-family: var(--font-display);
      font-size: 5rem;
      line-height: 0.8;
      color: var(--teal);
      opacity: 0.3;
      margin-bottom: 0.5rem;
    }
    .testimonial-text {
      font-size: 1.05rem;
      line-height: 1.8;
      color: var(--off-white);
      margin-bottom: 2rem;
      font-style: italic;
    }
    .testimonial-author { display: flex; align-items: center; gap: 1.2rem; }
    .author-avatar {
      width: 52px; height: 52px;
      border-radius: 50%;
      border: 2px solid var(--teal);
      overflow: hidden;
      flex-shrink: 0;
    }
    .author-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .author-name { font-family: var(--font-display); font-size: 1rem; font-weight: 700; display: block; margin-bottom: 0.3rem; }
    .stars { color: var(--teal); font-size: 0.85rem; letter-spacing: 2px; }

    .carousel-controls { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-top: 2rem; }
    .ctrl-btn {
      width: 44px; height: 44px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 50%; cursor: pointer; color: var(--muted);
      display: flex; align-items: center; justify-content: center;
      transition: border-color 0.2s, color 0.2s, transform 0.2s;
    }
    .ctrl-btn:hover { border-color: var(--teal); color: var(--teal); transform: scale(1.1); }
    .dots { display: flex; gap: 0.5rem; }
    .dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--border);
      border: none;
      cursor: pointer;
      transition: background 0.3s, transform 0.3s;
    }
    .dot.active { background: var(--teal); transform: scale(1.3); }

    /* Thumbnails */
    .thumb-row {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 2.5rem;
      flex-wrap: wrap;
    }
    .thumb {
      display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
      cursor: pointer; opacity: 0.45; transition: opacity 0.3s, transform 0.3s;
    }
    .thumb.active { opacity: 1; }
    .thumb:hover { opacity: 0.8; transform: translateY(-2px); }
    .thumb img {
      width: 48px; height: 48px;
      border-radius: 50%;
      border: 2px solid transparent;
      object-fit: cover;
      transition: border-color 0.3s;
    }
    .thumb.active img { border-color: var(--teal); }
    .thumb span { font-size: 0.72rem; font-weight: 600; color: var(--muted); }
    .thumb.active span { color: var(--teal); }

    @media (max-width: 768px) {
      .card-inner { padding: 1.8rem; }
      .testimonial-text { font-size: 0.9rem; }
      .carousel-track { height: 380px; }
    }
  `]
})
export class TestimonialsComponent {
  testimonials = [
    {
      name: 'Oluwafemi',
      image: 'assets/alec-whitten.jfif',
      text: 'Working with Krestkore Solutions Limited has been a great experience. Their team is highly professional, responsive, and knowledgeable. They helped streamline our technology setup and provided reliable IT support every step of the way.'
    },
    {
      name: 'Adeyemi',
      image: 'assets/kari-rasmussen.jfif',
      text: 'Beyond fixing the immediate issues, they also provided preventive maintenance recommendations that have helped improve the reliability and lifespan of our systems. Their responsiveness and technical expertise minimized downtime and allowed our operations to continue without disruption.'
    },
    {
      name: 'Nifemi',
      image: 'assets/alisa-hester.jfif',
      text: 'Their insights helped us make informed technology decisions, optimize our processes, and improve overall efficiency. What stood out most was their ability to explain technical concepts in a clear and actionable manner, making the entire process straightforward and productive.'
    },
    {
      name: 'Peace',
      image: 'assets/nala-goins.jfif',
      text: 'What stood out most was their commitment to understanding our needs and delivering solutions that genuinely improved our operations. Thanks to their expertise, we can focus on growing our business with confidence.'
    },
  ];

  activeIndex = signal(0);

  prevIndex = computed(() => {
    const i = this.activeIndex();
    return i === 0 ? this.testimonials.length - 1 : i - 1;
  });

  nextIndex = computed(() => {
    const i = this.activeIndex();
    return (i + 1) % this.testimonials.length;
  });

  private autoTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startAuto();
  }

  startAuto() {
    this.autoTimer = setInterval(() => this.next(), 5000);
  }

  resetAuto() {
    if (this.autoTimer) clearInterval(this.autoTimer);
    this.startAuto();
  }

  next() {
    this.activeIndex.update(i => (i + 1) % this.testimonials.length);
    this.resetAuto();
  }

  prev() {
    this.activeIndex.update(i => i === 0 ? this.testimonials.length - 1 : i - 1);
    this.resetAuto();
  }

  goTo(i: number) {
    this.activeIndex.set(i);
    this.resetAuto();
  }
}
