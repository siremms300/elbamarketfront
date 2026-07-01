'use client';

import { Star, Shield, ShieldCheck } from 'lucide-react';

// interface Commodity {
//   _id: string;
//   name: string;
//   grade: string;
//   quantity: { amount: number; unit: string };
//   price: { amount: number; currency: string; perUnit: string; negotiable: boolean };
//   location: { state: string; lga: string; locationType: string };
//   seller: { sellerType: string; name: string; verificationTier: string; rating: number; totalTransactions: number };
//   availableQuantity: number;
//   percentageRemaining: number;
//   displayPrice: string;
//   moistureContent: number;
//   minimumOrder: number;
// }



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
  images: { url: string; publicId: string }[];
  seller: { sellerType: string; name: string; verificationTier: string; rating: number; totalTransactions: number };
  status: string;
  availableQuantity: number;
  displayPrice: string;
  percentageRemaining: number;
  minimumOrder: number;
  qualityCertification: { hasCertification: boolean; certifyingBody?: string };
  createdAt: string;
}

interface SupplyRowMobileProps {
  commodity: Commodity;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function SupplyRowMobile({ commodity, isExpanded, onToggle }: SupplyRowMobileProps) {
  const getVerificationBadge = (tier: string) => {
    if (tier === 'trusted') {
      return (
        <span className="trusted-badge">
          <ShieldCheck className="w-3 h-3" /> Trusted
        </span>
      );
    }
    if (tier === 'verified') {
      return (
        <span className="verified-badge">
          <Shield className="w-3 h-3" /> Verified
        </span>
      );
    }
    return null;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage > 60) return 'bg-elba-secondary';
    if (percentage > 30) return 'bg-elba-tertiary';
    return 'bg-red-500';
  };

  return (
    <div
      onClick={onToggle}
      className={`border-b border-elba-surface-dark ${isExpanded ? 'bg-elba-surface' : 'bg-white'}`}
    >
      <div className="p-4">
        {/* Top row: Name + Grade + Price */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-elba-primary text-sm">{commodity.name}</h3>
              <span className={`grade-badge grade-${commodity.grade.toLowerCase()}`}>
                Grade {commodity.grade}
              </span>
              {commodity.price.negotiable && (
                <span className="text-[10px] bg-elba-surface-dark px-1.5 py-0.5 rounded text-gray-500">
                  Negotiable
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              {commodity.location.state}{commodity.location.lga ? ` · ${commodity.location.lga}` : ''}
            </p>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <p className="font-mono font-bold text-elba-primary text-base">
              ₦{commodity.price.amount.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-500">per {commodity.price.perUnit}</p>
          </div>
        </div>

        {/* Middle row: Quantity + Progress */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500">Available</p>
            <p className="font-mono font-semibold text-sm text-elba-primary">
              {commodity.availableQuantity.toLocaleString()} <span className="text-xs text-gray-500">{commodity.quantity.unit}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Min. Order</p>
            <p className="font-mono text-sm text-elba-primary">
              {commodity.minimumOrder} <span className="text-xs text-gray-500">{commodity.quantity.unit}</span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="supply-progress mb-2">
          <div
            className={`supply-progress-fill ${getProgressColor(commodity.percentageRemaining)}`}
            style={{ width: `${commodity.percentageRemaining}%` }}
          />
        </div>

        {/* Bottom row: Seller + Expand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <p className="text-xs text-gray-600 truncate">{commodity.seller.name}</p>
            {getVerificationBadge(commodity.seller.verificationTier)}
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-elba-tertiary text-elba-tertiary" />
              <span className="text-xs text-gray-500">{commodity.seller.rating.toFixed(1)}</span>
            </div>
          </div>
          <span className="text-[10px] text-elba-secondary font-medium flex-shrink-0 ml-2">
            {isExpanded ? 'Show less' : 'Details'}
          </span>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-elba-surface-dark pt-3 space-y-2">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-500">Total Supply</p>
              <p className="font-medium text-elba-primary">{commodity.quantity.amount.toLocaleString()} {commodity.quantity.unit}</p>
            </div>
            <div>
              <p className="text-gray-500">Location Type</p>
              <p className="font-medium text-elba-primary capitalize">{commodity.location.locationType.replace('_', ' ')}</p>
            </div>
            {commodity.moistureContent && (
              <div>
                <p className="text-gray-500">Moisture Content</p>
                <p className="font-medium text-elba-primary">{commodity.moistureContent.toFixed(1)}%</p>
              </div>
            )}
            <div>
              <p className="text-gray-500">Seller Type</p>
              <p className="font-medium text-elba-primary capitalize">{commodity.seller.sellerType}</p>
            </div>
          </div>
          <button className="btn-elba-primary text-sm w-full mt-2">
            Request Supply
          </button>
        </div>
      )}
    </div>
  );
}