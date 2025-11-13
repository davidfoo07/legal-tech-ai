import { useState, useEffect, type FormEvent } from 'react';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';

interface WaitlistEntry {
  id: string;
  email: string;
}

export const WaitlistPage = () => {
  const [email, setEmail] = useState('');
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // 1. Fetch the Waitlist Count on Mount
  useEffect(() => {
    const fetchWaitlistCount = async () => {
      setIsLoading(true);
      try {
        // Assuming your API returns List<Waitlist>
        const response = await api.get<WaitlistEntry[]>(
          '/waitlist/get-all-waitlists'
        );
        setCount(response.data.length);
      } catch (error) {
        console.error('Failed to fetch waitlist count:', error);
        setCount(null); // Show N/A or a default
      } finally {
        setIsLoading(false);
      }
    };
    fetchWaitlistCount();
  }, []);

  // 2. Handle the Form Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email.');
      setIsSigningUp(false);
      return;
    }

    try {
      // Note: Your backend API expects a raw string body, not a JSON object,
      // so we set the Content-Type header to text/plain.
      await api.post('/waitlist/signup-newsletter', email, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      toast.success('Success! You have joined the waitlist.');
      setEmail('');
      setCount(prevCount => (prevCount !== null ? prevCount + 1 : 1)); // Increment count instantly
    } catch (err: any) {
      // Check for specific error, like 409 Conflict for duplicate emails
      const message =
        err.response?.status === 409
          ? 'You are already on the list! Thank you.'
          : 'Signup failed. Please try again.';

      toast.error(message);
      console.error(err);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-2xl">
        <h1 className="text-sm font-medium uppercase text-blue-600 tracking-wider">
          LawLink Waitlist
        </h1>

        {/* Display Current Waitlist Number */}
        <p className="mt-4 text-6xl font-extrabold text-slate-800">
          {isLoading ? '...' : count !== null ? count : 'N/A'}
        </p>
        <p className="mb-8 text-lg font-medium text-slate-500">
          {isLoading ? 'Loading current sign-ups' : 'People have signed up!'}
        </p>

        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Be the first to access our platform.
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={isSigningUp}
            placeholder="Enter your best email address"
            className="w-full rounded-md border border-slate-300 px-4 py-3 text-lg focus:border-blue-600 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full rounded-md bg-blue-800 py-3 font-semibold text-white text-lg transition hover:bg-blue-900 disabled:opacity-50"
          >
            {isSigningUp ? 'Signing Up...' : 'Join the Waitlist'}
          </button>
        </form>
      </div>
    </div>
  );
};
