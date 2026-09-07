import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { fetchWishlist, toggleWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [user, dispatch]);

  const handleMoveToCart = (productId) => {
    dispatch(addToCart({ productId, quantity: 1 }));
    dispatch(toggleWishlist(productId));
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <Heart className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-slate-800">Your Wishlist</h2>
        <p className="text-xs text-slate-500">Sign in to save and sync your favorite artisan dairy items.</p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-dairy-600 text-white font-bold text-xs rounded-full shadow"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-serif text-3xl font-extrabold text-slate-900">Saved Favorites</h1>
        <p className="text-xs text-slate-500 mt-1">{items.length} items saved in your dairy wishlist</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-slate-800">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500">Tap the heart icon on any product to save it for later.</p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-dairy-600 text-white font-bold text-xs rounded-full shadow"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col p-4 group"
            >
              <Link
                to={`/products/${item.productId}`}
                className="aspect-square bg-slate-50 rounded-2xl p-4 flex items-center justify-center overflow-hidden mb-3"
              >
                <img
                  src={item.product?.mainImage || '/placeholder-dairy.svg'}
                  alt={item.product?.name || 'Product'}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/placeholder-dairy.svg';
                  }}
                  className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                />
              </Link>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-dairy-700">
                    {item.product?.category?.name || 'Dairy'}
                  </span>
                  <Link
                    to={`/products/${item.productId}`}
                    className="block font-bold text-sm text-slate-800 hover:text-dairy-700 transition-colors line-clamp-1 mt-0.5"
                  >
                    {item.product?.name || 'Artisan Dairy Item'}
                  </Link>
                  <p className="text-xs font-black text-slate-900 mt-1">
                    ₹{item.product?.discountPrice || item.product?.price || 0}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleMoveToCart(item.productId)}
                    className="flex-1 py-2 bg-dairy-600 hover:bg-dairy-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>

                  <button
                    onClick={() => dispatch(toggleWishlist(item.productId))}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
