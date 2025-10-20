import { Navigate } from 'react-router-dom';
import type { User } from '@/types/user';

interface AdminProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
}

export const AdminProtectedRoute = ({
  user,
  children,
}: AdminProtectedRouteProps) => {
  // Check if the user is logged in AND their role is 'ADMIN'
  if (user?.role === 'ADMIN') {
    return <>{children}</>;
  }

  // If not, redirect them to the home page
  return <Navigate to="/" />;
};
