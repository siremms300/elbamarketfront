'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Commodity {
  _id: string;
  commodityType?: { _id: string; name: string; emoji: string; category: string };
  name: string;
  grade: string;
  quantity: { amount: number; unit: string };
  price: { amount: number; perUnit: string };
  location: { state: string; lga: string };
  seller: { name: string; rating: number };
  availableQuantity: number;
}

export default function MarketPreview() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    try {
      const res = await fetch(`${API_URL}/commodities?limit=4&sortBy=date&sortOrder=desc`);
      const data = await res.json();
      if (data.success) {
        setCommodities(data.data);
      }
    } catch (err) {
      console.error('Error fetching commodities:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-elba-secondary bg-elba-secondary/10 px-4 py-1.5 rounded-full">
            Live Market
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-elba-primary mt-6 tracking-tight">
            Available{' '}
            <span className="text-elba-secondary">Commodities</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            Browse verified commodities from trusted warehouses across Nigeria.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 animate-pulse">
                <div className="w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4" />
                <div className="h-4 bg-gray-100 rounded w-2/3 mx-auto mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : commodities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No commodities available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {commodities.map((commodity) => (
              <Link
                key={commodity._id}
                href={`/market/${commodity._id}`}
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Image/Emoji */}
                <div className="h-36 bg-elba-surface flex items-center justify-center text-5xl relative">
                  {commodity.commodityType?.emoji || '📦'}
                  <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    commodity.grade === 'A' ? 'bg-white text-emerald-700' :
                    commodity.grade === 'B' ? 'bg-white text-amber-700' : 'bg-white text-gray-600'
                  }`}>
                    Grade {commodity.grade}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-elba-primary text-sm">{commodity.name}</h3>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{commodity.location?.state}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p className="font-bold text-elba-primary">
                      ₦{commodity.price?.amount?.toLocaleString()}
                      <span className="text-xs font-normal text-gray-500">/{commodity.price?.perUnit}</span>
                    </p>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {commodity.seller?.rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {commodity.availableQuantity?.toLocaleString()} {commodity.quantity?.unit} available
                    </span>
                    <span className="text-elba-secondary text-xs font-medium flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View More Button */}
        <div className="text-center mt-10">
          <Link
            href="/market"
            className="btn-elba-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-2xl shadow-lg shadow-elba-primary/20 hover:shadow-elba-primary/30 transition-all hover:-translate-y-0.5"
          >
            View All Commodities
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}