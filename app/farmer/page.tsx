'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  List,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
} from 'lucide-react';

export default function FarmerDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, live: 0, sold: 0 });
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/listings/my-listings?limit=5', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRecentListings(data.data);
        const all = data.data;
        setStats({
          total: data.total,
          pending: all.filter((l: any) => ['pending_review', 'auto_approved', 'assigned_to_warehouse', 'received_at_warehouse'].includes(l.status)).length,
          live: all.filter((l: any) => l.status === 'live').length,
          sold: all.filter((l: any) => l.status === 'sold').length,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const b: Record<string, string> = {
      pending_review: 'bg-amber-50 text-amber-700',
      auto_approved: 'bg-purple-50 text-purple-700',
      assigned_to_warehouse: 'bg-blue-50 text-blue-700',
      received_at_warehouse: 'bg-cyan-50 text-cyan-700',
      live: 'bg-green-50 text-green-700',
      rejected: 'bg-red-50 text-red-700',
      sold: 'bg-gray-100 text-gray-600',
    };
    return b[status] || 'bg-gray-50 text-gray-500';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-elba-primary">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Farmer</p>
        </div>
        <Link
          href="/farmer/listings/new"
          className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Listing
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Listings', value: stats.total, icon: List, color: 'text-elba-secondary', bg: 'bg-elba-secondary/10' },
          { label: 'In Progress', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Live', value: stats.live, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Sold', value: stats.sold, icon: CheckCircle, color: 'text-gray-500', bg: 'bg-gray-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-elba-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-elba-primary">Recent Listings</h2>
          <Link href="/farmer/listings" className="text-xs text-elba-secondary font-medium hover:text-elba-secondary-light">
            View all <ArrowRight className="w-3 h-3 inline" />
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : recentListings.length === 0 ? (
          <div className="p-12 text-center">
            <List className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No listings yet</p>
            <Link href="/farmer/listings/new" className="btn-elba-primary text-sm py-2.5 px-5 inline-flex items-center gap-2 mt-4">
              <Plus className="w-4 h-4" /> Create First Listing
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentListings.slice(0, 5).map((listing: any) => (
              <div key={listing._id} className="px-6 py-4 hover:bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-elba-surface flex items-center justify-center text-xl">
                    {listing.commodityType?.emoji || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-elba-primary">{listing.commodityType?.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getStatusBadge(listing.status)}`}>
                        {listing.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {listing.quantity?.amount} {listing.quantity?.unit} · ₦{listing.expectedPrice?.amount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}