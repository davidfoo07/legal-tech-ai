import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { User } from '@/types/user';
import { AuthPage } from './components/auth/index';
import { ChatPage } from './components/chat/index';
import { AdminDashboard } from './components/admin/index';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';
import { CaseReportDetailPage } from './components/admin/CaseReportDetailPage';
import { WaitlistPage } from './components/waitlist';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const handleSignOut = () => {
    localStorage.clear();
    setUser(null);
  };

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<AuthPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/waitlist" element={<WaitlistPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage user={user} />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute user={user}>
              <AdminDashboard user={user} onSignOut={handleSignOut} />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/case-report/:id"
          element={
            <AdminProtectedRoute user={user}>
              <CaseReportDetailPage />
            </AdminProtectedRoute>
          }
        />
        {/* Redirect any other path to the home page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
