import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img
                src="/netcrab-logo.svg"
                alt="NetCrab Logo"
                className="h-32 w-32 md:h-40 md:w-40"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-coral-400 to-coral-600 bg-clip-text text-transparent">
              Your network is dropping crumbs of gold.
              <br />
              NetCrab picks them up.
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              NetCrab watches how people actually use your tools and turns all that 'junk' click data into clean product insight—and optional, anonymized benchmark packs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/app"
                className="px-8 py-4 bg-coral-500 text-white rounded-lg font-semibold hover:bg-coral-600 transition-colors text-lg"
              >
                Get a Demo
              </Link>
              <Link
                href="/marketplace"
                className="px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors text-lg border border-slate-700"
              >
                Explore the Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-coral-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collect</h3>
              <p className="text-slate-400">On-premise agent captures behavioral events—clicks, scrolls, navigation—anonymized and secure.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-coral-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Understand</h3>
              <p className="text-slate-400">AI-powered insights surface friction points, flow patterns, and efficiency scores automatically.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-coral-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Improve</h3>
              <p className="text-slate-400">Actionable Crab Notes and hotspot analysis help you fix what's broken, fast.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-coral-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share & Earn</h3>
              <p className="text-slate-400">Opt-in to contribute anonymized patterns to benchmark packs and earn revenue shares.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <div className="bg-slate-900 rounded p-4 mb-4">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-slate-700 rounded w-3/4"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-32 bg-slate-700 rounded"></div>
                  <div className="h-32 bg-slate-700 rounded"></div>
                  <div className="h-32 bg-slate-700 rounded"></div>
                </div>
                <div className="h-48 bg-slate-700 rounded"></div>
              </div>
            </div>
            <p className="text-center text-slate-400 italic">
              Friction radar, flows, and Crab Notes—out of the box.
            </p>
          </div>
        </div>
      </section>

      {/* For Product Teams vs Data Buyers */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
              <h3 className="text-2xl font-bold mb-4">For Product Teams</h3>
              <p className="text-slate-300 mb-4">
                Find and fix friction fast. NetCrab surfaces where users struggle, which flows break, and what's causing rage clicks—all without surveys or guesswork.
              </p>
              <ul className="space-y-2 text-slate-400">
                <li>✓ Real-time friction detection</li>
                <li>✓ Flow visualization and analysis</li>
                <li>✓ AI-generated insights (Crab Notes)</li>
                <li>✓ Version comparison and A/B testing</li>
              </ul>
            </div>
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
              <h3 className="text-2xl font-bold mb-4">For Data Buyers</h3>
              <p className="text-slate-300 mb-4">
                Benchmark your UX against the market. Access anonymized, aggregated benchmarks from hundreds of products to see how you stack up.
              </p>
              <ul className="space-y-2 text-slate-400">
                <li>✓ Industry-wide UX benchmarks</li>
                <li>✓ Task flow archetypes</li>
                <li>✓ Release delta analysis</li>
                <li>✓ API access and downloads</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">Privacy First</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-2">No PII</h3>
              <p className="text-slate-400">We never capture keystrokes, passwords, or personally identifiable information. Only behavioral patterns.</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-2">On-Prem Control</h3>
              <p className="text-slate-400">The NetCrab Agent runs on your infrastructure. You control exactly what data leaves your network.</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-2">Aggregated Only</h3>
              <p className="text-slate-400">Marketplace packs contain only aggregated, anonymized benchmarks. No individual user data is ever shared.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex items-center gap-3">
              <img
                src="/netcrab-logo.svg"
                alt="NetCrab"
                className="h-10 w-10"
              />
              <div>
                <h3 className="text-2xl font-bold mb-2">NetCrab</h3>
                <p className="text-slate-400">Turning network noise into product gold.</p>
              </div>
            </div>
            <nav className="flex gap-6">
              <Link href="/app" className="text-slate-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/marketplace" className="text-slate-400 hover:text-white transition-colors">
                Marketplace
              </Link>
              <a href="mailto:hello@netcrab.net" className="text-slate-400 hover:text-white transition-colors">
                Contact
              </a>
            </nav>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            © 2025 NetCrab. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

