// client/app/admin/listings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Package,
  Eye,
  Trash2,
  X,
} from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Listing {
  _id: string;
  commodityType: { _id: string; name: string; emoji: string; slug: string; category: string };
  quantity: { amount: number; unit: string };
  expectedPrice: { amount: number; perUnit: string };
  currentLocation: { state: string; lga: string };
  createdBy: { _id: string; firstName: string; lastName: string; email: string; role: string };
  sourceType: string;
  status: string;
  assignedWarehouse?: { _id: string; name: string; code: string };
  submittedAt: string;
  reviewedAt?: string;
}

const statusFilters = [
  { value: '', label: 'All', icon: Package },
  { value: 'pending_review', label: 'Pending Review', icon: Clock },
  { value: 'auto_approved', label: 'Auto Approved', icon: Zap },
  { value: 'approved', label: 'Approved', icon: CheckCircle },
  { value: 'assigned_to_warehouse', label: 'At Warehouse', icon: Package },
  { value: 'received_at_warehouse', label: 'Received', icon: Package },
  { value: 'qa_completed', label: 'QA Done', icon: CheckCircle },
  { value: 'ready_for_market', label: 'Ready', icon: CheckCircle },
  { value: 'live', label: 'Live', icon: CheckCircle },
  { value: 'rejected', label: 'Rejected', icon: XCircle },
  { value: 'sold', label: 'Sold', icon: CheckCircle },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle },
];

