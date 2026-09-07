import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-dairy-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading operations dashboard...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];
  const categoryDistribution = data?.categoryDistribution || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900">Operations Overview</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time metrics, order volume, and inventory health</p>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
            <h2 className="font-serif font-black text-2xl text-slate-900">
              ₹{Number(stats.totalRevenue || 0).toFixed(2)}
            </h2>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Verified Revenue</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-dairy-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <h2 className="font-serif font-black text-2xl text-slate-900">{stats.totalOrders || 0}</h2>
            <span className="text-[11px] text-slate-500 font-medium">Delivered & Ongoing</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Catalog Products */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Products</span>
            <h2 className="font-serif font-black text-2xl text-slate-900">{stats.totalProducts || 0}</h2>
            <span className="text-[11px] text-slate-500 font-medium">Across 10 Categories</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customers</span>
            <h2 className="font-serif font-black text-2xl text-slate-900">{stats.totalUsers || 0}</h2>
            <span className="text-[11px] text-slate-500 font-medium">Verified Profiles</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders Alert */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Orders</span>
            <h2 className="font-serif font-black text-2xl text-amber-600">{stats.pendingOrders || 0}</h2>
            <span className="text-[11px] text-slate-500 font-medium">Require Confirmation</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Alert</span>
            <h2 className="font-serif font-black text-2xl text-rose-600">{stats.lowStockProducts || 0}</h2>
            <span className="text-[11px] text-slate-500 font-medium">Items with ≤ 10 stock</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Categories Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-slate-900">Recent Customer Orders</h3>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-dairy-700 hover:text-dairy-800 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-900">#{order.id}</td>
                    <td className="py-3 text-slate-700">{order.user?.name || 'Customer'}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-dairy-800 text-[10px] font-bold rounded-full">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-900">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Category Breakdown
          </h3>

          <div className="space-y-3">
            {categoryDistribution.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{cat.name}</span>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full font-bold">
                  {cat.productCount} items
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
