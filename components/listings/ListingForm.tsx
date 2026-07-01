'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowLeft,
  Package,
  MapPin,
  AlertCircle,
  CheckCircle,
  Warehouse,
  Tractor,
  Shield,
  Zap,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';


interface ListingFormProps {
  userRole: string;
  token: string;
  backUrl: string;
  successUrl: string;
  warehouses?: { _id: string; name: string; code: string; location: { state: string } }[];
}

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara', 'FCT',
];

const units = [
  { value: 'bag', label: 'Bag' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'ton', label: 'Ton' },
  { value: 'crate', label: 'Crate' },
  { value: 'basket', label: 'Basket' },
  { value: 'litre', label: 'Litre' },
];

const categoryEmojis: Record<string, string> = {
  grains: '🌾',
  legumes: '🫘',
  tubers: '🥔',
  vegetables: '🥬',
  fruits: '🍎',
  oil_seeds: '🌻',
  spices: '🌶️',
  cash_crops: '💰',
  other: '📦',
};

export default function ListingForm({ userRole, token, backUrl, successUrl, warehouses = [] }: ListingFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    commodityName: '',
    category: '',
    quantity: '',
    unit: 'bag',
    price: '',
    pricePerUnit: 'bag',
    negotiable: true,
    state: '',
    lga: '',
    community: '',
    harvestDate: '',
    moistureContent: '',
    farmingMethod: '',
    warehouseId: '',
    notes: '',
  });

  // Fetch categories from backend
//   useEffect(() => {
//     fetch('${API_URL}/commodity-types')
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           // Extract unique categories
//           const uniqueCategories = [...new Set(data.data.map((t: any) => t.category))].sort();
//           setCategories(uniqueCategories);
//         }
//       })
//       .catch(console.error);
//   }, []);


