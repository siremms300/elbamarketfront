'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Map,
  Package,
  MapPin,
  ArrowRight,
  Star,
  Shield,
  ShieldCheck,
  Warehouse,
  Tractor,
  Store,
  TrendingUp,
  TrendingDown,
  Filter,
  LayoutList,
  MapIcon,
} from 'lucide-react';
import FilterPanel from './FilterPanel';
import MarketStatsBar from './MarketStatsBar';

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

interface SupplyTableProps {
  commodities: Commodity[];
  loading: boolean;
  totalResults: number;
  stats: any;
  filters: any;
  updateFilter: (key: string, value: string | boolean) => void;
  clearAllFilters: () => void;
  viewMode: 'table' | 'map';
  setViewMode: (mode: 'table' | 'map') => void;
}

const locationTypeIcon = (type: string) => {
  switch (type) {
    case 'warehouse': return <Warehouse className="w-3 h-3" />;
    case 'farm': return <Tractor className="w-3 h-3" />;
    default: return <Store className="w-3 h-3" />;
  }
};

const locationTypeLabel: Record<string, string> = {
  warehouse: 'Warehouse',
  farm: 'Farm Gate',
  collection_center: 'Collection Center',
  market: 'Market',
};

export default function SupplyTable({
  commodities,
  loading,
  totalResults,
  stats,
  filters,
  updateFilter,
  clearAllFilters,
  viewMode,
  setViewMode,
}: SupplyTableProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) return false;
    return value !== '' && value !== false;
  }).length;

  const getProgressColor = (percentage: number) => {
    if (percentage > 60) return 'bg-emerald-500';
    if (percentage > 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const mobileChips = [
    { key: 'state', label: filters.state || 'State', active: !!filters.state },
    { key: 'grade', label: filters.grade ? `Grade ${filters.grade}` : 'Grade', active: !!filters.grade },
    { key: 'locationType', label: filters.locationType ? locationTypeLabel[filters.locationType] || filters.locationType : 'Source', active: !!filters.locationType },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <MarketStatsBar
        totalResults={totalResults}
        commodityCount={stats.byCommodity?.length || 0}
        stateCount={stats.byState?.length || 0}
      />

      {/* Top Bar */}
      <div className={`sticky z-40 transition-all duration-300 ${
        scrolled
          ? 'top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
          : 'top-0 bg-elba-primary'
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className={`lg:hidden flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
                scrolled
                  ? 'bg-gray-100 text-elba-primary hover:bg-gray-200'
                  : 'bg-white/10 border border-white/10 text-white hover:bg-white/15'
              }`}
            >
              <Filter className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="bg-elba-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                scrolled ? 'text-gray-400' : 'text-white/40'
              }`} />
              <input
                type="text"
                placeholder="Search commodities..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 ${
                  scrolled
                    ? 'bg-gray-50 border border-gray-200 text-elba-primary placeholder:text-gray-400 focus:bg-white focus:border-elba-secondary'
                    : 'bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:bg-white/15 focus:border-white/20'
                }`}
              />
              {filters.search && (
                <button
                  onClick={() => updateFilter('search', '')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                    scrolled ? 'text-gray-400 hover:text-gray-600' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort + View Toggle */}
            <div className="hidden sm:flex items-center gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className={`rounded-xl px-3 py-2.5 text-sm transition-all focus:outline-none ${
                  scrolled
                    ? 'bg-gray-50 border border-gray-200 text-elba-primary'
                    : 'bg-white/10 border border-white/10 text-white'
                }`}
              >
                <option value="date" className="text-elba-primary">Most Recent</option>
                <option value="price" className="text-elba-primary">Price</option>
                <option value="quantity" className="text-elba-primary">Quantity</option>
                <option value="rating" className="text-elba-primary">Rating</option>
              </select>

              <button
                onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className={`p-2.5 rounded-xl transition-all ${
                  scrolled
                    ? 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                    : 'bg-white/10 border border-white/10 text-white/70 hover:text-white hover:bg-white/15'
                }`}
              >
                {filters.sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </button>

              {/* View Toggle */}
              <div className={`flex rounded-xl p-0.5 border transition-all ${
                scrolled ? 'bg-gray-100 border-gray-200' : 'bg-white/10 border-white/10'
              }`}>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'table'
                      ? scrolled ? 'bg-white text-elba-primary shadow-sm' : 'bg-white text-elba-primary shadow-sm'
                      : scrolled ? 'text-gray-500 hover:text-gray-700' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'map'
                      ? scrolled ? 'bg-white text-elba-primary shadow-sm' : 'bg-white text-elba-primary shadow-sm'
                      : scrolled ? 'text-gray-500 hover:text-gray-700' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Chips */}
      <div className="lg:hidden bg-white border-b border-gray-100 overflow-x-auto">
        <div className="flex gap-2 px-4 py-2.5">
          {mobileChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => setMobileFilterOpen(true)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                chip.active
                  ? 'bg-elba-primary text-white border-elba-primary shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {chip.label}
            </button>
          ))}
          {filters.verifiedOnly && (
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border bg-elba-primary text-white border-elba-primary shadow-sm"
            >
              Verified ✓
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Bar */}
      {activeFilterCount > 0 && (
        <div className="hidden lg:flex items-center gap-2 px-4 sm:px-6 lg:px-8 py-2.5 bg-white border-b border-gray-100 flex-wrap animate-fade-in">
          <span className="text-xs text-gray-400 font-medium">Filters:</span>
          {filters.commodityType && (
            <span className="text-xs bg-elba-surface border border-elba-surface-dark px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-elba-primary">
              Commodity
              <button onClick={() => updateFilter('commodityType', '')} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.state && (
            <span className="text-xs bg-elba-surface border border-elba-surface-dark px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-elba-primary">
              {filters.state}
              <button onClick={() => updateFilter('state', '')} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.grade && (
            <span className="text-xs bg-elba-surface border border-elba-surface-dark px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-elba-primary">
              Grade {filters.grade}
              <button onClick={() => updateFilter('grade', '')} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.locationType && (
            <span className="text-xs bg-elba-surface border border-elba-surface-dark px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-elba-primary capitalize">
              {filters.locationType.replace('_', ' ')}
              <button onClick={() => updateFilter('locationType', '')} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.verifiedOnly && (
            <span className="text-xs bg-elba-secondary/10 border border-elba-secondary/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-elba-secondary">
              Verified only
              <button onClick={() => updateFilter('verifiedOnly', false)} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-red-500 hover:text-red-600 font-medium ml-2 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Layout */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-40 max-h-[calc(100vh-12rem)] flex flex-col">
              <FilterPanel
                filters={filters}
                updateFilter={updateFilter}
                stats={stats}
                onClearAll={clearAllFilters}
                isSidebar
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Loading State */}
            {loading && (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-100 rounded-lg w-1/3" />
                        <div className="h-3 bg-gray-50 rounded-lg w-1/4" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-100 rounded-lg w-24" />
                        <div className="h-9 bg-gray-100 rounded-xl w-28" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && commodities.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-elba-surface rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-xl font-semibold text-gray-500">No commodities found</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search terms</p>
              </div>
            )}

            {/* Commodity Rows */}
            {!loading && viewMode === 'table' && commodities.length > 0 && (
              <div className="space-y-3">
                {commodities.map((commodity, index) => (
                  <Link
                    key={commodity._id}
                    href={`/market/${commodity._id}`}
                    className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group animate-fade-in block"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start gap-4">
                        {/* Image */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-elba-surface flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                          {commodity.images?.[0]?.url ? (
                            <img src={commodity.images[0].url} alt={commodity.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">{commodity.commodityType?.emoji || '📦'}</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5">
                            <h3 className="font-bold text-elba-primary text-sm sm:text-base">
                              {commodity.name}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-lg ${
                                commodity.grade === 'A' ? 'bg-emerald-50 text-emerald-700' :
                                commodity.grade === 'B' ? 'bg-amber-50 text-amber-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                Grade {commodity.grade}
                              </span>
                              {commodity.qualityCertification?.hasCertification && (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg font-bold">
                                  <ShieldCheck className="w-2.5 h-2.5" /> Certified
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                            <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
                              {locationTypeIcon(commodity.location.locationType)}
                              <span className="capitalize">{locationTypeLabel[commodity.location.locationType]}</span>
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {commodity.location.state}{commodity.location.lga ? `, ${commodity.location.lga}` : ''}
                            </span>
                            {commodity.moistureContent && (
                              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                                💧 {commodity.moistureContent.toFixed(1)}%
                              </span>
                            )}
                          </div>

                          {/* Quantity + Seller Row */}
                          <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-3 gap-3">
                            <div className="flex items-center gap-6">
                              <div>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-mono font-bold text-sm text-elba-primary">
                                    {commodity.availableQuantity.toLocaleString()}
                                  </span>
                                  <span className="text-xs text-gray-500">{commodity.quantity.unit}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <div className="w-20 sm:w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(commodity.percentageRemaining)}`}
                                      style={{ width: `${commodity.percentageRemaining}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] text-gray-400">{commodity.percentageRemaining}%</span>
                                </div>
                              </div>
                              <div className="hidden sm:block text-xs text-gray-500">
                                Min: <span className="font-semibold text-elba-primary">{commodity.minimumOrder} {commodity.quantity.unit}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="hidden sm:flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-elba-surface flex items-center justify-center">
                                  <span className="text-[10px] font-bold text-elba-primary">
                                    {commodity.seller.name.charAt(0)}
                                  </span>
                                </div>
                                <div className="text-xs">
                                  <p className="font-medium text-elba-primary leading-tight">{commodity.seller.name}</p>
                                  <div className="flex items-center gap-1">
                                    {commodity.seller.verificationTier === 'trusted' && (
                                      <ShieldCheck className="w-3 h-3 text-elba-tertiary" />
                                    )}
                                    {commodity.seller.verificationTier === 'verified' && (
                                      <Shield className="w-3 h-3 text-elba-secondary" />
                                    )}
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span className="text-gray-500">{commodity.seller.rating.toFixed(1)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price + CTA */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className="text-right">
                            <p className="font-mono font-bold text-elba-primary text-lg sm:text-xl">
                              ₦{commodity.price.amount.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-gray-400">per {commodity.price.perUnit}</p>
                          </div>
                          <span className="btn-elba-primary text-xs sm:text-sm py-2.5 px-5 flex items-center gap-1.5 shadow-lg shadow-elba-primary/10 group-hover:shadow-elba-primary/20 transition-all group-hover:-translate-y-0.5">
                            Buy Now <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Map View */}
            {viewMode === 'map' && (
              <div className="bg-white border border-gray-200 rounded-3xl h-[650px] flex items-center justify-center shadow-sm">
                <div className="text-center">
                  <div className="w-20 h-20 bg-elba-surface rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Map className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-xl font-semibold text-gray-500">Map View</p>
                  <p className="text-sm text-gray-400 mt-2">Interactive commodity map coming soon</p>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalResults > 20 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-sm">
                <p className="text-gray-500">
                  Showing {(filters.page - 1) * filters.limit + 1}–
                  {Math.min(filters.page * filters.limit, totalResults)} of {totalResults} results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateFilter('page', String(filters.page - 1))}
                    disabled={filters.page === 1}
                    className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-gray-600 transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => updateFilter('page', String(filters.page + 1))}
                    disabled={filters.page * filters.limit >= totalResults}
                    className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-gray-600 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white shadow-2xl animate-slide-right overflow-y-auto">
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-elba-primary text-lg">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5">
              <FilterPanel
                filters={filters}
                updateFilter={updateFilter}
                stats={stats}
                onClearAll={clearAllFilters}
              />
            </div>
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-5 py-4">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="btn-elba-primary w-full py-3.5 text-sm font-semibold rounded-xl shadow-lg shadow-elba-primary/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}








































































































// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   Search,
//   X,
//   Map,
//   Package,
//   MapPin,
//   ArrowRight,
//   Star,
//   Shield,
//   ShieldCheck,
//   Warehouse,
//   Tractor,
//   Store,
//   TrendingUp,
//   TrendingDown,
//   Filter,
//   LayoutList,
//   MapIcon,
// } from 'lucide-react';
// import FilterPanel from './FilterPanel';
// import MarketStatsBar from './MarketStatsBar';
// import Link from 'next/link';

// // interface Commodity {
// //   _id: string;
// //   name: string;
// //   grade: string;
// //   quantity: { amount: number; unit: string };
// //   price: { amount: number; currency: string; perUnit: string; negotiable: boolean };
// //   location: { state: string; lga: string; community: string; locationType: string; warehouseId?: any };
// //   harvestDate: string;
// //   moistureContent: number;
// //   images: { url: string; publicId: string }[];
// //   seller: { sellerType: string; name: string; verificationTier: string; rating: number; totalTransactions: number };
// //   status: string;
// //   availableQuantity: number;
// //   displayPrice: string;
// //   percentageRemaining: number;
// //   minimumOrder: number;
// //   qualityCertification: { hasCertification: boolean; certifyingBody?: string };
// //   createdAt: string;
// // }



// interface Commodity {
//   _id: string;
//   commodityType?: { _id: string; name: string; emoji: string; slug: string; category: string };
//   name: string;
//   grade: string;
//   quantity: { amount: number; unit: string };
//   price: { amount: number; currency: string; perUnit: string; negotiable: boolean };
//   location: { state: string; lga: string; community: string; locationType: string; warehouseId?: any };
//   harvestDate: string;
//   moistureContent: number;
//   images: { url: string; publicId: string }[];
//   seller: { sellerType: string; name: string; verificationTier: string; rating: number; totalTransactions: number };
//   status: string;
//   availableQuantity: number;
//   displayPrice: string;
//   percentageRemaining: number;
//   minimumOrder: number;
//   qualityCertification: { hasCertification: boolean; certifyingBody?: string };
//   createdAt: string;
// }



// interface SupplyTableProps {
//   commodities: Commodity[];
//   loading: boolean;
//   totalResults: number;
//   stats: any;
//   filters: any;
//   updateFilter: (key: string, value: string | boolean) => void;
//   clearAllFilters: () => void;
//   viewMode: 'table' | 'map';
//   setViewMode: (mode: 'table' | 'map') => void;
// }

// const locationTypeIcon = (type: string) => {
//   switch (type) {
//     case 'warehouse': return <Warehouse className="w-3 h-3" />;
//     case 'farm': return <Tractor className="w-3 h-3" />;
//     default: return <Store className="w-3 h-3" />;
//   }
// };

// const locationTypeLabel: Record<string, string> = {
//   warehouse: 'Warehouse',
//   farm: 'Farm Gate',
//   collection_center: 'Collection Center',
//   market: 'Market',
// };

// // const commodityEmoji: Record<string, string> = {
// //   Maize: '🌽', Rice: '🍚', Soybeans: '🫘', Millet: '🌾', Sorghum: '🌾',
// //   Cassava: '🥔', Yam: '🥔', Cocoa: '🫘', Groundnuts: '🥜', 'Palm Oil': '🫗',
// //   Beans: '🫘', Sesame: '🌱', Ginger: '🫚', Garlic: '🧄', Onions: '🧅',
// //   Tomatoes: '🍅', Pepper: '🌶️', Cashew: '🥜', 'Shea Butter': '🧈', Wheat: '🌾',
// // };

// export default function SupplyTable({
//   commodities,
//   loading,
//   totalResults,
//   stats,
//   filters,
//   updateFilter,
//   clearAllFilters,
//   viewMode,
//   setViewMode,
// }: SupplyTableProps) {
//   const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 80);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
//     if (['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) return false;
//     return value !== '' && value !== false;
//   }).length;

//   const getProgressColor = (percentage: number) => {
//     if (percentage > 60) return 'bg-emerald-500';
//     if (percentage > 30) return 'bg-amber-500';
//     return 'bg-red-500';
//   };

//   const mobileChips = [
//     { key: 'state', label: filters.state || 'State', active: !!filters.state },
//     { key: 'grade', label: filters.grade ? `Grade ${filters.grade}` : 'Grade', active: !!filters.grade },
//     { key: 'locationType', label: filters.locationType ? locationTypeLabel[filters.locationType] || filters.locationType : 'Source', active: !!filters.locationType },
//   ];

//   return (
//     <div className="min-h-screen bg-[#f8faf9]">
//       <MarketStatsBar
//         totalResults={totalResults}
//         commodityCount={stats.byCommodity?.length || 0}
//         stateCount={stats.byState?.length || 0}
//       />

//       {/* Top Bar */}
//       {/* <div className={`sticky top-16 z-40 transition-all duration-300 ${
//         scrolled
//           ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
//           : 'bg-elba-primary'
//       }`}> */}
//       {/* Top Bar */}
//         <div className={`sticky z-40 transition-all duration-300 ${
//         scrolled
//             ? 'top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
//             : 'top-0 bg-elba-primary'
//         }`}>
//         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
//           <div className="flex items-center gap-3">
//             {/* Mobile Filter Button */}
//             <button
//               onClick={() => setMobileFilterOpen(true)}
//               className={`lg:hidden flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
//                 scrolled
//                   ? 'bg-gray-100 text-elba-primary hover:bg-gray-200'
//                   : 'bg-white/10 border border-white/10 text-white hover:bg-white/15'
//               }`}
//             >
//               <Filter className="w-4 h-4" />
//               {activeFilterCount > 0 && (
//                 <span className="bg-elba-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                   {activeFilterCount}
//                 </span>
//               )}
//             </button>

//             {/* Search */}
//             <div className="relative flex-1 max-w-md">
//               <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
//                 scrolled ? 'text-gray-400' : 'text-white/40'
//               }`} />
//               <input
//                 type="text"
//                 placeholder="Search commodities..."
//                 value={filters.search}
//                 onChange={(e) => updateFilter('search', e.target.value)}
//                 className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 ${
//                   scrolled
//                     ? 'bg-gray-50 border border-gray-200 text-elba-primary placeholder:text-gray-400 focus:bg-white focus:border-elba-secondary'
//                     : 'bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:bg-white/15 focus:border-white/20'
//                 }`}
//               />
//               {filters.search && (
//                 <button
//                   onClick={() => updateFilter('search', '')}
//                   className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
//                     scrolled ? 'text-gray-400 hover:text-gray-600' : 'text-white/40 hover:text-white'
//                   }`}
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               )}
//             </div>

//             {/* Sort + View Toggle */}
//             <div className="hidden sm:flex items-center gap-2">
//               <select
//                 value={filters.sortBy}
//                 onChange={(e) => updateFilter('sortBy', e.target.value)}
//                 className={`rounded-xl px-3 py-2.5 text-sm transition-all focus:outline-none ${
//                   scrolled
//                     ? 'bg-gray-50 border border-gray-200 text-elba-primary'
//                     : 'bg-white/10 border border-white/10 text-white'
//                 }`}
//               >
//                 <option value="date" className="text-elba-primary">Most Recent</option>
//                 <option value="price" className="text-elba-primary">Price</option>
//                 <option value="quantity" className="text-elba-primary">Quantity</option>
//                 <option value="rating" className="text-elba-primary">Rating</option>
//               </select>

//               <button
//                 onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
//                 className={`p-2.5 rounded-xl transition-all ${
//                   scrolled
//                     ? 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
//                     : 'bg-white/10 border border-white/10 text-white/70 hover:text-white hover:bg-white/15'
//                 }`}
//               >
//                 {filters.sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
//               </button>

//               {/* View Toggle */}
//               <div className={`flex rounded-xl p-0.5 border transition-all ${
//                 scrolled ? 'bg-gray-100 border-gray-200' : 'bg-white/10 border-white/10'
//               }`}>
//                 <button
//                   onClick={() => setViewMode('table')}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
//                     viewMode === 'table'
//                       ? scrolled ? 'bg-white text-elba-primary shadow-sm' : 'bg-white text-elba-primary shadow-sm'
//                       : scrolled ? 'text-gray-500 hover:text-gray-700' : 'text-white/60 hover:text-white'
//                   }`}
//                 >
//                   <LayoutList className="w-3.5 h-3.5" />
//                   List
//                 </button>
//                 <button
//                   onClick={() => setViewMode('map')}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
//                     viewMode === 'map'
//                       ? scrolled ? 'bg-white text-elba-primary shadow-sm' : 'bg-white text-elba-primary shadow-sm'
//                       : scrolled ? 'text-gray-500 hover:text-gray-700' : 'text-white/60 hover:text-white'
//                   }`}
//                 >
//                   <MapIcon className="w-3.5 h-3.5" />
//                   Map
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Filter Chips */}
//       <div className="lg:hidden bg-white border-b border-gray-100 overflow-x-auto">
//         <div className="flex gap-2 px-4 py-2.5">
//           {mobileChips.map((chip) => (
//             <button
//               key={chip.key}
//               onClick={() => setMobileFilterOpen(true)}
//               className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
//                 chip.active
//                   ? 'bg-elba-primary text-white border-elba-primary shadow-sm'
//                   : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
//               }`}
//             >
//               {chip.label}
//             </button>
//           ))}
//           {filters.verifiedOnly && (
//             <button
//               onClick={() => setMobileFilterOpen(true)}
//               className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border bg-elba-primary text-white border-elba-primary shadow-sm"
//             >
//               Verified ✓
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Active Filters Bar */}
//       {activeFilterCount > 0 && (
//         <div className="hidden lg:flex items-center gap-2 px-4 sm:px-6 lg:px-8 py-2.5 bg-white border-b border-gray-100 flex-wrap animate-fade-in">
//           <span className="text-xs text-gray-400 font-medium">Filters:</span>
//           {filters.name && (
//             <span className="text-xs bg-elba-surface border border-elba-surface-dark px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-elba-primary">
//               {filters.name}
//               <button onClick={() => updateFilter('name', '')} className="hover:text-red-500 transition-colors">
//                 <X className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//           {filters.state && (
//             <span className="text-xs bg-elba-surface border border-elba-surface-dark px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-elba-primary">
//               {filters.state}
//               <button onClick={() => updateFilter('state', '')} className="hover:text-red-500 transition-colors">
//                 <X className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//           {filters.grade && (
//             <span className="text-xs bg-elba-surface border border-elba-surface-dark px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-elba-primary">
//               Grade {filters.grade}
//               <button onClick={() => updateFilter('grade', '')} className="hover:text-red-500 transition-colors">
//                 <X className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//           {filters.locationType && (
//             <span className="text-xs bg-elba-surface border border-elba-surface-dark px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-elba-primary capitalize">
//               {filters.locationType.replace('_', ' ')}
//               <button onClick={() => updateFilter('locationType', '')} className="hover:text-red-500 transition-colors">
//                 <X className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//           {filters.verifiedOnly && (
//             <span className="text-xs bg-elba-secondary/10 border border-elba-secondary/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium text-elba-secondary">
//               Verified only
//               <button onClick={() => updateFilter('verifiedOnly', false)} className="hover:text-red-500 transition-colors">
//                 <X className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//           <button
//             onClick={clearAllFilters}
//             className="text-xs text-red-500 hover:text-red-600 font-medium ml-2 transition-colors"
//           >
//             Clear all
//           </button>
//         </div>
//       )}

