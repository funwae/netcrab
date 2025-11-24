'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PackDetailPage() {
  const params = useParams();
  const packId = params.packId as string;

  // Demo pack data
  const pack = {
    id: packId,
    title: 'B2B CRM UX Friction Benchmarks v1',
    vertical: 'B2B CRM',
    category: 'UX Benchmarks',
    updateFrequency: 'Daily',
    longDesc: 'This pack aggregates frustration and efficiency metrics across 37 B2B CRM products, providing daily benchmarks for common workflows like lead creation, opportunity management, and deal closure.',
    basePriceUsd: '499.00',
    orgCount: 37,
    sessionCount: 480000,
  };

  return (
    <main className="min-h-screen bg-netcrab-ink">
      {/* Top Nav */}
      <header className="bg-netcrab-ink border-b border-netcrab-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/netcrab-logo.svg" alt="NetCrab" className="h-8 w-8" />
              <span className="text-xl font-bold text-netcrab-text">NetCrab</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/marketplace" className="text-netcrab-muted hover:text-netcrab-text transition-colors">
                ← Back to Marketplace
              </Link>
              <Link href="/app" className="px-4 py-2 bg-netcrab-crab text-white rounded-lg hover:bg-netcrab-crab/90 transition-colors font-medium">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <span className="px-2 py-1 bg-netcrab-aqua/20 text-netcrab-aqua text-xs rounded mb-4 inline-block">
            {pack.vertical}
          </span>
          <h1 className="text-4xl font-bold text-netcrab-text mb-4">{pack.title}</h1>
          <p className="text-xl text-netcrab-muted">{pack.longDesc}</p>
        </div>

        <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6 mb-6">
          <h2 className="text-xl font-semibold text-netcrab-text mb-4">Quick Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-netcrab-text">{pack.orgCount}+</div>
              <div className="text-sm text-netcrab-muted">Products</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-netcrab-text">{(pack.sessionCount / 1000).toFixed(0)}k</div>
              <div className="text-sm text-netcrab-muted">Sessions/month</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-netcrab-text">{pack.updateFrequency}</div>
              <div className="text-sm text-netcrab-muted">Updates</div>
            </div>
          </div>
        </div>

        <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6 mb-6">
          <h2 className="text-xl font-semibold text-netcrab-text mb-4">Pricing</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-netcrab-text">${pack.basePriceUsd}/mo</div>
              <div className="text-sm text-netcrab-muted">Standard tier</div>
            </div>
            <Link
              href="/app"
              className="px-6 py-3 bg-netcrab-crab text-white rounded-lg hover:bg-netcrab-crab/90 transition-colors font-semibold"
            >
              Sign in to Buy
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

