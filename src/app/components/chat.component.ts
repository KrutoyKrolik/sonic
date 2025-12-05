import { Component, OnInit, ViewChild, ElementRef, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, transition, style, animate, state, keyframes } from '@angular/animations';
import { OllamaService, Message } from '../services/ollama.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('600ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages = signal<Message[]>([]);
  inputMessage = signal('');
  selectedModel = signal('llama2');
  isLoading = signal(false);
  availableModels = signal<string[]>([]);
  errorMessage = signal('');
  floatState = signal('floating');
  sparkleState = signal('');
  jingleState = signal('');
  snowflakes = signal<Array<{ id: number; delay: number; left: number }>>([]);

  constructor(private ollamaService: OllamaService) {}

  ngOnInit(): void {
    this.loadModels();
    this.generateSnowflakes();
    this.triggerSparkles();
  }

  generateSnowflakes(): void {
    const flakes: Array<{ id: number; delay: number; left: number }> = [];
    for (let i = 0; i < 15; i++) {
      flakes.push({
        id: i,
        delay: Math.random() * 2,
        left: Math.random() * 100
      });
    }
    this.snowflakes.set(flakes);
  }

  triggerSparkles(): void {
    setInterval(() => {
      this.sparkleState.set(Math.random().toString());
    }, 2000);
  }

  loadModels(): void {
    this.ollamaService.getAvailableModels().subscribe({
      next: (response: any) => {
        if (response.models && Array.isArray(response.models)) {
          this.availableModels.set(response.models.map((m: any) => m.name));
          if (this.availableModels().length > 0 && !this.availableModels().includes('llama2')) {
            this.selectedModel.set(this.availableModels()[0]);
          }
        }
      },
      error: (error) => {
        this.errorMessage.set('Failed to load models. Make sure Ollama is running on localhost:11434');
        console.error('Error loading models:', error);
      }
    });
  }

  sendMessage(): void {
    const message = this.inputMessage().trim();
    if (!message || this.isLoading()) {
      return;
    }

    this.triggerJingle();

    // Add user message
    const userMessage: Message = {
      id: this.generateId(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };

    this.messages.update(msgs => [...msgs, userMessage]);
    this.inputMessage.set('');
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Scroll to bottom
    setTimeout(() => this.scrollToBottom(), 0);

    // Prepare messages for API
    const apiMessages = this.messages().map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Get response from Ollama
    let assistantResponse = '';
    const assistantMessage: Message = {
      id: this.generateId(),
      content: '',
      role: 'assistant',
      timestamp: new Date()
    };

    this.messages.update(msgs => [...msgs, assistantMessage]);

    this.ollamaService.chat(apiMessages, this.selectedModel()).subscribe({
      next: (data: any) => {
        if (data.message && data.message.content) {
          assistantResponse += data.message.content;
          this.messages.update(msgs => {
            const updated = [...msgs];
            updated[updated.length - 1].content = assistantResponse;
            return updated;
          });
          this.scrollToBottom();
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error communicating with Ollama. Please check if it\'s running.');
        console.error('Chat error:', error);
        // Remove the empty assistant message
        this.messages.update(msgs => msgs.slice(0, -1));
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  clearChat(): void {
    this.messages.set([]);
    this.errorMessage.set('');
  }

  triggerJingle(): void {
    this.jingleState.set(Math.random().toString());
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      setTimeout(() => {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }, 0);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