//       {/* Main Layout */}
//       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
//         <div className="flex gap-8">
//           {/* Desktop Sidebar */}
//           <aside className="hidden lg:block w-72 flex-shrink-0">
//             <div className="sticky top-40 max-h-[calc(100vh-12rem)] flex flex-col">
//               <FilterPanel
//                 filters={filters}
//                 updateFilter={updateFilter}
//                 stats={stats}
//                 onClearAll={clearAllFilters}
//                 isSidebar
//               />
//             </div>
//           </aside>

//           {/* Main Content */}
//           <main className="flex-1 min-w-0">
//             {/* Loading State */}
//             {loading && (
//               <div className="space-y-3">
//                 {[...Array(6)].map((_, i) => (
                    
//                     <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">  
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 rounded-xl bg-gray-100" />
//                       <div className="flex-1 space-y-2">
//                         <div className="h-4 bg-gray-100 rounded-lg w-1/3" />
//                         <div className="h-3 bg-gray-50 rounded-lg w-1/4" />
//                       </div>
//                       <div className="space-y-2">
//                         <div className="h-5 bg-gray-100 rounded-lg w-24" />
//                         <div className="h-9 bg-gray-100 rounded-xl w-28" />
//                       </div>
//                     </div>
//                    </div> 
//                 ))}
//               </div>
//             )}

