'use client';

import { MapPin, Warehouse, Calendar, Droplets, Award, FileText, ArrowRight, Truck, Shield } from 'lucide-react';

interface Commodity {
  _id: string;
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
  qualityCertification: { hasCertification: boolean; certifyingBody?: string };
  minimumOrder: number;
  createdAt: string;
}

export default function CommodityExpanded({ commodity }: { commodity: Commodity }) {
  const daysSinceHarvest = commodity.harvestDate
    ? Math.floor((Date.now() - new Date(commodity.harvestDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="px-6 py-5 bg-elba-surface border-t border-elba-surface-dark">
      <div className="grid grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg border border-elba-surface-dark">
              <p className="text-xs text-gray-500 mb-1">Available</p>
              <p className="font-mono font-semibold text-elba-primary">
                {commodity.availableQuantity.toLocaleString()} <span className="text-xs font-normal text-gray-500">{commodity.quantity.unit}</span>
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-elba-surface-dark">
              <p className="text-xs text-gray-500 mb-1">Total Supply</p>
              <p className="font-mono font-semibold text-elba-primary">
                {commodity.quantity.amount.toLocaleString()} <span className="text-xs font-normal text-gray-500">{commodity.quantity.unit}</span>
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-elba-surface-dark">
              <p className="text-xs text-gray-500 mb-1">Min. Order</p>
              <p className="font-mono font-semibold text-elba-primary">
                {commodity.minimumOrder} <span className="text-xs font-normal text-gray-500">{commodity.quantity.unit}</span>
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-elba-surface-dark">
              <p className="text-xs text-gray-500 mb-1">Price</p>
              <p className="font-mono font-semibold text-elba-primary">
                ₦{commodity.price.amount.toLocaleString()}
                <span className="text-xs font-normal text-gray-500">/{commodity.price.perUnit}</span>
              </p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg border border-elba-surface-dark p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Supply Details</h4>
            <div className="grid grid-cols-2 gap-4">
              {commodity.harvestDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Harvest Date</p>
                    <p className="text-sm font-medium">
                      {new Date(commodity.harvestDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {daysSinceHarvest !== null && (
                        <span className="text-xs text-gray-500 ml-1">({daysSinceHarvest} days ago)</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {commodity.moistureContent && (
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Moisture Content</p>
                    <p className="text-sm font-medium">{commodity.moistureContent.toFixed(1)}%</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium">
                    {commodity.location.community}, {commodity.location.lga}, {commodity.location.state}
                  </p>
                </div>
              </div>

              {commodity.qualityCertification.hasCertification && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-elba-secondary" />
                  <div>
                    <p className="text-xs text-gray-500">Quality Certified</p>
                    <p className="text-sm font-medium text-elba-secondary">
                      {commodity.qualityCertification.certifyingBody || 'Certified'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Warehouse Info if stored in warehouse */}
          {commodity.location.locationType === 'warehouse' && commodity.location.warehouseId && (
            <div className="bg-white rounded-lg border border-elba-surface-dark p-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Warehouse className="w-4 h-4" /> Warehouse Storage
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Warehouse</p>
                  <p className="text-sm font-medium">{commodity.location.warehouseId.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Code: {commodity.location.warehouseId.code}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Storage Features</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {commodity.location.warehouseId.security?.hasCCTV && (
                      <span className="text-[10px] bg-elba-surface-dark px-1.5 py-0.5 rounded">CCTV</span>
                    )}
                    {commodity.location.warehouseId.security?.hasInsurance && (
                      <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                        <Shield className="w-3 h-3 inline mr-0.5" /> Insured
                      </span>
                    )}
                    {commodity.location.warehouseId.security?.hasFencing && (
                      <span className="text-[10px] bg-elba-surface-dark px-1.5 py-0.5 rounded">Secured</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Action Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-elba-surface-dark p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Source This Supply</h4>
            
            <button className="btn-primary w-full mb-3 flex items-center justify-center gap-2">
              Request Supply <ArrowRight className="w-4 h-4" />
            </button>
            
            <button className="btn-secondary w-full mb-3 flex items-center justify-center gap-2">
              <Truck className="w-4 h-4" /> Check Logistics
            </button>

            <div className="border-t border-elba-surface-dark pt-3 mt-3">
              <p className="text-xs text-gray-500 mb-2">Seller Information</p>
              <p className="text-sm font-semibold text-elba-primary">{commodity.seller.name}</p>
              <p className="text-xs text-gray-500 capitalize">{commodity.seller.sellerType}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-elba-secondary font-medium">
                  {commodity.seller.totalTransactions} transactions
                </span>
              </div>
            </div>
          </div>

          {commodity.location.locationType === 'warehouse' && (
            <div className="bg-elba-primary/5 rounded-lg border border-elba-primary/10 p-4">
              <div className="flex items-start gap-2">
                <Warehouse className="w-4 h-4 text-elba-secondary mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-elba-primary">Warehouse Storage Available</p>
                  <p className="text-xs text-gray-600 mt-1">
                    This commodity is stored in our secure warehouse. Quality verified, insured, and ready for immediate release.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}