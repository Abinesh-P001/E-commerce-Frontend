import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Upload, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [weight, setWeight] = useState('500');
  const [unit, setUnit] = useState('ml');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [nutrition, setNutrition] = useState('');
  const [storageInstructions, setStorageInstructions] = useState('Keep refrigerated between 2°C and 4°C.');
  const [deliveryInformation, setDeliveryInformation] = useState('Insulated cold-chain morning delivery before 7:00 AM.');
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState('');

  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        const cats = res.data.categories || [];
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('categoryId', categoryId);
      formData.append('price', price);
      if (discountPrice) formData.append('discountPrice', discountPrice);
      formData.append('stock', stock);
      formData.append('weight', weight);
      formData.append('unit', unit);
      formData.append('description', description);
      if (ingredients) formData.append('ingredients', ingredients);
      if (nutrition) formData.append('nutrition', nutrition);
      formData.append('storageInstructions', storageInstructions);
      formData.append('deliveryInformation', deliveryInformation);

      if (mainImageFile) {
        formData.append('mainImage', mainImageFile);
      } else if (mainImageUrl) {
        formData.append('mainImage', mainImageUrl);
      }

      const res = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newProduct = res.data.product;
      navigate(`/admin/products/edit/${newProduct.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
        <Link to="/admin/products" className="hover:text-dairy-700">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-dairy-800 font-semibold">New Product</span>
      </nav>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">Add New Dairy Product</h1>
          <p className="text-xs text-slate-500 mt-1">Fill product details. You can configure 360-degree rotation frames immediately after saving.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Organic Bilona Gir Cow Ghee (Glass Jar)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-dairy-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-dairy-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Regular Price (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="90.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Discount Price (₹, optional)</label>
              <input
                type="number"
                step="0.01"
                placeholder="78.00"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Weight / Volume</label>
              <input
                type="text"
                required
                placeholder="500"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="ml">ml (Milliliters)</option>
                <option value="L">L (Liters)</option>
                <option value="g">g (Grams)</option>
                <option value="kg">kg (Kilograms)</option>
                <option value="pack">pack</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe farm origin, taste, and packaging..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-dairy-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Main Image Upload or URL</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMainImageFile(e.target.files[0])}
                  className="text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-dairy-700"
                />
                <input
                  type="text"
                  placeholder="Or enter image URL..."
                  value={mainImageUrl}
                  onChange={(e) => setMainImageUrl(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <Link
              to="/admin/products"
              className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-dairy-600 hover:bg-dairy-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              {loading ? 'Creating Product...' : 'Save Product & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
