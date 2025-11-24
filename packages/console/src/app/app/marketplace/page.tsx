'use client';

import Layout from '@/components/Layout';

export default function SellerMarketplacePage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-netcrab-text">Marketplace</h1>
          <p className="text-netcrab-muted mt-1">Your contributions and revenue</p>
        </div>

        <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
          <h2 className="text-xl font-semibold text-netcrab-text mb-4">This Month's Projected Revenue</h2>
          <div className="text-4xl font-bold text-netcrab-crab mb-2">$2,450.32</div>
          <p className="text-netcrab-muted">Based on current pack contributions</p>
        </div>

        <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
          <h2 className="text-xl font-semibold text-netcrab-text mb-4">Your Contributions</h2>
          <div className="space-y-4">
            <div className="border border-netcrab-surface rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-netcrab-text">UX Friction Benchmarks - B2B CRM</div>
                  <div className="text-sm text-netcrab-muted">Last month: $1,820.11 revenue</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-netcrab-muted">182,340 sessions</div>
                  <div className="text-xs text-netcrab-muted">18% contribution</div>
                </div>
              </div>
            </div>
            <div className="border border-netcrab-surface rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-netcrab-text">Support Desk Flows v1</div>
                  <div className="text-sm text-netcrab-muted">Last month: $630.21 revenue</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-netcrab-muted">77,902 sessions</div>
                  <div className="text-xs text-netcrab-muted">12% contribution</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
