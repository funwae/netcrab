'use client';

import Layout from '@/components/Layout';

export default function MarketplacePage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-navy-900">Marketplace</h1>

        <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Your Contributions</h2>
          <div className="space-y-4">
            <div className="border border-navy-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-navy-900">UX Friction Benchmarks - B2B CRM</div>
                  <div className="text-sm text-navy-600">Last month: $0.00 revenue</div>
                </div>
                <div className="text-sm text-navy-600">12,450 sessions contributed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-navy-50 rounded-lg border border-navy-200 p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-2">Marketplace Participation</h3>
          <p className="text-navy-700 mb-4">
            Opt in to privacy-safe, cross-industry benchmark packs. Your anonymous patterns join
            others to create valuable data—and you get paid your share.
          </p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-navy-700">Enable marketplace participation</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-navy-700">Include billing flow data</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-navy-700">Include admin panel data</span>
            </label>
          </div>
        </div>

        <div className="text-sm text-navy-600">
          <p>
            Marketplace features will be available in Phase 3. Your data is currently only used
            for internal analytics.
          </p>
        </div>
      </div>
    </Layout>
  );
}

