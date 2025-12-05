import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  stream: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OllamaService {
  private readonly OLLAMA_API_URL = 'http://localhost:11434/api';
  private messageStream$ = new Subject<string>();

  constructor(private http: HttpClient) {}

  getAvailableModels(): Observable<any> {
    return this.http.get(`${this.OLLAMA_API_URL}/tags`);
  }

  chat(messages: Array<{ role: string; content: string }>, model: string = 'llama2'): Observable<any> {
    const request: ChatRequest = {
      model,
      messages,
      stream: true
    };

    return new Observable(observer => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${this.OLLAMA_API_URL}/chat`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      let buffer = '';

      xhr.onprogress = () => {
        buffer += xhr.responseText;
        const lines = buffer.split('\n');
        buffer = lines[lines.length - 1];

        for (let i = 0; i < lines.length - 1; i++) {
          if (lines[i].trim()) {
            try {
              const data = JSON.parse(lines[i]);
              observer.next(data);
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      };

      xhr.onload = () => {
        if (buffer.trim()) {
          try {
            const data = JSON.parse(buffer);
            observer.next(data);
          } catch (e) {
            console.error('Error parsing final JSON:', e);
          }
        }
        observer.complete();
      };

      xhr.onerror = () => {
        observer.error(new Error('Failed to connect to Ollama API'));
      };

      xhr.send(JSON.stringify(request));
    });
  }
}
