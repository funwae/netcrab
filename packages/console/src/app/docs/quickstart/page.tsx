import Link from 'next/link';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';

export default function QuickstartPage() {
  return (
    <div className="bg-netcrab-ink text-netcrab-text min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <Link href="/docs" className="text-netcrab-shell hover:underline text-sm mb-4 inline-block">
            ← Back to Docs
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Quickstart</h1>
          <p className="text-xl text-netcrab-muted">
            This guide takes you from zero to your first friction radar in about 20–30 minutes 
            (assuming you control a test environment for an internal app).
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">1. Create your org and product</h2>
            <ol className="list-decimal list-inside text-netcrab-muted space-y-2 ml-4">
              <li>Sign in to the NetCrab Console.</li>
              <li>Create an <strong className="text-netcrab-text">Org</strong> (e.g., <code className="bg-netcrab-surface px-1 rounded">acme-org</code>).</li>
              <li>Create a <strong className="text-netcrab-text">Product</strong> (e.g., <code className="bg-netcrab-surface px-1 rounded">crm-web</code>) and mark it as <strong className="text-netcrab-text">internal</strong>.</li>
            </ol>
            <p className="text-netcrab-muted mt-4">
              You'll receive an <strong className="text-netcrab-text">Org ID</strong> (<code className="bg-netcrab-surface px-1 rounded">org_id</code>) and 
              a <strong className="text-netcrab-text">Product ID</strong> (<code className="bg-netcrab-surface px-1 rounded">product_id</code>). 
              You'll use these in the agent configuration.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">2. Install the NetCrab Intranet Agent</h2>
            <div className="bg-netcrab-surface border border-netcrab-border rounded-lg p-4 mb-4">
              <p className="text-netcrab-muted text-sm mb-2">💡 For proof-of-concept, use a <strong className="text-netcrab-text">non-production</strong> environment first.</p>
            </div>
            <ol className="list-decimal list-inside text-netcrab-muted space-y-2 ml-4">
              <li>Pick a host or container that can see your internal app traffic.</li>
              <li>Install the agent (example: Docker):</li>
            </ol>
            <div className="bg-netcrab-surface border border-netcrab-border rounded-lg p-4 my-4 overflow-x-auto">
              <pre className="text-sm text-netcrab-muted">
{`docker run -d --name netcrab-agent \\
  -e NETCRAB_ORG_ID=acme-org \\
  -e NETCRAB_PRODUCT_ID=crm-web \\
  -e NETCRAB_ENV=staging \\
  -e NETCRAB_API_BASE=https://api.netcrab.net \\
  -p 9000:9000 \\
  your-registry/netcrab-agent:latest`}
              </pre>
            </div>
            <ol className="list-decimal list-inside text-netcrab-muted space-y-2 ml-4" start={3}>
              <li>Configure your app (or reverse proxy) to send:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Click / event beacons</li>
                  <li>Route changes</li>
                  <li>Error events</li>
                </ul>
              </li>
            </ol>
            <p className="text-netcrab-muted mt-4">
              For browser apps, this can be a small snippet or SDK wrapper; for server-rendered apps, 
              use middleware to emit events.
            </p>
            <p className="text-netcrab-muted mt-2">
              See <Link href="/docs/agent" className="text-netcrab-shell hover:underline">Intranet Agent & Data Collection</Link> for full config examples.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">3. Verify events are flowing</h2>
            <p className="text-netcrab-muted mb-2">In the NetCrab Console:</p>
            <ol className="list-decimal list-inside text-netcrab-muted space-y-2 ml-4">
              <li>Go to <strong className="text-netcrab-text">Overview → Data Health</strong>.</li>
              <li>Confirm that:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Sessions are increasing.</li>
                  <li>Events per session look non-zero.</li>
                  <li>At least one product is listed.</li>
                </ul>
              </li>
            </ol>
            <p className="text-netcrab-muted mt-4">If nothing shows up:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Double-check the <code className="bg-netcrab-surface px-1 rounded">NETCRAB_ORG_ID</code> and <code className="bg-netcrab-surface px-1 rounded">NETCRAB_PRODUCT_ID</code>.</li>
              <li>Confirm the agent can reach <code className="bg-netcrab-surface px-1 rounded">NETCRAB_API_BASE</code>.</li>
              <li>Verify your app is actually sending events (e.g., via browser dev tools or logs).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">4. Drive a few test flows</h2>
            <p className="text-netcrab-muted mb-2">Have 1–3 people:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Log into the internal app.</li>
              <li>Perform <strong className="text-netcrab-text">realistic tasks</strong> (e.g., search, edit, export).</li>
              <li>Intentionally:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Do some <strong className="text-netcrab-text">happy paths</strong> (complete workflows).</li>
                  <li>Do some <strong className="text-netcrab-text">struggle cases</strong> (click around, get stuck, backtrack).</li>
                </ul>
              </li>
            </ul>
            <p className="text-netcrab-muted mt-4">
              After a few minutes, NetCrab will have enough data to sketch sessions/minute, basic flows, and initial hotspots.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">5. Read your first friction radar</h2>
            <p className="text-netcrab-muted mb-2">In the Console, open:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li><strong className="text-netcrab-text">Overview</strong> for your product:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Friction index</li>
                  <li>Efficiency score</li>
                  <li>Key metrics</li>
                </ul>
              </li>
              <li>The <strong className="text-netcrab-text">Friction Radar</strong>:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Areas like "Onboarding", "Billing", "Support", "Reporting", "Search".</li>
                </ul>
              </li>
            </ul>
            <p className="text-netcrab-muted mt-4">
              These areas are auto-derived from paths and event tags; you can rename or regroup them later.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">6. Check Crab Notes</h2>
            <p className="text-netcrab-muted mb-2">Navigate to <strong className="text-netcrab-text">Crab Notes</strong>:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>You'll see 2–5 synthesized insights based on your early data.</li>
              <li>Mark them as:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>✅ Accepted (good insight)</li>
                  <li>💤 Not actionable</li>
                  <li>❌ Ignore</li>
                </ul>
              </li>
            </ul>
            <p className="text-netcrab-muted mt-4">
              This feedback helps NetCrab tune future Crab Notes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">7. Invite your team</h2>
            <p className="text-netcrab-muted mb-2">Once you're happy with the first signals:</p>
            <ol className="list-decimal list-inside text-netcrab-muted space-y-2 ml-4">
              <li>Go to <strong className="text-netcrab-text">Settings → Members</strong>.</li>
              <li>Invite:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>PMs and designers</li>
                  <li>Engineering leads for the internal tool</li>
                  <li>Ops/support managers who feel the pain</li>
                </ul>
              </li>
              <li>Share:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>A link to the <strong className="text-netcrab-text">Overview</strong>.</li>
                  <li>1–2 initial Crab Notes you want to validate.</li>
                  <li>A short request: "Does this match what you see day-to-day?"</li>
                </ul>
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">8. Next steps</h2>
            <p className="text-netcrab-muted mb-2">From here, most teams:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Wire in <strong className="text-netcrab-text">role and segment tags</strong> (Support vs Sales vs Finance).</li>
              <li>Tag key flows (e.g. "Create Opportunity", "Close Case").</li>
              <li>Decide <strong className="text-netcrab-text">if/when to opt into the benchmarks marketplace</strong>.</li>
            </ul>
            <p className="text-netcrab-muted mt-4">Continue with:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li><Link href="/docs/agent" className="text-netcrab-shell hover:underline">Intranet Agent & Data Collection</Link></li>
              <li><Link href="/docs/dashboard" className="text-netcrab-shell hover:underline">Console & Analytics</Link></li>
              <li><Link href="/docs/marketplace" className="text-netcrab-shell hover:underline">Benchmarks Marketplace</Link></li>
            </ul>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}

