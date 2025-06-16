import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  private readonly STORAGE_KEY = 'chat_conversations';
  private conversations: Conversation[] = [];
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);

  constructor() {
    this.loadConversations();
  }

  private loadConversations(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.conversations = JSON.parse(stored, (key, value) => {
        if (key === 'timestamp' || key === 'createdAt' || key === 'updatedAt') {
          return new Date(value);
        }
        return value;
      });
      this.conversationsSubject.next(this.conversations);
    }
  }

  private saveConversations(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.conversations));
    this.conversationsSubject.next(this.conversations);
  }

  getConversations(): Conversation[] {
    return this.conversations;
  }

  getConversationsObservable(): Observable<Conversation[]> {
    return this.conversationsSubject.asObservable();
  }

  createNewConversation(): Conversation {
    const conversation: Conversation = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.conversations.unshift(conversation);
    this.saveConversations();
    return conversation;
  }

  getConversation(id: string): Conversation | null {
    const conversation = this.conversations.find(c => c.id === id);
    return conversation || null;
  }

  addMessage(conversationId: string, message: ChatMessage): void {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.messages.push(message);
      conversation.updatedAt = new Date();
      this.saveConversations();
    }
  }

  deleteConversation(id: string): void {
    this.conversations = this.conversations.filter(c => c.id !== id);
    this.saveConversations();
  }

  clearAllConversations(): void {
    this.conversations = [];
    this.saveConversations();
  }

  updateConversationTitle(id: string, title: string): void {
    const conversation = this.conversations.find(c => c.id === id);
    if (conversation) {
      conversation.title = title;
      conversation.updatedAt = new Date();
      this.saveConversations();
    }
  }

  generateTitleFromMessage(message: string): string {
    // Generate a title from the first message
    const maxLength = 50;
    const title = message.trim().split('\n')[0];
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  }
} 