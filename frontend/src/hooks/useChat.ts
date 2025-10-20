import { useState, useCallback, useEffect } from 'react';
import type { Message } from '@/types/chat';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';

export function useChat(userId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For sending new messages
  const [isHistoryLoading, setIsHistoryLoading] = useState(true); // For the initial history load

  useEffect(() => {
    console.log('User ID in useChat hook:', userId);
  }, [userId]);

  // This hook runs once when the component mounts to fetch the chat history
  useEffect(() => {
    if (!userId) {
      setIsHistoryLoading(false);
      return; // Don't fetch if there's no user ID
    }

    const fetchHistory = async () => {
      setIsHistoryLoading(true);
      try {
        // Fetch history from your backend endpoint
        const response = await api.get(`/chat/history/${userId}`);

        console.log('Chat history response:', response.data);

        // Transform the backend's response into the frontend's Message type
        const historyMessages: Message[] = response.data.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt,
        }));

        if (historyMessages.length > 0) {
          setMessages(historyMessages);
        }

        console.log('Fetched chat history:', historyMessages);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
        toast.error('Could not load your previous conversation.');
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [userId]); // The dependency array ensures this runs only when userId is available

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input.trim() || isLoading || !userId) return;

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: input.trim(),
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const response = await api.post('/chat/send', {
          userId: userId,
          input: userMessage.content,
        });

        const aiReply = response.data.message;

        const assistantMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: aiReply,
          createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Sorry, I was unable to get a response. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, userId]
  );

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    // The UI is "loading" if either fetching history OR sending a new message
    isLoading: isHistoryLoading || isLoading,
  };
}
