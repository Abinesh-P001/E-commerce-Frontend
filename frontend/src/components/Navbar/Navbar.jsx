import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  Package,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { logout } from '../../store/authSlice';
import { fetchCart } from '../../store/cartSlice';
import { fetchWishlist } from '../../store/wishlistSlice';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const { itemCount } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [user, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-cream/90 backdrop-blur-sm py-4'
      }`}
    >
      {/* Top micro bar for quality guarantee */}
      <div className="hidden md:block border-b border-emerald-900/5 pb-2 mb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs text-slate-500 font-medium">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-dairy-700 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Grass-Fed A2 Certified</span>
            </span>
            <span>•</span>
            <span>Morning Doorstep Delivery Before 7:00 AM</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-600">Helpline: +91 98765 43210</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-dairy-600 flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6 fill-white">
                <path d="M50 20 C42 35 32 46 32 58 C32 68 40 76 50 76 C60 76 68 68 68 58 C68 46 58 35 50 20 Z" />
              </svg>
            </div>
            <div>
              <span className="font-serif font-extrabold text-2xl tracking-tight text-slate-900 group-hover:text-dairy-700 transition-colors">
                Dairy<span className="text-dairy-600">Fresh</span>
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-1">
                Pure Organic Farm
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md items-center relative"
          >
            <input
              type="text"
              placeholder="Search farm fresh milk, ghee, paneer, curd..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-full text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-dairy-500/20 focus:border-dairy-600 transition-all shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          </form>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-700">
            <Link to="/" className="hover:text-dairy-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="hover:text-dairy-600 transition-colors">
              Products
            </Link>
            <Link
              to="/products?featured=true"
              className="hover:text-dairy-600 transition-colors flex items-center space-x-1"
            >
              <span>360° Spotlight</span>
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3">
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative p-2.5 text-slate-600 hover:text-dairy-700 bg-white hover:bg-emerald-50/50 rounded-full border border-slate-200/70 shadow-sm transition-all"
            >
              <Heart className="w-4 h-4" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative p-2.5 text-slate-600 hover:text-dairy-700 bg-white hover:bg-emerald-50/50 rounded-full border border-slate-200/70 shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-dairy-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Direct Admin Link for quick switching */}
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-dairy-800 border border-emerald-200/60 rounded-full text-xs font-bold transition-all shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-dairy-700" />
                <span>Admin</span>
              </Link>
            )}

            {/* User Account / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 bg-white border border-slate-200/80 rounded-full hover:shadow-md transition-all text-xs font-semibold text-slate-800"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-dairy-800 font-bold flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      {user.role === 'ADMIN' && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-dairy-800 text-[10px] font-extrabold rounded-md">
                          ADMINISTRATOR
                        </span>
                      )}
                    </div>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-bold text-dairy-700 hover:bg-emerald-50 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-dairy-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-dairy-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-4 py-2 bg-dairy-600 hover:bg-dairy-700 text-white text-xs font-bold rounded-full shadow-sm hover:shadow-md transition-all"
                >
                  Join Farm
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-200/60 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search dairy products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            </form>

            <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
              <Link to="/" className="px-3 py-2 rounded-xl hover:bg-slate-100">
                Home
              </Link>
              <Link to="/products" className="px-3 py-2 rounded-xl hover:bg-slate-100">
                Products
              </Link>
              <Link to="/wishlist" className="px-3 py-2 rounded-xl hover:bg-slate-100">
                Wishlist ({wishlistItems.length})
              </Link>
              <Link to="/cart" className="px-3 py-2 rounded-xl hover:bg-slate-100">
                Cart ({itemCount})
              </Link>
              {user && (
                <Link to="/orders" className="px-3 py-2 rounded-xl hover:bg-slate-100">
                  My Orders
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-xl bg-emerald-50 text-dairy-800 font-bold"
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
