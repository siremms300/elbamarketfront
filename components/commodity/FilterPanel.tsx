'use client';

import { X } from 'lucide-react';

const commodityNames = [
  'Maize', 'Rice', 'Soybeans', 'Millet', 'Sorghum',
  'Cassava', 'Yam', 'Cocoa', 'Groundnuts', 'Palm Oil',
  'Beans', 'Sesame', 'Ginger', 'Garlic', 'Onions',
];

const nigerianStates = [
  'Kaduna', 'Kano', 'Oyo', 'Ogun', 'Benue', 'Niger', 'Kebbi',
  'Plateau', 'Taraba', 'Kogi', 'Kwara', 'Katsina', 'Zamfara',
  'Bauchi', 'Gombe', 'Adamawa', 'Borno', 'Yobe', 'Jigawa',
  'Sokoto', 'Nasarawa', 'Ebonyi', 'Enugu', 'Lagos',
];

interface FilterPanelProps {
  filters: any;
  updateFilter: (key: string, value: string | boolean) => void;
  stats: any;
  onClose: () => void;
}

export default function FilterPanel({ filters, updateFilter, stats, onClose }: FilterPanelProps) {
  return (
    <div className="bg-white border border-elba-surface-dark rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-elba-primary">Filter Supply</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Commodity Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Commodity
          </label>
          <select
            value={filters.name}
            onChange={(e) => updateFilter('name', e.target.value)}
            className="w-full border border-elba-surface-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
          >
            <option value="">All Commodities</option>
            {commodityNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Grade */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Grade
          </label>
          <select
            value={filters.grade}
            onChange={(e) => updateFilter('grade', e.target.value)}
            className="w-full border border-elba-surface-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
          >
            <option value="">All Grades</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            State
          </label>
          <select
            value={filters.state}
            onChange={(e) => updateFilter('state', e.target.value)}
            className="w-full border border-elba-surface-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
          >
            <option value="">All States</option>
            {nigerianStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* Location Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Source Type
          </label>
          <select
            value={filters.locationType}
            onChange={(e) => updateFilter('locationType', e.target.value)}
            className="w-full border border-elba-surface-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
          >
            <option value="">All Sources</option>
            <option value="warehouse">Warehouse</option>
            <option value="farm">Farm Gate</option>
            <option value="collection_center">Collection Center</option>
            <option value="market">Market</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-4">
        {/* Price Range */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Min Price (₦)
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="w-full border border-elba-surface-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Max Price (₦)
          </label>
          <input
            type="number"
            placeholder="Any"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-full border border-elba-surface-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
          />
        </div>

        {/* Quantity Range */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Min Quantity
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.minQuantity}
            onChange={(e) => updateFilter('minQuantity', e.target.value)}
            className="w-full border border-elba-surface-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Max Quantity
          </label>
          <input
            type="number"
            placeholder="Any"
            value={filters.maxQuantity}
            onChange={(e) => updateFilter('maxQuantity', e.target.value)}
            className="w-full border border-elba-surface-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-elba-surface-dark">
        {/* Harvest Freshness */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Harvest Freshness
          </label>
          <select
            value={filters.harvestDays}
            onChange={(e) => updateFilter('harvestDays', e.target.value)}
            className="w-full border border-elba-surface-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
          >
            <option value="">Any Time</option>
            <option value="30">Last 30 Days</option>
            <option value="60">Last 60 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>

        {/* Verified Only Toggle */}
        <div className="flex items-center gap-3 pt-5">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => updateFilter('verifiedOnly', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-elba-secondary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-elba-secondary"></div>
          </label>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Verified Sellers Only
          </span>
        </div>
      </div>
    </div>
  );
}