import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url = isLogin ? `${API_BASE}api/auth/login` : `${API_BASE}api/auth/register`;
      const body = isLogin ? { email: form.email, password: form.password } : form;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        navigate('/');
      } else {
        setError(data.msg || 'Error');
      }
    } catch {
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-96 flex flex-col gap-6 border border-purple-100">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-2 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-purple-700 mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" className="input rounded-lg border-2 border-purple-200 focus:border-purple-500 px-4 py-2 transition" required />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-purple-700 mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" className="input rounded-lg border-2 border-purple-200 focus:border-purple-500 px-4 py-2 transition" type="email" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-purple-700 mb-1">Password</label>
            <input name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" className="input rounded-lg border-2 border-purple-200 focus:border-purple-500 px-4 py-2 transition" type="password" required />
          </div>
          <button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-semibold py-2 rounded-xl shadow hover:scale-105 transition-transform duration-200 disabled:opacity-60" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
          {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="mt-2 text-purple-700 underline text-center font-semibold hover:text-blue-600 transition">
          {isLogin ? 'Create an account' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