//             {/* Empty State */}
//             {!loading && commodities.length === 0 && (
//               <div className="text-center py-20">
//                 <div className="w-20 h-20 bg-elba-surface rounded-3xl flex items-center justify-center mx-auto mb-6">
//                   <Package className="w-10 h-10 text-gray-300" />
//                 </div>
//                 <p className="text-xl font-semibold text-gray-500">No commodities found</p>
//                 <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search terms</p>
//               </div>
//             )}

//             {/* Commodity Rows */}
//             {!loading && viewMode === 'table' && commodities.length > 0 && (
//               <div className="space-y-3">
//                 {commodities.map((commodity, index) => (
//                   <div
//                     key={commodity._id}
//                     className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group animate-fade-in"
//                     style={{ animationDelay: `${index * 50}ms` }}
//                   >
//                     <div className="p-4 sm:p-5">
//                       <div className="flex items-start gap-4">
//                         {/* Image */}
//                         <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-elba-surface flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
//                           {commodity.images?.[0]?.url ? (
//                             <img src={commodity.images[0].url} alt={commodity.name} className="w-full h-full object-cover" />
//                           ) : (
//                             <span className="text-3xl">{commodity.commodityType?.emoji || '📦'}</span>
//                           )}
//                         </div>

//                         {/* Info */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5">
//                             <h3 className="font-bold text-elba-primary text-sm sm:text-base">
//                               {commodity.name}
//                             </h3>
//                             <div className="flex items-center gap-2 flex-wrap">
//                               <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-lg ${
//                                 commodity.grade === 'A' ? 'bg-emerald-50 text-emerald-700' :
//                                 commodity.grade === 'B' ? 'bg-amber-50 text-amber-700' :
//                                 'bg-gray-100 text-gray-600'
//                               }`}>
//                                 Grade {commodity.grade}
//                               </span>
//                               {commodity.qualityCertification?.hasCertification && (
//                                 <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg font-bold">
//                                   <ShieldCheck className="w-2.5 h-2.5" /> Certified
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
//                             <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
//                               {locationTypeIcon(commodity.location.locationType)}
//                               <span className="capitalize">{locationTypeLabel[commodity.location.locationType]}</span>
//                             </span>
//                             <span className="inline-flex items-center gap-1">
//                               <MapPin className="w-3 h-3" />
//                               {commodity.location.state}{commodity.location.lga ? `, ${commodity.location.lga}` : ''}
//                             </span>
//                             {commodity.moistureContent && (
//                               <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
//                                 💧 {commodity.moistureContent.toFixed(1)}%
//                               </span>
//                             )}
//                           </div>

//                           {/* Quantity + Seller Row */}
//                           <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-3 gap-3">
//                             <div className="flex items-center gap-6">
//                               <div>
//                                 <div className="flex items-baseline gap-1.5">
//                                   <span className="font-mono font-bold text-sm text-elba-primary">
//                                     {commodity.availableQuantity.toLocaleString()}
//                                   </span>
//                                   <span className="text-xs text-gray-500">{commodity.quantity.unit}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2 mt-1.5">
//                                   <div className="w-20 sm:w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                                     <div
//                                       className={`h-full rounded-full transition-all duration-500 ${getProgressColor(commodity.percentageRemaining)}`}
//                                       style={{ width: `${commodity.percentageRemaining}%` }}
//                                     />
//                                   </div>
//                                   <span className="text-[10px] text-gray-400">{commodity.percentageRemaining}%</span>
//                                 </div>
//                               </div>
//                               <div className="hidden sm:block text-xs text-gray-500">
//                                 Min: <span className="font-semibold text-elba-primary">{commodity.minimumOrder} {commodity.quantity.unit}</span>
//                               </div>
//                             </div>

//                             <div className="flex items-center gap-3">
//                               <div className="hidden sm:flex items-center gap-1.5">
//                                 <div className="w-6 h-6 rounded-full bg-elba-surface flex items-center justify-center">
//                                   <span className="text-[10px] font-bold text-elba-primary">
//                                     {commodity.seller.name.charAt(0)}
//                                   </span>
//                                 </div>
//                                 <div className="text-xs">
//                                   <p className="font-medium text-elba-primary leading-tight">{commodity.seller.name}</p>
//                                   <div className="flex items-center gap-1">
//                                     {commodity.seller.verificationTier === 'trusted' && (
//                                       <ShieldCheck className="w-3 h-3 text-elba-tertiary" />
//                                     )}
//                                     {commodity.seller.verificationTier === 'verified' && (
//                                       <Shield className="w-3 h-3 text-elba-secondary" />
//                                     )}
//                                     <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
//                                     <span className="text-gray-500">{commodity.seller.rating.toFixed(1)}</span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Price + CTA */}
//                         <div className="flex flex-col items-end gap-2 flex-shrink-0">
//                           <div className="text-right">
//                             <p className="font-mono font-bold text-elba-primary text-lg sm:text-xl">
//                               ₦{commodity.price.amount.toLocaleString()}
//                             </p>
//                             <p className="text-[10px] text-gray-400">per {commodity.price.perUnit}</p>
//                           </div>
//                           <button className="btn-elba-primary text-xs sm:text-sm py-2.5 px-5 flex items-center gap-1.5 shadow-lg shadow-elba-primary/10 hover:shadow-elba-primary/20 transition-all hover:-translate-y-0.5">
//                             Buy Now <ArrowRight className="w-3.5 h-3.5" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Map View */}
//             {viewMode === 'map' && (
//               <div className="bg-white border border-gray-200 rounded-3xl h-[650px] flex items-center justify-center shadow-sm">
//                 <div className="text-center">
//                   <div className="w-20 h-20 bg-elba-surface rounded-3xl flex items-center justify-center mx-auto mb-6">
//                     <Map className="w-10 h-10 text-gray-300" />
//                   </div>
//                   <p className="text-xl font-semibold text-gray-500">Map View</p>
//                   <p className="text-sm text-gray-400 mt-2">Interactive commodity map coming soon</p>
//                 </div>
//               </div>
//             )}

//             {/* Pagination */}
//             {!loading && totalResults > 20 && (
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-sm">
//                 <p className="text-gray-500">
//                   Showing {(filters.page - 1) * filters.limit + 1}–
//                   {Math.min(filters.page * filters.limit, totalResults)} of {totalResults} results
//                 </p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => updateFilter('page', String(filters.page - 1))}
//                     disabled={filters.page === 1}
//                     className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-gray-600 transition-all"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     onClick={() => updateFilter('page', String(filters.page + 1))}
//                     disabled={filters.page * filters.limit >= totalResults}
//                     className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-gray-600 transition-all"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </main>
//         </div>
//       </div>

//       {/* Mobile Filter Drawer */}
//       {mobileFilterOpen && (
//         <div className="fixed inset-0 z-50 lg:hidden">
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
//             onClick={() => setMobileFilterOpen(false)}
//           />
//           <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white shadow-2xl animate-slide-right overflow-y-auto">
//             <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
//               <h3 className="font-bold text-elba-primary text-lg">Filters</h3>
//               <button
//                 onClick={() => setMobileFilterOpen(false)}
//                 className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
//             <div className="p-5">
//               <FilterPanel
//                 filters={filters}
//                 updateFilter={updateFilter}
//                 stats={stats}
//                 onClearAll={clearAllFilters}
//               />
//             </div>
//             <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-5 py-4">
//               <button
//                 onClick={() => setMobileFilterOpen(false)}
//                 className="btn-elba-primary w-full py-3.5 text-sm font-semibold rounded-xl shadow-lg shadow-elba-primary/20"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }























































































// // 'use client';

// // import { useState, useRef } from 'react';
// // import {
// //   Search,
// //   X,
// //   Map,
// //   Package,
// //   MapPin,
// //   ArrowRight,
// //   Star,
// //   Shield,
// //   ShieldCheck,
// //   Warehouse,
// //   Tractor,
// //   Store,
// //   TrendingUp,
// //   TrendingDown,
// //   SlidersHorizontal,
// //   Filter,
// //   Menu,
// // } from 'lucide-react';
// // import FilterPanel from './FilterPanel';
// // import MarketStatsBar from './MarketStatsBar';

// // interface Commodity {
// //   _id: string;
// //   name: string;
// //   grade: string;
// //   quantity: { amount: number; unit: string };
// //   price: { amount: number; currency: string; perUnit: string; negotiable: boolean };
// //   location: { state: string; lga: string; community: string; locationType: string; warehouseId?: any };
// //   harvestDate: string;
// //   moistureContent: number;
// //   images: { url: string; publicId: string }[];
// //   seller: { sellerType: string; name: string; verificationTier: string; rating: number; totalTransactions: number };
// //   status: string;
// //   availableQuantity: number;
// //   displayPrice: string;
// //   percentageRemaining: number;
// //   minimumOrder: number;
// //   qualityCertification: { hasCertification: boolean; certifyingBody?: string };
// //   createdAt: string;
// // }

// // interface SupplyTableProps {
// //   commodities: Commodity[];
// //   loading: boolean;
// //   totalResults: number;
// //   stats: any;
// //   filters: any;
// //   updateFilter: (key: string, value: string | boolean) => void;
// //   clearAllFilters: () => void;
// //   viewMode: 'table' | 'map';
// //   setViewMode: (mode: 'table' | 'map') => void;
// // }

// // const locationTypeIcon = (type: string) => {
// //   switch (type) {
// //     case 'warehouse': return <Warehouse className="w-3 h-3" />;
// //     case 'farm': return <Tractor className="w-3 h-3" />;
// //     default: return <Store className="w-3 h-3" />;
// //   }
// // };

// // const locationTypeLabel: Record<string, string> = {
// //   warehouse: 'Warehouse',
// //   farm: 'Farm Gate',
// //   collection_center: 'Collection Center',
// //   market: 'Market',
// // };

// // const commodityEmoji: Record<string, string> = {
// //   Maize: '🌽', Rice: '🍚', Soybeans: '🫘', Millet: '🌾', Sorghum: '🌾',
// //   Cassava: '🥔', Yam: '🥔', Cocoa: '🫘', Groundnuts: '🥜', 'Palm Oil': '🫗',
// //   Beans: '🫘', Sesame: '🌱', Ginger: '🫚', Garlic: '🧄', Onions: '🧅',
// //   Tomatoes: '🍅', Pepper: '🌶️', Cashew: '🥜', 'Shea Butter': '🧈', Wheat: '🌾',
// // };

// // export default function SupplyTable({
// //   commodities,
// //   loading,
// //   totalResults,
// //   stats,
// //   filters,
// //   updateFilter,
// //   clearAllFilters,
// //   viewMode,
// //   setViewMode,
// // }: SupplyTableProps) {
// //   const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

// //   const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
// //     if (['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) return false;
// //     return value !== '' && value !== false;
// //   }).length;

// //   const getProgressColor = (percentage: number) => {
// //     if (percentage > 60) return 'bg-emerald-500';
// //     if (percentage > 30) return 'bg-amber-500';
// //     return 'bg-red-500';
// //   };

// //   const mobileChips = [
// //     { key: 'state', label: filters.state || 'State', active: !!filters.state },
// //     { key: 'grade', label: filters.grade ? `Grade ${filters.grade}` : 'Grade', active: !!filters.grade },
// //     { key: 'locationType', label: filters.locationType ? locationTypeLabel[filters.locationType] || filters.locationType : 'Source', active: !!filters.locationType },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-[#f8faf9]">
// //       <MarketStatsBar
// //         totalResults={totalResults}
// //         commodityCount={stats.byCommodity?.length || 0}
// //         stateCount={stats.byState?.length || 0}
// //       />

// //       {/* Dark Header Bar */}
// //       <div className="bg-elba-primary sticky top-16 z-40">
// //         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
// //           <div className="flex items-center gap-3">
// //             {/* Mobile Filter Drawer Trigger */}
// //             <button
// //               onClick={() => setMobileFilterOpen(true)}
// //               className="lg:hidden flex items-center gap-2 px-3 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm text-white font-medium flex-shrink-0"
// //             >
// //               <Filter className="w-4 h-4" />
// //               {activeFilterCount > 0 && (
// //                 <span className="bg-elba-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
// //                   {activeFilterCount}
// //                 </span>
// //               )}
// //             </button>

