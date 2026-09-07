import React, { useEffect, useState } from 'react';
import { Filter, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter
        ? `/orders/admin/all?status=${statusFilter}`
        : '/orders/admin/all';
      const res = await api.get(url);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900">Order Management</h1>
          <p className="text-xs text-slate-500 mt-1">Update fulfillment status and dispatch tracking</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent focus:outline-none text-slate-700 cursor-pointer font-semibold"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Delivery City</th>
                  <th className="px-6 py-4">Fulfillment Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">#{o.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 block">{o.user?.name}</span>
                      <span className="text-[11px] text-slate-400">{o.user?.email}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {o.items?.map((i) => `${i.product?.name || 'Item'} (x${i.quantity})`).join(', ') || 'No items'}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      ₹{Number(o.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {o.address ? `${o.address.city} (${o.address.pincode})` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full font-bold text-[11px] border focus:outline-none cursor-pointer ${
                          o.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : o.orderStatus === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : o.orderStatus === 'CANCELLED'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
