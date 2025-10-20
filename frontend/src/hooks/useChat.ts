import { useState, useCallback } from 'react';
import type { Message } from '@/types/chat';

// For now, use our proven working implementation with AI SDK v5 packages installed
// This allows easy migration to full AI SDK when your Java backend is ready

function generateLabourLawResponse(message: string): string {
  const msg = message.toLowerCase();

  if (
    msg.includes('fired') ||
    msg.includes('terminated') ||
    msg.includes('dismissed')
  ) {
    return "I understand you've been terminated from your position. This is a serious matter that requires careful evaluation. To better assist you, I need some information:\n\n1. How long were you employed with this company?\n2. Did you receive any prior warnings or disciplinary actions?\n3. Were you given a reason for termination?\n4. Do you have a written employment contract?\n\nThis information will help me assess whether there may be grounds for wrongful termination under Singapore's Employment Act.";
  }

  if (msg.includes('harassment') || msg.includes('discriminat')) {
    return "Workplace harassment and discrimination are serious violations of employment law in Singapore. I want to make sure I understand your situation clearly:\n\n1. What type of harassment or discrimination have you experienced?\n2. How long has this been occurring?\n3. Have you reported this to HR or management?\n4. Do you have any documentation or witnesses?\n\nYour answers will help determine the best course of action under Singapore's anti-discrimination laws.";
  }

  if (
    msg.includes('wage') ||
    msg.includes('unpaid') ||
    msg.includes('overtime') ||
    msg.includes('salary')
  ) {
    return "Unpaid wages and overtime violations are common employment law issues in Singapore. Let me gather some details:\n\n1. What is the total amount you believe you're owed?\n2. Over what time period did this occur?\n3. Do you have records of your hours worked?\n4. Has your employer given any reason for non-payment?\n\nThis information is crucial for assessing your claim under the Employment Act.";
  }

  if (msg.includes('contract') || msg.includes('agreement')) {
    return 'Employment contract issues can significantly impact your rights and obligations. To provide accurate guidance:\n\n1. Do you have a written employment contract?\n2. What specific terms or clauses are you concerned about?\n3. Has your employer breached any contract terms?\n4. Are you considering leaving or have you already left?\n\nUnderstanding your contract details is essential for proper legal advice.';
  }

  return "Thank you for sharing that information. To provide you with the most accurate guidance, could you please provide more specific details about your employment situation? For example:\n\n- Your job title and duties\n- How long you've been employed\n- The specific issue you're facing\n- Any relevant dates or documentation\n\nThe more details you can provide, the better I can assist you with Singapore labour law matters.";
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm LawLink AI, your labour law consultation assistant. I'm here to help you understand your rights and options regarding employment matters. Could you please describe your situation in detail?\n\nCommon topics include wrongful termination, unpaid wages, workplace discrimination, and employment contracts.",
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!input.trim() || isLoading) return;

      const trimmedInput = input.trim();
      const userMessage: Message = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: trimmedInput,
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        // Simulate API call - will be replaced with your Java backend
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = generateLabourLawResponse(trimmedInput);

        const assistantMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: response,
          createdAt: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Error generating response:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading]
  );

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  };
}