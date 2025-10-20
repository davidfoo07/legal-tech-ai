// src/components/auth/AuthPage.tsx

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { User } from '../types/user';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPage = ({ onLoginSuccess }: AuthPageProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLoginAttempt = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // This is a placeholder for your real login call
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const user: User = await response.json();
      onLoginSuccess(user); // Callback to update App state
    } else if (response.status === 404) {
      // User not found, switch to registration form
      setIsRegistering(true);
      setError('Email not found. Please register to continue.');
    } else {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, phone }),
    });

    if (response.ok) {
      const newUser: User = await response.json();
      onLoginSuccess(newUser);
    } else {
      // Handle potential errors like "email already exists"
      const errorData = await response.json();
      setError(errorData.message || 'Registration failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        {!isRegistering ? (
          // Login Form
          <div>
            <h1 className="mb-2 text-center text-2xl font-bold text-slate-800">
              Welcome to LawLink
            </h1>
            <p className="mb-6 text-center text-sm text-slate-500">
              Enter your email to log in or sign up.
            </p>
            <form onSubmit={handleLoginAttempt}>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-slate-600"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
              <button
                type="submit"
                className="mt-6 w-full rounded-md bg-blue-800 py-2 font-semibold text-white"
              >
                Continue
              </button>
            </form>
          </div>
        ) : (
          // Registration Form
          <div>
            <h1 className="mb-2 text-center text-2xl font-bold text-slate-800">
              Create Your Account
            </h1>
            <form onSubmit={handleRegister}>
              <div className="space-y-4">
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
                    htmlFor="reg-email"
                    className="mb-1 block text-sm font-medium"
                  >
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    readOnly
                    className="w-full rounded-md border bg-slate-100 px-3 py-2"
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
              <button
                type="submit"
                className="mt-6 w-full rounded-md bg-blue-800 py-2 font-semibold text-white"
              >
                Create Account
              </button>
            </form>
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className="mt-4 w-full text-center text-sm text-slate-500 hover:underline"
            >
              Back to Login
            </button>
          </div>
        )}
        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};