// //             {/* Search */}
// //             <div className="relative flex-1 max-w-md">
// //               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
// //               <input
// //                 type="text"
// //                 placeholder="Search commodities..."
// //                 value={filters.search}
// //                 onChange={(e) => updateFilter('search', e.target.value)}
// //                 className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:bg-white/15 focus:border-white/20 transition-all"
// //               />
// //               {filters.search && (
// //                 <button
// //                   onClick={() => updateFilter('search', '')}
// //                   className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
// //                 >
// //                   <X className="w-4 h-4" />
// //                 </button>
// //               )}
// //             </div>

// //             {/* Sort */}
// //             <select
// //               value={filters.sortBy}
// //               onChange={(e) => updateFilter('sortBy', e.target.value)}
// //               className="hidden sm:block bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
// //             >
// //               <option value="date" className="text-elba-primary">Most Recent</option>
// //               <option value="price" className="text-elba-primary">Price</option>
// //               <option value="quantity" className="text-elba-primary">Quantity</option>
// //               <option value="rating" className="text-elba-primary">Rating</option>
// //             </select>

// //             <button
// //               onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
// //               className="hidden sm:flex p-2.5 bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/15 transition-all"
// //             >
// //               {filters.sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
// //             </button>

// //             {/* View Toggle */}
// //             <div className="hidden sm:flex bg-white/10 rounded-xl p-0.5 border border-white/10">
// //               <button
// //                 onClick={() => setViewMode('table')}
// //                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
// //                   ${viewMode === 'table' ? 'bg-white text-elba-primary' : 'text-white/60 hover:text-white'}`}
// //               >
// //                 List
// //               </button>
// //               <button
// //                 onClick={() => setViewMode('map')}
// //                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
// //                   ${viewMode === 'map' ? 'bg-white text-elba-primary' : 'text-white/60 hover:text-white'}`}
// //               >
// //                 Map
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Mobile Filter Chips */}
// //       <div className="lg:hidden bg-white border-b border-gray-100 overflow-x-auto">
// //         <div className="flex gap-2 px-4 py-2.5">
// //           {mobileChips.map((chip) => (
// //             <button
// //               key={chip.key}
// //               onClick={() => setMobileFilterOpen(true)}
// //               className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
// //                 ${chip.active
// //                   ? 'bg-elba-primary text-white border-elba-primary'
// //                   : 'bg-gray-50 text-gray-600 border-gray-200'
// //                 }`}
// //             >
// //               {chip.label}
// //             </button>
// //           ))}
// //           {filters.verifiedOnly && (
// //             <button
// //               onClick={() => setMobileFilterOpen(true)}
// //               className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border bg-elba-primary text-white border-elba-primary"
// //             >
// //               Verified
// //             </button>
// //           )}
// //         </div>
// //       </div>

// //       {/* Active filters bar */}
// //       {activeFilterCount > 0 && (
// //         <div className="hidden lg:flex items-center gap-2 px-4 sm:px-6 lg:px-8 py-2.5 bg-white border-b border-gray-100 flex-wrap">
// //           <span className="text-xs text-gray-500 font-medium">Active:</span>
// //           {filters.name && (
// //             <span className="text-xs bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
// //               {filters.name}
// //               <button onClick={() => updateFilter('name', '')}><X className="w-3 h-3" /></button>
// //             </span>
// //           )}
// //           {filters.state && (
// //             <span className="text-xs bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
// //               {filters.state}
// //               <button onClick={() => updateFilter('state', '')}><X className="w-3 h-3" /></button>
// //             </span>
// //           )}
// //           {filters.grade && (
// //             <span className="text-xs bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
// //               Grade {filters.grade}
// //               <button onClick={() => updateFilter('grade', '')}><X className="w-3 h-3" /></button>
// //             </span>
// //           )}
// //           {filters.locationType && (
// //             <span className="text-xs bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 capitalize">
// //               {filters.locationType.replace('_', ' ')}
// //               <button onClick={() => updateFilter('locationType', '')}><X className="w-3 h-3" /></button>
// //             </span>
// //           )}
// //           {filters.verifiedOnly && (
// //             <span className="text-xs bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
// //               Verified only
// //               <button onClick={() => updateFilter('verifiedOnly', false)}><X className="w-3 h-3" /></button>
// //             </span>
// //           )}
// //           <button onClick={clearAllFilters} className="text-xs text-red-500 hover:text-red-600 font-medium ml-1">
// //             Clear all
// //           </button>
// //         </div>
// //       )}

// //       {/* Main Layout: Sidebar + Content */}
// //       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
// //         <div className="flex gap-6">
// //           {/* Desktop Sidebar - Always Visible */}
// //           {/* <aside className="hidden lg:block w-72 flex-shrink-0">
// //             <div className="sticky top-36">
// //               <FilterPanel
// //                 filters={filters}
// //                 updateFilter={updateFilter}
// //                 stats={stats}
// //                 onClearAll={clearAllFilters}
// //                 isSidebar
// //               />
// //             </div>
// //           </aside> */}


// //           {/* Desktop Sidebar - Always Visible */}
// //         <aside className="hidden lg:block w-72 flex-shrink-0">
// //             <div className="sticky top-36 max-h-[calc(100vh-10rem)] flex flex-col">
// //                 <FilterPanel
// //                 filters={filters}
// //                 updateFilter={updateFilter}
// //                 stats={stats}
// //                 onClearAll={clearAllFilters}
// //                 isSidebar
// //                 />
// //             </div>
// //         </aside>

// //           {/* Main Content */}
// //           <main className="flex-1 min-w-0">
// //             {/* Loading */}
// //             {loading && (
// //               <div className="space-y-2">
// //                 {[...Array(8)].map((_, i) => (
// //                   <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
// //                     <div className="flex items-center gap-4">
// //                       <div className="w-10 h-10 bg-gray-100 rounded-lg" />
// //                       <div className="flex-1 space-y-2">
// //                         <div className="h-4 bg-gray-100 rounded w-1/3" />
// //                         <div className="h-3 bg-gray-50 rounded w-1/4" />
// //                       </div>
// //                       <div className="h-8 bg-gray-100 rounded-lg w-32" />
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             {/* Empty */}
// //             {!loading && commodities.length === 0 && (
// //               <div className="text-center py-20">
// //                 <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
// //                 <p className="text-lg font-semibold text-gray-500">No commodities found</p>
// //                 <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
// //               </div>
// //             )}

// //             {/* Commodity Rows */}
// //             {!loading && viewMode === 'table' && commodities.length > 0 && (
// //               <div className="space-y-1.5">
// //                 {commodities.map((commodity) => (
// //                   <div
// //                     key={commodity._id}
// //                     className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-150 overflow-hidden group"
// //                   >
// //                     <div className="p-4 sm:p-5">
// //                       <div className="flex items-start gap-4">
// //                         {/* Commodity Image/Icon */}
// //                         <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-elba-surface flex items-center justify-center flex-shrink-0 overflow-hidden">
// //                           {commodity.images?.[0]?.url ? (
// //                             <img src={commodity.images[0].url} alt={commodity.name} className="w-full h-full object-cover" />
// //                           ) : (
// //                             <span className="text-2xl">{commodityEmoji[commodity.name] || '📦'}</span>
// //                           )}
// //                         </div>

// //                         {/* Main Info */}
// //                         <div className="flex-1 min-w-0">
// //                           <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
// //                             <h3 className="font-semibold text-elba-primary text-sm sm:text-base">
// //                               {commodity.name}
// //                             </h3>
// //                             <div className="flex items-center gap-2 flex-wrap">
// //                               <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-md
// //                                 ${commodity.grade === 'A' ? 'bg-emerald-50 text-emerald-700' :
// //                                   commodity.grade === 'B' ? 'bg-amber-50 text-amber-700' :
// //                                   'bg-gray-100 text-gray-600'}`}
// //                               >
// //                                 Grade {commodity.grade}
// //                               </span>
// //                               {commodity.qualityCertification?.hasCertification && (
// //                                 <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium">
// //                                   <ShieldCheck className="w-2.5 h-2.5" /> Certified
// //                                 </span>
// //                               )}
// //                             </div>
// //                           </div>

// //                           <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
// //                             <span className="flex items-center gap-1">
// //                               {locationTypeIcon(commodity.location.locationType)}
// //                               <span className="capitalize">{locationTypeLabel[commodity.location.locationType]}</span>
// //                             </span>
// //                             <span className="flex items-center gap-1">
// //                               <MapPin className="w-3 h-3" />
// //                               {commodity.location.state}{commodity.location.lga ? `, ${commodity.location.lga}` : ''}
// //                             </span>
// //                             {commodity.moistureContent && (
// //                               <span>💧 {commodity.moistureContent.toFixed(1)}% moisture</span>
// //                             )}
// //                           </div>
// //                         </div>

// //                         {/* Price + CTA */}
// //                         <div className="flex flex-col items-end gap-2 flex-shrink-0">
// //                           <div className="text-right">
// //                             <p className="font-mono font-bold text-elba-primary text-base sm:text-lg">
// //                               ₦{commodity.price.amount.toLocaleString()}
// //                             </p>
// //                             <p className="text-[10px] text-gray-400">per {commodity.price.perUnit}</p>
// //                           </div>
// //                           <button className="btn-elba-primary text-xs sm:text-sm py-2 px-4 sm:px-5 flex items-center gap-1.5">
// //                             Buy Now <ArrowRight className="w-3.5 h-3.5" />
// //                           </button>
// //                         </div>
// //                       </div>

// //                       {/* Bottom Row: Quantity + Seller */}
// //                       <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
// //                         <div className="flex items-center gap-6">
// //                           <div>
// //                             <div className="flex items-baseline gap-1.5">
// //                               <span className="font-mono font-semibold text-sm text-elba-primary">
// //                                 {commodity.availableQuantity.toLocaleString()}
// //                               </span>
// //                               <span className="text-xs text-gray-500">{commodity.quantity.unit}</span>
// //                               <span className="text-xs text-gray-400">available</span>
// //                             </div>
// //                             <div className="flex items-center gap-2 mt-1">
// //                               <div className="w-20 sm:w-28 h-1 bg-gray-100 rounded-full overflow-hidden">
// //                                 <div
// //                                   className={`h-full rounded-full transition-all duration-500 ${getProgressColor(commodity.percentageRemaining)}`}
// //                                   style={{ width: `${commodity.percentageRemaining}%` }}
// //                                 />
// //                               </div>
// //                               <span className="text-[10px] text-gray-400">{commodity.percentageRemaining}%</span>
// //                             </div>
// //                           </div>
// //                           <div className="hidden sm:block text-xs text-gray-500">
// //                             Min: <span className="font-medium text-elba-primary">{commodity.minimumOrder} {commodity.quantity.unit}</span>
// //                           </div>
// //                         </div>

// //                         <div className="flex items-center gap-3">
// //                           <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
// //                             <div className="w-5 h-5 rounded-full bg-elba-surface flex items-center justify-center">
// //                               <span className="text-[10px] font-bold text-elba-primary">
// //                                 {commodity.seller.name.charAt(0)}
// //                               </span>
// //                             </div>
// //                             <span className="font-medium text-elba-primary">{commodity.seller.name}</span>
// //                             {commodity.seller.verificationTier === 'trusted' && (
// //                               <ShieldCheck className="w-3 h-3 text-elba-tertiary" />
// //                             )}
// //                             {commodity.seller.verificationTier === 'verified' && (
// //                               <Shield className="w-3 h-3 text-elba-secondary" />
// //                             )}
// //                           </div>
// //                           <div className="flex items-center gap-1">
// //                             <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
// //                             <span className="text-xs font-medium">{commodity.seller.rating.toFixed(1)}</span>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             {/* Map View */}
// //             {viewMode === 'map' && (
// //               <div className="bg-white border border-gray-200 rounded-2xl h-[600px] flex items-center justify-center">
// //                 <div className="text-center">
// //                   <Map className="w-16 h-16 mx-auto mb-4 text-gray-300" />
// //                   <p className="text-lg font-semibold text-gray-500">Map View</p>
// //                   <p className="text-sm text-gray-400">Coming soon</p>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Pagination */}
// //             {!loading && totalResults > 20 && (
// //               <div className="flex items-center justify-between mt-6 text-sm">
// //                 <p className="text-gray-500">
// //                   {(filters.page - 1) * filters.limit + 1}–{Math.min(filters.page * filters.limit, totalResults)} of {totalResults}
// //                 </p>
// //                 <div className="flex gap-2">
// //                   <button
// //                     onClick={() => updateFilter('page', String(filters.page - 1))}
// //                     disabled={filters.page === 1}
// //                     className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
// //                   >
// //                     Previous
// //                   </button>
// //                   <button
// //                     onClick={() => updateFilter('page', String(filters.page + 1))}
// //                     disabled={filters.page * filters.limit >= totalResults}
// //                     className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
// //                   >
// //                     Next
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </main>
// //         </div>
// //       </div>