const sourceFilters = [
  { value: '', label: 'All Sources' },
  { value: 'farmer', label: 'Farmers' },
  { value: 'warehouse', label: 'Warehouses' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
];

export default function AdminListingsPage() {
  const { token, user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (token) fetchListings();
  }, [token, page, statusFilter, sourceFilter]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '20');
      if (statusFilter) params.append('status', statusFilter);
      if (sourceFilter) params.append('sourceType', sourceFilter);

      const res = await fetch(`${API_URL}/listings/admin/all?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setListings(data.data);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/listings/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess('Listing deleted successfully');
        setDeleteTarget(null);
        fetchListings();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to delete listing');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
      auto_approved: 'bg-purple-50 text-purple-700 border-purple-200',
      approved: 'bg-blue-50 text-blue-700 border-blue-200',
      assigned_to_warehouse: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      received_at_warehouse: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      qa_completed: 'bg-teal-50 text-teal-700 border-teal-200',
      ready_for_market: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      live: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
      sold: 'bg-gray-100 text-gray-600 border-gray-300',
      cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
      expired: 'bg-gray-50 text-gray-500 border-gray-200',
    };
    return badges[status] || 'bg-gray-50 text-gray-500 border-gray-200';
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-elba-primary">All Listings</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total listings</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2 self-start"
        >
          + New Listing
        </Link>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
          <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}
      {success && (
        <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-emerald-600">
          <CheckCircle className="w-5 h-5 flex-shrink-0" /> {success}
          <button onClick={() => setSuccess('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-2 pb-1">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => { setStatusFilter(f.value); setPage(1); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all flex-shrink-0
                    ${statusFilter === f.value
                      ? 'bg-elba-primary text-white border-elba-primary'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <f.icon className="w-3 h-3" />
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <select
            value={sourceFilter}
            onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 flex-shrink-0"
          >
            {sourceFilters.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No listings found</p>
            <p className="text-sm text-gray-400 mt-1">Try changing your filters</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Commodity</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted By</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {listings.map((listing) => (
                    <tr key={listing._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-elba-surface flex items-center justify-center text-lg flex-shrink-0">
                            {listing.commodityType?.emoji || '📦'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-elba-primary">{listing.commodityType?.name || 'Unknown'}</p>
                            <p className="text-[10px] text-gray-500">{listing.commodityType?.category?.replace('_', ' ') || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {listing.quantity?.amount?.toLocaleString()} {listing.quantity?.unit}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        ₦{listing.expectedPrice?.amount?.toLocaleString()}/{listing.expectedPrice?.perUnit}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                          {listing.sourceType?.replace('_', ' ') || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {listing.createdBy?.firstName} {listing.createdBy?.lastName}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(listing.status)}`}>
                          {getStatusLabel(listing.status)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">
                        {new Date(listing.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            href={`/admin/listings/${listing._id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-elba-secondary hover:text-elba-secondary-light transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </Link>
                          {/* Admin can delete ANY listing */}
                          <button
                            onClick={() => setDeleteTarget(listing)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete listing"
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

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-50">
              {listings.map((listing) => (
                <div key={listing._id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-elba-surface flex items-center justify-center text-lg flex-shrink-0">
                      {listing.commodityType?.emoji || '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-elba-primary">{listing.commodityType?.name}</p>
                      <p className="text-xs text-gray-500">
                        {listing.quantity?.amount?.toLocaleString()} {listing.quantity?.unit} · ₦{listing.expectedPrice?.amount?.toLocaleString()}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(listing.status)}`}>
                      {getStatusLabel(listing.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{listing.createdBy?.firstName} {listing.createdBy?.lastName} · {new Date(listing.submittedAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/listings/${listing._id}`}
                        className="text-elba-secondary font-medium flex items-center gap-1"
                      >
                        View <ArrowRight className="w-3 h-3" />
                      </Link>
                      {/* Admin can delete ANY listing */}
                      <button
                        onClick={() => setDeleteTarget(listing)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 text-sm">
          <p className="text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => !deleting && setDeleteTarget(null)} 
          />
          <div className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-elba-primary">Delete Listing</h3>
              <button 
                onClick={() => !deleting && setDeleteTarget(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex items-start gap-3 mb-6 bg-red-50 rounded-xl p-4">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700">Are you sure you want to delete this listing?</p>
                <p className="text-xs text-red-600 mt-1">This action cannot be undone.</p>
              </div>
            </div>

            {/* Listing Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl">
                  {deleteTarget.commodityType?.emoji || '📦'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-elba-primary">
                    {deleteTarget.commodityType?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {deleteTarget.quantity?.amount?.toLocaleString()} {deleteTarget.quantity?.unit} · ₦{deleteTarget.expectedPrice?.amount?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Listing
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}






























































// // client/app/admin/listings/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import Link from 'next/link';
// import {
//   Search,
//   Filter,
//   ArrowRight,
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Zap,
//   Package,
//   Eye,
//   Trash2,
//   X,
// } from 'lucide-react';
// import { API_URL } from '@/lib/api';

// interface Listing {
//   _id: string;
//   commodityType: { _id: string; name: string; emoji: string; slug: string; category: string };
//   quantity: { amount: number; unit: string };
//   expectedPrice: { amount: number; perUnit: string };
//   currentLocation: { state: string; lga: string };
//   createdBy: { _id: string; firstName: string; lastName: string; email: string; role: string };
//   sourceType: string;
//   status: string;
//   assignedWarehouse?: { _id: string; name: string; code: string };
//   submittedAt: string;
//   reviewedAt?: string;
// }

// const statusFilters = [
//   { value: '', label: 'All', icon: Package },
//   { value: 'pending_review', label: 'Pending Review', icon: Clock },
//   { value: 'auto_approved', label: 'Auto Approved', icon: Zap },
//   { value: 'approved', label: 'Approved', icon: CheckCircle },
//   { value: 'assigned_to_warehouse', label: 'At Warehouse', icon: Package },
//   { value: 'received_at_warehouse', label: 'Received', icon: Package },
//   { value: 'qa_completed', label: 'QA Done', icon: CheckCircle },
//   { value: 'ready_for_market', label: 'Ready', icon: CheckCircle },
//   { value: 'live', label: 'Live', icon: CheckCircle },
//   { value: 'rejected', label: 'Rejected', icon: XCircle },
//   { value: 'sold', label: 'Sold', icon: CheckCircle },
//   { value: 'cancelled', label: 'Cancelled', icon: XCircle },
// ];

// const sourceFilters = [
//   { value: '', label: 'All Sources' },
//   { value: 'farmer', label: 'Farmers' },
//   { value: 'warehouse', label: 'Warehouses' },
//   { value: 'admin', label: 'Admin' },
//   { value: 'super_admin', label: 'Super Admin' },
// ];

// const deletableStatuses = ['pending_review', 'auto_approved', 'rejected', 'cancelled', 'expired'];

// export default function AdminListingsPage() {
//   const { token } = useAuth();
//   const [listings, setListings] = useState<Listing[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState('');
//   const [sourceFilter, setSourceFilter] = useState('');
//   const [deleting, setDeleting] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     if (token) fetchListings();
//   }, [token, page, statusFilter, sourceFilter]);

//   const fetchListings = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       params.append('page', String(page));
//       params.append('limit', '20');
//       if (statusFilter) params.append('status', statusFilter);
//       if (sourceFilter) params.append('sourceType', sourceFilter);

//       const res = await fetch(`${API_URL}/listings/admin/all?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) {
//         setListings(data.data);
//         setTotal(data.total);
//       }
//     } catch (error) {
//       console.error('Error fetching listings:', error);
//       setError('Failed to fetch listings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteTarget) return;

//     setDeleting(true);
//     setError('');
//     setSuccess('');

//     try {
//       const res = await fetch(`${API_URL}/listings/${deleteTarget._id}`, {
//         method: 'DELETE',
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = await res.json();
      
//       if (data.success) {
//         setSuccess('Listing deleted successfully');
//         setDeleteTarget(null);
//         fetchListings();
//         // Clear success message after 3 seconds
//         setTimeout(() => setSuccess(''), 3000);
//       } else {
//         setError(data.message || 'Failed to delete listing');
//       }
//     } catch (err) {
//       console.error('Delete error:', err);
//       setError('Network error. Please try again.');
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const badges: Record<string, string> = {
//       pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
//       auto_approved: 'bg-purple-50 text-purple-700 border-purple-200',
//       approved: 'bg-blue-50 text-blue-700 border-blue-200',
//       assigned_to_warehouse: 'bg-indigo-50 text-indigo-700 border-indigo-200',
//       received_at_warehouse: 'bg-cyan-50 text-cyan-700 border-cyan-200',
//       qa_completed: 'bg-teal-50 text-teal-700 border-teal-200',
//       ready_for_market: 'bg-emerald-50 text-emerald-700 border-emerald-200',
//       live: 'bg-green-50 text-green-700 border-green-200',
//       rejected: 'bg-red-50 text-red-700 border-red-200',
//       sold: 'bg-gray-100 text-gray-600 border-gray-300',
//       cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
//       expired: 'bg-gray-50 text-gray-500 border-gray-200',
//     };
//     return badges[status] || 'bg-gray-50 text-gray-500 border-gray-200';
//   };

//   const getStatusLabel = (status: string) => {
//     return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
//   };

//   const totalPages = Math.ceil(total / 20);

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-elba-primary">All Listings</h1>
//           <p className="text-sm text-gray-500 mt-1">{total} total listings</p>
//         </div>
//         <Link
//           href="/admin/listings/new"
//           className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2 self-start"
//         >
//           + New Listing
//         </Link>
//       </div>

//       {/* Messages */}
//       {error && (
//         <div className="mb-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-red-600">
//           <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
//           <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
//         </div>
//       )}
//       {success && (
//         <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-emerald-600">
//           <CheckCircle className="w-5 h-5 flex-shrink-0" /> {success}
//           <button onClick={() => setSuccess('')} className="ml-auto"><X className="w-4 h-4" /></button>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="flex-1 overflow-x-auto">
//             <div className="flex gap-2 pb-1">
//               {statusFilters.map((f) => (
//                 <button
//                   key={f.value}
//                   onClick={() => { setStatusFilter(f.value); setPage(1); }}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all flex-shrink-0
//                     ${statusFilter === f.value
//                       ? 'bg-elba-primary text-white border-elba-primary'
//                       : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
//                     }`}
//                 >
//                   <f.icon className="w-3 h-3" />
//                   {f.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <select
//             value={sourceFilter}
//             onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
//             className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 flex-shrink-0"
//           >
//             {sourceFilters.map(f => (
//               <option key={f.value} value={f.value}>{f.label}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="p-8 text-center text-gray-400">Loading...</div>
//         ) : listings.length === 0 ? (
//           <div className="p-12 text-center">
//             <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
//             <p className="text-gray-500 font-medium">No listings found</p>
//             <p className="text-sm text-gray-400 mt-1">Try changing your filters</p>
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table */}
//             <div className="hidden lg:block overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-100 bg-gray-50/50">
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Commodity</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Source</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted By</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
//                     <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {listings.map((listing) => (
//                     <tr key={listing._id} className="hover:bg-gray-50/50 transition-colors">
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 rounded-lg bg-elba-surface flex items-center justify-center text-lg flex-shrink-0">
//                             {listing.commodityType?.emoji || '📦'}
//                           </div>
//                           <div>
//                             <p className="text-sm font-semibold text-elba-primary">{listing.commodityType?.name || 'Unknown'}</p>
//                             <p className="text-[10px] text-gray-500">{listing.commodityType?.category?.replace('_', ' ') || '—'}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-5 py-4 text-sm text-gray-700">
//                         {listing.quantity?.amount?.toLocaleString()} {listing.quantity?.unit}
//                       </td>
//                       <td className="px-5 py-4 text-sm text-gray-700">
//                         ₦{listing.expectedPrice?.amount?.toLocaleString()}/{listing.expectedPrice?.perUnit}
//                       </td>
//                       <td className="px-5 py-4">
//                         <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
//                           {listing.sourceType?.replace('_', ' ') || '—'}
//                         </span>
//                       </td>
//                       <td className="px-5 py-4 text-sm text-gray-700">
//                         {listing.createdBy?.firstName} {listing.createdBy?.lastName}
//                       </td>
//                       <td className="px-5 py-4">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(listing.status)}`}>
//                           {getStatusLabel(listing.status)}
//                         </span>
//                       </td>
//                       <td className="px-5 py-4 text-xs text-gray-500">
//                         {new Date(listing.submittedAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-5 py-4 text-right">
//                         <div className="flex items-center gap-2 justify-end">
//                           <Link
//                             href={`/admin/listings/${listing._id}`}
//                             className="inline-flex items-center gap-1 text-xs font-medium text-elba-secondary hover:text-elba-secondary-light transition-colors"
//                           >
//                             <Eye className="w-3.5 h-3.5" />
//                             View
//                           </Link>
//                           {deletableStatuses.includes(listing.status) && (
//                             <button
//                               onClick={() => setDeleteTarget(listing)}
//                               className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                               title="Delete listing"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile Cards */}
//             <div className="lg:hidden divide-y divide-gray-50">
//               {listings.map((listing) => (
//                 <div key={listing._id} className="p-4">
//                   <div className="flex items-start gap-3 mb-3">
//                     <div className="w-10 h-10 rounded-lg bg-elba-surface flex items-center justify-center text-lg flex-shrink-0">
//                       {listing.commodityType?.emoji || '📦'}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-elba-primary">{listing.commodityType?.name}</p>
//                       <p className="text-xs text-gray-500">
//                         {listing.quantity?.amount?.toLocaleString()} {listing.quantity?.unit} · ₦{listing.expectedPrice?.amount?.toLocaleString()}
//                       </p>
//                     </div>
//                     <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(listing.status)}`}>
//                       {getStatusLabel(listing.status)}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between text-xs text-gray-500">
//                     <span>{listing.createdBy?.firstName} {listing.createdBy?.lastName} · {new Date(listing.submittedAt).toLocaleDateString()}</span>
//                     <div className="flex items-center gap-2">
//                       <Link
//                         href={`/admin/listings/${listing._id}`}
//                         className="text-elba-secondary font-medium flex items-center gap-1"
//                       >
//                         View <ArrowRight className="w-3 h-3" />
//                       </Link>
//                       {deletableStatuses.includes(listing.status) && (
//                         <button
//                           onClick={() => setDeleteTarget(listing)}
//                           className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                         >
//                           <Trash2 className="w-3.5 h-3.5" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between mt-6 text-sm">
//           <p className="text-gray-500">
//             Page {page} of {totalPages}
//           </p>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setPage(p => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => setPage(p => p + 1)}
//               disabled={page >= totalPages}
//               className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteTarget && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div 
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
//             onClick={() => !deleting && setDeleteTarget(null)} 
//           />
//           <div className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-bold text-lg text-elba-primary">Delete Listing</h3>
//               <button 
//                 onClick={() => !deleting && setDeleteTarget(null)}
//                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-400" />
//               </button>
//             </div>

//             <div className="flex items-start gap-3 mb-6 bg-red-50 rounded-xl p-4">
//               <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//               <div>
//                 <p className="text-sm font-medium text-red-700">Are you sure you want to delete this listing?</p>
//                 <p className="text-xs text-red-600 mt-1">This action cannot be undone.</p>
//               </div>
//             </div>

//             {/* Listing Summary */}
//             <div className="bg-gray-50 rounded-xl p-4 mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl">
//                   {deleteTarget.commodityType?.emoji || '📦'}
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-elba-primary">
//                     {deleteTarget.commodityType?.name || 'Unknown'}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {deleteTarget.quantity?.amount?.toLocaleString()} {deleteTarget.quantity?.unit} · ₦{deleteTarget.expectedPrice?.amount?.toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setDeleteTarget(null)}
//                 disabled={deleting}
//                 className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 disabled={deleting}
//                 className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {deleting ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     Deleting...
//                   </>
//                 ) : (
//                   <>
//                     <Trash2 className="w-4 h-4" />
//                     Delete Listing
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }























































// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import Link from 'next/link';
// import {
//   Search,
//   Filter,
//   ArrowRight,
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Zap,
//   Package,
//   Eye,
//   Trash2,
// } from 'lucide-react';
// import { API_URL } from '@/lib/api';

// interface Listing {
//   _id: string;
//   commodityType: { _id: string; name: string; emoji: string; slug: string; category: string };
//   quantity: { amount: number; unit: string };
//   expectedPrice: { amount: number; perUnit: string };
//   currentLocation: { state: string; lga: string };
//   createdBy: { _id: string; firstName: string; lastName: string; email: string; role: string };
//   sourceType: string;
//   status: string;
//   assignedWarehouse?: { _id: string; name: string; code: string };
//   submittedAt: string;
//   reviewedAt?: string;
// }

// const statusFilters = [
//   { value: '', label: 'All', icon: Package },
//   { value: 'pending_review', label: 'Pending Review', icon: Clock },
//   { value: 'auto_approved', label: 'Auto Approved', icon: Zap },
//   { value: 'approved', label: 'Approved', icon: CheckCircle },
//   { value: 'assigned_to_warehouse', label: 'At Warehouse', icon: Package },
//   { value: 'received_at_warehouse', label: 'Received', icon: Package },
//   { value: 'qa_completed', label: 'QA Done', icon: CheckCircle },
//   { value: 'ready_for_market', label: 'Ready', icon: CheckCircle },
//   { value: 'live', label: 'Live', icon: CheckCircle },
//   { value: 'rejected', label: 'Rejected', icon: XCircle },
//   { value: 'sold', label: 'Sold', icon: CheckCircle },
//   { value: 'cancelled', label: 'Cancelled', icon: XCircle },
// ];

// const sourceFilters = [
//   { value: '', label: 'All Sources' },
//   { value: 'farmer', label: 'Farmers' },
//   { value: 'warehouse', label: 'Warehouses' },
//   { value: 'admin', label: 'Admin' },
//   { value: 'super_admin', label: 'Super Admin' },
// ];

// const deletableStatuses = ['pending_review', 'auto_approved', 'rejected', 'cancelled', 'expired'];

// export default function AdminListingsPage() {
//   const { token } = useAuth();
//   const [listings, setListings] = useState<Listing[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState('');
//   const [sourceFilter, setSourceFilter] = useState('');
//   const [deleting, setDeleting] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

//   useEffect(() => {
//     if (token) fetchListings();
//   }, [token, page, statusFilter, sourceFilter]);

//   const fetchListings = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       params.append('page', String(page));
//       params.append('limit', '20');
//       if (statusFilter) params.append('status', statusFilter);
//       if (sourceFilter) params.append('sourceType', sourceFilter);

//       const res = await fetch(`${API_URL}/listings/admin/all?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) {
//         setListings(data.data);
//         setTotal(data.total);
//       }
//     } catch (error) {
//       console.error('Error fetching listings:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (listingId: string) => {
//     if (!confirm('Are you sure you want to delete this listing? This cannot be undone.')) return;

//     setDeleting(true);
//     setDeleteTarget(listingId);
//     try {
//       const res = await fetch(`${API_URL}/listings/${listingId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) {
//         fetchListings();
//       } else {
//         alert(data.message);
//       }
//     } catch {
//       alert('Failed to delete. Please try again.');
//     } finally {
//       setDeleting(false);
//       setDeleteTarget(null);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const badges: Record<string, string> = {
//       pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
//       auto_approved: 'bg-purple-50 text-purple-700 border-purple-200',
//       approved: 'bg-blue-50 text-blue-700 border-blue-200',
//       assigned_to_warehouse: 'bg-indigo-50 text-indigo-700 border-indigo-200',
//       received_at_warehouse: 'bg-cyan-50 text-cyan-700 border-cyan-200',
//       qa_completed: 'bg-teal-50 text-teal-700 border-teal-200',
//       ready_for_market: 'bg-emerald-50 text-emerald-700 border-emerald-200',
//       live: 'bg-green-50 text-green-700 border-green-200',
//       rejected: 'bg-red-50 text-red-700 border-red-200',
//       sold: 'bg-gray-100 text-gray-600 border-gray-300',
//       cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
//       expired: 'bg-gray-50 text-gray-500 border-gray-200',
//     };
//     return badges[status] || 'bg-gray-50 text-gray-500 border-gray-200';
//   };

//   const getStatusLabel = (status: string) => {
//     return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
//   };

//   const totalPages = Math.ceil(total / 20);

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-elba-primary">All Listings</h1>
//           <p className="text-sm text-gray-500 mt-1">{total} total listings</p>
//         </div>
//         <Link
//           href="/admin/listings/new"
//           className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2 self-start"
//         >
//           + New Listing
//         </Link>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="flex-1 overflow-x-auto">
//             <div className="flex gap-2 pb-1">
//               {statusFilters.map((f) => (
//                 <button
//                   key={f.value}
//                   onClick={() => { setStatusFilter(f.value); setPage(1); }}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all flex-shrink-0
//                     ${statusFilter === f.value
//                       ? 'bg-elba-primary text-white border-elba-primary'
//                       : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
//                     }`}
//                 >
//                   <f.icon className="w-3 h-3" />
//                   {f.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <select
//             value={sourceFilter}
//             onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
//             className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 flex-shrink-0"
//           >
//             {sourceFilters.map(f => (
//               <option key={f.value} value={f.value}>{f.label}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="p-8 text-center text-gray-400">Loading...</div>
//         ) : listings.length === 0 ? (
//           <div className="p-12 text-center">
//             <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
//             <p className="text-gray-500 font-medium">No listings found</p>
//             <p className="text-sm text-gray-400 mt-1">Try changing your filters</p>
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table */}
//             <div className="hidden lg:block overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-100 bg-gray-50/50">
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Commodity</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Source</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted By</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
//                     <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {listings.map((listing) => (
//                     <tr key={listing._id} className="hover:bg-gray-50/50 transition-colors">
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 rounded-lg bg-elba-surface flex items-center justify-center text-lg flex-shrink-0">
//                             {listing.commodityType?.emoji || '📦'}
//                           </div>
//                           <div>
//                             <p className="text-sm font-semibold text-elba-primary">{listing.commodityType?.name || 'Unknown'}</p>
//                             <p className="text-[10px] text-gray-500">{listing.commodityType?.category?.replace('_', ' ') || '—'}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-5 py-4 text-sm text-gray-700">
//                         {listing.quantity?.amount?.toLocaleString()} {listing.quantity?.unit}
//                       </td>
//                       <td className="px-5 py-4 text-sm text-gray-700">
//                         ₦{listing.expectedPrice?.amount?.toLocaleString()}/{listing.expectedPrice?.perUnit}
//                       </td>
//                       <td className="px-5 py-4">
//                         <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
//                           {listing.sourceType?.replace('_', ' ') || '—'}
//                         </span>
//                       </td>
//                       <td className="px-5 py-4 text-sm text-gray-700">
//                         {listing.createdBy?.firstName} {listing.createdBy?.lastName}
//                       </td>
//                       <td className="px-5 py-4">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(listing.status)}`}>
//                           {getStatusLabel(listing.status)}
//                         </span>
//                       </td>
//                       <td className="px-5 py-4 text-xs text-gray-500">
//                         {new Date(listing.submittedAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-5 py-4 text-right">
//                         <div className="flex items-center gap-2 justify-end">
//                           <Link
//                             href={`/admin/listings/${listing._id}`}
//                             className="inline-flex items-center gap-1 text-xs font-medium text-elba-secondary hover:text-elba-secondary-light transition-colors"
//                           >
//                             <Eye className="w-3.5 h-3.5" />
//                             View
//                           </Link>
//                           {deletableStatuses.includes(listing.status) && (
//                             <button
//                               onClick={() => handleDelete(listing._id)}
//                               disabled={deleting && deleteTarget === listing._id}
//                               className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
//                               title="Delete listing"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile Cards */}
//             <div className="lg:hidden divide-y divide-gray-50">
//               {listings.map((listing) => (
//                 <div key={listing._id} className="p-4">
//                   <div className="flex items-start gap-3 mb-3">
//                     <div className="w-10 h-10 rounded-lg bg-elba-surface flex items-center justify-center text-lg flex-shrink-0">
//                       {listing.commodityType?.emoji || '📦'}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-elba-primary">{listing.commodityType?.name}</p>
//                       <p className="text-xs text-gray-500">
//                         {listing.quantity?.amount?.toLocaleString()} {listing.quantity?.unit} · ₦{listing.expectedPrice?.amount?.toLocaleString()}
//                       </p>
//                     </div>
//                     <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(listing.status)}`}>
//                       {getStatusLabel(listing.status)}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between text-xs text-gray-500">
//                     <span>{listing.createdBy?.firstName} {listing.createdBy?.lastName} · {new Date(listing.submittedAt).toLocaleDateString()}</span>
//                     <div className="flex items-center gap-2">
//                       <Link
//                         href={`/admin/listings/${listing._id}`}
//                         className="text-elba-secondary font-medium flex items-center gap-1"
//                       >
//                         View <ArrowRight className="w-3 h-3" />
//                       </Link>
//                       {deletableStatuses.includes(listing.status) && (
//                         <button
//                           onClick={() => handleDelete(listing._id)}
//                           disabled={deleting && deleteTarget === listing._id}
//                           className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
//                         >
//                           <Trash2 className="w-3.5 h-3.5" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between mt-6 text-sm">
//           <p className="text-gray-500">
//             Page {page} of {totalPages}
//           </p>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setPage(p => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => setPage(p => p + 1)}
//               disabled={page >= totalPages}
//               className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



















































































// // client/app/admin/listings/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import Link from 'next/link';
// import {
//   Search,
//   Filter,
//   ArrowRight,
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Zap,
//   Package,
//   Eye,
// } from 'lucide-react';
// import { API_URL } from '@/lib/api';


// interface Listing {
//   _id: string;
//   commodityType: { _id: string; name: string; emoji: string; slug: string; category: string };
//   quantity: { amount: number; unit: string };
//   expectedPrice: { amount: number; perUnit: string };
//   currentLocation: { state: string; lga: string };
//   createdBy: { _id: string; firstName: string; lastName: string; email: string; role: string };
//   sourceType: string;
//   status: string;
//   assignedWarehouse?: { _id: string; name: string; code: string };
//   submittedAt: string;
//   reviewedAt?: string;
// }

// const statusFilters = [
//   { value: '', label: 'All', icon: Package },
//   { value: 'pending_review', label: 'Pending Review', icon: Clock },
//   { value: 'auto_approved', label: 'Auto Approved', icon: Zap },
//   { value: 'approved', label: 'Approved', icon: CheckCircle },
//   { value: 'assigned_to_warehouse', label: 'At Warehouse', icon: Package },
//   { value: 'received_at_warehouse', label: 'Received', icon: Package },
//   { value: 'qa_completed', label: 'QA Done', icon: CheckCircle },
//   { value: 'ready_for_market', label: 'Ready', icon: CheckCircle },
//   { value: 'live', label: 'Live', icon: CheckCircle },
//   { value: 'rejected', label: 'Rejected', icon: XCircle },
//   { value: 'sold', label: 'Sold', icon: CheckCircle },
// ];

// const sourceFilters = [
//   { value: '', label: 'All Sources' },
//   { value: 'farmer', label: 'Farmers' },
//   { value: 'warehouse', label: 'Warehouses' },
//   { value: 'admin', label: 'Admin' },
//   { value: 'super_admin', label: 'Super Admin' },
// ];

// export default function AdminListingsPage() {
//   const { token } = useAuth();
//   const [listings, setListings] = useState<Listing[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState('');
//   const [sourceFilter, setSourceFilter] = useState('');
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     if (token) fetchListings();
//   }, [token, page, statusFilter, sourceFilter]);

//   const fetchListings = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       params.append('page', String(page));
//       params.append('limit', '20');
//       if (statusFilter) params.append('status', statusFilter);
//       if (sourceFilter) params.append('sourceType', sourceFilter);

//       const res = await fetch(`${API_URL}/listings/admin/all?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) {
//         setListings(data.data);
//         setTotal(data.total);
//       }
//     } catch (error) {
//       console.error('Error fetching listings:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const badges: Record<string, string> = {
//       pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
//       auto_approved: 'bg-purple-50 text-purple-700 border-purple-200',
//       approved: 'bg-blue-50 text-blue-700 border-blue-200',
//       assigned_to_warehouse: 'bg-indigo-50 text-indigo-700 border-indigo-200',
//       received_at_warehouse: 'bg-cyan-50 text-cyan-700 border-cyan-200',
//       qa_completed: 'bg-teal-50 text-teal-700 border-teal-200',
//       ready_for_market: 'bg-emerald-50 text-emerald-700 border-emerald-200',
//       live: 'bg-green-50 text-green-700 border-green-200',
//       rejected: 'bg-red-50 text-red-700 border-red-200',
//       sold: 'bg-gray-100 text-gray-600 border-gray-300',
//       cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
//       expired: 'bg-gray-50 text-gray-500 border-gray-200',
//     };
//     return badges[status] || 'bg-gray-50 text-gray-500 border-gray-200';
//   };

//   const getStatusLabel = (status: string) => {
//     return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
//   };

//   const totalPages = Math.ceil(total / 20);

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-elba-primary">All Listings</h1>
//           <p className="text-sm text-gray-500 mt-1">{total} total listings</p>
//         </div>
//         <Link
//           href="/admin/listings/new"
//           className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2 self-start"
//         >
//           + New Listing
//         </Link>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
//         <div className="flex flex-col sm:flex-row gap-3">
//           {/* Status filter chips */}
//           <div className="flex-1 overflow-x-auto">
//             <div className="flex gap-2 pb-1">
//               {statusFilters.map((f) => (
//                 <button
//                   key={f.value}
//                   onClick={() => { setStatusFilter(f.value); setPage(1); }}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all flex-shrink-0
//                     ${statusFilter === f.value
//                       ? 'bg-elba-primary text-white border-elba-primary'
//                       : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
//                     }`}
//                 >
//                   <f.icon className="w-3 h-3" />
//                   {f.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Source filter */}
//           <select
//             value={sourceFilter}
//             onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
//             className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 flex-shrink-0"
//           >
//             {sourceFilters.map(f => (
//               <option key={f.value} value={f.value}>{f.label}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="p-8 text-center text-gray-400">Loading...</div>
//         ) : listings.length === 0 ? (
//           <div className="p-12 text-center">
//             <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
//             <p className="text-gray-500 font-medium">No listings found</p>
//             <p className="text-sm text-gray-400 mt-1">Try changing your filters</p>
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table */}
//             <div className="hidden lg:block overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-100 bg-gray-50/50">
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Commodity</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Source</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted By</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
//                     <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {listings.map((listing) => (
//                     <tr key={listing._id} className="hover:bg-gray-50/50 transition-colors">
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 rounded-lg bg-elba-surface flex items-center justify-center text-lg flex-shrink-0">
//                             {listing.commodityType?.emoji || '📦'}
//                           </div>
//                           <div>
//                             <p className="text-sm font-semibold text-elba-primary">{listing.commodityType?.name || 'Unknown'}</p>
//                             <p className="text-[10px] text-gray-500">{listing.commodityType?.category?.replace('_', ' ') || '—'}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-5 py-4 text-sm text-gray-700">
//                         {listing.quantity?.amount?.toLocaleString()} {listing.quantity?.unit}
//                       </td>
//                       <td className="px-5 py-4 text-sm text-gray-700">
//                         ₦{listing.expectedPrice?.amount?.toLocaleString()}/{listing.expectedPrice?.perUnit}
//                       </td>
//                       <td className="px-5 py-4">
//                         <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
//                           {listing.sourceType?.replace('_', ' ') || '—'}
//                         </span>
//                       </td>
//                       <td className="px-5 py-4 text-sm text-gray-700">
//                         {listing.createdBy?.firstName} {listing.createdBy?.lastName}
//                       </td>
//                       <td className="px-5 py-4">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(listing.status)}`}>
//                           {getStatusLabel(listing.status)}
//                         </span>
//                       </td>
//                       <td className="px-5 py-4 text-xs text-gray-500">
//                         {new Date(listing.submittedAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-5 py-4 text-right">
//                         <Link
//                           href={`/admin/listings/${listing._id}`}
//                           className="inline-flex items-center gap-1 text-xs font-medium text-elba-secondary hover:text-elba-secondary-light transition-colors"
//                         >
//                           <Eye className="w-3.5 h-3.5" />
//                           View
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile Cards */}
//             <div className="lg:hidden divide-y divide-gray-50">
//               {listings.map((listing) => (
//                 <div key={listing._id} className="p-4">
//                   <div className="flex items-start gap-3 mb-3">
//                     <div className="w-10 h-10 rounded-lg bg-elba-surface flex items-center justify-center text-lg flex-shrink-0">
//                       {listing.commodityType?.emoji || '📦'}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-elba-primary">{listing.commodityType?.name}</p>
//                       <p className="text-xs text-gray-500">
//                         {listing.quantity?.amount?.toLocaleString()} {listing.quantity?.unit} · ₦{listing.expectedPrice?.amount?.toLocaleString()}
//                       </p>
//                     </div>
//                     <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(listing.status)}`}>
//                       {getStatusLabel(listing.status)}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between text-xs text-gray-500">
//                     <span>{listing.createdBy?.firstName} {listing.createdBy?.lastName} · {new Date(listing.submittedAt).toLocaleDateString()}</span>
//                     <Link
//                       href={`/admin/listings/${listing._id}`}
//                       className="text-elba-secondary font-medium flex items-center gap-1"
//                     >
//                       View <ArrowRight className="w-3 h-3" />
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between mt-6 text-sm">
//           <p className="text-gray-500">
//             Page {page} of {totalPages}
//           </p>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setPage(p => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => setPage(p => p + 1)}
//               disabled={page >= totalPages}
//               className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }