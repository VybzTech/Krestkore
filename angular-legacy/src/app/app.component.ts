import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { MarqueeComponent } from './components/marquee/marquee.component';
import { ServicesComponent } from './components/services/services.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ChatAgentComponent } from './components/chat-agent/chat-agent.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    MarqueeComponent,
    ServicesComponent,
    TestimonialsComponent,
    AboutComponent,
    ContactComponent,
    ChatAgentComponent,
    FooterComponent,
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-hero></app-hero>
      <app-marquee></app-marquee>
      <app-services></app-services>
      <app-testimonials></app-testimonials>
      <app-about></app-about>
      <app-contact></app-contact>
    </main>
    <app-footer></app-footer>
    <app-chat-agent></app-chat-agent>
  `,
  styles: [`main { display: block; }`]
})
export class AppComponent {}
