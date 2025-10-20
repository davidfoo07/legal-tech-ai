import { Scale } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="bg-blue-100 rounded-full p-2">
        <Scale className="w-8 h-8 text-blue-600" />
      </div>
      <div className="bg-slate-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.1s]" />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
          </div>
          <span className="text-xs text-slate-500 italic">
            LawLink AI is typing...
          </span>
        </div>
      </div>
    </div>
  );
}
