'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  User,
  Warehouse,
  Shield,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Tractor,
  Phone,
  Mail,
  Clock,
  Package,
  Calendar,
  Droplets,
  Tag,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

interface Listing {
  _id: string;
  commodityType: { _id: string; name: string; emoji: string; slug: string; category: string; defaultUnit: string };
  quantity: { amount: number; unit: string };
  expectedPrice: { amount: number; perUnit: string; negotiable: boolean };
  currentLocation: { state: string; lga: string; community: string };
  createdBy: {
    _id: string; firstName: string; lastName: string; email: string; phone: string;
    role: string; verificationTier: string; ratings?: { average: number; count: number }; totalTransactions?: number;
  };
  sourceType: string;
  status: string;
  farmDetails?: { harvestDate?: string; moistureContent?: number; farmingMethod?: string };
  assignedWarehouse?: { _id: string; name: string; code: string; location: { state: string; lga: string } };
  reviewedBy?: { firstName: string; lastName: string };
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  warehouseVerification?: {
    receivedBy?: { firstName: string; lastName: string };
    receivedAt?: string;
    receivedQuantity?: number;
    gradeAssigned?: string;
    moistureContent?: number;
    qualityNotes?: string;
    passed?: boolean;
    warehouseReceiptNumber?: string;
  };
  finalPrice?: { amount: number; perUnit: string };
  liveCommodityId?: string;
  adminNotes?: { note: string; addedBy: { firstName: string; lastName: string }; addedAt: string }[];
  submittedAt: string;
  notes?: string;
}

interface Warehouse {
  _id: string; name: string; code: string; location: { state: string; lga: string };
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending_review: { label: 'Pending Review', color: 'text-amber-700', bg: 'bg-amber-50', icon: Clock },
  auto_approved: { label: 'Auto Approved', color: 'text-purple-700', bg: 'bg-purple-50', icon: CheckCircle },
  approved: { label: 'Approved', color: 'text-blue-700', bg: 'bg-blue-50', icon: CheckCircle },
  assigned_to_warehouse: { label: 'Assigned to Warehouse', color: 'text-indigo-700', bg: 'bg-indigo-50', icon: Warehouse },
  received_at_warehouse: { label: 'Received at Warehouse', color: 'text-cyan-700', bg: 'bg-cyan-50', icon: Package },
  qa_completed: { label: 'QA Completed', color: 'text-teal-700', bg: 'bg-teal-50', icon: CheckCircle },
  ready_for_market: { label: 'Ready for Market', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle },
  live: { label: 'Live on Market', color: 'text-green-700', bg: 'bg-green-50', icon: ExternalLink },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-50', icon: XCircle },
  sold: { label: 'Sold', color: 'text-gray-700', bg: 'bg-gray-100', icon: CheckCircle },
};

