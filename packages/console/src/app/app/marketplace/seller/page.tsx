'use client';

import Layout from '@/components/Layout';

export default function SellerMarketplacePage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-navy-900">Marketplace - Your Contributions</h1>

        {/* Revenue Summary */}
        <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">This Month's Projected Revenue</h2>
          <div className="text-4xl font-bold text-navy-900 mb-2">$2,450.32</div>
          <p className="text-sm text-navy-600">Based on current session contributions</p>
        </div>

        {/* Pack Contributions */}
        <div className="bg-white rounded-lg shadow border border-navy-200">
          <div className="p-6 border-b border-navy-200">
            <h2 className="text-xl font-semibold text-navy-900">Your Pack Contributions</h2>
          </div>
          <div className="p-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-navy-200">
                  <th className="text-left py-3 px-4 font-medium text-navy-700">Pack</th>
                  <th className="text-right py-3 px-4 font-medium text-navy-700">Sessions</th>
                  <th className="text-right py-3 px-4 font-medium text-navy-700">Est. Share</th>
                  <th className="text-center py-3 px-4 font-medium text-navy-700">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-navy-100 hover:bg-navy-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-navy-900">B2B CRM UX Friction Benchmarks v1</div>
                  </td>
                  <td className="text-right py-3 px-4 text-navy-600">182,340</td>
                  <td className="text-right py-3 px-4 font-semibold text-navy-900">$1,820.11</td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span>
                  </td>
                </tr>
                <tr className="border-b border-navy-100 hover:bg-navy-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-navy-900">Support Desk Flows v1</div>
                  </td>
                  <td className="text-right py-3 px-4 text-navy-600">77,902</td>
                  <td className="text-right py-3 px-4 font-semibold text-navy-900">$630.21</td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Opt-in Section */}
        <div className="bg-navy-50 rounded-lg border border-navy-200 p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-2">Data Sharing Preferences</h3>
          <p className="text-sm text-navy-700 mb-4">
            NetCrab never shares PII or identifiers. Only aggregated patterns like 'median clicks to complete checkout'.
          </p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-navy-700">Include my anonymized data in UX Benchmarks pack</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-navy-700">Include my anonymized data in Task Flows pack</span>
            </label>
          </div>
        </div>
      </div>
    </Layout>
  );
}

