import Link from 'next/link';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-netcrab-ink">
      <TopNav />
      <div className="bg-netcrab-ink text-netcrab-text min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 border-b border-netcrab-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pricing that doesn't pinch
          </h1>
          <p className="text-xl text-netcrab-muted mb-8 max-w-2xl mx-auto">
            Simple, predictable pricing by session bands—not per-event billing. 
            Plus, marketplace participation can offset your costs.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-netcrab-muted">
            <span>Monthly</span>
            <span className="px-2 py-1 bg-netcrab-crab/20 text-netcrab-crab rounded text-xs">Annual saves 20%</span>
            <span>Annual</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Crab Tank - Free */}
            <div className="bg-netcrab-surface rounded-lg border border-netcrab-border p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-netcrab-text mb-2">Crab Tank</h3>
                <p className="text-netcrab-muted text-sm mb-4">Free / Sandbox</p>
                <div className="text-4xl font-bold text-netcrab-text mb-1">$0</div>
                <p className="text-sm text-netcrab-muted">Forever</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Up to 10k sessions/month</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>1 product</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Friction index & efficiency score</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Basic flows & hotspots</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Crab Notes in console</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-netcrab-muted">
                  <span className="mt-1">—</span>
                  <span>No marketplace participation</span>
                </li>
              </ul>
              <Link
                href="/app"
                className="block w-full text-center px-6 py-3 bg-netcrab-card border border-netcrab-border rounded-lg hover:bg-netcrab-card/80 transition-colors font-medium"
              >
                Get Started Free
              </Link>
            </div>

            {/* Team Net - Growth */}
            <div className="bg-netcrab-surface rounded-lg border-2 border-netcrab-crab p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-netcrab-crab text-white text-xs rounded-full font-medium">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-netcrab-text mb-2">Team Net</h3>
                <p className="text-netcrab-muted text-sm mb-4">Growth</p>
                <div className="text-4xl font-bold text-netcrab-text mb-1">$199</div>
                <p className="text-sm text-netcrab-muted">Per month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Up to 100k sessions/month</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>3 products</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>15 seats</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Advanced flows & segments</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Version comparison (release deltas)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Automated Crab Notes</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Marketplace participation & revenue share</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Email/export reports</span>
                </li>
              </ul>
              <Link
                href="/app"
                className="block w-full text-center px-6 py-3 bg-netcrab-crab text-white rounded-lg hover:bg-netcrab-crab/90 transition-colors font-medium"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Fleet - Enterprise */}
            <div className="bg-netcrab-surface rounded-lg border border-netcrab-border p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-netcrab-text mb-2">Fleet</h3>
                <p className="text-netcrab-muted text-sm mb-4">Enterprise</p>
                <div className="text-4xl font-bold text-netcrab-text mb-1">Custom</div>
                <p className="text-sm text-netcrab-muted">Contact sales</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>500k+ sessions/month</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Unlimited products</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>SSO & advanced RBAC</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>VPC or on-prem deployment</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Data residency options</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Custom data retention</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Dedicated support & onboarding</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-netcrab-shell mt-1">✓</span>
                  <span>Custom marketplace rules</span>
                </li>
              </ul>
              <Link
                href="/app"
                className="block w-full text-center px-6 py-3 bg-netcrab-card border border-netcrab-border rounded-lg hover:bg-netcrab-card/80 transition-colors font-medium"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          {/* Comparison Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-netcrab-text mb-4 text-center">
              How NetCrab compares
            </h2>
            <p className="text-netcrab-muted text-center mb-8 max-w-2xl mx-auto">
              NetCrab isn't trying to be "yet another product analytics tool." We're focused on 
              intranet tools, privacy-first deployment, and turning your "junk" click data into 
              both product insight <em>and</em> optional marketplace revenue.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-netcrab-border">
                    <th className="text-left p-4 text-netcrab-text font-semibold"></th>
                    <th className="text-left p-4 text-netcrab-text font-semibold">
                      <div>NetCrab</div>
                      <div className="text-xs text-netcrab-muted font-normal mt-1">Intranet-first</div>
                    </th>
                    <th className="text-left p-4 text-netcrab-text font-semibold">
                      <div>FullStory</div>
                      <div className="text-xs text-netcrab-muted font-normal mt-1">Enterprise DXI</div>
                    </th>
                    <th className="text-left p-4 text-netcrab-text font-semibold">
                      <div>PostHog</div>
                      <div className="text-xs text-netcrab-muted font-normal mt-1">Dev-first</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-netcrab-border/50">
                    <td className="p-4 font-medium text-netcrab-text">Focus</td>
                    <td className="p-4 text-netcrab-muted text-sm">Intranet & internal tools; UX friction & behavior "crumbs"</td>
                    <td className="p-4 text-netcrab-muted text-sm">Broad web & app DXI / product analytics</td>
                    <td className="p-4 text-netcrab-muted text-sm">Product OS (analytics, replay, flags, experiments)</td>
                  </tr>
                  <tr className="border-b border-netcrab-border/50">
                    <td className="p-4 font-medium text-netcrab-text">Deployment</td>
                    <td className="p-4 text-netcrab-muted text-sm">Intranet-first agent, on-prem / VPC-friendly</td>
                    <td className="p-4 text-netcrab-muted text-sm">Cloud-only, SaaS</td>
                    <td className="p-4 text-netcrab-muted text-sm">Cloud or self-host (with evolving guidance)</td>
                  </tr>
                  <tr className="border-b border-netcrab-border/50">
                    <td className="p-4 font-medium text-netcrab-text">Pricing style</td>
                    <td className="p-4 text-netcrab-muted text-sm">Simple tiers by monthly sessions, with transparent caps</td>
                    <td className="p-4 text-netcrab-muted text-sm">Tiered by sessions; pricing mostly via sales, typical deals in low-five-figures/year for mid-market</td>
                    <td className="p-4 text-netcrab-muted text-sm">Usage-based: per event, per recording; generous free tier but variable bill</td>
                  </tr>
                  <tr className="border-b border-netcrab-border/50">
                    <td className="p-4 font-medium text-netcrab-text">Free tier</td>
                    <td className="p-4 text-netcrab-muted text-sm">Crab Tank: up to 10k internal sessions, 1 product</td>
                    <td className="p-4 text-netcrab-muted text-sm">Free plan with limited behavioral analytics and session replays</td>
                    <td className="p-4 text-netcrab-muted text-sm">1M events + 5k replays + flags, etc., free every month</td>
                  </tr>
                  <tr className="border-b border-netcrab-border/50">
                    <td className="p-4 font-medium text-netcrab-text">Marketplace / benchmarks</td>
                    <td className="p-4 text-netcrab-muted text-sm">Built-in anonymized benchmark packs + revenue share back to contributors</td>
                    <td className="p-4 text-netcrab-muted text-sm">No built-in marketplace; benchmarks mostly internal</td>
                    <td className="p-4 text-netcrab-muted text-sm">No built-in marketplace; can export data to other tools</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-netcrab-text">Best fit</td>
                    <td className="p-4 text-netcrab-muted text-sm">Product teams improving internal tools & workflows, who also like the idea of earning from benchmarks</td>
                    <td className="p-4 text-netcrab-muted text-sm">Growth/enterprise teams needing rich DXI across web & mobile</td>
                    <td className="p-4 text-netcrab-muted text-sm">Product-led teams with strong dev resources and appetite for metered pricing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-bold text-netcrab-text mb-8 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-netcrab-surface rounded-lg border border-netcrab-border p-6">
                <h3 className="text-lg font-semibold text-netcrab-text mb-2">
                  Is this safe for HR/finance tools?
                </h3>
                <p className="text-netcrab-muted text-sm">
                  Yes. NetCrab is designed to be privacy-first by default. We don't collect keystrokes, 
                  free-text content, or PII. The agent runs inside your network and you control what leaves. 
                  See our <Link href="/docs/privacy-security" className="text-netcrab-shell hover:underline">Privacy & Security</Link> docs for details.
                </p>
              </div>
              <div className="bg-netcrab-surface rounded-lg border border-netcrab-border p-6">
                <h3 className="text-lg font-semibold text-netcrab-text mb-2">
                  Can I run NetCrab on-prem or in my own VPC?
                </h3>
                <p className="text-netcrab-muted text-sm">
                  Yes, on the Fleet (Enterprise) tier. The agent can run entirely on-prem, and you can 
                  choose to keep all data within your own infrastructure. Contact sales to discuss deployment options.
                </p>
              </div>
              <div className="bg-netcrab-surface rounded-lg border border-netcrab-border p-6">
                <h3 className="text-lg font-semibold text-netcrab-text mb-2">
                  How does the marketplace revenue share work?
                </h3>
                <p className="text-netcrab-muted text-sm">
                  When you opt in a product to the marketplace, your anonymized patterns contribute to benchmark packs. 
                  When those packs are sold, NetCrab takes a platform fee (e.g., 30%), and the rest is distributed 
                  to contributing orgs based on their session contributions. You receive monthly statements showing 
                  your share. See <Link href="/docs/marketplace" className="text-netcrab-shell hover:underline">Marketplace docs</Link> for details.
                </p>
              </div>
              <div className="bg-netcrab-surface rounded-lg border border-netcrab-border p-6">
                <h3 className="text-lg font-semibold text-netcrab-text mb-2">
                  What happens if we opt out of the marketplace later?
                </h3>
                <p className="text-netcrab-muted text-sm">
                  You can opt out at any time. Changes take effect for future aggregation runs. Historical 
                  aggregate metrics may remain in previously built packs (they're already anonymized and aggregated), 
                  but no new data will be included.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </main>
  );
}

