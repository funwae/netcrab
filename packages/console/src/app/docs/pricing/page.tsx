import Link from 'next/link';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';

export default function DocsPricingPage() {
  return (
    <div className="bg-netcrab-ink text-netcrab-text min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <Link href="/docs" className="text-netcrab-shell hover:underline text-sm mb-4 inline-block">
            ← Back to Docs
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pricing & Tiers</h1>
          <p className="text-xl text-netcrab-muted">
            NetCrab aims to make pricing simple and predictable: you pay by session bands, not by every individual event.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Crab Tank (Free)</h2>
            <p className="text-netcrab-muted mb-2">Best for <strong className="text-netcrab-text">small teams, pilots, and experiments</strong>.</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li><strong className="text-netcrab-text">Price:</strong> $0 / forever</li>
              <li><strong className="text-netcrab-text">Usage:</strong> Up to <strong className="text-netcrab-text">10k sessions/month</strong> for 1 internal product</li>
              <li><strong className="text-netcrab-text">Includes:</strong>
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Intranet agent</li>
                  <li>Friction index & efficiency score</li>
                  <li>Basic flows & hotspots</li>
                  <li>Crab Notes in the console</li>
                </ul>
              </li>
              <li><strong className="text-netcrab-text">Marketplace:</strong> Browse only; no data contribution or revenue share.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Team Net (Growth)</h2>
            <p className="text-netcrab-muted mb-2">Best for <strong className="text-netcrab-text">product teams with 1–3 critical internal tools</strong>.</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li><strong className="text-netcrab-text">Starting price:</strong> e.g., <strong className="text-netcrab-text">$149–$249/month</strong> (subject to change)</li>
              <li><strong className="text-netcrab-text">Usage:</strong> Bands like:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Up to 100k sessions/month</li>
                  <li>Up to 3 products</li>
                  <li>~15 seats</li>
                </ul>
              </li>
              <li><strong className="text-netcrab-text">Includes:</strong>
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Everything in Crab Tank</li>
                  <li>Advanced flows and user segments (role, device, app area)</li>
                  <li>Version comparison (release deltas)</li>
                  <li>Export and email reports</li>
                  <li>Priority support</li>
                </ul>
              </li>
              <li><strong className="text-netcrab-text">Marketplace:</strong>
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Opt-in per product</li>
                  <li>Access to benchmark packs at discounted rates</li>
                  <li>Revenue share / credits when your data contributes to purchased packs</li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">Fleet (Enterprise)</h2>
            <p className="text-netcrab-muted mb-2">Best for <strong className="text-netcrab-text">large orgs and compliance-sensitive environments</strong>.</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li><strong className="text-netcrab-text">Pricing:</strong> Custom, annual agreement</li>
              <li><strong className="text-netcrab-text">Usage:</strong> 500k+ sessions/month, many products</li>
              <li><strong className="text-netcrab-text">Includes:</strong>
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Everything in Team Net</li>
                  <li>VPC or on-prem deployment options</li>
                  <li>SSO & advanced RBAC</li>
                  <li>Data residency choices (where available)</li>
                  <li>Custom data retention/purge policies</li>
                  <li>Dedicated support & onboarding</li>
                  <li>Custom marketplace rules (e.g., which segments may contribute)</li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-netcrab-text mb-4">How billing works</h2>
            <ul className="list-disc list-inside text-netcrab-muted space-y-2 ml-4">
              <li><strong className="text-netcrab-text">Monthly billing</strong> by default; annual plans available.</li>
              <li>Each plan includes an <strong className="text-netcrab-text">included session band</strong>.</li>
              <li>If you burst above your band, you can:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Upgrade to a higher tier, or</li>
                  <li>Pay a simple overage rate per 10k sessions.</li>
                </ul>
              </li>
            </ul>
            <p className="text-netcrab-muted mt-4"><strong className="text-netcrab-text">Marketplace revenue share</strong> (Team Net / Fleet):</p>
            <ul className="list-disc list-inside text-netcrab-muted space-y-1 ml-4">
              <li>NetCrab takes a <strong className="text-netcrab-text">platform fee</strong>.</li>
              <li>The rest is distributed to contributing orgs based on sessions in each pack.</li>
              <li>You see a <strong className="text-netcrab-text">Marketplace Statement</strong> each month in the console.</li>
            </ul>
          </div>

          <div className="bg-netcrab-surface border border-netcrab-border rounded-lg p-6">
            <p className="text-netcrab-muted">
              For current public prices and any promotions, see the <Link href="/pricing" className="text-netcrab-shell hover:underline">Pricing page</Link> on the main site.
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}

