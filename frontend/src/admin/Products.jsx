import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, RotateCw, Eye } from 'lucide-react';
import api from '../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products?limit=50');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900">Products Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Manage dairy products, inventory, and 360-degree frame sequences</p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-dairy-600 hover:bg-dairy-700 text-white text-xs font-bold rounded-full shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-dairy-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading catalog items...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl p-1 flex-shrink-0 flex items-center justify-center border border-slate-100">
                          <img
                            src={p.mainImage}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{p.name}</span>
                          <span className="text-[11px] text-slate-400">
                            {p.weight} {p.unit}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.category?.name || 'Dairy'}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">
                        ₹{p.discountPrice ? p.discountPrice : p.price}
                      </span>
                      {p.discountPrice && (
                        <span className="text-[10px] text-slate-400 line-through block">
                          ₹{p.price}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold ${
                          p.stock <= 10 ? 'text-rose-600' : 'text-slate-800'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-dairy-800 text-[10px] font-bold rounded-full">
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/products/${p.id}`}
                          target="_blank"
                          title="View Live Store Page"
                          className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${p.id}`}
                          title="Edit Product & 360 Sequences"
                          className="p-2 text-slate-400 hover:text-dairy-700 rounded-xl"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          title="Delete Product"
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