// //       {/* Mobile Filter Drawer - Slides from Left */}
// //       {mobileFilterOpen && (
// //         <div className="fixed inset-0 z-50 lg:hidden">
// //           {/* Backdrop */}
// //           <div
// //             className="absolute inset-0 bg-black/50 transition-opacity"
// //             onClick={() => setMobileFilterOpen(false)}
// //           />
          
// //           {/* Drawer */}
// //           <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white shadow-2xl animate-slide-right overflow-y-auto">
// //             <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
// //               <h3 className="font-semibold text-elba-primary text-lg">Filters</h3>
// //               <button
// //                 onClick={() => setMobileFilterOpen(false)}
// //                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
// //               >
// //                 <X className="w-5 h-5 text-gray-500" />
// //               </button>
// //             </div>
            
// //             <div className="p-5">
// //               <FilterPanel
// //                 filters={filters}
// //                 updateFilter={updateFilter}
// //                 stats={stats}
// //                 onClearAll={clearAllFilters}
// //               />
// //             </div>

// //             {/* Bottom Apply Button */}
// //             <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4">
// //               <button
// //                 onClick={() => setMobileFilterOpen(false)}
// //                 className="btn-elba-primary w-full py-3.5 text-sm font-semibold rounded-xl"
// //               >
// //                 Apply Filters
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



















































































// // 'use client';

// // import { useState, useRef, useEffect } from 'react';
// // import {
// //   Search,
// //   X,
// //   Map,
// //   Package,
// //   MapPin,
// //   ArrowRight,
// //   Star,
// //   Shield,
// //   ShieldCheck,
// //   Warehouse,
// //   Tractor,
// //   Store,
// //   TrendingUp,
// //   TrendingDown,
// //   SlidersHorizontal,
// //   ChevronDown,
// //   Filter,
// // } from 'lucide-react';
// // import FilterPanel from './FilterPanel';
// // import MarketStatsBar from './MarketStatsBar';

// // interface Commodity {
// //   _id: string;
// //   name: string;
// //   grade: string;
// //   quantity: { amount: number; unit: string };
// //   price: { amount: number; currency: string; perUnit: string; negotiable: boolean };
// //   location: { state: string; lga: string; community: string; locationType: string; warehouseId?: any };
// //   harvestDate: string;
// //   moistureContent: number;
// //   images: { url: string; publicId: string }[];
// //   seller: { sellerType: string; name: string; verificationTier: string; rating: number; totalTransactions: number };
// //   status: string;
// //   availableQuantity: number;
// //   displayPrice: string;
// //   percentageRemaining: number;
// //   minimumOrder: number;
// //   qualityCertification: { hasCertification: boolean; certifyingBody?: string };
// //   createdAt: string;
// // }

// // interface SupplyTableProps {
// //   commodities: Commodity[];
// //   loading: boolean;
// //   totalResults: number;
// //   stats: any;
// //   filters: any;
// //   updateFilter: (key: string, value: string | boolean) => void;
// //   clearAllFilters: () => void;
// //   showFilters: boolean;
// //   setShowFilters: (show: boolean) => void;
// //   viewMode: 'table' | 'map';
// //   setViewMode: (mode: 'table' | 'map') => void;
// // }

// // const locationTypeIcon = (type: string) => {
// //   switch (type) {
// //     case 'warehouse': return <Warehouse className="w-3 h-3" />;
// //     case 'farm': return <Tractor className="w-3 h-3" />;
// //     default: return <Store className="w-3 h-3" />;
// //   }
// // };

// // const locationTypeLabel: Record<string, string> = {
// //   warehouse: 'Warehouse',
// //   farm: 'Farm Gate',
// //   collection_center: 'Collection Center',
// //   market: 'Market',
// // };

// // const commodityEmoji: Record<string, string> = {
// //   Maize: '🌽', Rice: '🍚', Soybeans: '🫘', Millet: '🌾', Sorghum: '🌾',
// //   Cassava: '🥔', Yam: '🥔', Cocoa: '🫘', Groundnuts: '🥜', 'Palm Oil': '🫗',
// //   Beans: '🫘', Sesame: '🌱', Ginger: '🫚', Garlic: '🧄', Onions: '🧅',
// //   Tomatoes: '🍅', Pepper: '🌶️', Cashew: '🥜', 'Shea Butter': '🧈', Wheat: '🌾',
// // };

// // export default function SupplyTable({
// //   commodities,
// //   loading,
// //   totalResults,
// //   stats,
// //   filters,
// //   updateFilter,
// //   clearAllFilters,
// //   showFilters,
// //   setShowFilters,
// //   viewMode,
// //   setViewMode,
// // }: SupplyTableProps) {
// //   const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
// //   const [expandedRow, setExpandedRow] = useState<string | null>(null);
// //   const tableRef = useRef<HTMLDivElement>(null);

// //   const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
// //     if (['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) return false;
// //     return value !== '' && value !== false;
// //   }).length;

// //   const getProgressColor = (percentage: number) => {
// //     if (percentage > 60) return 'bg-emerald-500';
// //     if (percentage > 30) return 'bg-amber-500';
// //     return 'bg-red-500';
// //   };

// //   // Mobile filter chips
// //   const mobileChips = [
// //     { key: 'state', label: filters.state || 'Any State', active: !!filters.state },
// //     { key: 'grade', label: filters.grade ? `Grade ${filters.grade}` : 'Any Grade', active: !!filters.grade },
// //     { key: 'locationType', label: filters.locationType ? locationTypeLabel[filters.locationType] || filters.locationType : 'Any Source', active: !!filters.locationType },
// //     { key: 'verifiedOnly', label: 'Verified Only', active: !!filters.verifiedOnly },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-[#f8faf9]">
// //       <MarketStatsBar
// //         totalResults={totalResults}
// //         commodityCount={stats.byCommodity?.length || 0}
// //         stateCount={stats.byState?.length || 0}
// //       />

// //       {/* Dark Header Bar */}
// //       <div className="bg-elba-primary sticky top-16 z-40">
// //         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
// //           <div className="flex items-center gap-3">
// //             {/* Search */}
// //             <div className="relative flex-1 max-w-md">
// //               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
// //               <input
// //                 type="text"
// //                 placeholder="Search commodities..."
// //                 value={filters.search}
// //                 onChange={(e) => updateFilter('search', e.target.value)}
// //                 className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:bg-white/15 focus:border-white/20 transition-all"
// //               />
// //               {filters.search && (
// //                 <button
// //                   onClick={() => updateFilter('search', '')}
// //                   className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
// //                 >
// //                   <X className="w-4 h-4" />
// //                 </button>
// //               )}
// //             </div>

// //             {/* Sort */}
// //             <select
// //               value={filters.sortBy}
// //               onChange={(e) => updateFilter('sortBy', e.target.value)}
// //               className="hidden sm:block bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
// //             >
// //               <option value="date" className="text-elba-primary">Most Recent</option>
// //               <option value="price" className="text-elba-primary">Price</option>
// //               <option value="quantity" className="text-elba-primary">Quantity</option>
// //               <option value="rating" className="text-elba-primary">Rating</option>
// //             </select>

// //             <button
// //               onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
// //               className="hidden sm:flex p-2.5 bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/15 transition-all"
// //             >
// //               {filters.sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
// //             </button>

// //             {/* Desktop Filter Toggle */}
// //             <button
// //               onClick={() => setShowFilters(!showFilters)}
// //               className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
// //                 ${showFilters || activeFilterCount > 0
// //                   ? 'bg-white text-elba-primary'
// //                   : 'bg-white/10 border border-white/10 text-white hover:bg-white/15'
// //                 }`}
// //             >
// //               <SlidersHorizontal className="w-4 h-4" />
// //               Filters
// //               {activeFilterCount > 0 && (
// //                 <span className="bg-elba-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
// //                   {activeFilterCount}
// //                 </span>
// //               )}
// //             </button>

// //             {/* Mobile Filter Button */}
// //             <button
// //               onClick={() => setMobileFilterOpen(true)}
// //               className="sm:hidden flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm text-white font-medium"
// //             >
// //               <Filter className="w-4 h-4" />
// //               Filters
// //               {activeFilterCount > 0 && (
// //                 <span className="bg-elba-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
// //                   {activeFilterCount}
// //                 </span>
// //               )}
// //             </button>

// //             {/* View Toggle */}
// //             <div className="hidden sm:flex bg-white/10 rounded-xl p-0.5 border border-white/10">
// //               <button
// //                 onClick={() => setViewMode('table')}
// //                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
// //                   ${viewMode === 'table' ? 'bg-white text-elba-primary' : 'text-white/60 hover:text-white'}`}
// //               >
// //                 List
// //               </button>
// //               <button
// //                 onClick={() => setViewMode('map')}
// //                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
// //                   ${viewMode === 'map' ? 'bg-white text-elba-primary' : 'text-white/60 hover:text-white'}`}
// //               >
// //                 Map
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Mobile Filter Chips */}
// //       <div className="sm:hidden bg-white border-b border-gray-100 overflow-x-auto">
// //         <div className="flex gap-2 px-4 py-2.5">
// //           {mobileChips.map((chip) => (
// //             <button
// //               key={chip.key}
// //               onClick={() => setMobileFilterOpen(true)}
// //               className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
// //                 ${chip.active
// //                   ? 'bg-elba-primary text-white border-elba-primary'
// //                   : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
// //                 }`}
// //             >
// //               {chip.label}
// //               {chip.active && <X className="w-3 h-3 inline ml-1" />}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
// //         <div className="flex gap-6">
// //           {/* Desktop Sidebar Filters */}
// //           {showFilters && (
// //             <div className="hidden lg:block w-72 flex-shrink-0">
// //               <div className="sticky top-36">
// //                 {/* <FilterPanel
// //                   filters={filters}
// //                   updateFilter={updateFilter}
// //                   stats={stats}
// //                   onClose={() => setShowFilters(false)}
// //                 /> */} 

// //                 <FilterPanel
// //                     filters={filters}
// //                     updateFilter={updateFilter}
// //                     stats={stats}
// //                     onClose={() => setShowFilters(false)}
// //                     onClearAll={clearAllFilters}
// //                 />
// //               </div>
// //             </div>
// //           )}

// //           {/* Main Content */}
// //           <div className="flex-1 min-w-0">
// //             {/* Active filters */}
// //             {activeFilterCount > 0 && (
// //               <div className="flex items-center gap-2 mb-4 flex-wrap">
// //                 <span className="text-xs text-gray-500 font-medium">Active:</span>
// //                 {filters.name && (
// //                   <span className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
// //                     {filters.name}
// //                     <button onClick={() => updateFilter('name', '')}><X className="w-3 h-3" /></button>
// //                   </span>
// //                 )}
// //                 {filters.state && (
// //                   <span className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
// //                     {filters.state}
// //                     <button onClick={() => updateFilter('state', '')}><X className="w-3 h-3" /></button>
// //                   </span>
// //                 )}
// //                 {filters.grade && (
// //                   <span className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
// //                     Grade {filters.grade}
// //                     <button onClick={() => updateFilter('grade', '')}><X className="w-3 h-3" /></button>
// //                   </span>
// //                 )}
// //                 {filters.locationType && (
// //                   <span className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 capitalize">
// //                     {filters.locationType.replace('_', ' ')}
// //                     <button onClick={() => updateFilter('locationType', '')}><X className="w-3 h-3" /></button>
// //                   </span>
// //                 )}
// //                 <button onClick={clearAllFilters} className="text-xs text-red-500 hover:text-red-600 font-medium ml-1">
// //                   Clear all
// //                 </button>
// //               </div>
// //             )}

