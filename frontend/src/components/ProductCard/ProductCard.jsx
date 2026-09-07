import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Eye, RotateCw } from 'lucide-react';
import Rating from '../Rating/Rating';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems.some((w) => w.productId === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(toggleWishlist(product.id));
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Product Image & Badges */}
      <Link to={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-50/70 p-4">
        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-amber-500 text-white text-[11px] font-bold rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* 360 Available Badge */}
        {product.name.includes('A2') || product.name.includes('Ghee') || product.name.includes('Milk (Glass') ? (
          <span className="absolute top-3 right-12 z-10 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold rounded-full flex items-center space-x-1 shadow-sm">
            <RotateCw className="w-3 h-3 text-emerald-400" />
            <span>360°</span>
          </span>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Wishlist"
          className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.mainImage || '/placeholder-dairy.svg'}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/placeholder-dairy.svg';
          }}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick View Button overlay on desktop */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-4 py-2 bg-white/95 text-slate-800 text-xs font-bold rounded-full shadow-lg flex items-center space-x-1.5 backdrop-blur-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category & Weight */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
          <span className="text-dairy-700 font-semibold uppercase tracking-wider text-[10px]">
            {product.category?.name || 'Dairy'}
          </span>
          <span>
            {product.weight} {product.unit}
          </span>
        </div>

        {/* Product Title */}
        <Link
          to={`/products/${product.id}`}
          className="font-bold text-slate-800 text-base leading-snug hover:text-dairy-700 transition-colors line-clamp-1 mb-1.5"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1.5 mb-3">
          <Rating value={product.rating || 5} size="w-3.5 h-3.5" />
          <span className="text-xs font-semibold text-slate-600">{product.rating || 5.0}</span>
          {product.reviewCount ? (
            <span className="text-xs text-slate-400">({product.reviewCount})</span>
          ) : null}
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-extrabold text-slate-900">
                ₹{product.discountPrice ? product.discountPrice : product.price}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-slate-400 line-through">₹{product.price}</span>
              )}
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold">In Stock</p>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-dairy-600 hover:bg-dairy-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
