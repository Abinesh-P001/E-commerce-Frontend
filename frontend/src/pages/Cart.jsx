import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { fetchCart, updateQuantity, removeItem, clearCart } from '../store/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items, subtotal, shippingAmount, total, itemCount, loading } = useSelector(
    (state) => state.cart
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-dairy-600 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-slate-800">Your Basket Awaits</h2>
        <p className="text-xs text-slate-500">Sign in to sync and view your farm fresh cart items.</p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-dairy-600 text-white font-bold text-xs rounded-full shadow"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const freeShippingThreshold = 500;
  const awayFromFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900">Your Shopping Basket</h1>
          <p className="text-xs text-slate-500 mt-0.5">{itemCount} items selected for delivery</p>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => dispatch(clearCart())}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Clear Entire Basket
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
          <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-slate-800">Your Basket is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Discover our raw A2 farm milk, Vedic cow ghee, and freshly cultured pot curd.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-dairy-600 text-white font-bold text-xs rounded-full shadow"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Progress Card */}
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-dairy-900 flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-dairy-600" />
                  {awayFromFreeShipping > 0 ? (
                    <span>
                      Add <strong>₹{awayFromFreeShipping.toFixed(0)}</strong> more to get Free Morning Delivery!
                    </span>
                  ) : (
                    <span>🎉 Congratulations! You have unlocked Free Morning Delivery!</span>
                  )}
                </span>
                <span className="font-bold text-dairy-800">{freeShippingPercent}%</span>
              </div>
              <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-dairy-600 transition-all duration-300"
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/products/${item.productId}`}
                    className="w-20 h-20 bg-slate-50 rounded-2xl p-2 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100"
                  >
                    <img
                      src={item.product?.mainImage || '/placeholder-dairy.svg'}
                      alt={item.product?.name || 'Product'}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/placeholder-dairy.svg';
                      }}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </Link>

                  {/* Title & Price */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-bold text-sm text-slate-800 hover:text-dairy-700 transition-colors line-clamp-1"
                    >
                      {item.product?.name || 'Artisan Dairy Product'}
                    </Link>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.product?.weight || ''} {item.product?.unit || ''} • ₹{item.unitPrice} each
                    </p>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      ₹{(item.itemTotal || Number(item.unitPrice) * item.quantity || 0).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-full p-1">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity - 1 }))
                          : dispatch(removeItem(item.id))
                      }
                      className="w-7 h-7 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors shadow-sm"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity + 1 }))
                      }
                      className="w-7 h-7 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors shadow-sm"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() => dispatch(removeItem(item.id))}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6 sticky top-24">
              <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Cold-Chain Shipping</span>
                  <span className="font-bold text-slate-900">
                    {shippingAmount === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${shippingAmount.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900">Grand Total</span>
                  <span className="font-serif font-black text-xl text-slate-900">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-dairy-600 hover:bg-dairy-700 active:scale-95 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[11px] text-slate-400 text-center flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-dairy-600" />
                <span>Verified SSL Checkout • 100% Purity Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
