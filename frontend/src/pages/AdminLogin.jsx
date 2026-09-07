import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Store } from 'lucide-react';
import api from '../services/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await api.post('/auth/admin-login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Dispatch directly to Redux store
      dispatch({
        type: 'auth/login/fulfilled',
        payload: {
          user: res.data.user,
          token: res.data.token,
        },
      });

      navigate('/admin', { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Administrator authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-dairy-600 to-emerald-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 ring-4 ring-emerald-500/20">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h1 className="font-serif text-3xl font-extrabold text-white tracking-tight">
          DairyFresh <span className="text-emerald-400">Portal</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
          Management & Operations Sign In
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl border border-slate-800 sm:px-10 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-sm font-bold text-slate-200">Administrator Access</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly restricted to authorized dairy platform administrators.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-2xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@dairyfresh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-dairy-600 to-emerald-600 hover:from-dairy-500 hover:to-emerald-500 active:scale-[0.99] text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Customer Storefront backlink */}
          <div className="pt-4 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-emerald-400 font-semibold transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Return to Customer Storefront</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
