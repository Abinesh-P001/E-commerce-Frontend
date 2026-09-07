import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import api from '../services/api';

const statusBadge = (status) => {
  switch (status) {
    case 'DELIVERED':
      return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">Delivered</span>;
    case 'SHIPPED':
      return <span className="px-3 py-1 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-full">Out for Delivery</span>;
    case 'PROCESSING':
      return <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full">Packaging</span>;
    case 'CONFIRMED':
      return <span className="px-3 py-1 bg-dairy-100 text-dairy-800 text-[11px] font-bold rounded-full">Confirmed</span>;
    case 'CANCELLED':
      return <span className="px-3 py-1 bg-rose-100 text-rose-800 text-[11px] font-bold rounded-full">Cancelled</span>;
    default:
      return <span className="px-3 py-1 bg-slate-100 text-slate-800 text-[11px] font-bold rounded-full">Pending</span>;
  }
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then((res) => {
        setOrders(res.data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-dairy-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Retrieving your dairy order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-serif text-3xl font-extrabold text-slate-900">My Orders</h1>
        <p className="text-xs text-slate-500 mt-1">Review past and ongoing morning dairy deliveries</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-slate-800">No Orders Yet</h3>
          <p className="text-xs text-slate-500">Your morning deliveries will be tracked right here.</p>
          <Link
            to="/products"
            className="inline-block px-6 py-2.5 bg-dairy-600 text-white font-bold text-xs rounded-full shadow"
          >
            Start Fresh Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-slate-900">Order #{order.id}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div>{statusBadge(order.orderStatus)}</div>
              </div>

              {/* Items Row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3 overflow-x-auto">
                  {order.items?.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="w-14 h-14 bg-slate-50 rounded-2xl p-1 flex-shrink-0 flex items-center justify-center border border-slate-100"
                    >
                      <img
                        src={item.product?.mainImage || '/placeholder-dairy.svg'}
                        alt={item.product?.name || 'Product'}
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                      />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-xs font-bold text-slate-600">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="block font-serif font-black text-lg text-slate-900">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                  </span>
                </div>
              </div>

              {/* Details link */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <Link
                  to={`/orders/${order.id}`}
                  className="text-xs font-bold text-dairy-700 hover:text-dairy-800 flex items-center space-x-1"
                >
                  <span>Track & View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
