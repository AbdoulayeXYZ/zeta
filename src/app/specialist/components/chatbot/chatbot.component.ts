import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatHistoryService, Conversation, ChatMessage } from '../../../services/chat-history.service';
import { OllamaService } from '../../../services/ollama.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  standalone: false,
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('fileInput') private fileInput!: ElementRef;
  
  conversations: Conversation[] = [];
  currentConversation: Conversation | null = null;
  newMessage: string = '';
  isProcessing: boolean = false;
  uploadedPdfContext: string | null = null;
  selectedFileName: string | null = null;

  constructor(
    private chatHistoryService: ChatHistoryService,
    private ollamaService: OllamaService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  loadConversations() {
    this.conversations = this.chatHistoryService.getConversations();
  }

  createNewConversation() {
    this.currentConversation = this.chatHistoryService.createNewConversation();
    this.loadConversations();
  }

  loadConversation(conversationId: string) {
    this.currentConversation = this.chatHistoryService.getConversation(conversationId);
  }

  deleteConversation(conversationId: string) {
    this.chatHistoryService.deleteConversation(conversationId);
    if (this.currentConversation?.id === conversationId) {
      this.currentConversation = null;
    }
    this.loadConversations();
  }

  async handleFileUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    this.selectedFileName = file.name;
    this.isProcessing = true;

    try {
      // Upload du fichier vers le backend pour extraction texte (PDF ou image)
      const formData = new FormData();
      formData.append('file', file);
      const res: any = await this.http.post('http://localhost:3000/api/detections/upload', formData).toPromise();
      this.uploadedPdfContext = res.text;

      // Add a system message about the uploaded file
      if (this.currentConversation) {
        const systemMessage: ChatMessage = {
          content: `File "${file.name}" has been uploaded and its content will be used as context for this conversation.`,
          isUser: false,
          timestamp: new Date()
        };
        this.chatHistoryService.addMessage(this.currentConversation.id, systemMessage);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      this.isProcessing = false;
      // Reset the file input
      this.fileInput.nativeElement.value = '';
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.newMessage.trim() || !this.currentConversation || this.isProcessing) {
      return;
    }

    const userMessage: ChatMessage = {
      content: this.newMessage,
      isUser: true,
      timestamp: new Date()
    };

    // Add user message to conversation
    this.chatHistoryService.addMessage(this.currentConversation.id, userMessage);
    this.newMessage = '';
    this.isProcessing = true;

    try {
      // If we have PDF context, include it in the prompt
      let prompt = userMessage.content;
      if (this.uploadedPdfContext) {
        prompt = `Context from PDF "${this.selectedFileName}":\n${this.uploadedPdfContext}\n\nUser question: ${userMessage.content}`;
      }

      // Get response from Ollama
      const response = await firstValueFrom(this.ollamaService.generateResponse(prompt));
      
      const botMessage: ChatMessage = {
        content: response.response,
        isUser: false,
        timestamp: new Date()
      };

      // Add bot response to conversation
      this.chatHistoryService.addMessage(this.currentConversation.id, botMessage);
      
      // Update conversation title if this is the first message
      if (this.currentConversation.messages.length === 2) {
        this.chatHistoryService.updateConversationTitle(
          this.currentConversation.id,
          this.chatHistoryService.generateTitleFromMessage(userMessage.content)
        );
        this.loadConversations();
      }
    } catch (error) {
      console.error('Error getting response from Ollama:', error);
      const errorMessage: ChatMessage = {
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      this.chatHistoryService.addMessage(this.currentConversation.id, errorMessage);
    } finally {
      this.isProcessing = false;
    }
  }

  clearPdfContext(): void {
    this.uploadedPdfContext = null;
    this.selectedFileName = null;
    if (this.currentConversation) {
      const systemMessage: ChatMessage = {
        content: 'PDF context has been cleared.',
        isUser: false,
        timestamp: new Date()
      };
      this.chatHistoryService.addMessage(this.currentConversation.id, systemMessage);
    }
  }
}
