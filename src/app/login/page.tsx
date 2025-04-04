'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession(); 

  useEffect(() => {
    if (status !== 'loading' && session) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError('Email ou password inválidos.');
    } else {
      router.push('/dashboard'); 
    }
  };

  if (status === 'loading') {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-800">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-semibold text-center mb-6 text-white">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-indigo-700 text-white font-semibold rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-600"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}
