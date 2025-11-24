import Link from 'next/link';
import NetCrabHeroCard from '@/components/shared/NetCrabHeroCard';

export default function Hero() {
  return (
    <section className="bg-netcrab-ink text-netcrab-text py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
          {/* Left: Text + CTAs */}
          <div className="max-w-[80ch]">
            <div className="text-xs text-netcrab-muted uppercase tracking-wider mb-4">
              BEHAVIORAL ANALYTICS · PRIVACY-FIRST
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your network is dropping{' '}
              <span className="bg-gradient-to-r from-netcrab-crab to-netcrab-shell bg-clip-text text-transparent">
                crumbs of gold
              </span>
              .<br />
              NetCrab picks them up.
            </h1>
            <p className="text-lg md:text-xl text-netcrab-muted mb-8 leading-relaxed">
              NetCrab sits quietly inside your intranet, watches how people actually use your tools, and turns all that "junk" click data into clean product insight—and optional, anonymized benchmark packs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                href="/app?demo=1"
                className="px-8 py-4 bg-netcrab-crab text-white rounded-lg font-semibold hover:bg-netcrab-crab/90 transition-colors text-lg text-center"
              >
                View Live Demo
              </Link>
              <Link
                href="/marketplace"
                className="px-8 py-4 bg-transparent border border-netcrab-border text-netcrab-text rounded-lg font-semibold hover:bg-netcrab-surface transition-colors text-lg text-center"
              >
                Explore the Marketplace
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-netcrab-muted">
              <span className="text-lg">🦀</span>
              <span>On-prem agent · No PII · Aggregated benchmarks only</span>
            </div>
          </div>

          {/* Right: Hero Card with Glow */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-netcrab-shell/20 rounded-2xl blur-2xl -z-10"></div>
            <NetCrabHeroCard
              orgLabel="demo-netcr"
              productLabel="crm-web"
              frictionIndex={0.42}
              efficiencyScore={0.78}
              sessions={12450}
              hotspotsCount={3}
              showLabel="Sample data"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
