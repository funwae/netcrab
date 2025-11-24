'use client';
export default function SettingsPage() {
  return (

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-netcrab-text">Settings</h1>

        {/* Data Controls */}
        <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
          <h2 className="text-xl font-semibold text-netcrab-text mb-4">Data Controls</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-netcrab-text mb-2">
                Domain Allowlist
              </label>
              <textarea
                className="w-full px-3 py-2 bg-netcrab-ink border border-netcrab-surface rounded-lg text-netcrab-text"
                rows={3}
                placeholder="example.com, app.example.com"
              />
              <p className="text-xs text-netcrab-muted mt-1">
                Comma-separated list of allowed domains
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-netcrab-text mb-2">
                Ignored Paths
              </label>
              <textarea
                className="w-full px-3 py-2 bg-netcrab-ink border border-netcrab-surface rounded-lg text-netcrab-text"
                rows={3}
                placeholder="/admin, /hr, /internal"
              />
              <p className="text-xs text-netcrab-muted mt-1">
                Paths to exclude from tracking
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-netcrab-text mb-2">
                Sampling Rate
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                defaultValue="1.0"
                className="w-full px-3 py-2 bg-netcrab-ink border border-netcrab-surface rounded-lg text-netcrab-text"
              />
              <p className="text-xs text-netcrab-muted mt-1">0.0 to 1.0 (1.0 = 100% of events)</p>
            </div>
          </div>
        </div>

        {/* Privacy & Compliance */}
        <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
          <h2 className="text-xl font-semibold text-netcrab-text mb-4">Privacy & Compliance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-netcrab-text">Marketplace Participation</div>
                <div className="text-sm text-netcrab-muted">
                  Opt in to share anonymized data for revenue
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-netcrab-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-netcrab-crab"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-netcrab-text mb-2">
                Data Retention Period
              </label>
              <select className="w-full px-3 py-2 bg-netcrab-ink border border-netcrab-surface rounded-lg text-netcrab-text">
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
                <option>Indefinite</option>
              </select>
            </div>
          </div>
        </div>

        {/* Agent Status */}
        <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
          <h2 className="text-xl font-semibold text-netcrab-text mb-4">NetCrab Agent Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-netcrab-text">Status</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm font-medium">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-netcrab-text">Last Event</span>
              <span className="text-netcrab-muted">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-netcrab-text">Version</span>
              <span className="text-netcrab-muted">0.1.0</span>
            </div>
          </div>
        </div>
      </div>

  );
}