useEffect(() => {
  fetch('${API_URL}/commodity-types')
    .then(res => res.json())
    .then(data => {
      if (data.success && Array.isArray(data.data)) {
        const uniqueCategories = [...new Set(data.data.map((t: any) => String(t.category)))] as string[];
        setCategories(uniqueCategories.sort());
      }
    })
    .catch(console.error);
}, []);


  const formatCategory = (cat: string) => {
    return cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.commodityName.trim()) { setError('Please enter a commodity name'); return; }
    if (!formData.category) { setError('Please select a category'); return; }
    if (!formData.quantity || Number(formData.quantity) < 1) { setError('Please enter a valid quantity'); return; }
    if (!formData.price || Number(formData.price) < 1) { setError('Please enter a valid price'); return; }
    if (!formData.state) { setError('Please select a state'); return; }

    setSubmitting(true);

    try {
      const body: any = {
        commodityName: formData.commodityName.trim(),
        category: formData.category,
        quantity: { amount: Number(formData.quantity), unit: formData.unit },
        expectedPrice: { amount: Number(formData.price), perUnit: formData.pricePerUnit, negotiable: formData.negotiable },
        currentLocation: { state: formData.state, lga: formData.lga || undefined, community: formData.community || undefined },
        notes: formData.notes || undefined,
      };

      if (userRole === 'farmer') {
        body.farmDetails = {};
        if (formData.harvestDate) body.farmDetails.harvestDate = formData.harvestDate;
        if (formData.moistureContent) body.farmDetails.moistureContent = Number(formData.moistureContent);
        if (formData.farmingMethod) body.farmDetails.farmingMethod = formData.farmingMethod;
      }

      if (['admin', 'super_admin'].includes(userRole) && formData.warehouseId) {
        body.warehouseId = formData.warehouseId;
      }

      const res = await fetch('${API_URL}/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => router.push(successUrl), 1500);
      } else {
        setError(data.message || 'Failed to create listing');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isAutoApproved = ['admin', 'super_admin', 'warehouse_operator'].includes(userRole);

  const roleMeta: Record<string, { icon: any; label: string; color: string; bg: string }> = {
    farmer: { icon: Tractor, label: 'Farmer', color: 'text-amber-600', bg: 'bg-amber-50' },
    warehouse_operator: { icon: Warehouse, label: 'Warehouse', color: 'text-blue-600', bg: 'bg-blue-50' },
    admin: { icon: Shield, label: 'Admin', color: 'text-purple-600', bg: 'bg-purple-50' },
    super_admin: { icon: Shield, label: 'Super Admin', color: 'text-purple-600', bg: 'bg-purple-50' },
  };

  const meta = roleMeta[userRole] || { icon: User, label: userRole, color: 'text-gray-600', bg: 'bg-gray-50' };
  const RoleIcon = meta.icon;
  const isFormValid = formData.commodityName.trim() && formData.category && formData.quantity && formData.price && formData.state;

  return (
    <div>
      <Link href={backUrl} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-elba-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center`}>
            <RoleIcon className={`w-5 h-5 ${meta.color}`} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-elba-primary">Create New Listing</h1>
            <p className="text-sm text-gray-500">Listing as {meta.label}</p>
          </div>
        </div>

        {isAutoApproved ? (
          <div className="flex items-center gap-2 text-sm text-elba-secondary bg-elba-secondary/5 rounded-xl px-4 py-2.5">
            <Zap className="w-4 h-4 flex-shrink-0" />
            <span>Auto-approved — skips review, goes straight to warehouse verification.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Your listing will be reviewed by our team before going live.</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-emerald-600">
          <CheckCircle className="w-5 h-5 flex-shrink-0" /> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Commodity Name + Category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
          <h2 className="font-semibold text-elba-primary mb-1 flex items-center gap-2">
            <Package className="w-5 h-5 text-elba-secondary" />
            What are you listing?
          </h2>
          <p className="text-xs text-gray-500 mb-5">Enter the commodity name and select its category</p>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Commodity Name *</label>
              <input
                type="text"
                value={formData.commodityName}
                onChange={(e) => updateField('commodityName', e.target.value)}
                placeholder="e.g. Maize, Cocoyam, Sunflower..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
              {categories.length === 0 ? (
                <div className="text-sm text-gray-400 py-3">Loading categories...</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => updateField('category', cat)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all
                        ${formData.category === cat
                          ? 'border-elba-secondary bg-elba-secondary/5 text-elba-primary shadow-sm ring-1 ring-elba-secondary/20'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-lg">{categoryEmojis[cat] || '📦'}</span>
                      <span>{formatCategory(cat)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rest of the form stays the same */}
        {formData.commodityName.trim() && formData.category && (
          <>
            {/* Quantity */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <h2 className="font-semibold text-elba-primary mb-4">Quantity</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount *</label>
                  <input type="number" min="1" value={formData.quantity} onChange={(e) => updateField('quantity', e.target.value)}
                    placeholder="e.g. 200" required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Unit</label>
                  <select value={formData.unit} onChange={(e) => updateField('unit', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all appearance-none cursor-pointer">
                    {units.map(u => (<option key={u.value} value={u.value}>{u.label}</option>))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <h2 className="font-semibold text-elba-primary mb-4">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expected Price (₦) *</label>
                  <input type="number" min="1" value={formData.price} onChange={(e) => updateField('price', e.target.value)}
                    placeholder="e.g. 45000" required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Per Unit</label>
                  <select value={formData.pricePerUnit} onChange={(e) => updateField('pricePerUnit', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all appearance-none cursor-pointer">
                    {units.map(u => (<option key={u.value} value={u.value}>Per {u.label}</option>))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button type="button" onClick={() => updateField('negotiable', !formData.negotiable)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${formData.negotiable ? 'bg-elba-secondary' : 'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${formData.negotiable ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm text-gray-600">Price is negotiable</span>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <h2 className="font-semibold text-elba-primary mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-elba-secondary" /> Location</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">State *</label>
                  <select value={formData.state} onChange={(e) => updateField('state', e.target.value)} required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all appearance-none cursor-pointer">
                    <option value="">Select state</option>
                    {nigerianStates.map(s => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">LGA</label>
                  <input type="text" value={formData.lga} onChange={(e) => updateField('lga', e.target.value)}
                    placeholder="Local Government Area"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Community / Village</label>
                <input type="text" value={formData.community} onChange={(e) => updateField('community', e.target.value)}
                  placeholder="e.g. Gidan Dogo"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all" />
              </div>
            </div>

            {/* Farm Details */}
            {userRole === 'farmer' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                <h2 className="font-semibold text-elba-primary mb-4 flex items-center gap-2"><Tractor className="w-5 h-5 text-amber-500" /> Farm Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Harvest Date</label>
                    <input type="date" value={formData.harvestDate} onChange={(e) => updateField('harvestDate', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Moisture Content (%)</label>
                    <input type="number" min="0" max="100" step="0.1" value={formData.moistureContent} onChange={(e) => updateField('moistureContent', e.target.value)}
                      placeholder="e.g. 12.5"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Farming Method</label>
                  <div className="flex gap-2">
                    {['organic', 'conventional', 'mixed'].map(m => (
                      <button key={m} type="button" onClick={() => updateField('farmingMethod', m)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${formData.farmingMethod === m ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Warehouse (admin) */}
            {['admin', 'super_admin'].includes(userRole) && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                <h2 className="font-semibold text-elba-primary mb-4 flex items-center gap-2"><Warehouse className="w-5 h-5 text-purple-500" /> Warehouse Assignment</h2>
                {warehouses.length > 0 ? (
                  <select value={formData.warehouseId} onChange={(e) => updateField('warehouseId', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all appearance-none cursor-pointer">
                    <option value="">Select warehouse (optional)</option>
                    {warehouses.map(w => (<option key={w._id} value={w._id}>{w.name} — {w.location?.state}</option>))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-500">No warehouses available.</p>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <h2 className="font-semibold text-elba-primary mb-4">Additional Notes</h2>
              <textarea value={formData.notes} onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Any extra information (optional)..." rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all resize-none" />
            </div>

            {/* Submit */}
            <button type="submit" disabled={submitting || !isFormValid}
              className="btn-elba-primary w-full py-4 flex items-center justify-center gap-2 text-base font-semibold rounded-2xl shadow-lg shadow-elba-primary/10 hover:shadow-elba-primary/20 transition-all disabled:opacity-50">
              {submitting ? 'Creating Listing...' : (<>{isAutoApproved ? 'Create Listing' : 'Submit for Review'} <ArrowRight className="w-5 h-5" /></>)}
            </button>
          </>
        )}
      </form>
    </div>
  );
}