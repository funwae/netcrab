import Link from 'next/link';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';

export default function OverviewPage() {
  return (
    <div className="bg-netcrab-ink text-netcrab-text min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <Link href="/docs" className="text-netcrab-shell hover:underline text-sm mb-4 inline-block">
            ← Back to Docs
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Overview</h1>
          <p className="text-xl text-netcrab-muted">
            NetCrab is a behavioral analytics and benchmarking layer for internal tools.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <div>
            <p className="text-netcrab-muted">
              Instead of focusing on public web funnels, NetCrab specializes in:
            </p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-2 ml-4">
              <li>Intranet apps, back-office tools, and admin consoles</li>
              <li>"Junk" clickstream data: clicks, navigation, rage-clicks, errors, time-to-complete</li>
              <li>UX friction and efficiency for real workflows ("Update a customer record", "Approve an invoice")</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Key concepts</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-netcrab-text mb-2">Org and Product</h3>
                <ul className="text-netcrab-muted space-y-1">
                  <li><strong className="text-netcrab-text">Org</strong> – Your company or business unit (e.g., <code className="bg-netcrab-surface px-1 rounded">acme-org</code>).</li>
                  <li><strong className="text-netcrab-text">Product</strong> – A specific internal tool or app (e.g., <code className="bg-netcrab-surface px-1 rounded">crm-web</code>, <code className="bg-netcrab-surface px-1 rounded">billing-portal</code>).</li>
                </ul>
                <p className="text-netcrab-muted mt-2">NetCrab groups all behavior by <strong className="text-netcrab-text">org + product</strong>.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-netcrab-text mb-2">Session</h3>
                <p className="text-netcrab-muted">
                  A <strong className="text-netcrab-text">session</strong> is a continuous block of user activity inside a product:
                </p>
                <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4 mt-2">
                  <li>Starts on first event (page load, click).</li>
                  <li>Ends after a period of inactivity (e.g., 30 minutes) or explicit end.</li>
                  <li>Contains events, flows, and metrics.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-netcrab-text mb-2">Flow</h3>
                <p className="text-netcrab-muted">
                  A <strong className="text-netcrab-text">flow</strong> represents a user journey from A → B through your tool, like:
                </p>
                <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4 mt-2">
                  <li>"Open customer → Edit → Save"</li>
                  <li>"Search → Filter → Export CSV"</li>
                </ul>
                <p className="text-netcrab-muted mt-2">
                  NetCrab automatically infers common flows and lets you label key ones.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-netcrab-text mb-2">Hotspot</h3>
                <p className="text-netcrab-muted">
                  A <strong className="text-netcrab-text">hotspot</strong> is a UI area or step where users struggle:
                </p>
                <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4 mt-2">
                  <li>High <strong className="text-netcrab-text">rage-click</strong> or back-and-forth behavior.</li>
                  <li>High <strong className="text-netcrab-text">drop-off</strong> or <strong className="text-netcrab-text">error</strong> rate.</li>
                  <li>Abnormally long <strong className="text-netcrab-text">time-to-complete</strong>.</li>
                </ul>
                <p className="text-netcrab-muted mt-2">Hotspots feed into Crab Notes and the friction radar.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-netcrab-text mb-2">Friction Index</h3>
                <p className="text-netcrab-muted">
                  The <strong className="text-netcrab-text">Friction Index</strong> is a 0–1 score summarizing UX pain:
                </p>
                <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4 mt-2">
                  <li>Higher numbers = more friction.</li>
                  <li>Computed from a mix of:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Rage-clicks</li>
                      <li>Error events</li>
                      <li>Backtracks / oscillations</li>
                      <li>Abandoned flows</li>
                      <li>Time-to-complete outliers</li>
                    </ul>
                  </li>
                </ul>
                <p className="text-netcrab-muted mt-2">
                  You'll see friction as a headline metric for a product, per area in the Friction Radar, and per flow or hotspot.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-netcrab-text mb-2">Efficiency Score</h3>
                <p className="text-netcrab-muted">
                  The <strong className="text-netcrab-text">Efficiency Score</strong> (0–100%) captures how often users:
                </p>
                <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4 mt-2">
                  <li><strong className="text-netcrab-text">Complete flows successfully</strong>, and</li>
                  <li>Do so within a <strong className="text-netcrab-text">reasonable time budget</strong>.</li>
                </ul>
                <p className="text-netcrab-muted mt-2">
                  Think of it as "how often does this tool get out of the way and let people succeed?"
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-netcrab-text mb-2">Crab Notes</h3>
                <p className="text-netcrab-muted">
                  <strong className="text-netcrab-text">Crab Notes</strong> are AI-generated insights derived from your data, for example:
                </p>
                <div className="bg-netcrab-surface border border-netcrab-border rounded-lg p-4 my-4 italic text-netcrab-muted">
                  "Users in the 'Support' role often rage-click the Export button on <code className="bg-netcrab-card px-1 rounded">/cases</code> after the latest release. Error rate is 3.2× higher than last week."
                </div>
                <p className="text-netcrab-muted">
                  They provide plain-language explanations on top of dashboards.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-netcrab-text mb-2">Packs & Marketplace</h3>
                <p className="text-netcrab-muted">
                  A <strong className="text-netcrab-text">Pack</strong> is a curated benchmark dataset you can access or sell into, such as:
                </p>
                <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4 mt-2">
                  <li><strong className="text-netcrab-text">UX Benchmark Packs</strong> – e.g., "B2B CRM Onboarding Friction"</li>
                  <li><strong className="text-netcrab-text">Task-flow Archetype Packs</strong> – canonical journeys for common workflows</li>
                  <li><strong className="text-netcrab-text">Release Delta Packs</strong> – before/after comparisons across many orgs</li>
                </ul>
                <p className="text-netcrab-muted mt-2">You can:</p>
                <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
                  <li><strong className="text-netcrab-text">Buy packs</strong> to compare your internal tools against peers.</li>
                  <li><strong className="text-netcrab-text">Contribute anonymized patterns</strong> and earn revenue share/credits when packs sell.</li>
                </ul>
                <p className="text-netcrab-muted mt-2">
                  See <Link href="/docs/marketplace" className="text-netcrab-shell hover:underline">Benchmarks Marketplace</Link> for the full model.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

