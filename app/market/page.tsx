// client/app/market/page.tsx
import type { Metadata } from 'next';
import MarketClient from './MarketClient';
import { API_URL } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Commodity Market | Buy Agricultural Products in Nigeria',
  description: 'Browse live agricultural commodity listings from our centers across Nigeria. Buy maize, soybean, groundnut, sesame, sorghum and more at competitive prices.',
  keywords: [
    'buy agricultural commodities Nigeria',
    'commodity market Nigeria',
    'farm produce marketplace',
    'buy maize Nigeria',
    'buy soybean Nigeria',
    'agricultural marketplace Nigeria',
    'commodity trading Nigeria',
  ],
  openGraph: {
    title: 'Commodity Market | Buy Agricultural Products in Nigeria',
    description: 'Browse live agricultural commodity listings from our centers across Nigeria.',
    url: 'https://www.elbermarket.com/market',
    type: 'website',
    siteName: 'ELBER MARKET',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commodity Market | Buy Agricultural Products in Nigeria',
    description: 'Browse live agricultural commodity listings from verified farmers and warehouses across Nigeria.',
  },
  alternates: {
    canonical: 'https://www.elbermarket.com/market',
  },
};

async function getCommodities() {
  try {
    const res = await fetch(`${API_URL}/commodities?limit=50`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching commodities for SEO:', error);
    return [];
  }
}

export default async function MarketPage() {
  const commodities = await getCommodities();

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://www.elbermarket.com/market',
        url: 'https://www.elbermarket.com/market',
        name: 'Commodity Market | ELBER MARKET',
        description: 'Browse live agricultural commodity listings from verified farmers and warehouses across Nigeria.',
        isPartOf: {
          '@id': 'https://www.elbermarket.com/#website',
        },
      },
      {
        '@type': 'ItemList',
        name: 'Agricultural Commodities Market',
        description: 'Live agricultural commodity listings available on ELBER MARKET',
        numberOfItems: commodities.length,
        itemListElement: commodities.map((commodity: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: commodity.name,
            description: `${commodity.name} - Grade ${commodity.grade} from ${commodity.location?.state || 'Nigeria'}. Available: ${commodity.availableQuantity} ${commodity.quantity?.unit || 'units'}.`,
            image: commodity.images?.[0]?.url || `https://www.elbermarket.com/logo.png`,
            sku: commodity._id,
            brand: {
              '@type': 'Brand',
              name: 'ELBER MARKET',
            },
            offers: {
              '@type': 'Offer',
              price: commodity.price?.amount?.toString() || '0',
              priceCurrency: 'NGN',
              availability: commodity.availableQuantity > 0 
                ? 'https://schema.org/InStock' 
                : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: commodity.seller?.name || 'ELBER MARKET',
              },
              priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
            additionalProperty: [
              {
                '@type': 'PropertyValue',
                name: 'Grade',
                value: commodity.grade || 'B',
              },
              {
                '@type': 'PropertyValue',
                name: 'Location',
                value: commodity.location?.state || 'Nigeria',
              },
              {
                '@type': 'PropertyValue',
                name: 'Source Type',
                value: commodity.location?.locationType || 'warehouse',
              },
              {
                '@type': 'PropertyValue',
                name: 'Moisture Content',
                value: commodity.moistureContent ? `${commodity.moistureContent}%` : 'N/A',
              },
              {
                '@type': 'PropertyValue',
                name: 'Minimum Order',
                value: `${commodity.minimumOrder} ${commodity.quantity?.unit || 'units'}`,
              },
            ],
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.elbermarket.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Market',
            item: 'https://www.elbermarket.com/market',
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <MarketClient />
    </>
  );
}



























































// // client/app/market/page.tsx
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import SupplyTable from '@/components/market/SupplyTable';
// import { API_URL } from '@/lib/api';

// export default function MarketPage() {
//   const [commodities, setCommodities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
//   const [totalResults, setTotalResults] = useState(0);
//   const [stats, setStats] = useState({ byCommodity: [], byState: [], byLocationType: [] });

//   const [filters, setFilters] = useState({
//     commodityType: '',
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

//   const fetchStats = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_URL}/commodities/stats`);
//       const data = await res.json();
//       if (data.success) {
//         setStats(data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCommodities();
//     fetchStats();
//   }, [fetchCommodities, fetchStats]);

//   const updateFilter = (key: string, value: string | boolean) => {
//     setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
//   };

//   const clearAllFilters = () => {
//     setFilters({
//       commodityType: '',
//       grade: '',
//       state: '',
//       locationType: '',
//       minPrice: '',
//       maxPrice: '',
//       minQuantity: '',
//       maxQuantity: '',
//       verifiedOnly: false,
//       harvestDays: '',
//       sortBy: 'date',
//       sortOrder: 'desc',
//       page: 1,
//       limit: 20,
//       search: '',
//     });
//   };

//   return (
//     <div>
//       <SupplyTable
//         commodities={commodities}
//         loading={loading}
//         totalResults={totalResults}
//         stats={stats}
//         filters={filters}
//         updateFilter={updateFilter}
//         clearAllFilters={clearAllFilters}
//         viewMode={viewMode}
//         setViewMode={setViewMode}
//       />
//     </div>
//   );
// }















































// // client/app/market/page.tsx
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import SupplyTable from '@/components/market/SupplyTable';
// import { API_URL } from '@/lib/api';

// export default function MarketPage() {
//   const [commodities, setCommodities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
//   const [totalResults, setTotalResults] = useState(0);
//   const [stats, setStats] = useState({ byCommodity: [], byState: [], byLocationType: [] });

//   const [filters, setFilters] = useState({
//     commodityType: '',
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

//       // ✅ Fixed: Using backticks for template literal
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

//   const fetchStats = useCallback(async () => {
//     try {
//       // ✅ Fixed: Using backticks for template literal
//       const res = await fetch(`${API_URL}/commodities/stats`);
//       const data = await res.json();
//       if (data.success) setStats(data.data);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCommodities();
//     fetchStats();
//   }, [fetchCommodities, fetchStats]);

//   const updateFilter = (key: string, value: string | boolean) => {
//     setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
//   };

//   const clearAllFilters = () => {
//     setFilters({
//       commodityType: '',
//       grade: '',
//       state: '',
//       locationType: '',
//       minPrice: '',
//       maxPrice: '',
//       minQuantity: '',
//       maxQuantity: '',
//       verifiedOnly: false,
//       harvestDays: '',
//       sortBy: 'date',
//       sortOrder: 'desc',
//       page: 1,
//       limit: 20,
//       search: '',
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
//       viewMode={viewMode}
//       setViewMode={setViewMode}
//     />
//   );
// }




















































































// // client/app/market/page.tsx
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import SupplyTable from '@/components/market/SupplyTable';
// import { API_URL } from '@/lib/api';

// export default function MarketPage() {
//   const [commodities, setCommodities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
//   const [totalResults, setTotalResults] = useState(0);
//   const [stats, setStats] = useState({ byCommodity: [], byState: [], byLocationType: [] });

// //   const [filters, setFilters] = useState({
// //     name: '',
// //     grade: '',
// //     state: '',
// //     locationType: '',
// //     minPrice: '',
// //     maxPrice: '',
// //     minQuantity: '',
// //     maxQuantity: '',
// //     verifiedOnly: false,
// //     harvestDays: '',
// //     sortBy: 'date',
// //     sortOrder: 'desc',
// //     page: 1,
// //     limit: 20,
// //     search: '',
// //   });


// const [filters, setFilters] = useState({
//   commodityType: '',  // changed from 'name'
//   grade: '',
//   state: '',
//   locationType: '',
//   minPrice: '',
//   maxPrice: '',
//   minQuantity: '',
//   maxQuantity: '',
//   verifiedOnly: false,
//   harvestDays: '',
//   sortBy: 'date',
//   sortOrder: 'desc',
//   page: 1,
//   limit: 20,
//   search: '',
// });

 

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

// //   const clearAllFilters = () => {
// //     setFilters({
// //       name: '', grade: '', state: '', locationType: '',
// //       minPrice: '', maxPrice: '', minQuantity: '', maxQuantity: '',
// //       verifiedOnly: false, harvestDays: '',
// //       sortBy: 'date', sortOrder: 'desc', page: 1, limit: 20, search: '',
// //     });
// //   };





// const clearAllFilters = () => {
//   setFilters({
//     commodityType: '', grade: '', state: '', locationType: '',
//     minPrice: '', maxPrice: '', minQuantity: '', maxQuantity: '',
//     verifiedOnly: false, harvestDays: '',
//     sortBy: 'date', sortOrder: 'desc', page: 1, limit: 20, search: '',
//   });
// };






//   return (
//     <SupplyTable
//       commodities={commodities}
//       loading={loading}
//       totalResults={totalResults}
//       stats={stats}
//       filters={filters}
//       updateFilter={updateFilter}
//       clearAllFilters={clearAllFilters}
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