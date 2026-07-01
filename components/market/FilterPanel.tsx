'use client';

import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { API_URL } from '@/lib/api';

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara', 'FCT',
];

interface CommodityType {
  _id: string;
  name: string;
  emoji: string;
  category: string;
  slug: string;
}

interface FilterPanelProps {
  filters: any;
  updateFilter: (key: string, value: string | boolean) => void;
  stats: any;
  onClearAll?: () => void;
  isSidebar?: boolean;
}

export default function FilterPanel({ filters, updateFilter, onClearAll, isSidebar }: FilterPanelProps) {
  const [commodityTypes, setCommodityTypes] = useState<CommodityType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetch('${API_URL}/commodity-types')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCommodityTypes(data.data);
      })
      .catch(console.error);
  }, []);

  // Everything dynamic from backend
  const categories = [...new Set(commodityTypes.map(t => t.category))].sort();
  const filteredTypes = selectedCategory
    ? commodityTypes.filter(t => t.category === selectedCategory)
    : commodityTypes;
  const selectedType = commodityTypes.find(t => t._id === filters.commodityType);

  const formatCategory = (cat: string) => {
    return cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const selectClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all appearance-none cursor-pointer hover:border-gray-300";
  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all hover:border-gray-300";

  return (
    <div className={`flex flex-col ${isSidebar ? 'max-h-[calc(100vh-12rem)]' : ''}`}>
      <div className={`${isSidebar ? 'overflow-y-auto pr-4 space-y-5 custom-scrollbar' : 'space-y-5'}`}>
        {isSidebar && (
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-elba-primary text-lg">Filters</h3>
            {onClearAll && (
              <button onClick={onClearAll} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors font-medium">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        )}

        {/* Commodity — fully dynamic */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Commodity</label>

          {/* Category dropdown */}
          <div className="relative mb-2">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                updateFilter('commodityType', '');
              }}
              className={selectClass}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{formatCategory(cat)}</option>
              ))}
            </select>
            <ChevronDownIcon />
          </div>

          {/* Commodity dropdown */}
          <div className="relative">
            <select
              value={filters.commodityType || ''}
              onChange={(e) => updateFilter('commodityType', e.target.value)}
              className={selectClass}
            >
              <option value="">
                {selectedCategory ? `All in ${formatCategory(selectedCategory)}` : 'All Commodities'}
              </option>
              {filteredTypes.map(type => (
                <option key={type._id} value={type._id}>{type.emoji} {type.name}</option>
              ))}
            </select>
            <ChevronDownIcon />
          </div>

          {selectedType && (
            <div className="mt-2 flex items-center gap-2 text-xs bg-elba-secondary/5 text-elba-secondary px-3 py-1.5 rounded-lg">
              <span>{selectedType.emoji}</span>
              <span className="font-medium">{selectedType.name}</span>
              <button onClick={() => updateFilter('commodityType', '')} className="ml-auto hover:text-red-500">✕</button>
            </div>
          )}
        </div>

        {/* Grade */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Grade</label>
          <div className="relative">
            <select value={filters.grade} onChange={(e) => updateFilter('grade', e.target.value)} className={selectClass}>
              <option value="">All Grades</option>
              <option value="A">Grade A — Premium</option>
              <option value="B">Grade B — Standard</option>
              <option value="C">Grade C — Economy</option>
            </select>
            <ChevronDownIcon />
          </div>
        </div>

        {/* State */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">State</label>
          <div className="relative">
            <select value={filters.state} onChange={(e) => updateFilter('state', e.target.value)} className={selectClass}>
              <option value="">All States</option>
              {nigerianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <ChevronDownIcon />
          </div>
        </div>

        {/* Source Type */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Source Type</label>
          <div className="relative">
            <select value={filters.locationType} onChange={(e) => updateFilter('locationType', e.target.value)} className={selectClass}>
              <option value="">All Sources</option>
              <option value="warehouse">🏭 Warehouse</option>
              <option value="farm">🚜 Farm Gate</option>
              <option value="collection_center">📦 Collection Center</option>
              <option value="market">🏪 Market</option>
            </select>
            <ChevronDownIcon />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Price Range (₦)</label>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className={inputClass} />
            <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Quantity</label>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Min" value={filters.minQuantity} onChange={(e) => updateFilter('minQuantity', e.target.value)} className={inputClass} />
            <input type="number" placeholder="Max" value={filters.maxQuantity} onChange={(e) => updateFilter('maxQuantity', e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Harvest Freshness */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Harvest Freshness</label>
          <div className="relative">
            <select value={filters.harvestDays} onChange={(e) => updateFilter('harvestDays', e.target.value)} className={selectClass}>
              <option value="">Any Time</option>
              <option value="30">Last 30 Days</option>
              <option value="60">Last 60 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
            <ChevronDownIcon />
          </div>
        </div>

        {/* Verified Toggle */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium text-elba-primary">Verified Sellers Only</span>
          <button
            onClick={() => updateFilter('verifiedOnly', !filters.verifiedOnly)}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${filters.verifiedOnly ? 'bg-elba-secondary' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${filters.verifiedOnly ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}