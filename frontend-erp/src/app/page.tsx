'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Main login form submitted for:', email);
    try {
      // Pass 'admin' or 'customer' role; defaulting to 'admin' as this seems to be an ERP system login
      console.log('Calling AuthContext login...');
      await login(email, password, 'admin');
      console.log('AuthContext login successful.');
    } catch (err: any) {
      console.error('AuthContext login failed:', err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
      }
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">ERP Login</h1>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
