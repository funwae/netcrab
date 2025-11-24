import Link from 'next/link';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';

export default function PrivacySecurityPage() {
  return (
    <div className="bg-netcrab-ink text-netcrab-text min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <Link href="/docs" className="text-netcrab-shell hover:underline text-sm mb-4 inline-block">
            ← Back to Docs
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy, Security & Compliance</h1>
          <p className="text-xl text-netcrab-muted">
            NetCrab is designed to be safe enough for internal tools from day one.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Data we do collect</h2>
            <p className="text-netcrab-muted mb-4">
              By default, NetCrab focuses on <strong className="text-netcrab-text">behavioral signals</strong>, not identities or content:
            </p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Clicks and UI actions (<code className="bg-netcrab-surface px-1 rounded">click</code>, <code className="bg-netcrab-surface px-1 rounded">submit</code>, <code className="bg-netcrab-surface px-1 rounded">navigate</code>)</li>
              <li>Page/screen views and route transitions</li>
              <li>Timing metrics (time on screen, time between steps)</li>
              <li>Error events (HTTP codes, known error IDs)</li>
              <li>Basic environment info (device type, browser, OS)</li>
            </ul>
            <p className="text-netcrab-muted mt-4">All events are tagged with:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li><code className="bg-netcrab-surface px-1 rounded">org_id</code></li>
              <li><code className="bg-netcrab-surface px-1 rounded">product_id</code></li>
              <li>Anonymous <code className="bg-netcrab-surface px-1 rounded">session_id</code></li>
              <li>Optional <code className="bg-netcrab-surface px-1 rounded">role</code> or <code className="bg-netcrab-surface px-1 rounded">segment</code> labels you define (e.g., Support, Sales)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Data we do not collect by default</h2>
            <p className="text-netcrab-muted mb-4">NetCrab does <strong className="text-netcrab-text">not</strong> collect:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Keystrokes or typed content</li>
              <li>Free-text fields (notes, comments, descriptions)</li>
              <li>Raw PII (names, emails, addresses, account numbers)</li>
              <li>File contents or attachments</li>
            </ul>
            <p className="text-netcrab-muted mt-4">If you attempt to send such data via the SDK, the agent will:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Drop those fields before sending, or</li>
              <li>Reject the payload (configurable).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Deployment & network model</h2>
            <ul className="list-disc list-inside text-netcrab-muted space-y-2 ml-4">
              <li><strong className="text-netcrab-text">Agent inside your intranet</strong> – The NetCrab agent runs close to your internal apps, usually in a DMZ or VPC.</li>
              <li><strong className="text-netcrab-text">Outbound-only</strong> – The agent initiates outbound connections to NetCrab's API over HTTPS (port 443). No inbound connections are required.</li>
              <li><strong className="text-netcrab-text">Configurable data egress</strong> – You can:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Restrict which products send data.</li>
                  <li>Limit which event types are allowed.</li>
                  <li>Control how much detail is included (e.g., paths only, no query params).</li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Marketplace safety</h2>
            <p className="text-netcrab-muted mb-4">When participating in the marketplace:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Only <strong className="text-netcrab-text">aggregated metrics</strong> are included in packs.</li>
              <li>NetCrab enforces:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Minimum cohort sizes (k-anonymity).</li>
                  <li>Differential privacy noise where appropriate.</li>
                </ul>
              </li>
              <li>No identifiable org names are shared inside packs; you will only be identified inside your <strong className="text-netcrab-text">own</strong> statements and console.</li>
            </ul>
            <p className="text-netcrab-muted mt-4">
              See <Link href="/docs/marketplace" className="text-netcrab-shell hover:underline">Benchmarks Marketplace</Link> for how packs are built and how revenue is shared.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Security practices</h2>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>All data in transit is encrypted with <strong className="text-netcrab-text">TLS 1.2+</strong>.</li>
              <li>Data at rest is encrypted with industry-standard algorithms.</li>
              <li>Access to production systems is limited to authorized personnel.</li>
              <li>Logs and access patterns are monitored for anomalies.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Compliance</h2>
            <p className="text-netcrab-muted mb-4">NetCrab can support:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li><strong className="text-netcrab-text">DPA / data processing addenda</strong> as needed.</li>
              <li>Region-specific data residency (on certain tiers).</li>
              <li>On-premises or VPC deployment for Fleet-tier customers.</li>
            </ul>
            <p className="text-netcrab-muted mt-4">
              If you have specific compliance questions (e.g., SOC 2, ISO 27001, HIPAA), contact us via the link 
              in the console or on the main site.
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}

