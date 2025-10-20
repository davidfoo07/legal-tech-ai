import React from 'react';
import { Scale } from 'lucide-react';
import { Container } from './Container';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-50">
      <Container>
        <div className="flex h-16 items-center">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">LawLink</h1>
              </div>
            </div>

            {/* Tagline */}
            <div className="hidden sm:block">
              <div className="h-6 w-px bg-slate-300 mx-4" />
              <p className="text-sm text-slate-600 font-medium">
                AI-Powered Labour Law Consultation
              </p>
            </div>
          </div>

          {/* Right side - could add user menu, etc. in future */}
          <div className="ml-auto">{/* Placeholder for future features */}</div>
        </div>

        {/* Mobile tagline */}
        <div className="sm:hidden pb-3">
          <p className="text-xs text-slate-600">
            AI-Powered Labour Law Consultation
          </p>
        </div>
      </Container>
    </header>
  );
};
