import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  AlertCircle,
  Ban,
  X,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import api from '../services/api';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // Cancellation Modal state (Popup-free)
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('Ordered by mistake');
  const [customReason, setCustomReason] = useState('');
  const [cancelSuggestion, setCancelSuggestion] = useState('');
  const [cancelError, setCancelError] = useState('');

  const cancellationReasons = [
    'Ordered by mistake',
    'Delivery schedule does not suit my timing',
    'Need to change delivery address or quantities',
    'Found an alternative dairy source',
    'Price or payment issue',
    'Other reason',
  ];

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = () => {
    setLoading(true);
    api.get(`/orders/${id}`)
      .then((res) => {
        setOrder(res.data.order);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    setCancelling(true);
    setCancelError('');

    const finalReason =
      selectedReason === 'Other reason' && customReason.trim()
        ? customReason.trim()
        : selectedReason;

    try {
      await api.put(`/orders/${id}/cancel`, {
        reason: finalReason,
        suggestion: cancelSuggestion.trim() || null,
      });

      setShowCancelModal(false);
      fetchOrder();
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel this order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-dairy-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading delivery tracking...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <h2 className="font-serif text-xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/orders" className="text-xs font-bold text-dairy-600">Back to Orders</Link>
      </div>
    );
  }

  const steps = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStepIndex = steps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
        <Link to="/orders" className="hover:text-dairy-700">My Orders</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-dairy-800 font-semibold">Order #{order.id}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Tracking Order #{order.id}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {['PENDING', 'CONFIRMED'].includes(order.orderStatus) && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-full transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Delivery</span>
            </button>
          )}
        </div>

        {/* Cancellation Notice Banner with Reason & Feedback */}
        {order.orderStatus === 'CANCELLED' ? (
          <div className="p-5 bg-rose-50/80 border border-rose-200 rounded-3xl space-y-3">
            <div className="flex items-center space-x-3 text-rose-900 text-xs font-bold">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>This order has been cancelled and dairy products were restocked.</span>
            </div>

            {order.cancelReason && (
              <div className="text-xs text-rose-800 bg-white/70 p-3 rounded-2xl border border-rose-100 space-y-1">
                <span className="font-bold text-rose-900 block uppercase tracking-wider text-[10px]">
                  Cancellation Reason:
                </span>
                <p>{order.cancelReason}</p>
              </div>
            )}

            {order.cancelSuggestion && (
              <div className="text-xs text-slate-700 bg-white/70 p-3 rounded-2xl border border-rose-100 space-y-1">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[10px] flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3 text-dairy-600" />
                  <span>Customer Suggestion Recorded:</span>
                </span>
                <p className="italic text-slate-600">"{order.cancelSuggestion}"</p>
              </div>
            )}
          </div>
        ) : (
          /* Visual Delivery Stepper */
          <div className="py-4">
            <div className="grid grid-cols-4 gap-2 text-center">
              {steps.map((st, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={st} className="space-y-2">
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isPassed
                            ? 'bg-dairy-600 text-white shadow-md shadow-emerald-700/20'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                    </div>
                    <p
                      className={`text-[11px] font-bold ${
                        isCurrent ? 'text-dairy-700' : isPassed ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      {st === 'CONFIRMED' && 'Confirmed'}
                      {st === 'PROCESSING' && 'Bottling / Packing'}
                      {st === 'SHIPPED' && 'Cold-Chain Transit'}
                      {st === 'DELIVERED' && 'Delivered'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Items & Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Ordered items list */}
        <div className="md:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Ordered Items
          </h2>

          <div className="space-y-3 divide-y divide-slate-100">
            {order.items?.map((item) => (
              <div key={item.id} className="pt-3 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl p-1 flex-shrink-0 flex items-center justify-center border border-slate-100">
                    <img
                      src={item.product?.mainImage || '/placeholder-dairy.svg'}
                      alt={item.product?.name || 'Product'}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/placeholder-dairy.svg';
                      }}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{item.product?.name || 'Product'}</h3>
                    <p className="text-[11px] text-slate-400">
                      Qty: {item.quantity} × ₹{Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-900">
                  ₹{(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">
                ₹{(Number(order.totalAmount) - Number(order.shippingAmount)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-bold text-slate-900">
                {Number(order.shippingAmount) === 0 ? 'FREE' : `₹${Number(order.shippingAmount).toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between text-sm">
              <span className="font-bold text-slate-900">Total Amount</span>
              <span className="font-serif font-black text-lg text-slate-900">
                ₹{Number(order.totalAmount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Address & Payment Details */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-serif text-base font-bold text-slate-900 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-dairy-600" />
              <span>Delivery Address</span>
            </h3>
            {order.address && (
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">{order.address.fullName}</p>
                <p>{order.address.addressLine}</p>
                <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                <p className="font-semibold text-slate-700">📞 {order.address.phone}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-serif text-base font-bold text-slate-900">Payment Status</h3>
            <div className="text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-bold text-slate-800">{order.payment?.paymentMethod || 'Online'}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-bold ${order.orderStatus === 'CANCELLED' ? 'text-slate-500' : 'text-emerald-600'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.payment?.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span>Txn ID:</span>
                  <span className="font-mono text-[10px] text-slate-500 truncate max-w-[120px]">
                    {order.payment.razorpayPaymentId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* POPUP-FREE INTERACTIVE CANCELLATION MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Ban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">Cancel Dairy Delivery</h3>
                  <p className="text-[11px] text-slate-400">Order #{order.id} will be restocked to inventory</p>
                </div>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {cancelError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{cancelError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmCancel} className="space-y-4">
              {/* Reason Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Why would you like to cancel this order? <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-1.5">
                  {cancellationReasons.map((r) => (
                    <label
                      key={r}
                      className={`flex items-center space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-all text-xs ${
                        selectedReason === r
                          ? 'border-dairy-600 bg-emerald-50/60 font-semibold text-slate-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancellationReason"
                        value={r}
                        checked={selectedReason === r}
                        onChange={() => setSelectedReason(r)}
                        className="text-dairy-600 focus:ring-dairy-500"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom reason input if "Other reason" is selected */}
              {selectedReason === 'Other reason' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Please describe your reason
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Specific reason for cancellation..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-dairy-500"
                  />
                </div>
              )}

              {/* Suggestions & Feedback box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <MessageSquare className="w-3.5 h-3.5 text-dairy-600" />
                  <span>Any suggestions on how DairyFresh can improve? (Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Would prefer evening delivery slot, or specific jar packaging..."
                  value={cancelSuggestion}
                  onChange={(e) => setCancelSuggestion(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-dairy-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
