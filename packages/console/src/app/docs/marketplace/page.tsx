import Link from 'next/link';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-netcrab-ink">
      <TopNav />
      <div className="bg-netcrab-ink text-netcrab-text min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <Link href="/docs" className="text-netcrab-shell hover:underline text-sm mb-4 inline-block">
            ← Back to Docs
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Benchmarks Marketplace</h1>
          <p className="text-xl text-netcrab-muted">
            NetCrab's marketplace turns your anonymized behavior patterns into benchmark packs you can buy 
            and revenue share or credits when other teams buy packs your data helped create.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">What is a Pack?</h2>
            <p className="text-netcrab-muted mb-4">
              A <strong className="text-netcrab-text">Pack</strong> is a curated dataset built from many participating orgs, such as:
            </p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-2 ml-4">
              <li><strong className="text-netcrab-text">UX Benchmark Packs</strong> – e.g., "B2B CRM Onboarding Friction (SaaS, 50–500 seats)"</li>
              <li><strong className="text-netcrab-text">Task-flow Archetype Packs</strong> – Canonical step sequences for workflows like "Create customer", "Resolve ticket", "Approve invoice".</li>
              <li><strong className="text-netcrab-text">Release Delta Packs</strong> – Before/after metrics for large UI changes across many orgs.</li>
            </ul>
            <p className="text-netcrab-muted mt-4">Each pack includes:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>A <strong className="text-netcrab-text">schema</strong> (what's measured).</li>
              <li><strong className="text-netcrab-text">Aggregated metrics</strong> (no row-level or identifiable data).</li>
              <li>Definitions for segments (industry, size, region) where applicable.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">How your data is used</h2>
            <p className="text-netcrab-muted mb-4">When you opt in a product to the marketplace:</p>
            <ol className="list-decimal list-inside text-netcrab-muted space-y-2 ml-4">
              <li>The intranet agent continues to collect behavioral events <strong className="text-netcrab-text">inside your network</strong>.</li>
              <li>Before anything leaves:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>PII, free text, and sensitive payloads are dropped by design.</li>
                  <li>Only <strong className="text-netcrab-text">pre-hashed IDs and event types</strong> survive.</li>
                </ul>
              </li>
              <li>NetCrab's backend:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Aggregates your events into <strong className="text-netcrab-text">cohorts</strong> (e.g., org, product, version, segment).</li>
                  <li>Applies <strong className="text-netcrab-text">minimum cohort sizes</strong> (k-anonymity) and <strong className="text-netcrab-text">noise</strong> (differential privacy) to protect individuals.</li>
                </ul>
              </li>
              <li>Only <strong className="text-netcrab-text">aggregate metrics</strong> (e.g., "X% of flows dropped at step 3" across many orgs) are included in packs.</li>
            </ol>
            <div className="bg-netcrab-surface border border-netcrab-border rounded-lg p-4 my-4">
              <p className="text-netcrab-muted font-semibold mb-2">We never:</p>
              <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
                <li>Expose raw user-level or session-level data to other customers.</li>
                <li>Sell or share your data in any pack without explicit product-level opt-in.</li>
              </ul>
            </div>
            <p className="text-netcrab-muted mt-4">
              For details, see <Link href="/docs/privacy-security" className="text-netcrab-shell hover:underline">Privacy, Security & Compliance</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Opting in and out</h2>
            <p className="text-netcrab-muted mb-2">In the Console:</p>
            <ol className="list-decimal list-inside text-netcrab-muted space-y-2 ml-4">
              <li>Go to <strong className="text-netcrab-text">Marketplace → Data Sharing</strong>.</li>
              <li>Toggle marketplace participation:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Global: "Org participates in NetCrab Marketplace".</li>
                  <li>Per-product: opt in/out each internal tool.</li>
                </ul>
              </li>
            </ol>
            <p className="text-netcrab-muted mt-4">
              Changes take effect for <strong className="text-netcrab-text">future</strong> aggregation runs; historical metrics may remain 
              in previously built packs, but those are always <strong className="text-netcrab-text">aggregate-only</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Revenue share model</h2>
            <p className="text-netcrab-muted mb-4">When a pack is sold (or accessed under a paid plan):</p>
            <ol className="list-decimal list-inside text-netcrab-muted space-y-2 ml-4">
              <li>NetCrab takes a <strong className="text-netcrab-text">platform fee</strong> (e.g., 30%).</li>
              <li>The remaining <strong className="text-netcrab-text">revenue pool</strong> is allocated to contributing orgs based on:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>How many <strong className="text-netcrab-text">eligible sessions</strong> they contributed.</li>
                  <li>Whether they met cohort thresholds (k-anonymity).</li>
                </ul>
              </li>
              <li>Your org receives:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Either <strong className="text-netcrab-text">cash payouts</strong> (via Stripe Connect, on eligible tiers), or</li>
                  <li><strong className="text-netcrab-text">Credits</strong> against your NetCrab invoice.</li>
                </ul>
              </li>
            </ol>
            <p className="text-netcrab-muted mt-4">
              At the end of each billing period you get a <strong className="text-netcrab-text">Marketplace Statement</strong> with:
            </p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Packs your data contributed to.</li>
              <li>Sessions contributed.</li>
              <li>Your share of the revenue pool.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Buying packs</h2>
            <p className="text-netcrab-muted mb-4">If you're more interested in <strong className="text-netcrab-text">consuming</strong> benchmarks:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-2 ml-4">
              <li>Visit <strong className="text-netcrab-text">Marketplace → Browse Packs</strong>.</li>
              <li>Filter by:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Vertical (e.g., B2B SaaS, Fintech, Support Tools)</li>
                  <li>Org size</li>
                  <li>Region or segment (where available)</li>
                </ul>
              </li>
              <li>Each pack shows:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Sample metrics and visualizations.</li>
                  <li>How often it's refreshed.</li>
                  <li>Rough cohort composition (without naming other orgs).</li>
                </ul>
              </li>
            </ul>
            <p className="text-netcrab-muted mt-4">You can:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Add packs to your <strong className="text-netcrab-text">My Packs</strong> view.</li>
              <li>Use the <strong className="text-netcrab-text">API</strong> to ingest pack data into your own BI or dashboards.</li>
            </ul>
            <p className="text-netcrab-muted mt-4">
              See <Link href="/docs/api" className="text-netcrab-shell hover:underline">API Overview</Link> for endpoints.
            </p>
          </div>

          <div className="bg-netcrab-surface border border-netcrab-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Example: B2B CRM Onboarding Pack</h2>
            <div className="space-y-2 text-netcrab-muted mb-4">
              <p><strong className="text-netcrab-text">Pack:</strong> <code className="bg-netcrab-card px-1 rounded">ux_b2b_crm_onboarding_v1</code></p>
              <p><strong className="text-netcrab-text">Vertical:</strong> B2B SaaS, CRM</p>
              <p><strong className="text-netcrab-text">Scope:</strong> Onboarding flows for internal CRM tools</p>
            </div>
            <p className="text-netcrab-muted mb-2">Pack contents:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Median friction index by step (invite, import, configure, first record).</li>
              <li>Top 3 hotspots and their typical fixes.</li>
              <li>Distribution of completion times by org size.</li>
            </ul>
            <p className="text-netcrab-muted mt-4">
              When you buy this pack, you see where your CRM onboarding sits relative to peers. 
              If your org opted in and contributed data, you also <strong className="text-netcrab-text">earn a share</strong> when other buyers purchase it.
            </p>
          </div>

          <div className="bg-netcrab-crab/10 border border-netcrab-crab/30 rounded-lg p-6">
            <p className="text-netcrab-muted">
              If you just want NetCrab without any data sharing, simply leave the marketplace toggles off. 
              You still get full intranet analytics for your org.
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}

