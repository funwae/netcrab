import Link from 'next/link';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';

export default function ApiPage() {
  return (
    <div className="bg-netcrab-ink text-netcrab-text min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <Link href="/docs" className="text-netcrab-shell hover:underline text-sm mb-4 inline-block">
            ← Back to Docs
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">API Overview</h1>
          <p className="text-xl text-netcrab-muted">
            NetCrab exposes a small, focused HTTP API for fetching analytics, querying packs, and managing API keys.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Authentication</h2>
            <p className="text-netcrab-muted mb-4">All requests use a <strong className="text-netcrab-text">Bearer API key</strong>:</p>
            <div className="bg-netcrab-surface border border-netcrab-border rounded-lg p-4 my-4 overflow-x-auto">
              <pre className="text-sm text-netcrab-muted">
{`Authorization: Bearer nc_live_xxx…`}
              </pre>
            </div>
            <p className="text-netcrab-muted">
              You can create and revoke keys under <strong className="text-netcrab-text">Settings → API Keys</strong> in the console. 
              Keys can be scoped to specific orgs/products (depending on tier).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Core endpoints</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-netcrab-text mb-2">Analytics</h3>
                <ul className="list-disc list-inside text-netcrab-muted space-y-2 ml-4">
                  <li><code className="bg-netcrab-surface px-1 rounded">GET /v1/analytics/overview?org={'{org_id}'}&product={'{product_id}'}&range=7d</code> – High-level metrics: friction index, efficiency score, sessions, and radar.</li>
                  <li><code className="bg-netcrab-surface px-1 rounded">GET /v1/analytics/flows?org={'{org_id}'}&product={'{product_id}'}&range=7d</code> – Aggregated flow metrics.</li>
                  <li><code className="bg-netcrab-surface px-1 rounded">GET /v1/analytics/hotspots?org={'{org_id}'}&product={'{product_id}'}&range=7d</code> – Top hotspots for a product.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-netcrab-text mb-2">Marketplace</h3>
                <ul className="list-disc list-inside text-netcrab-muted space-y-2 ml-4">
                  <li><code className="bg-netcrab-surface px-1 rounded">GET /v1/packs</code> – List packs available to your org.</li>
                  <li><code className="bg-netcrab-surface px-1 rounded">GET /v1/packs/{'{pack_id}'}</code> – Metadata and sample preview.</li>
                  <li><code className="bg-netcrab-surface px-1 rounded">GET /v1/packs/{'{pack_id}'}/data</code> – Access metrics for a purchased pack.</li>
                  <li><code className="bg-netcrab-surface px-1 rounded">GET /v1/marketplace/statements?month=YYYY-MM-DD</code> – Monthly marketplace statement for your org.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-netcrab-text mb-2">API Keys</h3>
                <ul className="list-disc list-inside text-netcrab-muted space-y-2 ml-4">
                  <li><code className="bg-netcrab-surface px-1 rounded">GET /v1/api-keys</code></li>
                  <li><code className="bg-netcrab-surface px-1 rounded">POST /v1/api-keys</code> (create)</li>
                  <li><code className="bg-netcrab-surface px-1 rounded">DELETE /v1/api-keys/{'{id}'}</code></li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Rate limits</h2>
            <p className="text-netcrab-muted mb-4">
              NetCrab uses simple <strong className="text-netcrab-text">per-key rate limits</strong>:
            </p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Burst and sustained limits per minute.</li>
              <li>429 responses when limits are exceeded.</li>
            </ul>
            <p className="text-netcrab-muted mt-4">
              Details and current limits are shown in the console next to your API keys.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Example: fetching the friction radar</h2>
            <div className="bg-netcrab-surface border border-netcrab-border rounded-lg p-4 my-4 overflow-x-auto">
              <pre className="text-sm text-netcrab-muted">
{`curl "https://api.netcrab.net/v1/analytics/overview?org=acme-org&product=crm-web&range=7d" \\
  -H "Authorization: Bearer nc_live_your_key_here"`}
              </pre>
            </div>
            <p className="text-netcrab-muted mb-2">The response includes:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li><code className="bg-netcrab-surface px-1 rounded">friction_index</code></li>
              <li><code className="bg-netcrab-surface px-1 rounded">efficiency_score</code></li>
              <li><code className="bg-netcrab-surface px-1 rounded">sessions</code></li>
              <li><code className="bg-netcrab-surface px-1 rounded">radar</code> (per area)</li>
              <li><code className="bg-netcrab-surface px-1 rounded">top_hotspots</code></li>
            </ul>
            <p className="text-netcrab-muted mt-4">
              You can surface this in your own internal dashboards or BI tools.
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}

