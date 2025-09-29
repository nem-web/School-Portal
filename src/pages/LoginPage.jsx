import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [remember, setRemember] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        // Use AuthContext to save user
        const userData = {
          email: data.user.email,
          isAdmin: "true",
          // token: data.token, // optional, if your backend returns a JWT
        };
        console.log('Login successful:', userData);
        // login(userData);
        if (remember) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
        setSuccessMessage('Login successful! Redirecting...');
        // Redirect admin to /admin, others to /
        setTimeout(() => navigate(userData.isAdmin ? '/admin' : '/'), 1500);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Cannot connect to server at http://localhost:3001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[84vh] bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
            Welcome Back!
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-900">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                <span className="ml-2">Remember me</span>
              </label>

              
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-gray-700 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          
        </div>
      </main>
    </div>
  );
}
