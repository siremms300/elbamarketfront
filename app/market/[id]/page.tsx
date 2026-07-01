'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Star,
  ShieldCheck,
  Minus,
  Plus,
  Award,
  Calendar,
  Droplets,
  Warehouse,
  CheckCircle,
} from 'lucide-react';

interface Commodity {
  _id: string;
  commodityType?: { _id: string; name: string; emoji: string; slug: string; category: string };
  name: string;
  grade: string;
  quantity: { amount: number; unit: string };
  price: { amount: number; currency: string; perUnit: string; negotiable: boolean };
  location: { state: string; lga: string; community: string; locationType: string; warehouseId?: any };
  harvestDate: string;
  moistureContent: number;
  seller: { sellerType: string; name: string; verificationTier: string; rating: number; totalTransactions: number };
  availableQuantity: number;
  percentageRemaining: number;
  minimumOrder: number;
  qualityCertification: { hasCertification: boolean; warehouseReceiptNumber?: string };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [commodity, setCommodity] = useState<Commodity | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderQuantity, setOrderQuantity] = useState(0);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/commodities/${id}`)
        .then(r => r.json())
        .then(d => {
          if (d.success) {
            setCommodity(d.data);
            setOrderQuantity(d.data.minimumOrder || 1);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-100 rounded w-20" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-50 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-5 bg-gray-100 rounded w-24" />
                <div className="h-9 bg-gray-100 rounded w-48" />
                <div className="h-12 bg-gray-100 rounded w-36" />
                <div className="h-20 bg-gray-50 rounded-xl" />
                <div className="h-14 bg-gray-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!commodity) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Product not found</p>
          <Link href="/market" className="text-elba-secondary text-sm mt-2 inline-block">← Back</Link>
        </div>
      </div>
    );
  }

  const totalPrice = commodity.price.amount * orderQuantity;
  const stockLow = commodity.percentageRemaining <= 30;
  const stockMedium = commodity.percentageRemaining > 30 && commodity.percentageRemaining <= 60;

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/market" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-elba-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Market
          </Link>
          {commodity.qualityCertification?.hasCertification && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" />
              Elba Verified
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* LEFT: Image */}
          <div>
            <div className="bg-elba-surface rounded-2xl aspect-square flex items-center justify-center text-[140px] md:text-[180px] relative overflow-hidden">
              {commodity.commodityType?.emoji || '📦'}
              {/* Stock badge */}
              <div className="absolute top-4 left-4">
                <span className={`
                  inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold
                  ${stockLow ? 'bg-red-50 text-red-700' : stockMedium ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}
                `}>
                  {stockLow ? 'Low Stock' : stockMedium ? 'Selling Fast' : 'In Stock'}
                </span>
              </div>
              {/* Grade badge */}
              <div className="absolute top-4 right-4">
                <span className={`
                  inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold
                  ${commodity.grade === 'A' ? 'bg-white/90 text-emerald-700' :
                    commodity.grade === 'B' ? 'bg-white/90 text-amber-700' : 'bg-white/90 text-gray-600'}
                `}>
                  Grade {commodity.grade}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Info + Purchase */}
          <div>
            {/* Category & Name */}
            <p className="text-xs font-bold text-elba-secondary uppercase tracking-widest mb-2">
              {commodity.commodityType?.category?.replace(/_/g, ' ')}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-elba-primary tracking-tight leading-tight mb-6">
              {commodity.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl md:text-4xl font-bold text-elba-primary">
                ₦{commodity.price.amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                per {commodity.price.perUnit}
                {commodity.price.negotiable && ' · Price negotiable'}
              </p>
            </div>

            {/* Seller */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-elba-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {commodity.seller.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-elba-primary truncate">{commodity.seller.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{commodity.seller.rating.toFixed(1)}</span>
                  <span>·</span>
                  <span>{commodity.seller.totalTransactions} trades</span>
                  {commodity.seller.verificationTier === 'trusted' && (
                    <>
                      <span>·</span>
                      <ShieldCheck className="w-3 h-3 text-elba-tertiary" />
                      <span className="text-elba-tertiary font-medium">Trusted</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-6 mb-6">
              {/* Stock bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">Available stock</span>
                  <span className="font-semibold text-elba-primary">
                    {commodity.availableQuantity.toLocaleString()} {commodity.quantity.unit}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      commodity.percentageRemaining > 60 ? 'bg-emerald-500' :
                      commodity.percentageRemaining > 30 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${commodity.percentageRemaining}%` }}
                  />
                </div>
              </div>

              {/* Quantity selector */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quantity</p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setOrderQuantity(Math.max(commodity.minimumOrder, orderQuantity - 1))}
                    disabled={orderQuantity <= commodity.minimumOrder}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center bg-gray-50 border border-gray-200 rounded-lg py-2.5">
                    <span className="text-base font-bold text-elba-primary">{orderQuantity}</span>
                    <span className="text-xs text-gray-500 ml-1">{commodity.quantity.unit}</span>
                  </div>
                  <button
                    onClick={() => setOrderQuantity(Math.min(commodity.availableQuantity, orderQuantity + 1))}
                    disabled={orderQuantity >= commodity.availableQuantity}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Min. order: {commodity.minimumOrder} {commodity.quantity.unit}
                </p>
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Total</span>
                  <span className="text-xl font-bold text-elba-primary">₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  if (!isAuthenticated) { router.push('/login'); return; }
                  alert('Checkout coming soon');
                }}
                className="w-full bg-elba-primary text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-elba-primary-light transition-colors flex items-center justify-center gap-2"
              >
                {isAuthenticated ? 'Buy Now' : 'Sign in to Buy'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-3">
                Payment secured by Elba Market
              </p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Product Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500">Location</p>
              </div>
              <p className="text-sm font-medium text-elba-primary leading-relaxed">
                {[commodity.location.community, commodity.location.lga, commodity.location.state].filter(Boolean).join(', ')}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Warehouse className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500">Source</p>
              </div>
              <p className="text-sm font-medium text-elba-primary capitalize">
                {commodity.location.locationType.replace('_', ' ')}
              </p>
            </div>

            {commodity.harvestDate && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-xs text-gray-500">Harvest Date</p>
                </div>
                <p className="text-sm font-medium text-elba-primary">
                  {new Date(commodity.harvestDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}

            {commodity.moistureContent && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-gray-400" />
                  <p className="text-xs text-gray-500">Moisture</p>
                </div>
                <p className="text-sm font-medium text-elba-primary">{commodity.moistureContent.toFixed(1)}%</p>
              </div>
            )}
          </div>

          {commodity.qualityCertification?.warehouseReceiptNumber && (
            <div className="mt-6 flex items-center gap-3 bg-emerald-50 rounded-xl p-4 max-w-md">
              <Award className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-emerald-600 font-medium">Warehouse Receipt</p>
                <p className="text-sm font-bold text-emerald-700">{commodity.qualityCertification.warehouseReceiptNumber}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}