'use client';

import Link from 'next/link';

interface Pack {
  id: string;
  title: string;
  shortDesc: string;
  vertical: string;
  category: string;
  updateFrequency: string;
  basePriceUsd: string;
  orgCount: number;
  sessionCount: number;
}

const demoPacks: Pack[] = [
  {
    id: 'ux_friction_b2b_crm_v1',
    title: 'B2B CRM UX Friction Benchmarks v1',
    shortDesc: 'Daily friction and efficiency metrics for core CRM workflows.',
    vertical: 'B2B CRM',
    category: 'UX Benchmarks',
    updateFrequency: 'Daily',
    basePriceUsd: '499.00',
    orgCount: 37,
    sessionCount: 480000,
  },
  {
    id: 'flows_support_ticketing_v1',
    title: 'Support Desk Task Flow Archetypes v1',
    shortDesc: 'Common task flow patterns for support desk applications.',
    vertical: 'Support Desk',
    category: 'Task Flows',
    updateFrequency: 'Weekly',
    basePriceUsd: '399.00',
    orgCount: 24,
    sessionCount: 320000,
  },
  {
    id: 'release_deltas_saas_v1',
    title: 'SaaS Release Delta & Trend Packs v1',
    shortDesc: 'Pre/post-release friction and efficiency comparisons.',
    vertical: 'SaaS',
    category: 'Release Deltas',
    updateFrequency: 'Weekly',
    basePriceUsd: '599.00',
    orgCount: 42,
    sessionCount: 650000,
  },
];

export default function MarketplacePage() {
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
              <Link href="/#how-it-works" className="text-netcrab-muted hover:text-netcrab-text transition-colors">
                Product
              </Link>
              <Link href="/app" className="px-4 py-2 bg-netcrab-crab text-white rounded-lg hover:bg-netcrab-crab/90 transition-colors font-medium">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-netcrab-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-netcrab-text">Marketplace</h1>
          <p className="text-xl text-netcrab-muted">Benchmark your UX against the market</p>
        </div>
      </section>

      {/* Pack Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoPacks.map((pack) => (
              <div
                key={pack.id}
                className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6 hover:border-netcrab-aqua/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="px-2 py-1 bg-netcrab-aqua/20 text-netcrab-aqua text-xs rounded mb-2 inline-block">
                      {pack.vertical}
                    </span>
                    <h3 className="text-xl font-bold text-netcrab-text mt-2">{pack.title}</h3>
                  </div>
                </div>
                <p className="text-netcrab-muted mb-4">{pack.shortDesc}</p>
                <div className="space-y-2 mb-4 text-sm text-netcrab-muted">
                  <div>Category: {pack.category}</div>
                  <div>Updates: {pack.updateFrequency}</div>
                  <div>{pack.orgCount}+ products · {pack.sessionCount.toLocaleString()} sessions/month</div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-netcrab-surface">
                  <div className="text-2xl font-bold text-netcrab-text">${pack.basePriceUsd}/mo</div>
                  <Link
                    href={`/marketplace/${pack.id}`}
                    className="px-4 py-2 bg-netcrab-crab text-white rounded-lg hover:bg-netcrab-crab/90 transition-colors text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-netcrab-ink border-t border-netcrab-surface py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex items-center gap-3">
              <img src="/netcrab-logo.svg" alt="NetCrab" className="h-10 w-10" />
              <div>
                <h3 className="text-2xl font-bold mb-2 text-netcrab-text">NetCrab</h3>
                <p className="text-netcrab-muted">Turning network noise into product gold.</p>
              </div>
            </div>
            <nav className="flex gap-6">
              <Link href="/#how-it-works" className="text-netcrab-muted hover:text-netcrab-text transition-colors">
                Product
              </Link>
              <Link href="/marketplace" className="text-netcrab-muted hover:text-netcrab-text transition-colors">
                Marketplace
              </Link>
              <Link href="/app" className="text-netcrab-muted hover:text-netcrab-text transition-colors">
                Console
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}

