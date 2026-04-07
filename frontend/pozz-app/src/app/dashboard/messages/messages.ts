import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
})
export class MessagesComponent {
  readonly conversations = signal<Conversation[]>([
    {
      id: '1',
      participantName: 'Sarah Johnson',
      lastMessage: 'I\'m interested in investing in your tech startup project',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
      unread: 2,
      isOnline: true,
    },
    {
      id: '2',
      participantName: 'Michael Chen',
      lastMessage: 'Can you provide more details about the expected ROI?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      unread: 0,
      isOnline: false,
    },
    {
      id: '3',
      participantName: 'Emily Rodriguez',
      lastMessage: 'Thank you for the information!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unread: 0,
      isOnline: true,
    },
  ]);

  readonly selectedConversation = signal<Conversation | null>(null);
  readonly messages = signal<Message[]>([]);
  readonly newMessage = signal('');

  selectConversation(conversation: Conversation): void {
    this.selectedConversation.set(conversation);
    
    // Mock messages for the selected conversation
    this.messages.set([
      {
        id: '1',
        senderId: conversation.id,
        senderName: conversation.participantName,
        content: 'Hello! I saw your project and I\'m very interested.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isOwn: false,
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'You',
        content: 'Thank you for your interest! What would you like to know?',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        isOwn: true,
      },
      {
        id: '3',
        senderId: conversation.id,
        senderName: conversation.participantName,
        content: conversation.lastMessage,
        timestamp: conversation.lastMessageTime,
        isOwn: false,
      },
    ]);

    // Mark as read
    this.conversations.update(convs =>
      convs.map(c => c.id === conversation.id ? { ...c, unread: 0 } : c)
    );
  }

  sendMessage(): void {
    const content = this.newMessage().trim();
    if (!content || !this.selectedConversation()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      content,
      timestamp: new Date(),
      isOwn: true,
    };

    this.messages.update(msgs => [...msgs, newMsg]);
    this.newMessage.set('');

    // Update conversation's last message
    const conv = this.selectedConversation()!;
    this.conversations.update(convs =>
      convs.map(c => c.id === conv.id ? { ...c, lastMessage: content, lastMessageTime: new Date() } : c)
    );
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  formatMessageTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
}

