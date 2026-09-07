import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Truck,
  Heart,
  Award,
  ChevronRight,
  Droplet,
} from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import Product360Viewer from '../components/Product360Viewer/Product360Viewer';
import { fetchProducts, fetchCategories } from '../store/productSlice';
import api from '../services/api';

const Home = () => {
  const dispatch = useDispatch();
  const { products, categories, loading } = useSelector((state) => state.products);
  const [spotlightProduct, setSpotlightProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
    dispatch(fetchCategories());

    // Fetch flagship product with 360 views for spotlight
    api.get('/products')
      .then((res) => {
        const flagship = res.data.products?.find((p) => p.name.includes('A2 Organic')) || res.data.products?.[0];
        if (flagship) {
          api.get(`/products/${flagship.id}`).then((pRes) => {
            setSpotlightProduct(pRes.data.product);
          });
        }
      })
      .catch(console.error);
  }, [dispatch]);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-gradient-to-b from-emerald-50/50 via-cream to-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-emerald-100 text-dairy-800 rounded-full text-xs font-extrabold tracking-wide shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>DIRECT FROM PASTURE TO DOORSTEP</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15]">
                Pure, Raw & Unadulterated{' '}
                <span className="text-dairy-600 italic underline decoration-amber-400 decoration-wavy decoration-2">
                  A2 Dairy
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Sourced from stress-free indigenous Gir cows fed on organic clover and alfalfa. Chilled instantly at 4°C and delivered before morning dawn in eco-friendly sanitized glass bottles.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-4 bg-dairy-600 hover:bg-dairy-700 text-white font-bold text-sm rounded-full shadow-lg shadow-emerald-700/25 hover:shadow-emerald-700/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Explore Fresh Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#spotlight-360"
                  className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-full border border-slate-200/80 shadow-sm transition-all flex items-center justify-center space-x-2"
                >
                  <RotateCw className="w-4 h-4 text-dairy-600" />
                  <span>Inspect 360° Bottle</span>
                </a>
              </div>

              {/* Quick Trust Metric Pills */}
              <div className="pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <span className="block font-serif font-black text-2xl text-slate-900">100%</span>
                  <span className="text-xs text-slate-500 font-medium">Grass-Fed A2</span>
                </div>
                <div>
                  <span className="block font-serif font-black text-2xl text-slate-900">0%</span>
                  <span className="text-xs text-slate-500 font-medium">Preservatives</span>
                </div>
                <div>
                  <span className="block font-serif font-black text-2xl text-slate-900">4°C</span>
                  <span className="text-xs text-slate-500 font-medium">Cold Chain Chilled</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md aspect-square bg-gradient-to-tr from-emerald-100 to-amber-50 rounded-[40px] p-8 shadow-2xl border border-white flex items-center justify-center">
                {/* Floating pill badge */}
                <div className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-2xl shadow-lg border border-slate-100 flex items-center space-x-2">
                  <Droplet className="w-5 h-5 text-dairy-600 fill-dairy-500" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">Morning Drop</p>
                    <p className="text-[9px] text-slate-400">Guaranteed before 7 AM</p>
                  </div>
                </div>

                <img
                  src="/uploads/360/milk-360-01.svg"
                  alt="A2 Whole Milk Bottle"
                  className="max-h-full drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute -bottom-4 -left-4 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2.5">
                  <RotateCw className="w-4 h-4 text-emerald-400 animate-spin" />
                  <div>
                    <p className="text-xs font-bold text-white">Full 360° Rotation</p>
                    <p className="text-[9px] text-emerald-300">Interact with all 36 angles below</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-dairy-700">Categories</span>
            <h2 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
              Farm Fresh Essentials
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-dairy-700 hover:text-dairy-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?categoryId=${category.id}`}
              className="group p-5 bg-white rounded-3xl border border-slate-100 hover:border-dairy-200 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100/70 transition-colors flex items-center justify-center p-3 mb-3 overflow-hidden">
                <img
                  src={category.image || '/placeholder-category.png'}
                  alt={category.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-dairy-700 transition-colors">
                {category.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {category._count?.products || 0} Products
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Signature 360-Degree Interactive Spotlight Section */}
      <section id="spotlight-360" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950 rounded-[36px] p-8 lg:p-14 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* 360 Viewer Canvas */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              {spotlightProduct && spotlightProduct.view360Images?.length > 0 ? (
                <Product360Viewer
                  images={spotlightProduct.view360Images}
                  productName={spotlightProduct.name}
                />
              ) : (
                <div className="aspect-[4/5] bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400">
                  <RotateCw className="w-8 h-8 animate-spin mr-2" />
                  <span>Loading 360 Sequence...</span>
                </div>
              )}
            </div>

            {/* Spotlight Details */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
                <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>SIGNATURE 360° INSPECTION</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Inspect Every Angle of Purity Before Ordering
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We believe in 100% transparency. Drag, swipe, or auto-spin our flagship products to verify nutritional breakdowns, glass packaging seals, and pure batch numbers.
              </p>

              {spotlightProduct && (
                <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-lg">{spotlightProduct.name}</h3>
                    <span className="font-serif font-black text-xl text-emerald-400">
                      ₹{spotlightProduct.discountPrice || spotlightProduct.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {spotlightProduct.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-emerald-300 font-semibold">
                      ✓ Available for immediate delivery
                    </span>
                    <Link
                      to={`/products/${spotlightProduct.id}`}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">Sanitized glass bottles, hermetically sealed cap</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">Triple lab-tested for pesticides and heavy metals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Best Sellers Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-dairy-700">
              Popular Picks
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
              Customer Favorites
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-dairy-700 hover:text-dairy-800 flex items-center space-x-1"
          >
            <span>See All Products</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-white rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Quality & Freshness Guarantee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50 rounded-3xl p-8 sm:p-12 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Our 100% Purity Guarantee
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              If our milk or ghee does not meet your standard of freshness, flavor, or texture, we will refund your order immediately with no questions asked.
            </p>
          </div>
          <Link
            to="/products"
            className="px-8 py-3.5 bg-dairy-600 hover:bg-dairy-700 text-white font-bold text-xs rounded-full shadow-md transition-all flex-shrink-0"
          >
            Taste The Difference
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
