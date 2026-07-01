'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Plus,
  Warehouse,
  MapPin,
  Package,
  Shield,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { API_URL } from '@/lib/api';


interface Warehouse {
  _id: string;
  name: string;
  code: string;
  location: { state: string; lga: string; address: string };
  capacity: { total: number; used: number };
  status: string;
  manager?: { name: string; phone: string };
}

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara', 'FCT',
];

export default function AdminWarehousesPage() {
  const { token } = useAuth();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    state: '',
    lga: '',
    address: '',
    capacity: '',
    managerName: '',
    managerPhone: '',
  });

  useEffect(() => {
    if (token) fetchWarehouses();
  }, [token]);

  const fetchWarehouses = async () => {
    try {
      const res = await fetch('${API_URL}/warehouses?limit=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setWarehouses(data.data);
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const body = {
        name: formData.name,
        code: formData.code || formData.name.substring(0, 3).toUpperCase() + '-' + Date.now().toString().slice(-4),
        location: {
          state: formData.state,
          lga: formData.lga,
          address: formData.address,
        },
        capacity: {
          total: Number(formData.capacity) || 1000,
          used: 0,
        },
        manager: {
          name: formData.managerName || undefined,
          phone: formData.managerPhone || undefined,
        },
        status: 'active',
        services: ['storage', 'grading', 'bagging'],
        security: {
          hasSecurityPersonnel: true,
          hasFencing: true,
          hasInsurance: false,
        },
      };

      const res = await fetch('${API_URL}/warehouses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Warehouse created successfully');
        setShowCreate(false);
        setFormData({ name: '', code: '', state: '', lga: '', address: '', capacity: '', managerName: '', managerPhone: '' });
        fetchWarehouses();
      } else {
        setError(data.message);
      }
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-elba-primary">Warehouses</h1>
          <p className="text-sm text-gray-500 mt-1">{warehouses.length} warehouses</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Warehouse
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-emerald-600">
          <CheckCircle className="w-5 h-5 flex-shrink-0" /> {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : warehouses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
          <Warehouse className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No warehouses yet</p>
          <p className="text-sm text-gray-400 mt-1">Create your first warehouse to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {warehouses.map((wh) => (
            <div key={wh._id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Warehouse className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-elba-primary">{wh.name}</h3>
                    <p className="text-xs text-gray-500">{wh.code}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  wh.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {wh.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{wh.location?.state}{wh.location?.lga ? `, ${wh.location.lga}` : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Package className="w-4 h-4" />
                  <span>{wh.capacity?.used || 0} / {wh.capacity?.total || 0} tons used</span>
                </div>
                {wh.manager?.name && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>{wh.manager.name}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Warehouse Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-elba-primary">Add Warehouse</h3>
              <button onClick={() => setShowCreate(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Elba Warehouse A" required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Code</label>
                  <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">State *</label>
                  <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20">
                    <option value="">Select state</option>
                    {nigerianStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">LGA</label>
                  <input type="text" value={formData.lga} onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                    placeholder="Local Government Area"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Address</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Capacity (metric tons)</label>
                <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="e.g. 5000"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Manager Name</label>
                  <input type="text" value={formData.managerName} onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    placeholder="Optional"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Manager Phone</label>
                  <input type="text" value={formData.managerPhone} onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                    placeholder="Optional"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20" />
                </div>
              </div>

              <button type="submit" disabled={submitting || !formData.name || !formData.state}
                className="btn-elba-primary w-full py-3 text-sm font-semibold rounded-xl disabled:opacity-50">
                {submitting ? 'Creating...' : 'Create Warehouse'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}