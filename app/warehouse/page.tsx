'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  ClipboardList,
  Package,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';

export default function WarehouseDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ awaiting: 0, inStorage: 0, processed: 0 });
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchQueue();
      fetchInventory();
    }
  }, [token]);

  const fetchQueue = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/listings/warehouse/awaiting', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRecentListings(data.data.slice(0, 5));
        setStats(prev => ({ ...prev, awaiting: data.data.length }));
      }
    } catch (err) {
      console.error('Error fetching queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/warehouses?status=active&limit=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        const warehouse = data.data[0];
        setStats(prev => ({
          ...prev,
          inStorage: warehouse.capacity?.used || 0,
          processed: warehouse.capacity?.total || 0,
        }));
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-elba-primary">Warehouse Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of warehouse operations</p>
        </div>
        <Link
          href="/warehouse/listings/new"
          className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Awaiting Processing', value: stats.awaiting, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'In Storage (tons)', value: stats.inStorage, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Processed Today', value: stats.processed, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
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

      {/* Awaiting Queue */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-elba-primary">Awaiting Processing</h2>
          <Link href="/warehouse/queue" className="text-xs text-elba-secondary font-medium hover:text-elba-secondary-light transition-colors">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : recentListings.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-emerald-300 mb-3" />
            <p className="text-gray-500 font-medium">No pending items</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentListings.map((listing: any) => (
              <div key={listing._id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-elba-surface flex items-center justify-center text-xl">
                    {listing.commodityType?.emoji || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-elba-primary">
                      {listing.commodityType?.name} — {listing.quantity?.amount} {listing.quantity?.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      {listing.createdBy?.firstName} {listing.createdBy?.lastName} · {listing.currentLocation?.state}
                    </p>
                  </div>
                  <Link
                    href="/warehouse/queue"
                    className="text-xs font-medium text-elba-secondary hover:text-elba-secondary-light transition-colors"
                  >
                    Process
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}