// client/app/farmer/listings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Plus, Package, Eye, Trash2, AlertCircle, X } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Listing {
  _id: string;
  commodityType: { _id: string; name: string; emoji: string };
  quantity: { amount: number; unit: string };
  expectedPrice: { amount: number; perUnit: string };
  currentLocation: { state: string };
  status: string;
  submittedAt: string;
  liveCommodityId?: string;
}

const statuses = [
  { value: '', label: 'All' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'auto_approved', label: 'Approved' },
  { value: 'assigned_to_warehouse', label: 'At Warehouse' },
  { value: 'received_at_warehouse', label: 'Received' },
  { value: 'live', label: 'Live' },
  { value: 'sold', label: 'Sold' },
  { value: 'rejected', label: 'Rejected' },
];

const statusColors: Record<string, string> = {
  pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
  auto_approved: 'bg-purple-50 text-purple-700 border-purple-200',
  assigned_to_warehouse: 'bg-blue-50 text-blue-700 border-blue-200',
  received_at_warehouse: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  live: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  sold: 'bg-gray-100 text-gray-600 border-gray-300',
};

export default function FarmerListingsPage() {
  const { token } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchListings();
  }, [token, statusFilter]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('limit', '50');
      if (statusFilter) params.append('status', statusFilter);

      const res = await fetch(`${API_URL}/listings/my-listings?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { setListings([]); setTotal(0); return; }
      const data = await res.json();
      if (data.success) { setListings(data.data); setTotal(data.total); }
    } catch (err) { 
      console.error(err); 
      setError('Failed to fetch listings');
    } finally { 
      setLoading(false); 
    }
  };

  const handleDelete = async (listingId: string) => {
    setDeleting(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch(`${API_URL}/listings/${listingId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess('Listing deleted successfully');
        setDeleteConfirm(null);
        fetchListings(); // Refresh the list
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

  const canDelete = (status: string) => {
    return ['pending_review', 'auto_approved', 'rejected', 'cancelled', 'qa_completed'].includes(status);
  };

  const formatStatus = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const badge = (s: string) => statusColors[s] || 'bg-gray-50 text-gray-500 border-gray-200';

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-elba-primary">My Listings</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total</p>
        </div>
        <Link href="/farmer/listings/new" className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" /> New Listing
        </Link>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm text-emerald-600">
          {success}
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <button key={s.value} onClick={() => setStatusFilter(s.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              statusFilter === s.value ? 'bg-elba-primary text-white border-elba-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse"><div className="h-4 bg-gray-100 rounded w-1/3 mb-2" /></div>)}</div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No listings yet</p>
          <Link href="/farmer/listings/new" className="btn-elba-primary text-sm py-2.5 px-5 inline-flex items-center gap-2 mt-4">
            <Plus className="w-4 h-4" /> New Listing
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-elba-surface flex items-center justify-center text-2xl flex-shrink-0">
                    {listing.commodityType?.emoji || '📦'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-elba-primary">{listing.commodityType?.name || 'Unknown'}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge(listing.status)}`}>
                        {formatStatus(listing.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {listing.quantity?.amount?.toLocaleString()} {listing.quantity?.unit} · ₦{listing.expectedPrice?.amount?.toLocaleString()}/{listing.expectedPrice?.perUnit}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{listing.currentLocation?.state} · {new Date(listing.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {listing.liveCommodityId && (
                    <Link href={`/market/${listing.liveCommodityId}`} target="_blank" 
                      className="text-xs text-elba-secondary font-medium flex items-center gap-1 hover:text-elba-secondary-light transition-colors">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                  )}
                  {canDelete(listing.status) && (
                    <button
                      onClick={() => setDeleteConfirm(listing._id)}
                      className="text-xs text-red-500 font-medium flex items-center gap-1 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-elba-primary">Delete Listing</h3>
              <button onClick={() => setDeleteConfirm(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-4 bg-red-50 rounded-xl p-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  'Deleting...'
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
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
































































// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import Link from 'next/link';
// import { Plus, Package, Eye, Trash2 } from 'lucide-react';
// import { API_URL } from '@/lib/api';

// interface Listing {
//   _id: string;
//   commodityType: { _id: string; name: string; emoji: string };
//   quantity: { amount: number; unit: string };
//   expectedPrice: { amount: number; perUnit: string };
//   currentLocation: { state: string };
//   status: string;
//   submittedAt: string;
//   liveCommodityId?: string;
// }

// const statuses = [
//   { value: '', label: 'All' },
//   { value: 'pending_review', label: 'Pending Review' },
//   { value: 'auto_approved', label: 'Approved' },
//   { value: 'assigned_to_warehouse', label: 'At Warehouse' },
//   { value: 'received_at_warehouse', label: 'Received' },
//   { value: 'live', label: 'Live' },
//   { value: 'sold', label: 'Sold' },
//   { value: 'rejected', label: 'Rejected' },
// ];

// const statusColors: Record<string, string> = {
//   pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
//   auto_approved: 'bg-purple-50 text-purple-700 border-purple-200',
//   assigned_to_warehouse: 'bg-blue-50 text-blue-700 border-blue-200',
//   received_at_warehouse: 'bg-cyan-50 text-cyan-700 border-cyan-200',
//   live: 'bg-green-50 text-green-700 border-green-200',
//   rejected: 'bg-red-50 text-red-700 border-red-200',
//   sold: 'bg-gray-100 text-gray-600 border-gray-300',
//   cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
// };

// const deletableStatuses = ['pending_review', 'auto_approved', 'rejected', 'cancelled', 'expired'];

// export default function FarmerListingsPage() {
//   const { token } = useAuth();
//   const [listings, setListings] = useState<Listing[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState('');
//   const [total, setTotal] = useState(0);
//   const [deleting, setDeleting] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

//   useEffect(() => {
//     if (!token) return;
//     fetchListings();
//   }, [token, statusFilter]);

//   const fetchListings = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       params.append('limit', '50');
//       if (statusFilter) params.append('status', statusFilter);

//       const res = await fetch(`${API_URL}/listings/my-listings?${params}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) { setListings([]); setTotal(0); return; }
//       const data = await res.json();
//       if (data.success) { setListings(data.data); setTotal(data.total); }
//     } catch (err) { console.error(err); }
//     finally { setLoading(false); }
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

//   const formatStatus = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
//   const badge = (s: string) => statusColors[s] || 'bg-gray-50 text-gray-500 border-gray-200';

//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-elba-primary">My Listings</h1>
//           <p className="text-sm text-gray-500 mt-1">{total} total</p>
//         </div>
//         <Link href="/farmer/listings/new" className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2 self-start">
//           <Plus className="w-4 h-4" /> New Listing
//         </Link>
//       </div>

//       <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
//         {statuses.map((s) => (
//           <button key={s.value} onClick={() => setStatusFilter(s.value)}
//             className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
//               statusFilter === s.value ? 'bg-elba-primary text-white border-elba-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
//             }`}>
//             {s.label}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse"><div className="h-4 bg-gray-100 rounded w-1/3 mb-2" /></div>)}</div>
//       ) : listings.length === 0 ? (
//         <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
//           <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
//           <p className="text-gray-500 font-medium">No listings yet</p>
//           <Link href="/farmer/listings/new" className="btn-elba-primary text-sm py-2.5 px-5 inline-flex items-center gap-2 mt-4">
//             <Plus className="w-4 h-4" /> New Listing
//           </Link>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {listings.map((listing) => (
//             <div key={listing._id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-all">
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex items-center gap-4 flex-1 min-w-0">
//                   <div className="w-12 h-12 rounded-xl bg-elba-surface flex items-center justify-center text-2xl flex-shrink-0">
//                     {listing.commodityType?.emoji || '📦'}
//                   </div>
//                   <div className="min-w-0">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <h3 className="font-semibold text-elba-primary">{listing.commodityType?.name || 'Unknown'}</h3>
//                       <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge(listing.status)}`}>
//                         {formatStatus(listing.status)}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {listing.quantity?.amount?.toLocaleString()} {listing.quantity?.unit} · ₦{listing.expectedPrice?.amount?.toLocaleString()}/{listing.expectedPrice?.perUnit}
//                     </p>
//                     <p className="text-xs text-gray-400 mt-1">{listing.currentLocation?.state} · {new Date(listing.submittedAt).toLocaleDateString()}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 flex-shrink-0">
//                   {listing.liveCommodityId && (
//                     <Link href={`/market/${listing.liveCommodityId}`} target="_blank" className="text-xs text-elba-secondary font-medium flex items-center gap-1">
//                       <Eye className="w-3.5 h-3.5" /> View
//                     </Link>
//                   )}

//                   {deletableStatuses.includes(listing.status) && (
//                     <button
//                       onClick={() => handleDelete(listing._id)}
//                       disabled={deleting && deleteTarget === listing._id}
//                       className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
//                       title="Delete listing"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }















































































// // client/app/farmer/listings/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import Link from 'next/link';
// import { Plus, Package, Eye } from 'lucide-react';
// import { API_URL } from '@/lib/api';

// interface Listing {
//   _id: string;
//   commodityType: { _id: string; name: string; emoji: string };
//   quantity: { amount: number; unit: string };
//   expectedPrice: { amount: number; perUnit: string };
//   currentLocation: { state: string };
//   status: string;
//   submittedAt: string;
//   liveCommodityId?: string;
// }

// const statuses = [
//   { value: '', label: 'All' },
//   { value: 'pending_review', label: 'Pending Review' },
//   { value: 'auto_approved', label: 'Approved' },
//   { value: 'assigned_to_warehouse', label: 'At Warehouse' },
//   { value: 'received_at_warehouse', label: 'Received' },
//   { value: 'live', label: 'Live' },
//   { value: 'sold', label: 'Sold' },
//   { value: 'rejected', label: 'Rejected' },
// ];

// const statusColors: Record<string, string> = {
//   pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
//   auto_approved: 'bg-purple-50 text-purple-700 border-purple-200',
//   assigned_to_warehouse: 'bg-blue-50 text-blue-700 border-blue-200',
//   received_at_warehouse: 'bg-cyan-50 text-cyan-700 border-cyan-200',
//   live: 'bg-green-50 text-green-700 border-green-200',
//   rejected: 'bg-red-50 text-red-700 border-red-200',
//   sold: 'bg-gray-100 text-gray-600 border-gray-300',
// };

// export default function FarmerListingsPage() {
//   const { token } = useAuth();
//   const [listings, setListings] = useState<Listing[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState('');
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     if (!token) return;
//     fetchListings();
//   }, [token, statusFilter]);

//   const fetchListings = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       params.append('limit', '50');
//       if (statusFilter) params.append('status', statusFilter);

//       const res = await fetch(`${API_URL}/listings/my-listings?${params}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) { setListings([]); setTotal(0); return; }
//       const data = await res.json();
//       if (data.success) { setListings(data.data); setTotal(data.total); }
//     } catch (err) { console.error(err); }
//     finally { setLoading(false); }
//   };

//   const formatStatus = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
//   const badge = (s: string) => statusColors[s] || 'bg-gray-50 text-gray-500 border-gray-200';

//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-elba-primary">My Listings</h1>
//           <p className="text-sm text-gray-500 mt-1">{total} total</p>
//         </div>
//         <Link href="/farmer/listings/new" className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2 self-start">
//           <Plus className="w-4 h-4" /> New Listing
//         </Link>
//       </div>

//       <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
//         {statuses.map((s) => (
//           <button key={s.value} onClick={() => setStatusFilter(s.value)}
//             className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
//               statusFilter === s.value ? 'bg-elba-primary text-white border-elba-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
//             }`}>
//             {s.label}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse"><div className="h-4 bg-gray-100 rounded w-1/3 mb-2" /></div>)}</div>
//       ) : listings.length === 0 ? (
//         <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
//           <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
//           <p className="text-gray-500 font-medium">No listings yet</p>
//           <Link href="/farmer/listings/new" className="btn-elba-primary text-sm py-2.5 px-5 inline-flex items-center gap-2 mt-4">
//             <Plus className="w-4 h-4" /> New Listing
//           </Link>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {listings.map((listing) => (
//             <div key={listing._id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-all">
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex items-center gap-4 flex-1 min-w-0">
//                   <div className="w-12 h-12 rounded-xl bg-elba-surface flex items-center justify-center text-2xl flex-shrink-0">
//                     {listing.commodityType?.emoji || '📦'}
//                   </div>
//                   <div className="min-w-0">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <h3 className="font-semibold text-elba-primary">{listing.commodityType?.name || 'Unknown'}</h3>
//                       <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge(listing.status)}`}>
//                         {formatStatus(listing.status)}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {listing.quantity?.amount?.toLocaleString()} {listing.quantity?.unit} · ₦{listing.expectedPrice?.amount?.toLocaleString()}/{listing.expectedPrice?.perUnit}
//                     </p>
//                     <p className="text-xs text-gray-400 mt-1">{listing.currentLocation?.state} · {new Date(listing.submittedAt).toLocaleDateString()}</p>
//                   </div>
//                 </div>
//                 {listing.liveCommodityId && (
//                   <Link href={`/market/${listing.liveCommodityId}`} target="_blank" className="text-xs text-elba-secondary font-medium flex items-center gap-1 flex-shrink-0">
//                     <Eye className="w-3.5 h-3.5" /> View
//                   </Link>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }