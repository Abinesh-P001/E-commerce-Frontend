import React, { useEffect, useState } from 'react';
import { Plus, Trash2, FolderTree, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name, description });
      setName('');
      setDescription('');
      setShowAdd(false);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category and its associations?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900">Categories</h1>
          <p className="text-xs text-slate-500 mt-1">Manage dairy product taxonomy and classification</p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-5 py-2.5 bg-dairy-600 hover:bg-dairy-700 text-white text-xs font-bold rounded-full shadow transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-xl">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Create New Category</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Organic Cottage Cheese"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Description of this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-1.5 text-xs text-slate-500 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-dairy-600 text-white font-bold text-xs rounded-xl shadow"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-dairy-600 flex items-center justify-center">
                  <FolderTree className="w-4 h-4" />
                </span>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">
                  {cat._count?.products || 0} Products
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {cat.description || 'No description provided.'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex justify-end">
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