export default function AdminListingDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (token && id) {
      fetchListing();
      fetchWarehouses();
    }
  }, [token, id]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setListing(data.data);
        if (data.data.assignedWarehouse) {
          setSelectedWarehouse(data.data.assignedWarehouse._id);
        }
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/warehouses?status=active&limit=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setWarehouses(data.data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const handleApprove = async () => {
    if (!selectedWarehouse) { setError('Please select a warehouse'); return; }
    setActionLoading(true); setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ warehouseId: selectedWarehouse, notes: reviewNotes || 'Approved' }),
      });
      const data = await res.json();
      if (data.success) { setSuccess('Approved'); setTimeout(fetchListing, 600); }
      else setError(data.message);
    } catch { setError('Network error'); }
    finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!rejectionReason) { setError('Please provide a reason'); return; }
    setActionLoading(true); setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      const data = await res.json();
      if (data.success) { setSuccess('Rejected'); setShowReject(false); setTimeout(fetchListing, 600); }
      else setError(data.message);
    } catch { setError('Network error'); }
    finally { setActionLoading(false); }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-32" />
        <div className="h-48 bg-gray-50 rounded-2xl" />
        <div className="h-32 bg-gray-50 rounded-2xl" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Listing not found</p>
        <Link href="/admin/listings" className="text-elba-secondary text-sm mt-2 inline-block">← Back</Link>
      </div>
    );
  }

  const status = statusConfig[listing.status] || statusConfig.pending_review;
  const StatusIcon = status.icon;
  const canReview = listing.status === 'pending_review';

  return (
    <div>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/admin/listings" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-elba-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>
      </div>

      {/* Messages */}
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

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-5">
          {/* Hero Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-elba-surface flex items-center justify-center text-4xl sm:text-5xl shadow-sm">
                  {listing.commodityType?.emoji || '📦'}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-elba-primary tracking-tight">{listing.commodityType?.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500 capitalize">{listing.commodityType?.category?.replace('_', ' ')}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-sm text-gray-500">{listing.sourceType === 'farmer' ? 'Farmer listing' : `${listing.sourceType?.replace('_', ' ')} listing`}</span>
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${status.bg} ${status.color} border-current/20 self-start`}>
                <StatusIcon className="w-4 h-4" /> {status.label}
              </span>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Quantity', value: `${listing.quantity?.amount?.toLocaleString()} ${listing.quantity?.unit}` },
                { label: 'Price', value: `₦${listing.expectedPrice?.amount?.toLocaleString()}/${listing.expectedPrice?.perUnit}` },
                { label: 'Price Type', value: listing.expectedPrice?.negotiable ? 'Negotiable' : 'Fixed' },
                { label: 'Location', value: listing.currentLocation?.state },
              ].map(metric => (
                <div key={metric.label} className="bg-elba-surface rounded-xl p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{metric.label}</p>
                  <p className="font-semibold text-elba-primary text-sm">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Details Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Location */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-gray-500">State</span><span className="text-sm font-medium text-elba-primary">{listing.currentLocation?.state}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">LGA</span><span className="text-sm font-medium text-elba-primary">{listing.currentLocation?.lga || '—'}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Community</span><span className="text-sm font-medium text-elba-primary">{listing.currentLocation?.community || '—'}</span></div>
              </div>
            </div>

            {/* Farm Details or Warehouse */}
            {listing.farmDetails ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Tractor className="w-4 h-4" /> Farm Details
                </h3>
                <div className="space-y-3">
                  {listing.farmDetails.harvestDate && (
                    <div className="flex justify-between"><span className="text-sm text-gray-500">Harvest Date</span><span className="text-sm font-medium text-elba-primary">{new Date(listing.farmDetails.harvestDate).toLocaleDateString()}</span></div>
                  )}
                  {listing.farmDetails.moistureContent !== undefined && (
                    <div className="flex justify-between"><span className="text-sm text-gray-500">Moisture</span><span className="text-sm font-medium text-elba-primary">{listing.farmDetails.moistureContent}%</span></div>
                  )}
                  {listing.farmDetails.farmingMethod && (
                    <div className="flex justify-between"><span className="text-sm text-gray-500">Method</span><span className="text-sm font-medium text-elba-primary capitalize">{listing.farmDetails.farmingMethod}</span></div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Source</span><span className="text-sm font-medium text-elba-primary capitalize">{listing.sourceType?.replace('_', ' ')}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Submitted</span><span className="text-sm font-medium text-elba-primary">{new Date(listing.submittedAt).toLocaleDateString()}</span></div>
                  {listing.reviewedAt && (
                    <div className="flex justify-between"><span className="text-sm text-gray-500">Reviewed</span><span className="text-sm font-medium text-elba-primary">{new Date(listing.reviewedAt).toLocaleDateString()}</span></div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Warehouse Verification (if done) */}
          {listing.warehouseVerification && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Warehouse className="w-4 h-4" /> Warehouse Verification
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {listing.warehouseVerification.receivedQuantity && (
                  <div><p className="text-[10px] text-gray-400 uppercase mb-1">Received</p><p className="font-semibold text-elba-primary">{listing.warehouseVerification.receivedQuantity} {listing.quantity?.unit}</p></div>
                )}
                {listing.warehouseVerification.gradeAssigned && (
                  <div><p className="text-[10px] text-gray-400 uppercase mb-1">Grade</p><p className="font-semibold text-elba-primary">{listing.warehouseVerification.gradeAssigned}</p></div>
                )}
                {listing.warehouseVerification.moistureContent !== undefined && (
                  <div><p className="text-[10px] text-gray-400 uppercase mb-1">Moisture</p><p className="font-semibold text-elba-primary">{listing.warehouseVerification.moistureContent}%</p></div>
                )}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase mb-1">Result</p>
                  <span className={`inline-flex items-center gap-1 text-sm font-semibold ${listing.warehouseVerification.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                    {listing.warehouseVerification.passed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {listing.warehouseVerification.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Rejection Info */}
          {listing.status === 'rejected' && (
            <div className="bg-red-50 rounded-2xl border border-red-100 p-5 sm:p-6">
              <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2"><XCircle className="w-5 h-5" /> Rejected</h3>
              <p className="text-sm text-red-600">{listing.rejectionReason}</p>
              {listing.reviewedBy && (
                <p className="text-xs text-red-400 mt-2">By {listing.reviewedBy.firstName} {listing.reviewedBy.lastName} on {listing.reviewedAt ? new Date(listing.reviewedAt).toLocaleDateString() : '—'}</p>
              )}
            </div>
          )}

          {/* Live Link */}
          {listing.liveCommodityId && (
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
                <div>
                  <p className="font-semibold text-emerald-700">Live on Market</p>
                  <p className="text-xs text-emerald-500">This listing is visible to buyers</p>
                </div>
              </div>
              <Link href="/market" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                View <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Activity Log */}
          {listing.adminNotes && listing.adminNotes.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Activity
              </h3>
              <div className="space-y-4">
                {listing.adminNotes.map((note, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-elba-surface flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-elba-primary">{note.addedBy?.firstName?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">{note.note}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{note.addedBy?.firstName} {note.addedBy?.lastName} · {new Date(note.addedAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-5">
            {/* Submitted By */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Submitted By</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-elba-primary text-white flex items-center justify-center font-bold text-lg">
                  {listing.createdBy?.firstName?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-elba-primary">{listing.createdBy?.firstName} {listing.createdBy?.lastName}</p>
                  <p className="text-xs text-gray-500 capitalize">{listing.createdBy?.role?.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4 text-gray-400 flex-shrink-0" /><span className="truncate">{listing.createdBy?.email}</span></div>
                {listing.createdBy?.phone && <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />{listing.createdBy?.phone}</div>}
                {listing.createdBy?.totalTransactions !== undefined && <div className="flex items-center gap-2 text-gray-600"><Package className="w-4 h-4 text-gray-400 flex-shrink-0" />{listing.createdBy?.totalTransactions} trades</div>}
                {listing.createdBy?.ratings?.average !== undefined && <div className="flex items-center gap-2 text-gray-600"><Star className="w-4 h-4 text-amber-400 flex-shrink-0" />{listing.createdBy?.ratings?.average?.toFixed(1)}</div>}
              </div>
            </div>

            {/* Warehouse */}
            {listing.assignedWarehouse && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Assigned Warehouse</h3>
                <p className="font-semibold text-elba-primary">{listing.assignedWarehouse.name}</p>
                <p className="text-xs text-gray-500">{listing.assignedWarehouse.code} · {listing.assignedWarehouse.location?.state}</p>
              </div>
            )}

            {/* Review Action */}
            {canReview && (
              <div className="bg-white rounded-2xl border border-elba-secondary/30 shadow-lg shadow-elba-secondary/5 p-5 sm:p-6">
                <h3 className="font-semibold text-elba-primary mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-elba-tertiary" /> Review
                </h3>
                <div className="space-y-3">
                  <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary transition-all"
                  >
                    <option value="">Select warehouse...</option>
                    {warehouses.map((w) => (
                      <option key={w._id} value={w._id}>{w.name} — {w.location?.state}</option>
                    ))}
                  </select>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Notes (optional)..."
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary transition-all resize-none"
                  />
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading || !selectedWarehouse}
                    className="w-full py-3 bg-elba-secondary text-white rounded-xl text-sm font-semibold hover:bg-elba-secondary-light disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {actionLoading ? 'Processing...' : <><CheckCircle className="w-4 h-4" /> Approve Listing</>}
                  </button>
                  <button
                    onClick={() => setShowReject(true)}
                    disabled={actionLoading}
                    className="w-full py-2.5 text-red-600 text-sm font-medium hover:bg-red-50 rounded-xl transition-all"
                  >
                    Reject Listing
                  </button>
                </div>
              </div>
            )}

            {/* Notes */}
            {listing.notes && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</h3>
                <p className="text-sm text-gray-600">{listing.notes}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Timeline
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Submitted</span><span className="text-elba-primary">{new Date(listing.submittedAt).toLocaleDateString()}</span></div>
                {listing.reviewedAt && <div className="flex justify-between"><span className="text-gray-500">Reviewed</span><span className="text-elba-primary">{new Date(listing.reviewedAt).toLocaleDateString()}</span></div>}
                {listing.warehouseVerification?.receivedAt && <div className="flex justify-between"><span className="text-gray-500">Received</span><span className="text-elba-primary">{new Date(listing.warehouseVerification.receivedAt).toLocaleDateString()}</span></div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowReject(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-bold text-lg text-elba-primary mb-2">Reject Listing</h3>
            <p className="text-sm text-gray-500 mb-4">The submitter will see this reason.</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Why is this being rejected?"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 h-24 resize-none"
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setShowReject(false); setRejectionReason(''); }}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleReject} disabled={actionLoading || !rejectionReason}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors">
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}