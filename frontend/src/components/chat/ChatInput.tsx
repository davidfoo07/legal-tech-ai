import { forwardRef } from 'react'; // Import forwardRef
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

// Wrap the component with forwardRef
export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ input, handleInputChange, handleSubmit, isLoading }, ref) => {
    const { t } = useTranslation('chat');
    return (
      <div className="border-t border-slate-200 bg-white">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl p-4">
          <div className="flex items-end gap-2">
            <Textarea
              // Attach the forwarded ref to the textarea
              ref={ref}
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder={t('inputPlaceholder')}
              className="flex-1"
              maxLength={500}
              onKeyDown={e => {
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
              className="h-[60px] w-[60px] shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>{t('inputShortcut')}</span>{' '}
            <span
              className={
                input.length > 450 ? 'text-orange-600 font-medium' : ''
              }
            >
              {input.length}/500
            </span>
          </div>
        </form>
      </div>
    );
  }
);
