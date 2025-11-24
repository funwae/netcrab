import Link from 'next/link';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';

export default function FAQPage() {
  const faqs = [
    {
      q: 'Is NetCrab safe for HR/finance tools?',
      a: 'Yes. NetCrab is designed to be privacy-first by default. We don\'t collect keystrokes, free-text content, or PII. The agent runs inside your network and you control what leaves. See our Privacy & Security docs for details.',
      link: '/docs/privacy-security',
    },
    {
      q: 'Can I run NetCrab on-prem or in my own VPC?',
      a: 'Yes, on the Fleet (Enterprise) tier. The agent can run entirely on-prem, and you can choose to keep all data within your own infrastructure. Contact sales to discuss deployment options.',
    },
    {
      q: 'What happens if we opt out of the marketplace later?',
      a: 'You can opt out at any time. Changes take effect for future aggregation runs. Historical aggregate metrics may remain in previously built packs (they\'re already anonymized and aggregated), but no new data will be included.',
    },
    {
      q: 'How is friction computed?',
      a: 'The Friction Index combines multiple signals: rage-clicks, error events, backtracks/oscillations, abandoned flows, and time-to-complete outliers. It\'s normalized to a 0–1 scale where higher numbers indicate more friction.',
    },
    {
      q: 'What\'s the difference between sessions and events?',
      a: 'A session is a continuous block of user activity (typically ending after 30 minutes of inactivity). Events are individual actions within a session (clicks, page views, errors). NetCrab pricing is based on sessions, not individual events.',
    },
    {
      q: 'How does the marketplace revenue share work?',
      a: 'When you opt in a product to the marketplace, your anonymized patterns contribute to benchmark packs. When those packs are sold, NetCrab takes a platform fee (e.g., 30%), and the rest is distributed to contributing orgs based on their session contributions. You receive monthly statements showing your share.',
      link: '/docs/marketplace',
    },
  ];

  return (
    <main className="min-h-screen bg-netcrab-ink">
      <TopNav />
      <div className="bg-netcrab-ink text-netcrab-text min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <Link href="/docs" className="text-netcrab-shell hover:underline text-sm mb-4 inline-block">
            ← Back to Docs
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-netcrab-surface rounded-lg border border-netcrab-border p-6">
              <h2 className="text-xl font-semibold text-netcrab-text mb-3">{faq.q}</h2>
              <p className="text-netcrab-muted">
                {faq.a}
                {faq.link && (
                  <> See <Link href={faq.link} className="text-netcrab-shell hover:underline">here</Link> for details.</>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}