// //             {/* Loading */}
// //             {loading && (
// //               <div className="space-y-2">
// //                 {[...Array(8)].map((_, i) => (
// //                   <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
// //                     <div className="flex items-center gap-4">
// //                       <div className="w-10 h-10 bg-gray-100 rounded-lg" />
// //                       <div className="flex-1 space-y-2">
// //                         <div className="h-4 bg-gray-100 rounded w-1/3" />
// //                         <div className="h-3 bg-gray-50 rounded w-1/4" />
// //                       </div>
// //                       <div className="h-8 bg-gray-100 rounded-lg w-32" />
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             {/* Empty */}
// //             {!loading && commodities.length === 0 && (
// //               <div className="text-center py-20">
// //                 <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
// //                 <p className="text-lg font-semibold text-gray-500">No commodities found</p>
// //                 <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
// //               </div>
// //             )}

// //             {/* Commodity Rows */}
// //             {!loading && viewMode === 'table' && commodities.length > 0 && (
// //               <div ref={tableRef} className="space-y-1.5">
// //                 {commodities.map((commodity) => (
// //                   <div
// //                     key={commodity._id}
// //                     className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-150 overflow-hidden group"
// //                   >
// //                     <div className="p-4 sm:p-5">
// //                       <div className="flex items-start gap-4">
// //                         {/* Commodity Image/Icon */}
// //                         <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-elba-surface flex items-center justify-center flex-shrink-0 overflow-hidden">
// //                           {commodity.images?.[0]?.url ? (
// //                             <img src={commodity.images[0].url} alt={commodity.name} className="w-full h-full object-cover" />
// //                           ) : (
// //                             <span className="text-2xl">{commodityEmoji[commodity.name] || '📦'}</span>
// //                           )}
// //                         </div>

// //                         {/* Main Info */}
// //                         <div className="flex-1 min-w-0">
// //                           <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
// //                             <h3 className="font-semibold text-elba-primary text-sm sm:text-base">
// //                               {commodity.name}
// //                             </h3>
// //                             <div className="flex items-center gap-2 flex-wrap">
// //                               <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-md
// //                                 ${commodity.grade === 'A' ? 'bg-emerald-50 text-emerald-700' :
// //                                   commodity.grade === 'B' ? 'bg-amber-50 text-amber-700' :
// //                                   'bg-gray-100 text-gray-600'}`}
// //                               >
// //                                 Grade {commodity.grade}
// //                               </span>
// //                               {commodity.qualityCertification?.hasCertification && (
// //                                 <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium">
// //                                   <ShieldCheck className="w-2.5 h-2.5" /> Certified
// //                                 </span>
// //                               )}
// //                             </div>
// //                           </div>

// //                           <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
// //                             <span className="flex items-center gap-1">
// //                               {locationTypeIcon(commodity.location.locationType)}
// //                               <span className="capitalize">{locationTypeLabel[commodity.location.locationType]}</span>
// //                             </span>
// //                             <span className="flex items-center gap-1">
// //                               <MapPin className="w-3 h-3" />
// //                               {commodity.location.state}{commodity.location.lga ? `, ${commodity.location.lga}` : ''}
// //                             </span>
// //                             {commodity.moistureContent && (
// //                               <span>💧 {commodity.moistureContent.toFixed(1)}% moisture</span>
// //                             )}
// //                           </div>
// //                         </div>

// //                         {/* Price + CTA */}
// //                         {/* <div className="flex flex-col items-end gap-2 flex-shrink-0">
// //                           <div className="text-right">
// //                             <p className="font-mono font-bold text-elba-primary text-base sm:text-lg">
// //                               ₦{commodity.price.amount.toLocaleString()}
// //                             </p>
// //                             <p className="text-[10px] text-gray-400">per {commodity.price.perUnit}</p>
// //                           </div>
// //                           <button className="btn-elba-primary text-xs sm:text-sm py-2 px-4 sm:px-5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
// //                             Source <ArrowRight className="w-3.5 h-3.5" />
// //                           </button>
// //                         </div> */}



// //                         {/* Price + CTA */}
// //                         <div className="flex flex-col items-end gap-2 flex-shrink-0">
// //                         <div className="text-right">
// //                             <p className="font-mono font-bold text-elba-primary text-base sm:text-lg">
// //                             ₦{commodity.price.amount.toLocaleString()}
// //                             </p>
// //                             <p className="text-[10px] text-gray-400">per {commodity.price.perUnit}</p>
// //                         </div>
// //                         <button className="btn-elba-primary text-xs sm:text-sm py-2 px-4 sm:px-5 flex items-center gap-1.5">
// //                             Buy Now <ArrowRight className="w-3.5 h-3.5" />
// //                         </button>
// //                         </div>





// //                       </div>

// //                       {/* Bottom Row: Quantity + Seller */}
// //                       <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
// //                         <div className="flex items-center gap-6">
// //                           {/* Quantity */}
// //                           <div>
// //                             <div className="flex items-baseline gap-1.5">
// //                               <span className="font-mono font-semibold text-sm text-elba-primary">
// //                                 {commodity.availableQuantity.toLocaleString()}
// //                               </span>
// //                               <span className="text-xs text-gray-500">{commodity.quantity.unit}</span>
// //                               <span className="text-xs text-gray-400">available</span>
// //                             </div>
// //                             <div className="flex items-center gap-2 mt-1">
// //                               <div className="w-20 sm:w-28 h-1 bg-gray-100 rounded-full overflow-hidden">
// //                                 <div
// //                                   className={`h-full rounded-full transition-all duration-500 ${getProgressColor(commodity.percentageRemaining)}`}
// //                                   style={{ width: `${commodity.percentageRemaining}%` }}
// //                                 />
// //                               </div>
// //                               <span className="text-[10px] text-gray-400">{commodity.percentageRemaining}%</span>
// //                             </div>
// //                           </div>

// //                           {/* Minimum Order */}
// //                           <div className="hidden sm:block text-xs text-gray-500">
// //                             Min: <span className="font-medium text-elba-primary">{commodity.minimumOrder} {commodity.quantity.unit}</span>
// //                           </div>
// //                         </div>

// //                         {/* Seller */}
// //                         <div className="flex items-center gap-3">
// //                           <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
// //                             <div className="w-5 h-5 rounded-full bg-elba-surface flex items-center justify-center">
// //                               <span className="text-[10px] font-bold text-elba-primary">
// //                                 {commodity.seller.name.charAt(0)}
// //                               </span>
// //                             </div>
// //                             <span className="font-medium text-elba-primary">{commodity.seller.name}</span>
// //                             {commodity.seller.verificationTier === 'trusted' && (
// //                               <ShieldCheck className="w-3 h-3 text-elba-tertiary" />
// //                             )}
// //                             {commodity.seller.verificationTier === 'verified' && (
// //                               <Shield className="w-3 h-3 text-elba-secondary" />
// //                             )}
// //                           </div>
// //                           <div className="flex items-center gap-1">
// //                             <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
// //                             <span className="text-xs font-medium">{commodity.seller.rating.toFixed(1)}</span>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             {/* Map View Placeholder */}
// //             {viewMode === 'map' && (
// //               <div className="bg-white border border-gray-200 rounded-2xl h-[600px] flex items-center justify-center">
// //                 <div className="text-center">
// //                   <Map className="w-16 h-16 mx-auto mb-4 text-gray-300" />
// //                   <p className="text-lg font-semibold text-gray-500">Map View</p>
// //                   <p className="text-sm text-gray-400">Coming soon</p>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Pagination */}
// //             {!loading && totalResults > 20 && (
// //               <div className="flex items-center justify-between mt-6 text-sm">
// //                 <p className="text-gray-500">
// //                   {(filters.page - 1) * filters.limit + 1}–{Math.min(filters.page * filters.limit, totalResults)} of {totalResults}
// //                 </p>
// //                 <div className="flex gap-2">
// //                   <button
// //                     onClick={() => updateFilter('page', String(filters.page - 1))}
// //                     disabled={filters.page === 1}
// //                     className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
// //                   >
// //                     Previous
// //                   </button>
// //                   <button
// //                     onClick={() => updateFilter('page', String(filters.page + 1))}
// //                     disabled={filters.page * filters.limit >= totalResults}
// //                     className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
// //                   >
// //                     Next
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Mobile Bottom Sheet Filters */}
// //       {mobileFilterOpen && (
// //         <div className="fixed inset-0 z-50 sm:hidden">
// //           <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
// //           <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto animate-slide-up">
// //             <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-3xl">
// //               <h3 className="font-semibold text-elba-primary text-lg">Filters</h3>
// //               <button onClick={() => setMobileFilterOpen(false)}>
// //                 <X className="w-5 h-5 text-gray-400" />
// //               </button>
// //             </div>
// //             <div className="p-5">
// //               {/* <FilterPanel
// //                 filters={filters}
// //                 updateFilter={updateFilter}
// //                 stats={stats}
// //                 onClose={() => setMobileFilterOpen(false)}
// //               /> */}

// //               <FilterPanel
// //                 filters={filters}
// //                 updateFilter={updateFilter}
// //                 stats={stats}
// //                 onClose={() => setMobileFilterOpen(false)}
// //                 onClearAll={clearAllFilters}
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



































































































// // 'use client';

// // import { useState } from 'react';
// // import { Search, SlidersHorizontal, X, Map, Package, TrendingUp, MapPin, ArrowRight } from 'lucide-react';
// // import FilterPanel from './FilterPanel';
// // import MarketStatsBar from './MarketStatsBar';

// // interface Commodity {
// //   _id: string;
// //   name: string;
// //   grade: string;
// //   quantity: { amount: number; unit: string };
// //   price: { amount: number; currency: string; perUnit: string; negotiable: boolean };
// //   location: { state: string; lga: string; community: string; locationType: string; warehouseId?: any };
// //   harvestDate: string;
// //   moistureContent: number;
// //   images: { url: string; publicId: string }[];
// //   seller: { sellerType: string; name: string; verificationTier: string; rating: number; totalTransactions: number };
// //   status: string;
// //   availableQuantity: number;
// //   displayPrice: string;
// //   percentageRemaining: number;
// //   minimumOrder: number;
// //   qualityCertification: { hasCertification: boolean; certifyingBody?: string };
// //   createdAt: string;
// // }

// // interface SupplyTableProps {
// //   commodities: Commodity[];
// //   loading: boolean;
// //   totalResults: number;
// //   stats: any;
// //   filters: any;
// //   updateFilter: (key: string, value: string | boolean) => void;
// //   clearAllFilters: () => void;
// //   showFilters: boolean;
// //   setShowFilters: (show: boolean) => void;
// //   viewMode: 'grid' | 'map';
// //   setViewMode: (mode: 'grid' | 'map') => void;
// // }

// // const locationTypeLabel: Record<string, string> = {
// //   warehouse: 'Warehouse',
// //   farm: 'Farm Gate',
// //   collection_center: 'Collection Center',
// //   market: 'Market',
// // };

// // const commodityPlaceholders: Record<string, string> = {
// //   Maize: '🌽',
// //   Rice: '🍚',
// //   Soybeans: '🫘',
// //   Millet: '🌾',
// //   Sorghum: '🌾',
// //   Cassava: '🥔',
// //   Yam: '🥔',
// //   Cocoa: '🫘',
// //   Groundnuts: '🥜',
// //   'Palm Oil': '🫗',
// //   Beans: '🫘',
// //   Sesame: '🌱',
// //   Ginger: '🫚',
// //   Garlic: '🧄',
// //   Onions: '🧅',
// //   Tomatoes: '🍅',
// //   Pepper: '🌶️',
// //   Cashew: '🥜',
// //   'Shea Butter': '🧈',
// //   Wheat: '🌾',
// // };

// // export default function SupplyTable({
// //   commodities,
// //   loading,
// //   totalResults,
// //   stats,
// //   filters,
// //   updateFilter,
// //   clearAllFilters,
// //   showFilters,
// //   setShowFilters,
// //   viewMode,
// //   setViewMode,
// // }: SupplyTableProps) {
// //   const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

// //   const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
// //     if (['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) return false;
// //     return value !== '' && value !== false;
// //   }).length;

