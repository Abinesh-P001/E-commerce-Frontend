import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-24 h-24 rounded-3xl bg-emerald-100 text-dairy-700 flex items-center justify-center mx-auto shadow-lg shadow-emerald-700/10">
        <Compass className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-dairy-700">404 Error</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900">
          Pasture Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          The dairy product or page you are looking for may have moved or doesn't exist.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 bg-dairy-600 hover:bg-dairy-700 text-white font-bold text-xs rounded-full shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-full shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <span>Browse Products</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
