import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import type { User } from '@/types/user';
import { useEffect, useRef } from 'react';

interface ChatPageProps {
  user: User;
}

export const ChatPage = ({ user }: ChatPageProps) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat(user.uid);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Header user={user} onSignOut={handleSignOut} />
      <main className="flex-1 overflow-y-auto">
        <ChatWindow messages={messages} isLoading={isLoading} />
      </main>
      <ChatInput
        ref={textareaRef}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
      <Footer />
    </div>
  );
};
