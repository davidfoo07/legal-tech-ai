import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Chat Bubble variants
const chatBubbleVariants = {
  sent: 'ml-auto bg-blue-600 text-white',
  received: 'mr-auto bg-slate-100 text-slate-900',
};

// Chat Bubble component
interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'sent' | 'received';
}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant = 'received', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex w-max max-w-[75%] gap-2 rounded-lg px-3 py-2 text-sm',
        chatBubbleVariants[variant],
        className
      )}
      {...props}
    />
  )
);
ChatBubble.displayName = 'ChatBubble';

// Chat Bubble Avatar component
interface ChatBubbleAvatarProps {
  children?: React.ReactNode;
  fallback?: string;
  className?: string;
}

const ChatBubbleAvatar = React.forwardRef<
  HTMLDivElement,
  ChatBubbleAvatarProps
>(({ children, fallback, className }, ref) => (
  <Avatar ref={ref} className={cn('h-8 w-8', className)}>
    {children}
    <AvatarFallback className="text-xs">{fallback}</AvatarFallback>
  </Avatar>
));
ChatBubbleAvatar.displayName = 'ChatBubbleAvatar';

// Chat Bubble Message component
interface ChatBubbleMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'sent' | 'received';
}

const ChatBubbleMessage = React.forwardRef<
  HTMLDivElement,
  ChatBubbleMessageProps
>(({ className, variant = 'received', children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'leading-relaxed',
      variant === 'sent' ? 'text-white' : 'text-slate-900',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
ChatBubbleMessage.displayName = 'ChatBubbleMessage';

// Chat Message List component
const ChatMessageList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-4', className)} {...props} />
));
ChatMessageList.displayName = 'ChatMessageList';

export { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, ChatMessageList };