// //   const getProgressColor = (percentage: number) => {
// //     if (percentage > 60) return 'bg-elba-secondary';
// //     if (percentage > 30) return 'bg-elba-tertiary';
// //     return 'bg-red-500';
// //   };

// //   const getImageUrl = (commodity: Commodity) => {
// //     if (commodity.images && commodity.images.length > 0) {
// //       return commodity.images[0].url;
// //     }
// //     return null;
// //   };

// //   const getPlaceholder = (name: string) => {
// //     return commodityPlaceholders[name] || '📦';
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50/50">
// //       <MarketStatsBar
// //         totalResults={totalResults}
// //         commodityCount={stats.byCommodity?.length || 0}
// //         stateCount={stats.byState?.length || 0}
// //       />

// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
// //         {/* Search + Toolbar */}
// //         <div className="flex flex-col sm:flex-row gap-3 mb-6">
// //           <div className="relative flex-1">
// //             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
// //             <input
// //               type="text"
// //               placeholder="Search maize, rice, soybeans..."
// //               value={filters.search}
// //               onChange={(e) => updateFilter('search', e.target.value)}
// //               className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary shadow-sm"
// //             />
// //           </div>

// //           <div className="flex gap-2">
// //             <button
// //               onClick={() => setShowFilters(!showFilters)}
// //               className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-medium border transition-all
// //                 ${showFilters || activeFilterCount > 0
// //                   ? 'border-elba-secondary text-elba-secondary bg-elba-secondary/5'
// //                   : 'border-gray-200 text-gray-600 bg-white shadow-sm hover:border-gray-300'
// //                 }`}
// //             >
// //               <SlidersHorizontal className="w-4 h-4" />
// //               <span className="hidden sm:inline">Filters</span>
// //               {activeFilterCount > 0 && (
// //                 <span className="bg-elba-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
// //                   {activeFilterCount}
// //                 </span>
// //               )}
// //             </button>

// //             <div className="hidden sm:flex bg-white rounded-2xl p-1 border border-gray-200 shadow-sm">
// //               <button
// //                 onClick={() => setViewMode('grid')}
// //                 className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
// //                   ${viewMode === 'grid' ? 'bg-elba-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
// //               >
// //                 Grid
// //               </button>
// //               <button
// //                 onClick={() => setViewMode('map')}
// //                 className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
// //                   ${viewMode === 'map' ? 'bg-elba-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
// //               >
// //                 Map
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Active Filters */}
// //         {activeFilterCount > 0 && (
// //           <div className="flex items-center gap-2 mb-5 flex-wrap">
// //             <span className="text-xs text-gray-500 font-medium">Filters:</span>
// //             {filters.name && (
// //               <span className="text-xs bg-white border border-gray-200 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
// //                 {filters.name}
// //                 <button onClick={() => updateFilter('name', '')}><X className="w-3 h-3" /></button>
// //               </span>
// //             )}
// //             {filters.state && (
// //               <span className="text-xs bg-white border border-gray-200 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
// //                 {filters.state}
// //                 <button onClick={() => updateFilter('state', '')}><X className="w-3 h-3" /></button>
// //               </span>
// //             )}
// //             {filters.grade && (
// //               <span className="text-xs bg-white border border-gray-200 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
// //                 Grade {filters.grade}
// //                 <button onClick={() => updateFilter('grade', '')}><X className="w-3 h-3" /></button>
// //               </span>
// //             )}
// //             {filters.locationType && (
// //               <span className="text-xs bg-white border border-gray-200 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm capitalize">
// //                 {filters.locationType.replace('_', ' ')}
// //                 <button onClick={() => updateFilter('locationType', '')}><X className="w-3 h-3" /></button>
// //               </span>
// //             )}
// //             {filters.verifiedOnly && (
// //               <span className="text-xs bg-white border border-gray-200 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
// //                 Verified only
// //                 <button onClick={() => updateFilter('verifiedOnly', false)}><X className="w-3 h-3" /></button>
// //               </span>
// //             )}
// //             <button
// //               onClick={clearAllFilters}
// //               className="text-xs text-red-500 hover:text-red-600 font-medium ml-1"
// //             >
// //               Clear all
// //             </button>
// //           </div>
// //         )}

// //         {/* Filter Panel */}
// //         {showFilters && (
// //           <div className="mb-6">
// //             <FilterPanel
// //               filters={filters}
// //               updateFilter={updateFilter}
// //               stats={stats}
// //               onClose={() => setShowFilters(false)}
// //             />
// //           </div>
// //         )}

// //         {/* Content */}
// //         {viewMode === 'map' ? (
// //           <div className="bg-white border border-gray-200 rounded-3xl h-[500px] sm:h-[650px] flex items-center justify-center shadow-sm">
// //             <div className="text-center p-6">
// //               <Map className="w-16 h-16 mx-auto mb-4 text-gray-300" />
// //               <p className="text-lg font-semibold text-gray-500">Map View</p>
// //               <p className="text-sm text-gray-400 mt-1">Interactive commodity map coming soon</p>
// //             </div>
// //           </div>
// //         ) : loading ? (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
// //             {[...Array(6)].map((_, i) => (
// //               <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
// //                 <div className="skeleton h-40 sm:h-48 rounded-xl mb-4" />
// //                 <div className="skeleton h-4 w-3/4 mb-2" />
// //                 <div className="skeleton h-3 w-1/2 mb-3" />
// //                 <div className="skeleton h-8 w-full rounded-lg" />
// //               </div>
// //             ))}
// //           </div>
// //         ) : commodities.length === 0 ? (
// //           <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
// //             <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
// //             <p className="text-lg font-semibold text-gray-500">No commodities found</p>
// //             <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
// //           </div>
// //         ) : (
// //           <>
// //             {/* Product Grid */}
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
// //               {commodities.map((commodity) => {
// //                 const imageUrl = getImageUrl(commodity);
// //                 const isExpanded = expandedMobile === commodity._id;

// //                 return (
// //                   <div
// //                     key={commodity._id}
// //                     className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden group"
// //                   >
// //                     {/* Image */}
// //                     <div className="relative h-40 sm:h-48 bg-elba-surface overflow-hidden">
// //                       {imageUrl ? (
// //                         <img
// //                           src={imageUrl}
// //                           alt={commodity.name}
// //                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
// //                         />
// //                       ) : (
// //                         <div className="w-full h-full flex items-center justify-center text-5xl sm:text-6xl">
// //                           {getPlaceholder(commodity.name)}
// //                         </div>
// //                       )}
// //                       {/* Badges on image */}
// //                       <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
// //                         <span className={`grade-badge grade-${commodity.grade.toLowerCase()} shadow-sm`}>
// //                           Grade {commodity.grade}
// //                         </span>
// //                         {commodity.qualityCertification?.hasCertification && (
// //                           <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-medium shadow-sm">
// //                             Certified
// //                           </span>
// //                         )}
// //                       </div>
// //                       {commodity.price.negotiable && (
// //                         <div className="absolute top-3 right-3">
// //                           <span className="text-[10px] bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-gray-600 font-medium shadow-sm">
// //                             Price negotiable
// //                           </span>
// //                         </div>
// //                       )}
// //                       {/* Location type badge */}
// //                       <div className="absolute bottom-3 left-3">
// //                         <span className="text-[10px] bg-elba-primary/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
// //                           <MapPin className="w-3 h-3" />
// //                           {locationTypeLabel[commodity.location.locationType] || commodity.location.locationType}
// //                         </span>
// //                       </div>
// //                     </div>

// //                     {/* Content */}
// //                     <div className="p-4 sm:p-5">
// //                       {/* Commodity name + seller */}
// //                       <div className="flex items-start justify-between mb-1">
// //                         <h3 className="font-semibold text-elba-primary text-base sm:text-lg">
// //                           {commodity.name}
// //                         </h3>
// //                         <p className="font-mono font-bold text-elba-primary text-lg sm:text-xl">
// //                           ₦{commodity.price.amount.toLocaleString()}
// //                         </p>
// //                       </div>
// //                       <p className="text-xs text-gray-500 mb-3">
// //                         per {commodity.price.perUnit} · {commodity.seller.name}
// //                       </p>

// //                       {/* Quantity + Progress */}
// //                       <div className="mb-4">
// //                         <div className="flex items-center justify-between mb-1">
// //                           <span className="text-xs text-gray-500">
// //                             Available: <span className="font-semibold text-elba-primary">{commodity.availableQuantity.toLocaleString()} {commodity.quantity.unit}</span>
// //                           </span>
// //                           <span className="text-xs text-gray-400">
// //                             {commodity.percentageRemaining}% remaining
// //                           </span>
// //                         </div>
// //                         <div className="supply-progress">
// //                           <div
// //                             className={`supply-progress-fill ${getProgressColor(commodity.percentageRemaining)}`}
// //                             style={{ width: `${commodity.percentageRemaining}%` }}
// //                           />
// //                         </div>
// //                       </div>

// //                       {/* Details row */}
// //                       <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 flex-wrap">
// //                         <span className="flex items-center gap-1">
// //                           <MapPin className="w-3 h-3" />
// //                           {commodity.location.state}
// //                         </span>
// //                         {commodity.moistureContent && (
// //                           <span>Moisture: {commodity.moistureContent.toFixed(1)}%</span>
// //                         )}
// //                         <span>Min: {commodity.minimumOrder} {commodity.quantity.unit}</span>
// //                       </div>

// //                       {/* Always visible CTA */}
// //                       <button className="btn-elba-primary w-full flex items-center justify-center gap-2 py-3 text-sm sm:text-base">
// //                         Request Supply
// //                         <ArrowRight className="w-4 h-4" />
// //                       </button>

// //                       {/* Seller info */}
// //                       <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
// //                         <div className="flex items-center gap-2 min-w-0">
// //                           <div className="w-7 h-7 rounded-full bg-elba-surface flex items-center justify-center flex-shrink-0">
// //                             <span className="text-xs font-bold text-elba-primary">
// //                               {commodity.seller.name.charAt(0)}
// //                             </span>
// //                           </div>
// //                           <div className="min-w-0">
// //                             <p className="text-xs font-medium text-elba-primary truncate">{commodity.seller.name}</p>
// //                             <p className="text-[10px] text-gray-500">
// //                               {commodity.seller.verificationTier === 'trusted' ? '✓ Trusted' :
// //                                commodity.seller.verificationTier === 'verified' ? '✓ Verified' : 'Registered'} ·{' '}
// //                               {commodity.seller.totalTransactions} trades
// //                             </p>
// //                           </div>
// //                         </div>
// //                         <div className="flex items-center gap-1 flex-shrink-0">
// //                           <span className="text-yellow-500 text-sm">★</span>
// //                           <span className="text-xs font-medium">{commodity.seller.rating.toFixed(1)}</span>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>

// //             {/* Pagination */}
// //             {totalResults > 20 && (
// //               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-sm">
// //                 <p className="text-gray-500">
// //                   Showing {(filters.page - 1) * filters.limit + 1}–
// //                   {Math.min(filters.page * filters.limit, totalResults)} of {totalResults} results
// //                 </p>
// //                 <div className="flex gap-2">
// //                   <button
// //                     onClick={() => updateFilter('page', String(filters.page - 1))}
// //                     disabled={filters.page === 1}
// //                     className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm font-medium"
// //                   >
// //                     Previous
// //                   </button>
// //                   <button
// //                     onClick={() => updateFilter('page', String(filters.page + 1))}
// //                     disabled={filters.page * filters.limit >= totalResults}
// //                     className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm font-medium"
// //                   >
// //                     Next
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

































































// // 'use client';

// // import { Search, SlidersHorizontal, X, TrendingDown, TrendingUp, Package, Map } from 'lucide-react';
// // import SupplyRowMobile from './SupplyRowMobile';
// // import FilterPanel from './FilterPanel';
// // import MarketStatsBar from './MarketStatsBar';

// // interface Commodity {
// //   _id: string;
// //   name: string;
// //   grade: string;
// //   quantity: { amount: number; unit: string };
// //   price: { amount: number; currency: string; perUnit: string; negotiable: boolean };
// //   location: { state: string; lga: string; community: string; locationType: string; warehouseId?: any };
// //   harvestDate: string;
// //   moistureContent: number;
// //   seller: { sellerType: string; name: string; verificationTier: string; rating: number; totalTransactions: number };
// //   status: string;
// //   availableQuantity: number;
// //   displayPrice: string;
// //   percentageRemaining: number;
// //   minimumOrder: number;
// //   createdAt: string;
// // }

