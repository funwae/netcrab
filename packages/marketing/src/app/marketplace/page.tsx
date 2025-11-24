'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Pack {
  id: string;
  title: string;
  shortDesc: string;
  vertical: string;
  category: string;
  updateFrequency: string;
  basePriceUsd: string;
}

export default function MarketplacePage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    vertical: '',
    category: '',
    updateFrequency: '',
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.vertical) params.append('vertical', filters.vertical);
    if (filters.category) params.append('category', filters.category);
    if (filters.updateFrequency) params.append('updateFrequency', filters.updateFrequency);

    const marketplaceUrl = process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || 'http://localhost:5000';
    fetch(`${marketplaceUrl}/v1/packs?${params}`)
      .then(res => res.json())
      .then(data => {
        setPacks(data.packs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading packs:', err);
        setLoading(false);
      });
  }, [filters]);

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">Marketplace</h1>
        <p className="text-navy-600 mb-8">Browse anonymized UX benchmark data packs</p>

        <div className="flex gap-8">
          {/* Filters */}
          <aside className="w-64">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-navy-900 mb-4">Filters</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Vertical</label>
                  <select
                    className="w-full px-3 py-2 border border-navy-300 rounded"
                    value={filters.vertical}
                    onChange={(e) => setFilters({ ...filters, vertical: e.target.value })}
                  >
                    <option value="">All</option>
                    <option value="B2B_CRM">B2B CRM</option>
                    <option value="SUPPORT_DESK">Support Desk</option>
                    <option value="ERP">ERP</option>
                    <option value="HRIS">HRIS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Category</label>
                  <select
                    className="w-full px-3 py-2 border border-navy-300 rounded"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  >
                    <option value="">All</option>
                    <option value="UX Benchmarks">UX Benchmarks</option>
                    <option value="Task Flows">Task Flows</option>
                    <option value="Releases">Releases</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Pack Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="text-center py-12">Loading packs...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packs.map((pack) => (
                  <div key={pack.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-navy-900">{pack.title}</h3>
                      <span className="px-2 py-1 bg-navy-100 text-navy-700 rounded text-xs">
                        {pack.vertical}
                      </span>
                    </div>
                    <p className="text-sm text-navy-600 mb-4">{pack.shortDesc}</p>
                    <div className="flex items-center justify-between text-sm text-navy-500 mb-4">
                      <span>{pack.category}</span>
                      <span>{pack.updateFrequency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-navy-900">
                        From ${pack.basePriceUsd}/mo
                      </span>
                      <Link
                        href={`/marketplace/${pack.id}`}
                        className="px-4 py-2 bg-coral-500 text-white rounded hover:bg-coral-600"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

