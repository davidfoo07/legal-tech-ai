import { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatMessageList } from '@/components/ui/chat';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import type { Message } from '@/types/chat';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <ChatMessageList>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </ChatMessageList>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-blue-100 rounded-full p-6 mb-4">
        <MessageCircle className="w-12 h-12 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Welcome to LawLink AI
      </h2>
      <p className="text-slate-600 max-w-md mb-4">
        Start by describing your employment situation. I'm here to help you 
        understand your rights and options regarding labour law matters.
      </p>
      <p className="text-sm text-slate-500">
        Common topics include wrongful termination, unpaid wages, workplace 
        discrimination, and employment contracts.
      </p>
    </div>
  );
}