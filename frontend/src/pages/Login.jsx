import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginUser, clearError } from '../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, user } = useSelector((state) => state.auth);

  const redirectTarget = location.state?.from?.pathname;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((res) => {
      if (!res.error) {
        const loggedUser = res.payload?.user;
        if (redirectTarget) {
          navigate(redirectTarget, { replace: true });
        } else if (loggedUser?.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/', { replace: true });
        }
      }
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-dairy-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-700/20">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900">Customer Sign In</h1>
          <p className="text-xs text-slate-500">Sign in to manage your dairy orders, fresh basket, and morning delivery</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-dairy-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-dairy-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-dairy-600 hover:bg-dairy-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In to Farm</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="space-y-3 pt-2 text-center text-xs">
          <p className="text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-dairy-600 hover:underline">
              Create Account (Join Farm)
            </Link>
          </p>

          <div className="border-t border-slate-100 pt-3">
            <Link
              to="/admin/login"
              className="text-[11px] text-slate-400 hover:text-dairy-700 font-semibold inline-flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Administrator Portal Access</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
