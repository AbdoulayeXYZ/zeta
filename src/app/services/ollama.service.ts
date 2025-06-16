import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OllamaService {
  private readonly OLLAMA_API_URL = 'http://localhost:11434/api/generate';
  private readonly MODEL = 'llama2';

  constructor(private http: HttpClient) {}

  generateResponse(prompt: string): Observable<OllamaResponse> {
    const requestBody = {
      model: this.MODEL,
      prompt: this.formatPrompt(prompt),
      stream: false
    };

    return this.http.post<OllamaResponse>(this.OLLAMA_API_URL, requestBody);
  }

  private formatPrompt(userMessage: string): string {
    // Format the prompt to get better medical responses
    return `You are Zetabot, an AI medical assistant. You provide helpful, accurate, and professional medical information.
    You should:
    - Be clear and concise in your responses
    - Focus on medical accuracy
    - Be professional but friendly
    - Acknowledge when you're not sure about something
    - Always prioritize patient safety
    - Not provide specific medical diagnoses without proper medical consultation

    User: ${userMessage}
    Zetabot:`;
  }
} 