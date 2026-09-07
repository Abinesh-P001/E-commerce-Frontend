import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-dairy-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-dairy-700">
          Order Placed Successfully
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900">
          Thank You For Ordering Farm Fresh!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Your order <strong>#{id}</strong> has been confirmed and scheduled for morning cold-chain delivery.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-left space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
          <span className="text-slate-500 font-medium">Order Number:</span>
          <span className="font-mono font-bold text-slate-900">#{id}</span>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-700">
          <Clock className="w-4 h-4 text-dairy-600 flex-shrink-0" />
          <span>Expected Delivery: <strong>Tomorrow morning before 7:00 AM</strong></span>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-700">
          <ShieldCheck className="w-4 h-4 text-dairy-600 flex-shrink-0" />
          <span>Cold-chain sealed at 4°C directly from the dairy</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to={`/orders/${id}`}
          className="w-full sm:w-auto px-6 py-3 bg-dairy-600 hover:bg-dairy-700 text-white font-bold text-xs rounded-full shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Package className="w-4 h-4" />
          <span>Track Order Status</span>
        </Link>

        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-full border border-slate-200 transition-all flex items-center justify-center space-x-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
