import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heart,
  ShoppingBag,
  Zap,
  RotateCw,
  ImageIcon,
  ShieldCheck,
  Truck,
  Clock,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import Product360Viewer from '../components/Product360Viewer/Product360Viewer';
import ProductCard from '../components/ProductCard/ProductCard';
import Rating from '../components/Rating/Rating';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('360'); // '360' or 'gallery'
  const [selectedGalleryImg, setSelectedGalleryImg] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    api.get(`/products/${id}`)
      .then((res) => {
        const prod = res.data.product;
        setProduct(prod);
        setSelectedGalleryImg(prod.mainImage);
        // Default to 360 viewer if 360 frames exist, otherwise gallery
        if (prod.view360Images && prod.view360Images.length > 0) {
          setActiveTab('360');
        } else {
          setActiveTab('gallery');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const isWishlisted = product ? wishlistItems.some((w) => w.productId === product.id) : false;

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity }));
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity }))
      .then(() => navigate('/checkout'));
  };

  const handleToggleWishlist = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(toggleWishlist(product.id));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess('Thank you! Your verified review has been published.');
      setReviewComment('');
      // Refresh product details
      const updated = await api.get(`/products/${id}`);
      setProduct(updated.data.product);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-dairy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-semibold text-sm">Loading farm fresh product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 text-sm">The product you requested might have been retired or moved.</p>
        <Link to="/products" className="px-6 py-2.5 bg-dairy-600 text-white font-bold text-xs rounded-full inline-block shadow">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const has360 = product.view360Images && product.view360Images.length > 0;
  const nutritionObj = product.nutrition
    ? typeof product.nutrition === 'string'
      ? JSON.parse(product.nutrition)
      : product.nutrition
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-dairy-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/products" className="hover:text-dairy-700">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-dairy-800 font-semibold">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Media Viewer with 360 / Gallery Switcher */}
        <div className="lg:col-span-6 space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center space-x-2 p-1.5 bg-slate-200/60 rounded-2xl w-fit">
            {has360 && (
              <button
                type="button"
                onClick={() => setActiveTab('360')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === '360'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <RotateCw className="w-4 h-4 text-dairy-600" />
                <span>Interactive 360° View</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <span>Standard Gallery</span>
            </button>
          </div>

          {/* Active Viewer Display */}
          {activeTab === '360' && has360 ? (
            <Product360Viewer
              images={product.view360Images}
              productName={product.name}
            />
          ) : (
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-white rounded-3xl border border-slate-200 p-8 flex items-center justify-center overflow-hidden shadow-inner">
                <img
                  src={selectedGalleryImg}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-xl"
                />
              </div>

              {/* Gallery Thumbnails */}
              {product.galleryImages && product.galleryImages.length > 0 && (
                <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGalleryImg(product.mainImage)}
                    className={`w-16 h-16 rounded-2xl bg-white border-2 p-1.5 flex-shrink-0 transition-all ${
                      selectedGalleryImg === product.mainImage
                        ? 'border-dairy-600 shadow-md'
                        : 'border-slate-200'
                    }`}
                  >
                    <img src={product.mainImage} alt="Main thumb" className="w-full h-full object-contain" />
                  </button>
                  {product.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedGalleryImg(img)}
                      className={`w-16 h-16 rounded-2xl bg-white border-2 p-1.5 flex-shrink-0 transition-all ${
                        selectedGalleryImg === img ? 'border-dairy-600 shadow-md' : 'border-slate-200'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Product Info, Pricing & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-dairy-700 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{product.category?.name || 'Dairy Fresh'}</span>
              <span>•</span>
              <span className="text-slate-500">{product.weight} {product.unit}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Stock Status */}
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full">
                <Rating value={product.rating || 5} size="w-4 h-4" />
                <span className="text-xs font-bold text-amber-900">{product.rating}</span>
                <span className="text-xs text-amber-700">({product.reviewCount || 0} reviews)</span>
              </div>

              {product.stock > 0 ? (
                <span className="px-3 py-1 bg-emerald-100 text-dairy-800 text-xs font-extrabold rounded-full">
                  ✓ In Stock ({product.stock} left)
                </span>
              ) : (
                <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-extrabold rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Pricing Row */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-baseline space-x-4">
            <span className="font-serif font-black text-3xl text-slate-900">
              ₹{product.discountPrice ? product.discountPrice : product.price}
            </span>
            {product.discountPrice && (
              <>
                <span className="text-sm font-semibold text-slate-400 line-through">
                  ₹{product.price}
                </span>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                  Save ₹{(product.price - product.discountPrice).toFixed(0)}
                </span>
              </>
            )}
            <span className="text-xs text-slate-400 ml-auto font-medium">Taxes included</span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity selector & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-full p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-4 bg-dairy-600 hover:bg-dairy-700 active:scale-95 disabled:bg-slate-300 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 active:scale-95 disabled:bg-slate-300 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className="p-4 bg-white hover:bg-rose-50 border border-slate-200 rounded-2xl shadow-sm transition-all"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              </button>
            </div>
          </div>

          {/* Delivery & Quality Benefits */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-start space-x-3 p-3 bg-emerald-50/50 rounded-2xl">
              <Truck className="w-5 h-5 text-dairy-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-800">Cold Chain Direct</p>
                <p className="text-[11px] text-slate-500">Delivered chilled at 4°C</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-emerald-50/50 rounded-2xl">
              <Clock className="w-5 h-5 text-dairy-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-800">Morning Drop</p>
                <p className="text-[11px] text-slate-500">Before 7:00 AM daily</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Specs & Nutrition Grid */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-8">
        <h2 className="font-serif text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4">
          Purity & Nutritional Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ingredients</h3>
              <p className="text-sm font-medium text-slate-700 mt-1">
                {product.ingredients || '100% Pure Organic Dairy. No artificial flavorings.'}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Instructions</h3>
              <p className="text-sm font-medium text-slate-700 mt-1">
                {product.storageInstructions || 'Keep refrigerated between 2°C and 4°C.'}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Details</h3>
              <p className="text-sm font-medium text-slate-700 mt-1">
                {product.deliveryInformation || 'Dispatched in thermal insulated boxes before 7:00 AM.'}
              </p>
            </div>
          </div>

          {/* Nutrition Table */}
          {nutritionObj && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Nutritional Facts (Per 100ml / 100g)
              </h3>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 divide-y divide-slate-200/60 text-xs">
                {Object.entries(nutritionObj).map(([key, val]) => (
                  <div key={key} className="py-2 flex items-center justify-between">
                    <span className="capitalize font-semibold text-slate-600">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="font-bold text-slate-900">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">Verified Customer Reviews</h2>
            <p className="text-xs text-slate-500 mt-1">
              Average {product.rating} / 5 based on {product.reviews?.length || 0} evaluations
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Rating value={product.rating || 5} size="w-5 h-5" />
            <span className="font-serif font-black text-xl text-slate-900">{product.rating}</span>
          </div>
        </div>

        {/* Submit Review Form */}
        <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-dairy-600" />
            <span>Write a Review</span>
          </h3>

          {reviewSuccess ? (
            <div className="p-3 bg-emerald-100 text-dairy-900 text-xs font-bold rounded-xl">
              {reviewSuccess}
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold text-slate-600">Your Rating:</span>
                <Rating
                  value={reviewRating}
                  onChange={(val) => setReviewRating(val)}
                  readonly={false}
                  size="w-5 h-5"
                />
              </div>

              <textarea
                required
                rows={3}
                placeholder="Describe freshness, aroma, taste, texture, or delivery experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-dairy-600"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 bg-dairy-600 hover:bg-dairy-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          )}
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="p-5 bg-slate-50/70 rounded-2xl space-y-2 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {rev.user?.name || 'Verified Buyer'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Rating value={rev.rating} size="w-3.5 h-3.5" />
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>

      {/* Related Products Grid */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
