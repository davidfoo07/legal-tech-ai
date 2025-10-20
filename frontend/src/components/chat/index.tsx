import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import type { User } from '@/types/user';

interface ChatPageProps {
  user: User;
}

export const ChatPage = ({ user }: ChatPageProps) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat(user.uid);

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Header user={user} />
      <main className="flex-1 overflow-hidden">
        <ChatWindow messages={messages} isLoading={isLoading} />
      </main>
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
