import React from 'react';
import { Container } from './Container';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
      <Container>
        <div className="py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-sm text-slate-600">
              © 2024 LawLink. Professional legal AI consultation platform.
            </div>
            <div className="text-xs text-slate-500">
              This is an AI assistant for informational purposes only. Consult a
              qualified lawyer for legal advice.
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
