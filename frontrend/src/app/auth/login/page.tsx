// src/app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1) Send login request
      const res = await axios.post('http://localhost:3001/auth/login', {
        email,
        password,
      });

      // 2) Inspect what the backend actually returned:
      console.log('LOGIN RESPONSE →', res.data);

      // 3) Extract the token from any of the common fields:
      const payload = res.data as any;
      const tokenCandidate =
        typeof payload.token === 'string' && payload.token.includes('.')
          ? payload.token
          : typeof payload.accessToken === 'string' && payload.accessToken.includes('.')
          ? payload.accessToken
          : typeof payload.access_token === 'string' && payload.access_token.includes('.')
          ? payload.access_token
          : null;

      if (!tokenCandidate) {
        throw new Error(
          'Login response did not contain a valid JWT (looked for token / accessToken / access_token).'
        );
      }

      const token = tokenCandidate;

      // 4) Decode the JWT payload client-side to grab the user ID.
      let decoded: any;
      try {
        const base64Payload = token.split('.')[1];
        // atob is available in the browser to decode Base64
        const jsonPayload = atob(base64Payload);
        decoded = JSON.parse(jsonPayload);
      } catch (decodeErr) {
        console.error('Failed to decode JWT payload:', decodeErr);
        throw new Error('Unable to decode JWT to extract user ID.');
      }

      console.log('DECODED JWT PAYLOAD →', decoded);

      // 5) Determine which field in the decoded token holds the user ID.
      //    Common names are `sub`, `id`, or `userId`. Adjust as needed.
      const userIdFromToken =
        typeof decoded.sub === 'number'
          ? decoded.sub
          : typeof decoded.id === 'number'
          ? decoded.id
          : typeof decoded.userId === 'number'
          ? decoded.userId
          : null;

      if (userIdFromToken === null) {
        throw new Error(
          'Decoded JWT did not contain a numeric user ID (looked for "sub", "id", or "userId").'
        );
      }

      // 6) Store both the JWT (in a cookie) and the userId (in localStorage)
      Cookies.set('token', token, { path: '/' });
      localStorage.setItem('userId', String(userIdFromToken));

      toast.success('Logged in successfully!');
      router.push('/authenticated');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Login error (Axios):', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Invalid credentials');
      } else {
        console.error('Login error (unknown):', err);
        setError((err as Error).message || 'An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-blue-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back 👋</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Please log in to your account</p>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text text-sm text-gray-700 font-medium">Email</span>
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text text-sm text-gray-700 font-medium">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg shadow hover:bg-indigo-700 transition-all"
            >
              Login
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{' '}
          <a href="/auth/register" className="text-indigo-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
