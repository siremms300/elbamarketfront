'use client';

import { ChevronDown, ChevronUp, Star, Warehouse, Tractor, Store, Shield, ShieldCheck, MapPin } from 'lucide-react';
import type { JSX } from 'react';



interface Commodity {
  _id: string;
  name: string;
  grade: string;
  quantity: { amount: number; unit: string };
  price: { amount: number; currency: string; perUnit: string; negotiable: boolean };
  location: { state: string; lga: string; locationType: string };
  seller: { sellerType: string; name: string; verificationTier: string; rating: number; totalTransactions: number };
  availableQuantity: number;
  percentageRemaining: number;
  displayPrice: string;
  moistureContent: number;
  minimumOrder: number;  // Add this line
}

interface CommodityRowProps {
  commodity: Commodity;
  isExpanded: boolean;
  onToggle: () => void;
  locationTypeIcon: (type: string) => JSX.Element;
}

export default function CommodityRow({ commodity, isExpanded, onToggle, locationTypeIcon }: CommodityRowProps) {
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

  const locationTypeLabel = {
    warehouse: 'Warehouse',
    farm: 'Farm Gate',
    collection_center: 'Collection Center',
    market: 'Market',
  };

  return (
    <div
      onClick={onToggle}
      className={`supply-row ${isExpanded ? 'supply-row-expanded' : ''}`}
    >
      <div className="grid grid-cols-[1fr_80px_120px_180px_140px_100px_40px] gap-4 px-6 py-4 items-center">
        {/* Commodity Name */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-elba-primary text-sm">{commodity.name}</span>
            {commodity.price.negotiable && (
              <span className="text-[10px] bg-elba-surface-dark px-1.5 py-0.5 rounded text-gray-500">Negotiable</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>Min. Order: {commodity.minimumOrder} {commodity.quantity.unit}</span>
            {commodity.moistureContent && (
              <span>• Moisture: {commodity.moistureContent.toFixed(1)}%</span>
            )}
          </div>
        </div>

        {/* Grade */}
        <div>
          <span className={`grade-badge grade-${commodity.grade.toLowerCase()}`}>
            Grade {commodity.grade}
          </span>
        </div>

        {/* Available Quantity with Progress Bar */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-sm font-semibold text-elba-primary">
              {commodity.availableQuantity.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">{commodity.quantity.unit}</span>
          </div>
          <div className="supply-progress mt-1.5">
            <div
              className={`supply-progress-fill ${getProgressColor(commodity.percentageRemaining)}`}
              style={{ width: `${commodity.percentageRemaining}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {commodity.percentageRemaining}% of {commodity.quantity.amount.toLocaleString()} {commodity.quantity.unit}
          </p>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">
              {locationTypeIcon(commodity.location.locationType)}
            </span>
            <div>
              <p className="text-sm font-medium text-elba-primary">{commodity.location.state}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="px-1.5 py-0.5 bg-elba-surface-dark rounded text-[10px]">
                  {locationTypeLabel[commodity.location.locationType as keyof typeof locationTypeLabel]}
                </span>
                {commodity.location.lga && `• ${commodity.location.lga}`}
              </p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div>
          <p className="font-mono text-sm font-bold text-elba-primary">
            ₦{commodity.price.amount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">per {commodity.price.perUnit}</p>
        </div>

        {/* Seller */}
        <div>
          <p className="text-sm font-medium text-elba-primary truncate">{commodity.seller.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {getVerificationBadge(commodity.seller.verificationTier)}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Star className="w-3 h-3 fill-elba-tertiary text-elba-tertiary" />
              {commodity.seller.rating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Expand Icon */}
        <div className="flex justify-end">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}