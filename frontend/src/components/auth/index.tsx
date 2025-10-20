import { useState } from 'react';
import type { FormEvent } from 'react';
import type { User } from '@/types/user';
import api from '@/api/axios';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPage = ({ onLoginSuccess }: AuthPageProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    const payload = isRegistering ? { username, email, phone } : { email };

    try {
      const response = await api.post(endpoint, payload);
      const user: User = response.data;
      onLoginSuccess(user);
    } catch (err: any) {
      // Axios places error details in `err.response`
      if (err.response?.status === 404 && !isRegistering) {
        setIsRegistering(true);
        setError('Email not found. Please register to continue.');
      } else {
        const message =
          err.response?.data?.message || 'An unexpected error occurred.';
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setError(null); // Clear errors when switching forms
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-slate-800">
          {isRegistering ? 'Create Your Account' : 'Welcome to LawLink'}
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          {isRegistering
            ? 'Enter your details to get started.'
            : 'Enter your email to log in or sign up.'}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="space-y-4 mb-4">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1 block text-sm font-medium"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  placeholder="Your contact number"
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              readOnly={isRegistering}
              placeholder="you@example.com"
              className={`w-full rounded-md border border-slate-300 px-3 py-2 ${isRegistering ? 'bg-slate-100' : ''}`}
            />
          </div>

          {error && (
            <p className="mt-4 text-center text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-md bg-blue-800 py-2 font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? 'Processing...'
              : isRegistering
                ? 'Create Account'
                : 'Continue'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isRegistering
            ? 'Already have an account?'
            : "Don't have an account?"}
          <button
            type="button"
            onClick={toggleForm}
            className="ml-1 font-semibold text-blue-800 hover:underline"
          >
            {isRegistering ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};
