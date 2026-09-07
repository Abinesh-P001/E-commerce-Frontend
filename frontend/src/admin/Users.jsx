import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, Mail, Phone, UserPlus, X, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('customers'); // 'customers' or 'admins'
  const [customers, setCustomers] = useState([]);
  const [administrators, setAdministrators] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Admin Modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [submittingAdmin, setSubmittingAdmin] = useState(false);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
  const [adminErrorMsg, setAdminErrorMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [custRes, adminRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/administrators'),
      ]);
      setCustomers(custRes.data.users || []);
      setAdministrators(adminRes.data.administrators || []);
    } catch (err) {
      console.error('Failed to load user accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setSubmittingAdmin(true);
    setAdminErrorMsg('');
    setAdminSuccessMsg('');

    try {
      const res = await api.post('/admin/create-admin', {
        name: newAdminName,
        email: newAdminEmail,
        password: newAdminPassword,
        phone: newAdminPhone,
      });

      setAdminSuccessMsg(`Administrator "${res.data.administrator.name}" created successfully!`);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminPhone('');

      // Refresh administrators list
      const updatedAdminRes = await api.get('/admin/administrators');
      setAdministrators(updatedAdminRes.data.administrators || []);

      setTimeout(() => {
        setAdminSuccessMsg('');
        setShowAdminModal(false);
      }, 1500);
    } catch (err) {
      setAdminErrorMsg(err.message || 'Failed to create administrator account.');
    } finally {
      setSubmittingAdmin(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900">User Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Separated customer accounts and administrative team credentials
          </p>
        </div>

        {/* Create Another Admin Button */}
        {activeTab === 'admins' && (
          <button
            onClick={() => setShowAdminModal(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-full shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Admin</span>
          </button>
        )}
      </div>

      {/* Tabs Switcher: Customers vs Admin Team */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'customers'
              ? 'bg-dairy-600 text-white shadow-md shadow-emerald-700/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Accounts ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'admins'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Admin Team ({administrators.length})</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          <div className="w-8 h-8 border-3 border-dairy-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading records...</span>
        </div>
      ) : activeTab === 'customers' ? (
        /* CUSTOMERS TABLE (Admin details NEVER appear here) */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 bg-emerald-50/50 border-b border-emerald-100/60 flex items-center justify-between text-xs text-dairy-800 font-semibold">
            <span>Verified Customer Profiles (Excludes All Staff & Administrators)</span>
            <span className="font-bold">{customers.length} total customers</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Account Type</th>
                  <th className="px-6 py-4">Completed Orders</th>
                  <th className="px-6 py-4">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No customer accounts registered yet.
                    </td>
                  </tr>
                ) : (
                  customers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-dairy-800 font-bold flex items-center justify-center">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 space-y-0.5">
                        <p className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{u.email}</span>
                        </p>
                        {u.phone && (
                          <p className="flex items-center space-x-1 text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{u.phone}</span>
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-dairy-800">
                          CUSTOMER
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {u._count?.orders || 0} Orders
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ADMINISTRATORS TABLE */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authorized Administrator Team (Full Platform Privileges)</span>
            </span>
            <button
              onClick={() => setShowAdminModal(true)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-colors"
            >
              + Add Admin
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Administrator</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Access Level</th>
                  <th className="px-6 py-4">Created On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {administrators.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-emerald-400 font-bold flex items-center justify-center shadow-sm">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900">{admin.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">{admin.email}</td>
                    <td className="px-6 py-4 text-slate-600">{admin.phone || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                        SUPER ADMIN
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE NEW ADMIN MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-dairy-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4 text-dairy-600" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">Create Administrator</h3>
                  <p className="text-[11px] text-slate-400">Grant full dashboard and operations access</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {adminSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{adminSuccessMsg}</span>
              </div>
            )}

            {adminErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{adminErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-dairy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin2@dairyfresh.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-dairy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-dairy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newAdminPhone}
                  onChange={(e) => setNewAdminPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-dairy-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdmin}
                  className="px-5 py-2.5 bg-dairy-600 hover:bg-dairy-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {submittingAdmin ? 'Creating...' : 'Create Administrator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
