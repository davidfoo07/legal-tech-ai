// src/components/chat/ChatPage.tsx

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import type { User } from '../types/user';

interface ChatPageProps {
  user: User;
}

export const ChatPage = ({ user }: ChatPageProps) => {
  // Pass the user's ID to your chat hook for API calls
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat(user.uid);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
      <Footer />
    </div>
  );
};
