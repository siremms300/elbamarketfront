// client/app/market/MarketClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import SupplyTable from '@/components/market/SupplyTable';
import { API_URL } from '@/lib/api';

export default function MarketClient() {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [totalResults, setTotalResults] = useState(0);
  const [stats, setStats] = useState({ byCommodity: [], byState: [], byLocationType: [] });

  const [filters, setFilters] = useState({
    commodityType: '',
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

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/commodities/stats`);
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchCommodities();
    fetchStats();
  }, [fetchCommodities, fetchStats]);

  const updateFilter = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearAllFilters = () => {
    setFilters({
      commodityType: '',
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