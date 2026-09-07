import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Plus, CheckCircle2, ShieldCheck, ArrowRight, CreditCard, Banknote } from 'lucide-react';
import { fetchCart, resetCart } from '../store/cartSlice';
import api from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items, subtotal, shippingAmount, total } = useSelector((state) => state.cart);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE'); // 'ONLINE' or 'COD'
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // New Address Form state
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560001');

  useEffect(() => {
    dispatch(fetchCart());
    fetchAddresses();
  }, [dispatch]);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      const list = res.data.addresses || [];
      setAddresses(list);
      const def = list.find((a) => a.isDefault) || list[0];
      if (def) setSelectedAddressId(def.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/addresses', {
        fullName,
        phone,
        addressLine,
        city,
        state,
        pincode,
        isDefault: addresses.length === 0,
      });
      const newAddr = res.data.address;
      setAddresses([newAddr, ...addresses]);
      setSelectedAddressId(newAddr.id);
      setShowAddressForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please choose or add a delivery address.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on backend (atomic transaction validates stock and totals)
      const orderRes = await api.post('/orders', {
        addressId: selectedAddressId,
        paymentMethod,
      });

      const order = orderRes.data.order;

      // 2. If online payment selected: initiate payment order
      if (paymentMethod === 'ONLINE') {
        const payRes = await api.post('/payment/create-order', {
          orderId: order.id,
        });

        // If Razorpay script is in window or mock mode:
        if (payRes.data.isMock) {
          // Dev mock payment verification
          await api.post('/payment/verify', {
            orderId: order.id,
            razorpayOrderId: payRes.data.razorpayOrderId,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            razorpaySignature: 'mock_signature',
          });
        }
      }

      dispatch(resetCart());
      navigate(`/order-success/${order.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-800">Your Basket is Empty</h2>
        <p className="text-xs text-slate-500">Add products to your basket before proceeding to checkout.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-dairy-600 text-white font-bold text-xs rounded-full shadow">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <h1 className="font-serif text-3xl font-extrabold text-slate-900 border-b border-slate-200 pb-4">
        Secure Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Address Selection & Payment Method */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-dairy-600" />
                <span>1. Choose Delivery Address</span>
              </h2>

              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="px-3.5 py-1.5 bg-emerald-50 text-dairy-800 hover:bg-emerald-100 text-xs font-bold rounded-full transition-colors flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Address cards list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                    selectedAddressId === addr.id
                      ? 'border-dairy-600 bg-emerald-50/30 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {selectedAddressId === addr.id && (
                    <span className="absolute top-3 right-3 text-dairy-600">
                      <CheckCircle2 className="w-5 h-5 fill-dairy-600 text-white" />
                    </span>
                  )}
                  <p className="font-bold text-xs text-slate-900">{addr.fullName}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{addr.addressLine}</p>
                  <p className="text-[11px] text-slate-500">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-700 mt-2">
                    📞 {addr.phone}
                  </p>
                </div>
              ))}
            </div>

            {/* Collapsible New Address Form */}
            {showAddressForm && (
              <form onSubmit={handleCreateAddress} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Enter New Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street Address / House No.</label>
                    <input
                      type="text"
                      required
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-dairy-600 hover:bg-dairy-700 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Save & Deliver Here
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
              2. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod('ONLINE')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                  paymentMethod === 'ONLINE'
                    ? 'border-dairy-600 bg-emerald-50/30 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-dairy-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-xs text-slate-900">Instant Online / Razorpay</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    UPI, Credit/Debit Cards, Net Banking & Wallets
                  </p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                  paymentMethod === 'COD'
                    ? 'border-dairy-600 bg-emerald-50/30 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Banknote className="w-5 h-5 text-dairy-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-xs text-slate-900">Cash on Delivery</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Pay upon doorstep early morning delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6 sticky top-24">
            <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Items in Order
            </h3>

            {/* Item preview list */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-semibold text-slate-800 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-900">₹{item.itemTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-bold text-slate-900">
                  {shippingAmount === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    `₹${shippingAmount.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total Payable</span>
                <span className="font-serif font-black text-xl text-slate-900">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-4 bg-dairy-600 hover:bg-dairy-700 active:scale-95 disabled:bg-slate-300 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Securing Order...</span>
              ) : (
                <>
                  <span>Confirm Order & Pay ₹{total.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-[11px] text-slate-400 text-center flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-dairy-600" />
              <span>100% Encrypted & Authenticated Order</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
