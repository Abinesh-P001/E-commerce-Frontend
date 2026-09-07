import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { User, MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // New address state
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560001');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      setAddresses(res.data.addresses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/addresses', {
        fullName,
        phone,
        addressLine,
        city,
        state,
        pincode,
        isDefault: addresses.length === 0,
      });
      setShowAddForm(false);
      fetchAddresses();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this delivery address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSetDefault = async (addr) => {
    try {
      await api.put(`/addresses/${addr.id}`, {
        isDefault: true,
      });
      fetchAddresses();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-serif text-3xl font-extrabold text-slate-900">My Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your personal information and morning doorstep delivery addresses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Personal Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 md:col-span-1 h-fit">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-dairy-800 font-extrabold text-2xl flex items-center justify-center mx-auto shadow-inner">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center">
            <h2 className="font-bold text-base text-slate-900">{user?.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            {user?.phone && <p className="text-xs text-slate-500 mt-1">📞 {user.phone}</p>}
            <span className="inline-block mt-2 px-3 py-1 bg-emerald-50 text-dairy-800 text-[10px] font-extrabold rounded-full">
              {user?.role} MEMBER
            </span>
          </div>
        </div>

        {/* Address Book */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-dairy-600" />
              <span>Saved Delivery Addresses</span>
            </h3>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-1.5 bg-dairy-600 hover:bg-dairy-700 text-white text-xs font-bold rounded-full transition-colors flex items-center space-x-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          {/* New address form */}
          {showAddForm && (
            <form onSubmit={handleAddAddress} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New Address</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Recipient Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Street / Apartment"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="col-span-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-1.5 text-xs text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-dairy-600 text-white text-xs font-bold rounded-xl shadow"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* Address Cards */}
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-2xl border border-slate-200 flex items-start justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-dairy-800 text-[10px] font-extrabold rounded-md">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500">{addr.addressLine}</p>
                  <p className="text-slate-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-slate-700 font-semibold">📞 {addr.phone}</p>
                </div>

                <div className="flex items-center space-x-2">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="text-[11px] font-bold text-dairy-700 hover:underline"
                    >
                      Make Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
