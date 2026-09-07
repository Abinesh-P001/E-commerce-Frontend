import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  LogOut,
  Store,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { logout } from '../store/authSlice';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Add Product', path: '/admin/products/add', icon: PlusCircle },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/admin/users', icon: Users },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-dairy-600 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-extrabold text-lg text-white">DairyFresh</h1>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-dairy-600 text-white shadow-md shadow-emerald-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Customer Storefront</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden lg:block text-xs font-bold text-slate-500">
            <span>Logged in as: </span>
            <span className="text-slate-900">{user?.name}</span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="px-3.5 py-1.5 bg-emerald-50 text-dairy-800 hover:bg-emerald-100 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Live Store</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
              title="Sign out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex">
            <div className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-lg">Admin Portal</span>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-800"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-400 font-bold flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
