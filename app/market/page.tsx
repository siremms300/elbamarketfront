// client/app/market/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import SupplyTable from '@/components/market/SupplyTable';
import { API_URL } from '@/lib/api';

export default function MarketPage() {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [totalResults, setTotalResults] = useState(0);
  const [stats, setStats] = useState({ byCommodity: [], byState: [], byLocationType: [] });

//   const [filters, setFilters] = useState({
//     name: '',
//     grade: '',
//     state: '',
//     locationType: '',
//     minPrice: '',
//     maxPrice: '',
//     minQuantity: '',
//     maxQuantity: '',
//     verifiedOnly: false,
//     harvestDays: '',
//     sortBy: 'date',
//     sortOrder: 'desc',
//     page: 1,
//     limit: 20,
//     search: '',
//   });


const [filters, setFilters] = useState({
  commodityType: '',  // changed from 'name'
  grade: '',
  state: '',
  locationType: '',
  minPrice: '',
  maxPrice: '',
  minQuantity: '',
  maxQuantity: '',
  verifiedOnly: false,
  harvestDays: '',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  limit: 20,
  search: '',
});

 

  const fetchCommodities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== false) params.append(key, String(value));
      });

      const res = await fetch(`${API_URL}/commodities?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCommodities(data.data);
        setTotalResults(data.total);
      }
    } catch (error) {
      console.error('Error fetching commodities:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = async () => {
    try {
      const res = await fetch('${API_URL}/commodities/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchCommodities();
    fetchStats();
  }, [fetchCommodities]);

  const updateFilter = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

//   const clearAllFilters = () => {
//     setFilters({
//       name: '', grade: '', state: '', locationType: '',
//       minPrice: '', maxPrice: '', minQuantity: '', maxQuantity: '',
//       verifiedOnly: false, harvestDays: '',
//       sortBy: 'date', sortOrder: 'desc', page: 1, limit: 20, search: '',
//     });
//   };





const clearAllFilters = () => {
  setFilters({
    commodityType: '', grade: '', state: '', locationType: '',
    minPrice: '', maxPrice: '', minQuantity: '', maxQuantity: '',
    verifiedOnly: false, harvestDays: '',
    sortBy: 'date', sortOrder: 'desc', page: 1, limit: 20, search: '',
  });
};






  return (
    <SupplyTable
      commodities={commodities}
      loading={loading}
      totalResults={totalResults}
      stats={stats}
      filters={filters}
      updateFilter={updateFilter}
      clearAllFilters={clearAllFilters}
      viewMode={viewMode}
      setViewMode={setViewMode}
    />
  );
}












































































// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import SupplyTable from '@/components/market/SupplyTable';

// export default function MarketPage() {
//   const [commodities, setCommodities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<'table' | 'map'>('table');  // Changed from 'grid' to 'table'
//   const [showFilters, setShowFilters] = useState(false);
//   const [totalResults, setTotalResults] = useState(0);
//   const [stats, setStats] = useState({ byCommodity: [], byState: [], byLocationType: [] });

//   const [filters, setFilters] = useState({
//     name: '',
//     grade: '',
//     state: '',
//     locationType: '',
//     minPrice: '',
//     maxPrice: '',
//     minQuantity: '',
//     maxQuantity: '',
//     verifiedOnly: false,
//     harvestDays: '',
//     sortBy: 'date',
//     sortOrder: 'desc',
//     page: 1,
//     limit: 20,
//     search: '',
//   });

//   const fetchCommodities = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value !== '' && value !== false) params.append(key, String(value));
//       });

//       const res = await fetch(`${API_URL}/commodities?${params.toString()}`);
//       const data = await res.json();
//       if (data.success) {
//         setCommodities(data.data);
//         setTotalResults(data.total);
//       }
//     } catch (error) {
//       console.error('Error fetching commodities:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters]);

//   const fetchStats = async () => {
//     try {
//       const res = await fetch('${API_URL}/commodities/stats');
//       const data = await res.json();
//       if (data.success) setStats(data.data);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCommodities();
//     fetchStats();
//   }, [fetchCommodities]);

//   const updateFilter = (key: string, value: string | boolean) => {
//     setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
//   };

//   const clearAllFilters = () => {
//     setFilters({
//       name: '', grade: '', state: '', locationType: '',
//       minPrice: '', maxPrice: '', minQuantity: '', maxQuantity: '',
//       verifiedOnly: false, harvestDays: '',
//       sortBy: 'date', sortOrder: 'desc', page: 1, limit: 20, search: '',
//     });
//   };

//   return (
//     <SupplyTable
//       commodities={commodities}
//       loading={loading}
//       totalResults={totalResults}
//       stats={stats}
//       filters={filters}
//       updateFilter={updateFilter}
//       clearAllFilters={clearAllFilters}
//       showFilters={showFilters}
//       setShowFilters={setShowFilters}
//       viewMode={viewMode}
//       setViewMode={setViewMode}
//     />
//   );
// }




















































































// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import SupplyTable from '@/components/market/SupplyTable';

// export default function MarketPage() {
//   const [commodities, setCommodities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
//   const [showFilters, setShowFilters] = useState(false);
//   const [totalResults, setTotalResults] = useState(0);
//   const [stats, setStats] = useState({ byCommodity: [], byState: [], byLocationType: [] });

//   const [filters, setFilters] = useState({
//     name: '',
//     grade: '',
//     state: '',
//     locationType: '',
//     minPrice: '',
//     maxPrice: '',
//     minQuantity: '',
//     maxQuantity: '',
//     verifiedOnly: false,
//     harvestDays: '',
//     sortBy: 'date',
//     sortOrder: 'desc',
//     page: 1,
//     limit: 20,
//     search: '',
//   });

//   const fetchCommodities = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value !== '' && value !== false) params.append(key, String(value));
//       });

//       const res = await fetch(`${API_URL}/commodities?${params.toString()}`);
//       const data = await res.json();
//       if (data.success) {
//         setCommodities(data.data);
//         setTotalResults(data.total);
//       }
//     } catch (error) {
//       console.error('Error fetching commodities:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters]);

//   const fetchStats = async () => {
//     try {
//       const res = await fetch('${API_URL}/commodities/stats');
//       const data = await res.json();
//       if (data.success) setStats(data.data);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCommodities();
//     fetchStats();
//   }, [fetchCommodities]);

//   const updateFilter = (key: string, value: string | boolean) => {
//     setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
//   };

//   const clearAllFilters = () => {
//     setFilters({
//       name: '', grade: '', state: '', locationType: '',
//       minPrice: '', maxPrice: '', minQuantity: '', maxQuantity: '',
//       verifiedOnly: false, harvestDays: '',
//       sortBy: 'date', sortOrder: 'desc', page: 1, limit: 20, search: '',
//     });
//   };

//   return (
//     <SupplyTable
//       commodities={commodities}
//       loading={loading}
//       totalResults={totalResults}
//       stats={stats}
//       filters={filters}
//       updateFilter={updateFilter}
//       clearAllFilters={clearAllFilters}
//       showFilters={showFilters}
//       setShowFilters={setShowFilters}
//       viewMode={viewMode}
//       setViewMode={setViewMode}
//     />
//   );
// }




























































































// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import SupplyTable from '@/components/market/SupplyTable';

// export default function MarketPage() {
//   const [commodities, setCommodities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
//   const [showFilters, setShowFilters] = useState(false);
//   const [totalResults, setTotalResults] = useState(0);
//   const [stats, setStats] = useState({ byCommodity: [], byState: [], byLocationType: [] });

//   const [filters, setFilters] = useState({
//     name: '',
//     grade: '',
//     state: '',
//     locationType: '',
//     minPrice: '',
//     maxPrice: '',
//     minQuantity: '',
//     maxQuantity: '',
//     verifiedOnly: false,
//     harvestDays: '',
//     sortBy: 'date',
//     sortOrder: 'desc',
//     page: 1,
//     limit: 20,
//     search: '',
//   });

//   const fetchCommodities = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value) params.append(key, String(value));
//       });

//       const res = await fetch(`${API_URL}/commodities?${params.toString()}`);
//       const data = await res.json();
//       if (data.success) {
//         setCommodities(data.data);
//         setTotalResults(data.total);
//       }
//     } catch (error) {
//       console.error('Error fetching commodities:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters]);

//   const fetchStats = async () => {
//     try {
//       const res = await fetch('${API_URL}/commodities/stats');
//       const data = await res.json();
//       if (data.success) setStats(data.data);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCommodities();
//     fetchStats();
//   }, [fetchCommodities]);

//   const toggleExpand = (id: string) => {
//     setExpandedId(expandedId === id ? null : id);
//   };

//   const updateFilter = (key: string, value: string | boolean) => {
//     setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
//   };

//   const clearAllFilters = () => {
//     setFilters({
//       name: '', grade: '', state: '', locationType: '',
//       minPrice: '', maxPrice: '', minQuantity: '', maxQuantity: '',
//       verifiedOnly: false, harvestDays: '',
//       sortBy: 'date', sortOrder: 'desc', page: 1, limit: 20, search: '',
//     });
//   };

//   return (
//     <SupplyTable
//       commodities={commodities}
//       loading={loading}
//       totalResults={totalResults}
//       stats={stats}
//       filters={filters}
//       updateFilter={updateFilter}
//       clearAllFilters={clearAllFilters}
//       expandedId={expandedId}
//       toggleExpand={toggleExpand}
//       showFilters={showFilters}
//       setShowFilters={setShowFilters}
//       viewMode={viewMode}
//       setViewMode={setViewMode}
//     />
//   );
// }