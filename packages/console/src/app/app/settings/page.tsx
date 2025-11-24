'use client';

import Layout from '@/components/Layout';

export default function SettingsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-navy-900">Settings</h1>

        {/* Data Controls */}
        <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Data Controls</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Domain Allowlist
              </label>
              <textarea
                className="w-full px-3 py-2 border border-navy-300 rounded-lg"
                rows={3}
                placeholder="example.com, app.example.com"
              />
              <p className="text-xs text-navy-500 mt-1">
                Comma-separated list of allowed domains
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Ignored Paths
              </label>
              <textarea
                className="w-full px-3 py-2 border border-navy-300 rounded-lg"
                rows={3}
                placeholder="/admin, /hr, /internal"
              />
              <p className="text-xs text-navy-500 mt-1">
                Paths to exclude from tracking
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Sampling Rate
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                defaultValue="1.0"
                className="w-full px-3 py-2 border border-navy-300 rounded-lg"
              />
              <p className="text-xs text-navy-500 mt-1">0.0 to 1.0 (1.0 = 100% of events)</p>
            </div>
          </div>
        </div>

        {/* Privacy & Compliance */}
        <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Privacy & Compliance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-navy-900">Marketplace Participation</div>
                <div className="text-sm text-navy-600">
                  Opt in to share anonymized data for revenue
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-navy-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-500"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Data Retention Period
              </label>
              <select className="w-full px-3 py-2 border border-navy-300 rounded-lg">
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
                <option>Indefinite</option>
              </select>
            </div>
          </div>
        </div>

        {/* Agent Status */}
        <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">NetCrab Agent Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-navy-700">Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-navy-700">Last Event</span>
              <span className="text-navy-600">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-navy-700">Version</span>
              <span className="text-navy-600">0.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

