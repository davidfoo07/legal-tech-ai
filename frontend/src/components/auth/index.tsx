import { useState } from 'react';
import type { FormEvent } from 'react';
import type { User } from '@/types/user';
import api from '@/api/axios';
import { useTranslation } from 'react-i18next';
interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPage = ({ onLoginSuccess }: AuthPageProps) => {
  const { t } = useTranslation('auth');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isRegistering) {
      // This regex checks for a "+" sign followed by 9 to 15 digits.
      // This covers most international numbers (e.g., +6591234567, +12125551234)
      const phoneRegex = /^\+\d{9,15}$/;

      if (!phoneRegex.test(phone)) {
        setError(t('errorInvalidPhone'));
        setIsLoading(false);
        return;
      }
    }

    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    const payload = isRegistering
      ? { username, email, phone, language }
      : { email };

    try {
      const response = await api.post(endpoint, payload);
      const user: User = response.data;
      onLoginSuccess(user);
    } catch (err: any) {
      if (err.response?.status === 404 && !isRegistering) {
        setIsRegistering(true);
        // 3. Use the 't' function for translations
        setError(t('errorNotFound'));
      } else {
        const message = err.response?.data?.message || t('errorDefault');
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
          {isRegistering ? t('titleRegister') : t('titleLogin')}
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          {isRegistering ? t('subtitleRegister') : t('subtitleLogin')}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="space-y-4 mb-4">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium"
                >
                  {t('usernameLabel')}
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  placeholder={t('usernamePlaceholder')}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1 block text-sm font-medium"
                >
                  {t('phoneLabel')}
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  placeholder={t('phonePlaceholder')}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label
                  htmlFor="language"
                  className="mb-1 block text-sm font-medium"
                >
                  {t('languageSelectLabel')}
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                >
                  <option value="en">English</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="zh">中文 (Chinese)</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              {t('emailLabel')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder={t('emailPlaceholder')}
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
              ? t('buttonLoading')
              : isRegistering
                ? t('buttonRegister')
                : t('buttonLogin')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isRegistering ? t('toggleToLogin') : t('toggleToRegister')}
          <button
            type="button"
            onClick={toggleForm}
            className="ml-1 font-semibold text-blue-800 hover:underline"
          >
            {isRegistering ? t('toggleLoginButton') : t('toggleRegisterButton')}
          </button>
        </p>
      </div>
    </div>
  );
};
