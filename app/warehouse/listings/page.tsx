'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Plus, Package, Eye } from 'lucide-react';

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
  { value: 'auto_approved', label: 'Auto Approved' },
  { value: 'assigned_to_warehouse', label: 'Assigned' },
  { value: 'received_at_warehouse', label: 'Received' },
  { value: 'qa_completed', label: 'QA Done' },
  { value: 'live', label: 'Live' },
  { value: 'sold', label: 'Sold' },
  { value: 'rejected', label: 'Rejected' },
];

const statusColors: Record<string, string> = {
  pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
  auto_approved: 'bg-purple-50 text-purple-700 border-purple-200',
  assigned_to_warehouse: 'bg-blue-50 text-blue-700 border-blue-200',
  received_at_warehouse: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  qa_completed: 'bg-teal-50 text-teal-700 border-teal-200',
  ready_for_market: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  live: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  sold: 'bg-gray-100 text-gray-600 border-gray-300',
};

export default function WarehouseListingsPage() {
  const { token } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);

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

      const res = await fetch(`http://localhost:5000/api/listings/my-listings?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error('Failed to fetch:', res.status);
        setListings([]);
        setTotal(0);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setListings(data.data);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (s: string) =>
    s.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const badge = (s: string) =>
    statusColors[s] || 'bg-gray-50 text-gray-500 border-gray-200';

  if (!token) {
    return (
      <div className="text-center py-12 text-gray-400">
        Please log in to view your listings.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-elba-primary">My Listings</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total</p>
        </div>
        <Link
          href="/warehouse/listings/new"
          className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" /> New Listing
        </Link>
      </div>

      {/* Status chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              statusFilter === s.value
                ? 'bg-elba-primary text-white border-elba-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse"
            >
              <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No listings yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Create your first listing to get started
          </p>
          <Link
            href="/warehouse/listings/new"
            className="btn-elba-primary text-sm py-2.5 px-5 inline-flex items-center gap-2 mt-4"
          >
            <Plus className="w-4 h-4" /> New Listing
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-elba-surface flex items-center justify-center text-2xl flex-shrink-0">
                    {listing.commodityType?.emoji || '📦'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-elba-primary">
                        {listing.commodityType?.name || 'Unknown'}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge(
                          listing.status
                        )}`}
                      >
                        {formatStatus(listing.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {listing.quantity?.amount?.toLocaleString()}{' '}
                      {listing.quantity?.unit} · ₦
                      {listing.expectedPrice?.amount?.toLocaleString()}/
                      {listing.expectedPrice?.perUnit}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {listing.currentLocation?.state} ·{' '}
                      {new Date(listing.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {listing.liveCommodityId && (
                  <Link
                    href={`/market/${listing.liveCommodityId}`}
                    target="_blank"
                    className="text-xs text-elba-secondary font-medium hover:text-elba-secondary-light flex items-center gap-1 flex-shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}