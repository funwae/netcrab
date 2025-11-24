import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-netcrab-ink text-netcrab-text py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left: Text + CTAs */}
          <div>
            <div className="flex justify-center lg:justify-start mb-8">
              <img
                src="/netcrab-logo.svg"
                alt="NetCrab Logo"
                className="h-24 w-24 lg:h-32 lg:w-32"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your network is dropping{' '}
              <span className="bg-gradient-to-r from-netcrab-crab to-netcrab-aqua bg-clip-text text-transparent">
                crumbs of gold
              </span>
              .<br />
              NetCrab picks them up.
            </h1>
            <p className="text-xl md:text-2xl text-netcrab-muted mb-8 leading-relaxed">
              NetCrab watches how people actually use your tools and turns all that 'junk' click data into clean product insight—and optional, anonymized benchmark packs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/app"
                className="px-8 py-4 bg-netcrab-crab text-white rounded-lg font-semibold hover:bg-netcrab-crab/90 transition-colors text-lg text-center"
              >
                View Live Demo
              </Link>
              <Link
                href="/marketplace"
                className="px-8 py-4 bg-netcrab-surface border border-netcrab-aqua/30 text-netcrab-text rounded-lg font-semibold hover:bg-netcrab-card transition-colors text-lg text-center"
              >
                Explore the Marketplace
              </Link>
            </div>
          </div>

          {/* Right: Dashboard Preview Card */}
          <div className="relative">
            <div className="bg-netcrab-surface rounded-lg p-6 border border-netcrab-card shadow-2xl">
              <div className="bg-netcrab-ink rounded p-4 mb-4">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-netcrab-card rounded w-3/4"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-32 bg-netcrab-card rounded flex items-center justify-center">
                      <div className="text-netcrab-muted text-sm">Friction: 0.42</div>
                    </div>
                    <div className="h-32 bg-netcrab-card rounded flex items-center justify-center">
                      <div className="text-netcrab-muted text-sm">Efficiency: 78%</div>
                    </div>
                    <div className="h-32 bg-netcrab-card rounded flex items-center justify-center">
                      <div className="text-netcrab-muted text-sm">12.4k sessions</div>
                    </div>
                  </div>
                  <div className="h-48 bg-netcrab-card rounded flex items-center justify-center">
                    <div className="text-netcrab-muted text-sm">Friction radar visualization</div>
                  </div>
                </div>
              </div>
              <p className="text-center text-netcrab-muted italic text-sm">
                Friction radar, flows, and Crab Notes—out of the box.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

