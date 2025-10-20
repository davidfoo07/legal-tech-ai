import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  return (
    <div className="border-t border-slate-200 bg-white">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="Describe your employment situation in detail..."
            className="flex-1 min-h-[60px] max-h-[200px] resize-none border-2 border-slate-300 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
            maxLength={500}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-[60px] w-[60px] shrink-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span className={input.length > 450 ? 'text-orange-600 font-medium' : ''}>
            {input.length}/500
          </span>
        </div>
      </form>
    </div>
  );
}