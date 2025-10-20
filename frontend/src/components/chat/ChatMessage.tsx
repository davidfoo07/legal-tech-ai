import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from '@/components/ui/chat';
import { Scale, User } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import type { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.role === 'assistant';
  const timestamp = message.createdAt
    ? format(new Date(message.createdAt), 'HH:mm')
    : '';

  return (
    <div className={`flex gap-3 ${!isAI ? 'flex-row-reverse' : ''}`}>
      <ChatBubbleAvatar>
        {isAI ? (
          <Scale className="w-5 h-5 text-blue-600" />
        ) : (
          <User className="w-5 h-5 text-slate-600" />
        )}
      </ChatBubbleAvatar>
      <ChatBubble variant={isAI ? 'received' : 'sent'} className="max-w-[70%]">
        <ChatBubbleMessage variant={isAI ? 'received' : 'sent'}>
          {isAI ? (
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="text-sm">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
          {timestamp && (
            <span className="text-xs opacity-70 mt-1 block">{timestamp}</span>
          )}
        </ChatBubbleMessage>
      </ChatBubble>
    </div>
  );
}
