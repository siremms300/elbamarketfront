// client/app/admin/warehouse/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Package,
  Warehouse,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ClipboardList,
  Search,
  X,
} from 'lucide-react';
import { API_URL } from '@/lib/api';


interface Listing {
  _id: string;
  commodityType: { _id: string; name: string; emoji: string; slug: string };
  quantity: { amount: number; unit: string };
  expectedPrice: { amount: number; perUnit: string };
  currentLocation: { state: string; lga: string };
  createdBy: { _id: string; firstName: string; lastName: string; role: string };
  sourceType: string;
  status: string;
  assignedWarehouse?: { _id: string; name: string; code: string };
  submittedAt: string;
  warehouseVerification?: {
    receivedQuantity?: number;
  };
}

export default function WarehouseQueuePage() {
  const { token } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showReceive, setShowReceive] = useState(false);
  const [showQA, setShowQA] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Receive form
  const [receivedQuantity, setReceivedQuantity] = useState('');
  const [receiveNotes, setReceiveNotes] = useState('');

  // QA form
  const [gradeAssigned, setGradeAssigned] = useState('B');
  const [qaMoisture, setQaMoisture] = useState('');
  const [foreignMatter, setForeignMatter] = useState('');
  const [pestInfestation, setPestInfestation] = useState(false);
  const [qaNotes, setQaNotes] = useState('');
  const [qaPassed, setQaPassed] = useState(true);
  const [finalPriceAmount, setFinalPriceAmount] = useState('');
  const [finalPricePerUnit, setFinalPricePerUnit] = useState('bag');

  useEffect(() => {
    if (token) fetchListings();
  }, [token]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('${API_URL}/listings/warehouse/awaiting', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setListings(data.data);
    } catch (err) {
      console.error('Error fetching warehouse listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReceive = async () => {
    if (!selectedListing || !receivedQuantity) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/listings/${selectedListing._id}/receive`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          receivedQuantity: Number(receivedQuantity),
          notes: receiveNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Goods received at warehouse');
        setShowReceive(false);
        setReceivedQuantity('');
        setReceiveNotes('');
        fetchListings();
      } else {
        setError(data.message);
      }
    } catch {
      setError('Network error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleQA = async () => {
    if (!selectedListing) return;
    setActionLoading(true);
    setError('');
    try {
      const body: any = {
        gradeAssigned,
        moistureContent: qaMoisture ? Number(qaMoisture) : undefined,
        foreignMatter: foreignMatter ? Number(foreignMatter) : undefined,
        pestInfestation,
        qualityNotes: qaNotes,
        passed: qaPassed,
      };

      if (finalPriceAmount) {
        body.finalPrice = {
          amount: Number(finalPriceAmount),
          perUnit: finalPricePerUnit,
        };
      }

      const res = await fetch(`${API_URL}/listings/${selectedListing._id}/complete-qa`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message);
        setShowQA(false);
        fetchListings();
      } else {
        setError(data.message);
      }
    } catch {
      setError('Network error');
    } finally {
      setActionLoading(false);
    }
  };

  const openReceive = (listing: Listing) => {
    setSelectedListing(listing);
    setReceivedQuantity(String(listing.quantity?.amount || ''));
    setReceiveNotes('');
    setShowReceive(true);
    setShowQA(false);
  };

  const openQA = (listing: Listing) => {
    setSelectedListing(listing);
    setGradeAssigned('B');
    setQaMoisture('');
    setForeignMatter('');
    setPestInfestation(false);
    setQaNotes('');
    setQaPassed(true);
    setFinalPriceAmount(String(listing.expectedPrice?.amount || ''));
    setFinalPricePerUnit(listing.expectedPrice?.perUnit || 'bag');
    setShowQA(true);
    setShowReceive(false);
  };

  const needsReceive = (status: string) =>
    ['auto_approved', 'approved', 'assigned_to_warehouse'].includes(status);

  const needsQA = (status: string) => status === 'received_at_warehouse';

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      auto_approved: 'bg-purple-50 text-purple-700',
      approved: 'bg-blue-50 text-blue-700',
      assigned_to_warehouse: 'bg-indigo-50 text-indigo-700',
      received_at_warehouse: 'bg-cyan-50 text-cyan-700',
      qa_completed: 'bg-teal-50 text-teal-700',
      ready_for_market: 'bg-emerald-50 text-emerald-700',
      live: 'bg-green-50 text-green-700',
    };
    return badges[status] || 'bg-gray-50 text-gray-600';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-elba-primary">Warehouse Queue</h1>
          <p className="text-sm text-gray-500 mt-1">Receive and verify incoming listings</p>
        </div>
        <button onClick={fetchListings} className="text-sm text-elba-secondary font-medium hover:text-elba-secondary-light">
          Refresh
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
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-gray-500 font-medium">No listings awaiting warehouse</p>
          <p className="text-sm text-gray-400 mt-1">All caught up!</p>
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
                      <h3 className="font-semibold text-elba-primary">{listing.commodityType?.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getStatusBadge(listing.status)}`}>
                        {listing.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {listing.quantity?.amount?.toLocaleString()} {listing.quantity?.unit} · ₦{listing.expectedPrice?.amount?.toLocaleString()}/{listing.expectedPrice?.perUnit}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {listing.createdBy?.firstName} {listing.createdBy?.lastName} · {listing.currentLocation?.state} · {new Date(listing.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {needsReceive(listing.status) && (
                    <button
                      onClick={() => openReceive(listing)}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      Receive
                    </button>
                  )}
                  {needsQA(listing.status) && (
                    <button
                      onClick={() => openQA(listing)}
                      className="px-4 py-2 bg-elba-secondary/10 text-elba-secondary rounded-xl text-sm font-medium hover:bg-elba-secondary/20 transition-colors"
                    >
                      Complete QA
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Receive Modal */}
      {showReceive && selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowReceive(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-elba-primary">Receive Goods</h3>
              <button onClick={() => setShowReceive(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {selectedListing.commodityType?.emoji} {selectedListing.commodityType?.name} — {selectedListing.quantity?.amount} {selectedListing.quantity?.unit} expected
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Quantity Received *</label>
                <input type="number" value={receivedQuantity} onChange={(e) => setReceivedQuantity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Notes</label>
                <textarea value={receiveNotes} onChange={(e) => setReceiveNotes(e.target.value)} rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 resize-none" />
              </div>
              <button onClick={handleReceive} disabled={actionLoading || !receivedQuantity}
                className="w-full py-3 bg-elba-secondary text-white rounded-xl text-sm font-semibold hover:bg-elba-secondary-light disabled:opacity-50">
                {actionLoading ? 'Processing...' : 'Confirm Receipt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QA Modal */}
      {showQA && selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowQA(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-elba-primary">Quality Assessment</h3>
              <button onClick={() => setShowQA(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {selectedListing.commodityType?.emoji} {selectedListing.commodityType?.name} — Received: {selectedListing.warehouseVerification?.receivedQuantity || selectedListing.quantity?.amount} {selectedListing.quantity?.unit}
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Grade</label>
                  <select value={gradeAssigned} onChange={(e) => setGradeAssigned(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20">
                    <option value="A">Grade A — Premium</option>
                    <option value="B">Grade B — Standard</option>
                    <option value="C">Grade C — Economy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Moisture (%)</label>
                  <input type="number" step="0.1" value={qaMoisture} onChange={(e) => setQaMoisture(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Foreign Matter (%)</label>
                  <input type="number" step="0.1" value={foreignMatter} onChange={(e) => setForeignMatter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pest Infestation</label>
                  <button type="button" onClick={() => setPestInfestation(!pestInfestation)}
                    className={`w-full py-3 rounded-xl text-sm font-medium border transition-all ${
                      pestInfestation ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                    {pestInfestation ? 'Yes — Infested' : 'No — Clean'}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Final Market Price (Optional)</p>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={finalPriceAmount} onChange={(e) => setFinalPriceAmount(e.target.value)} placeholder="Amount"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20" />
                  <select value={finalPricePerUnit} onChange={(e) => setFinalPricePerUnit(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20">
                    <option value="bag">Per Bag</option><option value="kg">Per Kg</option><option value="ton">Per Ton</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Quality Notes</label>
                <textarea value={qaNotes} onChange={(e) => setQaNotes(e.target.value)} rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 resize-none" />
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setQaPassed(true)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                    qaPassed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}>
                  ✓ Pass
                </button>
                <button type="button" onClick={() => setQaPassed(false)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                    !qaPassed ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}>
                  ✗ Fail
                </button>
              </div>

              <button onClick={handleQA} disabled={actionLoading}
                className="w-full py-3.5 bg-elba-primary text-white rounded-xl text-sm font-semibold hover:bg-elba-primary-light disabled:opacity-50 transition-all">
                {actionLoading ? 'Processing...' : qaPassed ? 'Complete QA & Push to Market' : 'Complete QA (Will not go live)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}