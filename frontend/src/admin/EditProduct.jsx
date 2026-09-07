import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, RotateCw, Upload, Save, CheckCircle2, Trash2 } from 'lucide-react';
import Product360Viewer from '../components/Product360Viewer/Product360Viewer';
import api from '../services/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading360, setUploading360] = useState(false);
  const [message, setMessage] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [active, setActive] = useState(true);
  const [description, setDescription] = useState('');

  // 360 files state
  const [files360, setFiles360] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get('/categories'),
      ]);
      const p = prodRes.data.product;
      setProduct(p);
      setName(p.name);
      setCategoryId(p.category?.id || '');
      setPrice(String(p.price));
      setDiscountPrice(p.discountPrice ? String(p.discountPrice) : '');
      setStock(String(p.stock));
      setActive(p.active);
      setDescription(p.description);

      setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/products/${id}`, {
        name,
        categoryId: parseInt(categoryId, 10),
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: parseInt(stock, 10),
        active,
        description,
      });
      setMessage('Product updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload360 = async (e) => {
    e.preventDefault();
    if (!files360 || files360.length === 0) {
      alert('Please select files for the 360 sequence.');
      return;
    }

    setUploading360(true);
    try {
      const formData = new FormData();
      formData.append('replace', 'true');
      for (let i = 0; i < files360.length; i++) {
        formData.append('images', files360[i]);
      }

      await api.post(`/products/${id}/360-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert(`Successfully uploaded ${files360.length} 360-degree rotation frames!`);
      setFiles360([]);
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading360(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading product editor...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
        <Link to="/admin/products" className="hover:text-dairy-700">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-dairy-800 font-semibold">{product?.name}</span>
      </nav>

      {message && (
        <div className="p-4 bg-emerald-100 border border-emerald-200 text-dairy-900 rounded-2xl text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-dairy-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Details Form */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-slate-900">Edit Product Attributes</h1>
            <p className="text-xs text-slate-500 mt-0.5">Update pricing, inventory, and visibility</p>
          </div>
          <Link
            to={`/products/${id}`}
            target="_blank"
            className="text-xs font-bold text-dairy-600 hover:underline"
          >
            View Live Page ↗
          </Link>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stock Level</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Discount Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="activeProd"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded text-dairy-600 border-slate-300"
              />
              <label htmlFor="activeProd" className="text-xs font-semibold text-slate-700">
                Product Active & Purchasable
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-dairy-600 hover:bg-dairy-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Update Product'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 360-Degree Image Sequence Manager */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-dairy-800 rounded-full text-xs font-bold mb-2">
            <RotateCw className="w-3.5 h-3.5 text-dairy-600" />
            <span>Interactive 360° Management</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-slate-900">
            360-Degree Frame Sequence ({product?.view360Images?.length || 0} Frames Loaded)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload up to 36 sequential images. Files are sorted sequentially to provide seamless rotation physics.
          </p>
        </div>

        {/* Live Preview of 360 Viewer */}
        {product?.view360Images?.length > 0 && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-xs font-bold text-slate-700 mb-3">Live Interactive 360 Preview:</p>
            <div className="max-w-sm mx-auto">
              <Product360Viewer
                images={product.view360Images}
                productName={product.name}
              />
            </div>
          </div>
        )}

        {/* Upload Sequence Form */}
        <form onSubmit={handleUpload360} className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Upload New 360 Image Sequence
          </h3>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles360(e.target.files)}
            className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-dairy-600 file:text-white hover:file:bg-dairy-700 cursor-pointer"
          />

          {files360.length > 0 && (
            <p className="text-xs text-dairy-700 font-bold">
              ✓ {files360.length} image files selected for upload.
            </p>
          )}

          <button
            type="submit"
            disabled={uploading360 || files360.length === 0}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading360 ? 'Uploading Sequence...' : `Upload ${files360.length || 0} Frames`}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
