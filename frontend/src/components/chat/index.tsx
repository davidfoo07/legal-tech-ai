import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import type { User } from '@/types/user';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface ChatPageProps {
  user: User;
}

export const ChatPage = ({ user }: ChatPageProps) => {
  const { t, i18n } = useTranslation(['chat', 'common']);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat(user.uid);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (user.language && user.language !== i18n.language) {
      i18n.changeLanguage(user.language);
      console.log(`Language switched to: ${user.language}`);
    }
  }, [user.language, i18n]);

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
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          welcomeMessage={t('chat:welcomeMessage', { user: user.username })}
        />
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
