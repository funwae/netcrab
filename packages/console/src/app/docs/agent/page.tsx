import Link from 'next/link';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';

export default function AgentPage() {
  return (
    <div className="bg-netcrab-ink text-netcrab-text min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <Link href="/docs" className="text-netcrab-shell hover:underline text-sm mb-4 inline-block">
            ← Back to Docs
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Intranet Agent & Data Collection</h1>
          <p className="text-xl text-netcrab-muted">
            The NetCrab agent runs inside your network and captures behavioral events from your internal tools.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Overview</h2>
            <p className="text-netcrab-muted">
              The NetCrab Intranet Agent is a lightweight service that:
            </p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Runs close to your internal apps (DMZ, VPC, or on-prem)</li>
              <li>Receives event beacons from your apps (via SDK or middleware)</li>
              <li>Scrubs PII and sensitive data before sending</li>
              <li>Batches and forwards events to NetCrab's cloud API</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Installation</h2>
            <p className="text-netcrab-muted mb-4">The agent can be deployed as:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Docker container</li>
              <li>Kubernetes deployment</li>
              <li>Standalone binary (Linux/Windows)</li>
            </ul>
            <p className="text-netcrab-muted mt-4">
              See the <Link href="/docs/quickstart" className="text-netcrab-shell hover:underline">Quickstart guide</Link> for installation steps.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Configuration</h2>
            <p className="text-netcrab-muted mb-4">Key environment variables:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-2 ml-4">
              <li><code className="bg-netcrab-surface px-1 rounded">NETCRAB_ORG_ID</code> – Your organization ID</li>
              <li><code className="bg-netcrab-surface px-1 rounded">NETCRAB_PRODUCT_ID</code> – Product identifier</li>
              <li><code className="bg-netcrab-surface px-1 rounded">NETCRAB_API_BASE</code> – NetCrab API endpoint</li>
              <li><code className="bg-netcrab-surface px-1 rounded">NETCRAB_ENV</code> – Environment (staging, production)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Data Collection</h2>
            <p className="text-netcrab-muted mb-4">The agent collects:</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>Click events and UI interactions</li>
              <li>Page/screen views and navigation</li>
              <li>Error events and performance metrics</li>
              <li>Timing data (time on screen, time between steps)</li>
            </ul>
            <p className="text-netcrab-muted mt-4">
              All data is scrubbed of PII before leaving your network. See <Link href="/docs/privacy-security" className="text-netcrab-shell hover:underline">Privacy & Security</Link> for details.
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}

