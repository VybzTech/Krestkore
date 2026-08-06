import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-agent',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="agent-wrapper">
      <!-- Chat bubble -->
      <div class="chat-bubble" [class.visible]="chatOpen()">
        <div class="chat-header">
          <img src="assets/Animated_Krestkore_Agent.png" alt="Kris" class="chat-avatar">
          <div>
            <strong>Kris</strong>
            <span class="online-dot"></span>
            <small>Krestkore Support</small>
          </div>
          <button class="close-btn" (click)="toggleChat()" aria-label="Close chat">✕</button>
        </div>
        <div class="chat-body">
          <div class="bot-msg">
            <p>👋 Hey there! I'm <strong>Kris</strong>, your Krestkore assistant.</p>
            <p>Need help with IT services, a quote, or just have a question? I've got you covered.</p>
          </div>
          <div class="quick-actions">
            <button class="quick-btn" *ngFor="let q of quickLinks" (click)="handleQuick(q)">{{ q.label }}</button>
          </div>
          <div class="user-msg" *ngIf="userMessage()">
            <p>{{ userMessage() }}</p>
          </div>
          <div class="bot-msg reply" *ngIf="botReply()">
            <p>{{ botReply() }}</p>
          </div>
        </div>
        <div class="chat-footer">
          <a href="#contact" class="chat-cta" (click)="toggleChat()">
            Contact the full team →
          </a>
        </div>
      </div>

      <!-- Agent toggle button -->
      <button class="agent-btn" (click)="toggleChat()" [attr.aria-label]="chatOpen() ? 'Close chat' : 'Chat with Kris'">
        <div class="agent-img-wrap" [class.bounce]="!chatOpen()">
          <img src="assets/Animated_Krestkore_Agent.png" alt="Kris - Krestkore Support Agent" draggable="false">
        </div>
        <div class="agent-badge" *ngIf="!chatOpen()">
          <span>Chat with Kris</span>
        </div>
        <div class="ping-ring"></div>
      </button>
    </div>
  `,
  styles: [`
    .agent-wrapper {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 900;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 1rem;
    }

    /* Chat bubble */
    .chat-bubble {
      width: 340px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(20,184,166,0.1);
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: all 0.4s var(--ease-out-expo);
      transform-origin: bottom right;
    }
    .chat-bubble.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    .chat-header {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 1rem 1.2rem;
      background: var(--navy);
      border-bottom: 1px solid var(--border);
    }
    .chat-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      border: 2px solid var(--teal);
      object-fit: cover;
      object-position: top;
    }
    .chat-header div { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; }
    .chat-header strong { font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; }
    .chat-header small { font-size: 0.72rem; color: var(--muted); }
    .online-dot {
      display: inline-block;
      width: 7px; height: 7px;
      background: #22c55e;
      border-radius: 50%;
      margin-left: 0.4rem;
      vertical-align: middle;
      animation: pulse 2s ease-in-out infinite;
    }
    .close-btn {
      background: none; border: none; cursor: pointer;
      color: var(--muted); font-size: 0.9rem;
      padding: 0.2rem; transition: color 0.2s;
    }
    .close-btn:hover { color: var(--white); }

    .chat-body {
      padding: 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      max-height: 280px;
      overflow-y: auto;
    }
    .bot-msg {
      background: rgba(20,184,166,0.08);
      border: 1px solid rgba(20,184,166,0.15);
      border-radius: 12px 12px 12px 2px;
      padding: 0.85rem 1rem;
      animation: chatPop 0.3s var(--ease-out-expo) both;
    }
    .bot-msg p { font-size: 0.85rem; line-height: 1.6; color: var(--off-white); }
    .bot-msg p + p { margin-top: 0.4rem; }
    .bot-msg strong { color: var(--teal); }

    .user-msg {
      background: var(--teal);
      border-radius: 12px 12px 2px 12px;
      padding: 0.85rem 1rem;
      align-self: flex-end;
      max-width: 85%;
      animation: chatPop 0.3s var(--ease-out-expo) both;
    }
    .user-msg p { font-size: 0.85rem; color: var(--navy); font-weight: 500; }

    .bot-msg.reply {
      animation-delay: 0.3s;
    }

    .quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .quick-btn {
      padding: 0.4rem 0.9rem;
      background: none;
      border: 1px solid var(--border);
      border-radius: 20px;
      font-family: var(--font-body);
      font-size: 0.78rem;
      color: var(--muted);
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s;
    }
    .quick-btn:hover { border-color: var(--teal); color: var(--teal); }

    .chat-footer {
      padding: 0.8rem 1.2rem;
      border-top: 1px solid var(--border);
      text-align: center;
    }
    .chat-cta {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--teal);
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .chat-cta:hover { opacity: 0.75; }

    /* Agent button */
    .agent-btn {
      position: relative;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
    }
    .agent-img-wrap {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      background: var(--navy);
      border: 3px solid var(--teal);
      box-shadow: 0 8px 32px rgba(20,184,166,0.3);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .agent-img-wrap.bounce {
      animation: agentBounce 3s ease-in-out infinite;
    }
    .agent-img-wrap:hover {
      transform: scale(1.08);
      box-shadow: 0 12px 40px rgba(20,184,166,0.45);
    }
    .agent-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
    }
    .agent-badge {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 0.4rem 0.9rem;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--white);
      white-space: nowrap;
      margin-bottom: 1rem;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      animation: fadeIn 0.5s ease 1s both;
    }
    .ping-ring {
      position: absolute;
      top: 0; right: 0;
      width: 18px; height: 18px;
      background: var(--teal);
      border-radius: 50%;
      border: 2px solid var(--dark);
      animation: pulse 2s ease-in-out infinite;
    }

    @media (max-width: 420px) {
      .agent-wrapper { bottom: 1rem; right: 1rem; }
      .chat-bubble { width: calc(100vw - 2rem); }
    }
  `]
})
export class ChatAgentComponent {
  chatOpen = signal(false);
  userMessage = signal('');
  botReply = signal('');

  quickLinks = [
    { label: '💻 Software Dev', reply: 'Great choice! Our software team builds custom web and mobile apps. Head to the contact form to get a tailored quote.' },
    { label: '🌐 Networking', reply: 'We design and deploy robust LAN/WAN, wireless, and VPN solutions. Contact us for a site assessment.' },
    { label: '🖥️ Hardware', reply: 'We source and maintain top-brand hardware: HP, Dell, Lenovo, and more. Let\'s discuss your requirements!' },
    { label: '🔐 Security', reply: 'From CCTV to biometric access control, we\'ve got your physical security covered. Reach out to our team!' },
  ];

  toggleChat() {
    this.chatOpen.update(v => !v);
  }

  handleQuick(q: { label: string; reply: string }) {
    this.userMessage.set(q.label);
    setTimeout(() => this.botReply.set(q.reply), 400);
  }
}
