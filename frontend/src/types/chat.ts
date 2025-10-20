// Simple message interface for our chat system
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string; // ISO date string
}

export interface ChatConfig {
  initialMessages: Message[];
  maxMessages?: number;
}
