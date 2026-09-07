import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, SlidersHorizontal, ArrowUpDown, Search, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import { fetchProducts, fetchCategories } from '../store/productSlice';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { products, categories, totalPages, page, total, loading } = useSelector(
    (state) => state.products
  );

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Trigger product fetch when query params change
  useEffect(() => {
    const params = {};
    if (selectedCategory) params.categoryId = selectedCategory;
    if (keyword) params.keyword = keyword;
    if (sort) params.sort = sort;
    if (inStockOnly) params.inStock = 'true';
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    params.page = searchParams.get('page') || 1;
    params.limit = 12;

    dispatch(fetchProducts(params));
  }, [selectedCategory, keyword, sort, inStockOnly, minPrice, maxPrice, searchParams, dispatch]);

  const handleApplyFilter = () => {
    const newParams = new URLSearchParams();
    if (selectedCategory) newParams.set('categoryId', selectedCategory);
    if (keyword) newParams.set('keyword', keyword);
    if (sort) newParams.set('sort', sort);
    if (inStockOnly) newParams.set('inStock', 'true');
    if (minPrice) newParams.set('minPrice', minPrice);
    if (maxPrice) newParams.set('maxPrice', maxPrice);
    newParams.set('page', '1');

    setSearchParams(newParams);
    setMobileFilterOpen(false);
  };

  const handleResetFilter = () => {
    setSelectedCategory('');
    setKeyword('');
    setSort('newest');
    setInStockOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900">
            Fresh Dairy Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length} of {total} artisan dairy items
          </p>
        </div>

        {/* Sorting Dropdown and Mobile Filter Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm"
          >
            <Filter className="w-4 h-4 text-dairy-600" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm text-xs font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                const p = new URLSearchParams(searchParams);
                p.set('sort', e.target.value);
                setSearchParams(p);
              }}
              className="bg-transparent focus:outline-none text-slate-700 cursor-pointer font-medium"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        {/* Sidebar Filters Desktop */}
        <div className={`md:block space-y-6 ${mobileFilterOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-dairy-600" />
                <span>Filters</span>
              </h3>
              <button
                onClick={handleResetFilter}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-500 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search inside filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter name..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-dairy-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Category</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    selectedCategory === ''
                      ? 'bg-dairy-100 text-dairy-800'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(String(cat.id))}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedCategory === String(cat.id)
                        ? 'bg-dairy-100 text-dairy-800'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400">({cat._count?.products || 0})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Price Range (₹)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="stockFilter"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-dairy-600 focus:ring-dairy-500 border-slate-300"
              />
              <label htmlFor="stockFilter" className="text-xs font-semibold text-slate-700 cursor-pointer">
                In Stock Only
              </label>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApplyFilter}
              className="w-full py-2.5 bg-dairy-600 hover:bg-dairy-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="md:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-white rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8">
              <p className="text-base font-bold text-slate-700">No dairy products matched your filters.</p>
              <p className="text-xs text-slate-400 mt-1">Try broadening your search term or resetting filters.</p>
              <button
                onClick={handleResetFilter}
                className="mt-4 px-6 py-2 bg-dairy-600 text-white font-bold text-xs rounded-full shadow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    page === i + 1
                      ? 'bg-dairy-600 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
