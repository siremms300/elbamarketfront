'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  TrendingUp,
  ArrowRight,
  Plus,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/admin/StatCard';

interface ListingStats {
  pending: number;
  autoApproved: number;
  inProgress: number;
  rejected: number;
  active: number;
  sold: number;
  total: number;
  bySource: { _id: string; count: number }[];
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<ListingStats | null>(null);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchStats();
      fetchRecentListings();
    }
  }, [token]);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/listings/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentListings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/listings/pending-review?limit=5', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRecentListings(data.data);
    } catch (error) {
      console.error('Error fetching recent listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-elba-primary">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of listing activity</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/listings/new"
            className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2 shadow-lg shadow-elba-primary/10 hover:shadow-elba-primary/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Listing
          </Link>
          <Link
            href="/admin/listings"
            className="flex items-center gap-2 text-sm font-medium text-elba-secondary hover:text-elba-secondary-light transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Pending Review"
            value={stats.pending}
            icon={Clock}
            color="text-amber-500"
            bgColor="bg-amber-50"
          />
          <StatCard
            label="Auto Approved"
            value={stats.autoApproved}
            icon={Zap}
            color="text-purple-500"
            bgColor="bg-purple-50"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={AlertCircle}
            color="text-blue-500"
            bgColor="bg-blue-50"
          />
          <StatCard
            label="Live on Market"
            value={stats.active}
            icon={CheckCircle}
            color="text-emerald-500"
            bgColor="bg-emerald-50"
          />
        </div>
      )}

      {/* Second row stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Sold"
            value={stats.sold}
            icon={Package}
            color="text-gray-500"
            bgColor="bg-gray-50"
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon={XCircle}
            color="text-red-500"
            bgColor="bg-red-50"
          />
          <StatCard
            label="Total Listings"
            value={stats.total}
            icon={TrendingUp}
            color="text-elba-secondary"
            bgColor="bg-elba-secondary/10"
          />
        </div>
      )}

      {/* Source breakdown */}
      {stats?.bySource && stats.bySource.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Listings by Source
          </h3>
          <div className="flex items-center gap-4 flex-wrap">
            {stats.bySource.map((source) => (
              <div
                key={source._id}
                className="flex items-center gap-2 bg-elba-surface rounded-xl px-4 py-2.5"
              >
                <span className="text-xs font-medium text-gray-500 capitalize">
                  {source._id.replace('_', ' ')}
                </span>
                <span className="text-sm font-bold text-elba-primary">{source.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Pending Listings */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-elba-primary">Pending Review</h2>
          <Link
            href="/admin/listings"
            className="text-xs text-elba-secondary font-medium hover:text-elba-secondary-light transition-colors"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">
            <div className="animate-pulse">Loading...</div>
          </div>
        ) : recentListings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </div>
            <p className="text-gray-500 font-medium">All caught up!</p>
            <p className="text-sm text-gray-400 mt-1">No pending listings to review</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentListings.map((listing: any) => (
              <div key={listing._id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-elba-surface flex items-center justify-center text-xl flex-shrink-0">
                    {listing.commodityType?.emoji || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-elba-primary truncate">
                        {listing.commodityType?.name}
                      </p>
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                        Pending
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {listing.createdBy?.firstName} {listing.createdBy?.lastName}
                      {' · '}
                      {listing.quantity?.amount} {listing.quantity?.unit}
                      {' · '}
                      {listing.currentLocation?.state}
                      {' · '}
                      {new Date(listing.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/admin/listings/${listing._id}`}
                    className="text-xs font-medium text-elba-secondary hover:text-elba-secondary-light transition-colors flex-shrink-0"
                  >
                    Review
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
























































// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import {
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Package,
//   TrendingUp,
//   ArrowRight,
// } from 'lucide-react';
// import Link from 'next/link';
// import StatCard from '@/components/admin/StatCard';

// interface ListingStats {
//   pending: number;
//   inProgress: number;
//   rejected: number;
//   active: number;
//   sold: number;
//   total: number;
// }

// export default function AdminDashboard() {
//   const { token } = useAuth();
//   const [stats, setStats] = useState<ListingStats | null>(null);
//   const [recentListings, setRecentListings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (token) {
//       fetchStats();
//       fetchRecentListings();
//     }
//   }, [token]);

//   const fetchStats = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/listings/admin/stats', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) setStats(data.data);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   };

//   const fetchRecentListings = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/listings/pending-review?limit=5', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) setRecentListings(data.data);
//     } catch (error) {
//       console.error('Error fetching recent listings:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {/* Page Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-elba-primary">Dashboard</h1>
//           <p className="text-sm text-gray-500 mt-1">Overview of listing activity</p>
//         </div>
//         <Link
//           href="/admin/listings"
//           className="flex items-center gap-2 text-sm font-medium text-elba-secondary hover:text-elba-secondary-light transition-colors"
//         >
//           View all listings
//           <ArrowRight className="w-4 h-4" />
//         </Link>
//       </div>

//       {/* Stats Grid */}
//       {stats && (
//         <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
//           <StatCard
//             label="Pending Review"
//             value={stats.pending}
//             icon={Clock}
//             color="text-amber-500"
//             bgColor="bg-amber-50"
//           />
//           <StatCard
//             label="In Progress"
//             value={stats.inProgress}
//             icon={AlertCircle}
//             color="text-blue-500"
//             bgColor="bg-blue-50"
//           />
//           <StatCard
//             label="Live"
//             value={stats.active}
//             icon={CheckCircle}
//             color="text-emerald-500"
//             bgColor="bg-emerald-50"
//           />
//           <StatCard
//             label="Sold"
//             value={stats.sold}
//             icon={Package}
//             color="text-gray-500"
//             bgColor="bg-gray-50"
//           />
//           <StatCard
//             label="Rejected"
//             value={stats.rejected}
//             icon={XCircle}
//             color="text-red-500"
//             bgColor="bg-red-50"
//           />
//         </div>
//       )}

//       {/* Recent Pending Listings */}
//       <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
//         <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
//           <h2 className="font-bold text-elba-primary">Pending Review</h2>
//           <Link
//             href="/admin/listings"
//             className="text-xs text-elba-secondary font-medium hover:text-elba-secondary-light transition-colors"
//           >
//             View all
//           </Link>
//         </div>

//         {loading ? (
//           <div className="p-8 text-center text-gray-400">Loading...</div>
//         ) : recentListings.length === 0 ? (
//           <div className="p-12 text-center">
//             <CheckCircle className="w-12 h-12 mx-auto text-emerald-300 mb-3" />
//             <p className="text-gray-500 font-medium">All caught up!</p>
//             <p className="text-sm text-gray-400 mt-1">No pending listings to review</p>
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-50">
//             {recentListings.map((listing: any) => (
//               <div key={listing._id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 rounded-xl bg-elba-surface flex items-center justify-center text-xl">
//                     {listing.commodityType?.emoji || '📦'}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-elba-primary">
//                       {listing.commodityType?.name} — {listing.quantity.amount} {listing.quantity.unit}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {listing.farmer?.firstName} {listing.farmer?.lastName} · {listing.currentLocation?.state} · {new Date(listing.submittedAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <Link
//                     href={`/admin/listings/${listing._id}`}
//                     className="text-xs font-medium text-elba-secondary hover:text-elba-secondary-light transition-colors"
//                   >
//                     Review
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }