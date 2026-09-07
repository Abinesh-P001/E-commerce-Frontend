import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* 4 Pillars Benefit Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Certified Pure</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Zero antibiotics, synthetic hormones, or chemical preservatives.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 rounded-2xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Cold-Chain Delivery</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Insulated transport strictly maintained between 2°C to 4°C.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Before 7:00 AM</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Farm-milked at dawn, chilled, bottled, and at your door in 12 hours.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Interactive 360° Quality</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Inspect every bottle angle, nutrition label, and purity seal online.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-dairy-600 flex items-center justify-center shadow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5 fill-white">
                  <path d="M50 20 C42 35 32 46 32 58 C32 68 40 76 50 76 C60 76 68 68 68 58 C68 46 58 35 50 20 Z" />
                </svg>
              </div>
              <span className="font-serif font-extrabold text-2xl tracking-tight text-white">
                Dairy<span className="text-dairy-500">Fresh</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              We bridge pristine pastoral farms directly with your family breakfast table. Dedicated to indigenous Gir cows, regenerative soil grazing, and zero adulteration.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/40 rounded-full text-[11px] font-bold">
                FSSAI Lic. No: 11223344556677
              </span>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Shop Products</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/products?category=milk" className="hover:text-emerald-400 transition-colors">
                  A2 Farm Fresh Milk
                </Link>
              </li>
              <li>
                <Link to="/products?category=ghee" className="hover:text-emerald-400 transition-colors">
                  Vedic Bilona Ghee
                </Link>
              </li>
              <li>
                <Link to="/products?category=curd" className="hover:text-emerald-400 transition-colors">
                  Artisanal Pot Curd
                </Link>
              </li>
              <li>
                <Link to="/products?category=paneer" className="hover:text-emerald-400 transition-colors">
                  Fresh Malai Paneer
                </Link>
              </li>
              <li>
                <Link to="/products?category=butter" className="hover:text-emerald-400 transition-colors">
                  Cultured Pasture Butter
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/orders" className="hover:text-emerald-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-emerald-400 transition-colors">
                  Delivery Addresses
                </Link>
              </li>
              <li>
                <span className="text-slate-300 font-semibold block">Morning Delivery:</span>
                5:30 AM – 7:30 AM
              </li>
              <li>
                <span className="text-slate-300 font-semibold block">Support Hotline:</span>
                +91 98765 43210
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Farm Newsletter</h5>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Receive seasonal dairy harvests, Vedic butter making tips, and exclusive subscriber discounts.
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs rounded-2xl">
                ✓ Thank you for joining our farm community!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-dairy-600 hover:bg-dairy-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} DairyFresh Ltd. All Rights Reserved.</p>
        <div className="flex items-center space-x-6">
          <Link to="/products" className="hover:text-slate-400">Privacy Policy</Link>
          <Link to="/products" className="hover:text-slate-400">Terms of Service</Link>
          <Link to="/admin" className="hover:text-emerald-400 text-slate-400 font-semibold">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
