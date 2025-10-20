import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';

function App() {
  // Move useChat to App level to share state between components
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <Header />
      
      {/* Scrollable Chat Area */}
      <ChatWindow messages={messages} isLoading={isLoading} />
      
      {/* Fixed Input */}
      <ChatInput 
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
      
      {/* Fixed Footer */}
      <Footer />
    </div>
  );
}

export default App;