// // interface SupplyTableProps {
// //   commodities: Commodity[];
// //   loading: boolean;
// //   totalResults: number;
// //   stats: any;
// //   filters: any;
// //   updateFilter: (key: string, value: string | boolean) => void;
// //   clearAllFilters: () => void;
// //   expandedId: string | null;
// //   toggleExpand: (id: string) => void;
// //   showFilters: boolean;
// //   setShowFilters: (show: boolean) => void;
// //   viewMode: 'table' | 'map';
// //   setViewMode: (mode: 'table' | 'map') => void;
// // }

// // export default function SupplyTable({
// //   commodities,
// //   loading,
// //   totalResults,
// //   stats,
// //   filters,
// //   updateFilter,
// //   clearAllFilters,
// //   expandedId,
// //   toggleExpand,
// //   showFilters,
// //   setShowFilters,
// //   viewMode,
// //   setViewMode,
// // }: SupplyTableProps) {
// //   const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
// //     if (['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) return false;
// //     return value !== '' && value !== false;
// //   }).length;

// //   return (
// //     <div className="min-h-screen bg-white">
// //       {/* Stats Bar */}
// //       <MarketStatsBar
// //         totalResults={totalResults}
// //         commodityCount={stats.byCommodity?.length || 0}
// //         stateCount={stats.byState?.length || 0}
// //       />

// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
// //         {/* Search + Filter Bar */}
// //         <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
// //           {/* Search */}
// //           <div className="relative flex-1">
// //             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
// //             <input
// //               type="text"
// //               placeholder="Search commodities, locations, sellers..."
// //               value={filters.search}
// //               onChange={(e) => updateFilter('search', e.target.value)}
// //               className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-elba-surface-dark rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary"
// //             />
// //           </div>

// //           {/* Action Buttons */}
// //           <div className="flex gap-2">
// //             <button
// //               onClick={() => setShowFilters(!showFilters)}
// //               className={`flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl text-sm font-medium border transition-all flex-shrink-0
// //                 ${showFilters || activeFilterCount > 0
// //                   ? 'border-elba-secondary text-elba-secondary bg-elba-secondary/5'
// //                   : 'border-elba-surface-dark text-gray-600'
// //                 }`}
// //             >
// //               <SlidersHorizontal className="w-4 h-4" />
// //               <span className="hidden sm:inline">Filters</span>
// //               {activeFilterCount > 0 && (
// //                 <span className="bg-elba-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
// //                   {activeFilterCount}
// //                 </span>
// //               )}
// //             </button>

// //             {/* View toggle - desktop only */}
// //             <div className="hidden sm:flex bg-elba-surface rounded-xl p-0.5 border border-elba-surface-dark">
// //               <button
// //                 onClick={() => setViewMode('table')}
// //                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
// //                   ${viewMode === 'table' ? 'bg-white text-elba-primary shadow-sm' : 'text-gray-500'}`}
// //               >
// //                 List
// //               </button>
// //               <button
// //                 onClick={() => setViewMode('map')}
// //                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
// //                   ${viewMode === 'map' ? 'bg-white text-elba-primary shadow-sm' : 'text-gray-500'}`}
// //               >
// //                 Map
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Active filters tags */}
// //         {activeFilterCount > 0 && (
// //           <div className="flex items-center gap-2 mb-4 flex-wrap">
// //             <span className="text-xs text-gray-500">Active filters:</span>
// //             {filters.name && (
// //               <span className="text-xs bg-elba-surface px-2 py-1 rounded-full flex items-center gap-1">
// //                 {filters.name}
// //                 <button onClick={() => updateFilter('name', '')}>
// //                   <X className="w-3 h-3" />
// //                 </button>
// //               </span>
// //             )}
// //             {filters.state && (
// //               <span className="text-xs bg-elba-surface px-2 py-1 rounded-full flex items-center gap-1">
// //                 {filters.state}
// //                 <button onClick={() => updateFilter('state', '')}>
// //                   <X className="w-3 h-3" />
// //                 </button>
// //               </span>
// //             )}
// //             {filters.grade && (
// //               <span className="text-xs bg-elba-surface px-2 py-1 rounded-full flex items-center gap-1">
// //                 Grade {filters.grade}
// //                 <button onClick={() => updateFilter('grade', '')}>
// //                   <X className="w-3 h-3" />
// //                 </button>
// //               </span>
// //             )}
// //             {filters.verifiedOnly && (
// //               <span className="text-xs bg-elba-surface px-2 py-1 rounded-full flex items-center gap-1">
// //                 Verified only
// //                 <button onClick={() => updateFilter('verifiedOnly', false)}>
// //                   <X className="w-3 h-3" />
// //                 </button>
// //               </span>
// //             )}
// //             <button
// //               onClick={clearAllFilters}
// //               className="text-xs text-red-500 hover:text-red-600 ml-2"
// //             >
// //               Clear all
// //             </button>
// //           </div>
// //         )}

// //         {/* Filter Panel */}
// //         {showFilters && (
// //           <div className="mb-4 sm:mb-6">
// //             <FilterPanel
// //               filters={filters}
// //               updateFilter={updateFilter}
// //               stats={stats}
// //               onClose={() => setShowFilters(false)}
// //             />
// //           </div>
// //         )}

// //         {/* Content */}
// //         {viewMode === 'map' ? (
// //           <div className="bg-elba-surface border border-elba-surface-dark rounded-2xl h-[400px] sm:h-[600px] flex items-center justify-center text-gray-400">
// //             <div className="text-center p-6">
// //               <Map className="w-12 h-12 mx-auto mb-3" />
// //               <p className="text-sm font-medium">Map View</p>
// //               <p className="text-xs mt-1">Coming soon</p>
// //             </div>
// //           </div>
// //         ) : loading ? (
// //           <div className="space-y-3">
// //             {[...Array(5)].map((_, i) => (
// //               <div key={i} className="skeleton h-24 rounded-xl" />
// //             ))}
// //           </div>
// //         ) : commodities.length === 0 ? (
// //           <div className="text-center py-16">
// //             <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
// //             <p className="text-gray-500 font-medium">No commodities found</p>
// //             <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
// //           </div>
// //         ) : (
// //           <>
// //             {/* Desktop Table */}
// //             <div className="hidden sm:block bg-white border border-elba-surface-dark rounded-2xl overflow-hidden">
// //               <div className="grid grid-cols-[1fr_80px_120px_180px_140px_100px_40px] gap-4 px-6 py-3.5 bg-elba-surface border-b border-elba-surface-dark text-xs font-semibold text-gray-500 uppercase tracking-wider">
// //                 <div>Commodity</div>
// //                 <div>Grade</div>
// //                 <div>Available</div>
// //                 <div>Location</div>
// //                 <div>Price</div>
// //                 <div>Seller</div>
// //                 <div></div>
// //               </div>
// //               <div className="divide-y divide-elba-surface-dark">
// //                 {commodities.map((commodity) => (
// //                   <div key={commodity._id}>
// //                     {/* Desktop row - reuse the existing CommodityRow but I'll keep it simple */}
// //                     <div
// //                       onClick={() => toggleExpand(commodity._id)}
// //                       className={`supply-row ${expandedId === commodity._id ? 'supply-row-expanded' : ''}`}
// //                     >
// //                       <div className="grid grid-cols-[1fr_80px_120px_180px_140px_100px_40px] gap-4 px-6 py-4 items-center">
// //                         <div>
// //                           <p className="font-semibold text-elba-primary text-sm">{commodity.name}</p>
// //                           <p className="text-xs text-gray-500 mt-1">
// //                             Min. Order: {commodity.minimumOrder} {commodity.quantity.unit}
// //                           </p>
// //                         </div>
// //                         <div>
// //                           <span className={`grade-badge grade-${commodity.grade.toLowerCase()}`}>
// //                             Grade {commodity.grade}
// //                           </span>
// //                         </div>
// //                         <div>
// //                           <p className="font-mono text-sm font-semibold text-elba-primary">
// //                             {commodity.availableQuantity.toLocaleString()}
// //                           </p>
// //                           <p className="text-xs text-gray-500">{commodity.quantity.unit}</p>
// //                           <div className="supply-progress mt-1">
// //                             <div
// //                               className={`supply-progress-fill ${commodity.percentageRemaining > 60 ? 'bg-elba-secondary' : commodity.percentageRemaining > 30 ? 'bg-elba-tertiary' : 'bg-red-500'}`}
// //                               style={{ width: `${commodity.percentageRemaining}%` }}
// //                             />
// //                           </div>
// //                         </div>
// //                         <div>
// //                           <p className="text-sm font-medium text-elba-primary">{commodity.location.state}</p>
// //                           <p className="text-xs text-gray-500 capitalize">{commodity.location.locationType.replace('_', ' ')}</p>
// //                         </div>
// //                         <div>
// //                           <p className="font-mono text-sm font-bold text-elba-primary">
// //                             ₦{commodity.price.amount.toLocaleString()}
// //                           </p>
// //                           <p className="text-xs text-gray-500">per {commodity.price.perUnit}</p>
// //                         </div>
// //                         <div>
// //                           <p className="text-sm font-medium text-elba-primary truncate">{commodity.seller.name}</p>
// //                           <p className="text-xs text-gray-500 capitalize">{commodity.seller.sellerType}</p>
// //                         </div>
// //                         <div className="text-right text-gray-400 text-xs">
// //                           {expandedId === commodity._id ? '▲' : '▼'}
// //                         </div>
// //                       </div>
// //                     </div>
// //                     {/* Expanded desktop */}
// //                     {expandedId === commodity._id && (
// //                       <div className="px-6 py-5 bg-elba-surface border-t border-elba-surface-dark">
// //                         <div className="grid grid-cols-4 gap-4 text-sm">
// //                           <div>
// //                             <p className="text-xs text-gray-500">Total Supply</p>
// //                             <p className="font-medium">{commodity.quantity.amount.toLocaleString()} {commodity.quantity.unit}</p>
// //                           </div>
// //                           <div>
// //                             <p className="text-xs text-gray-500">Min. Order</p>
// //                             <p className="font-medium">{commodity.minimumOrder} {commodity.quantity.unit}</p>
// //                           </div>
// //                           {commodity.moistureContent && (
// //                             <div>
// //                               <p className="text-xs text-gray-500">Moisture</p>
// //                               <p className="font-medium">{commodity.moistureContent.toFixed(1)}%</p>
// //                             </div>
// //                           )}
// //                           <div>
// //                             <p className="text-xs text-gray-500">Listed</p>
// //                             <p className="font-medium">{new Date(commodity.createdAt).toLocaleDateString()}</p>
// //                           </div>
// //                         </div>
// //                         <button className="btn-elba-primary text-sm mt-4">
// //                           Request Supply
// //                         </button>
// //                       </div>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Mobile Cards */}
// //             <div className="sm:hidden">
// //               {commodities.map((commodity) => (
// //                 <SupplyRowMobile
// //                   key={commodity._id}
// //                   commodity={commodity}
// //                   isExpanded={expandedId === commodity._id}
// //                   onToggle={() => toggleExpand(commodity._id)}
// //                 />
// //               ))}
// //             </div>
// //           </>
// //         )}

// //         {/* Pagination */}
// //         {!loading && totalResults > 20 && (
// //           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm">
// //             <p className="text-gray-500">
// //               Showing {(filters.page - 1) * filters.limit + 1}–
// //               {Math.min(filters.page * filters.limit, totalResults)} of {totalResults}
// //             </p>
// //             <div className="flex gap-2">
// //               <button
// //                 onClick={() => updateFilter('page', String(filters.page - 1))}
// //                 disabled={filters.page === 1}
// //                 className="px-4 py-2 border border-elba-surface-dark rounded-lg hover:bg-elba-surface disabled:opacity-50"
// //               >
// //                 Previous
// //               </button>
// //               <button
// //                 onClick={() => updateFilter('page', String(filters.page + 1))}
// //                 disabled={filters.page * filters.limit >= totalResults}
// //                 className="px-4 py-2 border border-elba-surface-dark rounded-lg hover:bg-elba-surface disabled:opacity-50"
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }