import Link from 'next/link';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-netcrab-ink">
      <TopNav />
      <div className="bg-netcrab-ink text-netcrab-text min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <Link href="/docs" className="text-netcrab-shell hover:underline text-sm mb-4 inline-block">
            ← Back to Docs
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Console & Analytics</h1>
          <p className="text-xl text-netcrab-muted">
            The NetCrab Console provides a web dashboard for viewing friction insights, flows, hotspots, and AI-generated Crab Notes.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Overview</h2>
            <p className="text-netcrab-muted mb-4">
              The Overview page shows high-level metrics for your products:
            </p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li><strong className="text-netcrab-text">Friction Index</strong> – Overall UX pain score (0–1)</li>
              <li><strong className="text-netcrab-text">Efficiency Score</strong> – Task completion rate (0–100%)</li>
              <li><strong className="text-netcrab-text">Sessions</strong> – Total user sessions in the selected period</li>
              <li><strong className="text-netcrab-text">Friction Radar</strong> – Friction breakdown by area (Onboarding, Billing, Support, etc.)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Flows</h2>
            <p className="text-netcrab-muted mb-4">
              The Flows page visualizes user journeys through your tools:
            </p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>NetCrab automatically infers common flows from navigation patterns</li>
              <li>You can label key flows (e.g., "Create Opportunity", "Close Case")</li>
              <li>Each flow shows completion rate, average friction, and session count</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Hotspots</h2>
            <p className="text-netcrab-muted mb-4">
              Hotspots identify UI areas where users struggle:
            </p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>High rage-click rates</li>
              <li>Elevated error rates</li>
              <li>Abnormal time-to-complete</li>
              <li>High drop-off rates</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Crab Notes</h2>
            <p className="text-netcrab-muted mb-4">
              Crab Notes are AI-generated, human-readable insights:
            </p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Generated from your behavioral data</li>
              <li>Highlight actionable friction points</li>
              <li>Include recommendations for fixes</li>
              <li>You can mark them as accepted, not actionable, or ignore</li>
            </ul>
            <p className="text-netcrab-muted mt-4">
              Your feedback helps NetCrab tune future Crab Notes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">My Packs</h2>
            <p className="text-netcrab-muted mb-4">
              If you've purchased benchmark packs from the marketplace:
            </p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>View pack data and metrics</li>
              <li>Compare your metrics against benchmarks</li>
              <li>Download pack data for BI tools</li>
              <li>Access via API for programmatic use</li>
            </ul>
            <p className="text-netcrab-muted mt-4">
              See <Link href="/docs/marketplace" className="text-netcrab-shell hover:underline">Benchmarks Marketplace</Link> for details.
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}

