import { TrendingUp, Package, MapPin } from 'lucide-react';

interface MarketStatsBarProps {
  totalResults: number;
  commodityCount: number;
  stateCount: number;
}

export default function MarketStatsBar({ totalResults, commodityCount, stateCount }: MarketStatsBarProps) {
  return (
    <div className="bg-elba-primary pt-16 lg:pt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto text-sm">
          <div className="flex items-center gap-2 text-white/70 flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-elba-secondary-light" />
            <span className="text-white/50 hidden sm:inline">Active Listings</span>
            <span className="font-bold text-white">{totalResults.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 flex-shrink-0">
            <Package className="w-4 h-4 text-elba-tertiary-light" />
            <span className="text-white/50 hidden sm:inline">Commodities</span>
            <span className="font-bold text-white">{commodityCount}</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 flex-shrink-0">
            <MapPin className="w-4 h-4 text-elba-secondary-light" />
            <span className="text-white/50 hidden sm:inline">States</span>
            <span className="font-bold text-white">{stateCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


































// import { TrendingUp, Package, MapPin } from 'lucide-react';

// interface MarketStatsBarProps {
//   totalResults: number;
//   commodityCount: number;
//   stateCount: number;
// }

// export default function MarketStatsBar({ totalResults, commodityCount, stateCount }: MarketStatsBarProps) {
//   return (
//     <div className="bg-elba-primary">
//       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
//         <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto text-sm">
//           <div className="flex items-center gap-2 text-white/70 flex-shrink-0">
//             <TrendingUp className="w-4 h-4 text-elba-secondary-light" />
//             <span className="text-white/50 hidden sm:inline">Active Listings</span>
//             <span className="font-bold text-white">{totalResults.toLocaleString()}</span>
//           </div>
//           <div className="flex items-center gap-2 text-white/70 flex-shrink-0">
//             <Package className="w-4 h-4 text-elba-tertiary-light" />
//             <span className="text-white/50 hidden sm:inline">Commodities</span>
//             <span className="font-bold text-white">{commodityCount}</span>
//           </div>
//           <div className="flex items-center gap-2 text-white/70 flex-shrink-0">
//             <MapPin className="w-4 h-4 text-elba-secondary-light" />
//             <span className="text-white/50 hidden sm:inline">States</span>
//             <span className="font-bold text-white">{stateCount}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }














































// import { TrendingUp, Package, MapPin } from 'lucide-react';

// interface MarketStatsBarProps {
//   totalResults: number;
//   commodityCount: number;
//   stateCount: number;
// }

// export default function MarketStatsBar({ totalResults, commodityCount, stateCount }: MarketStatsBarProps) {
//   return (
//     <div className="bg-elba-surface border-b border-elba-surface-dark">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-4 sm:gap-8 overflow-x-auto text-sm whitespace-nowrap">
//         <div className="flex items-center gap-2">
//           <TrendingUp className="w-4 h-4 text-elba-secondary flex-shrink-0" />
//           <span className="text-gray-500 hidden sm:inline">Active Listings</span>
//           <span className="font-semibold text-elba-primary">{totalResults}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <Package className="w-4 h-4 text-elba-tertiary flex-shrink-0" />
//           <span className="text-gray-500 hidden sm:inline">Commodities</span>
//           <span className="font-semibold text-elba-primary">{commodityCount}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <MapPin className="w-4 h-4 text-elba-secondary flex-shrink-0" />
//           <span className="text-gray-500 hidden sm:inline">States</span>
//           <span className="font-semibold text-elba-primary">{stateCount}</span>
//         </div>
//       </div>
//     </div>
//   );
// }