import { Scale, LogOut } from 'lucide-react';
import { Container } from './Container';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import type { User } from '@/types/user';
import { useEffect } from 'react';

interface HeaderProps {
  user: User;
  onSignOut: () => void; // Function to handle sign-out
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
  useEffect(() => {
    console.log('user: ', user);
  }, [user]);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Left Side: Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-800">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">LawLink</h1>
            </div>
          </div>

          {/* Right Side: User Menu and Sign Out Button */}
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              Welcome, {user.username}
            </span>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700"
              title={user.username}
            >
              {getInitials(user.username)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onSignOut} // Call the sign-out function on click
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};
