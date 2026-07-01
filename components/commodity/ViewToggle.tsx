'use client';

import { List, Map } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'table' | 'map';
  onChange: (mode: 'table' | 'map') => void;
}

export default function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="flex bg-elba-surface rounded-lg p-0.5 border border-elba-surface-dark">
      <button
        onClick={() => onChange('table')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${viewMode === 'table'
            ? 'bg-white text-elba-primary shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
          }`}
      >
        <List className="w-4 h-4" />
        Supply Table
      </button>
      <button
        onClick={() => onChange('map')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${viewMode === 'map'
            ? 'bg-white text-elba-primary shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
          }`}
      >
        <Map className="w-4 h-4" />
        Map View
      </button>
    </div>
  );
}