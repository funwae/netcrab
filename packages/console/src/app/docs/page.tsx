import Link from 'next/link';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';

export default function DocsPage() {
  const docSections = [
    {
      title: 'Getting Started',
      items: [
        { href: '/docs/overview', title: 'Product Overview', description: 'What NetCrab is & when to use it' },
        { href: '/docs/quickstart', title: 'Quickstart', description: 'From install to first Crab Notes' },
      ],
    },
    {
      title: 'Core Concepts',
      items: [
        { href: '/docs/agent', title: 'Intranet Agent & Data Collection', description: 'Deploying and configuring the agent' },
        { href: '/docs/dashboard', title: 'Console & Analytics', description: 'Using the NetCrab dashboard' },
      ],
    },
    {
      title: 'Marketplace',
      items: [
        { href: '/docs/marketplace', title: 'Benchmarks Marketplace', description: 'Revenue share & benchmark packs' },
      ],
    },
    {
      title: 'Reference',
      items: [
        { href: '/docs/privacy-security', title: 'Privacy, Security & Compliance', description: 'Data handling and safety' },
        { href: '/docs/pricing', title: 'Pricing & Tiers', description: 'Detailed pricing information' },
        { href: '/docs/api', title: 'API Overview', description: 'API endpoints and authentication' },
        { href: '/docs/faq', title: 'FAQ', description: 'Common questions' },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-netcrab-ink">
      <TopNav />
      <div className="bg-netcrab-ink text-netcrab-text min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to NetCrab</h1>
          <p className="text-xl text-netcrab-muted max-w-3xl">
            NetCrab turns the "junk" behavioral exhaust from your internal tools into clear friction insights, 
            actionable Crab Notes, and optional anonymized benchmark packs that you can sell or earn credit from.
          </p>
        </div>

        <div className="mb-12 bg-netcrab-surface rounded-lg border border-netcrab-border p-6">
          <h2 className="text-2xl font-bold text-netcrab-text mb-4">Who NetCrab is for</h2>
          <p className="text-netcrab-muted mb-4">
            NetCrab is designed for teams who:
          </p>
          <ul className="space-y-2 text-netcrab-muted">
            <li className="flex items-start gap-2">
              <span className="text-netcrab-shell mt-1">✓</span>
              <span>Own internal tools / intranet apps (CRM, back office, support tools, admin consoles)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-netcrab-shell mt-1">✓</span>
              <span>Want to find and fix UX friction in those tools</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-netcrab-shell mt-1">✓</span>
              <span>Prefer simple, predictable pricing over per-event billing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-netcrab-shell mt-1">✓</span>
              <span>Like the idea that their anonymous "crumbs" can feed benchmarks and marketplace revenue</span>
            </li>
          </ul>
        </div>

        <div className="space-y-12">
          {docSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-2xl font-bold text-netcrab-text mb-6">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="bg-netcrab-surface rounded-lg border border-netcrab-border p-6 hover:border-netcrab-shell/30 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-netcrab-text mb-2">{item.title}</h3>
                    <p className="text-sm text-netcrab-muted">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-netcrab-crab/10 rounded-lg border border-netcrab-crab/30 p-8 text-center">
          <h2 className="text-2xl font-bold text-netcrab-text mb-4">Ready to get started?</h2>
          <p className="text-netcrab-muted mb-6">
            Follow the <Link href="/docs/quickstart" className="text-netcrab-shell hover:underline">Quickstart guide</Link> to 
            install the agent and see your first friction radar in about 20 minutes.
          </p>
          <Link
            href="/app"
            className="inline-block px-6 py-3 bg-netcrab-crab text-white rounded-lg hover:bg-netcrab-crab/90 transition-colors font-medium"
          >
            Go to Console
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}

