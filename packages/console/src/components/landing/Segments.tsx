export default function Segments() {
  return (
    <section className="bg-netcrab-ink py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Teams Card */}
          <div className="bg-netcrab-surface rounded-lg border border-netcrab-border p-8 hover:border-netcrab-shell/30 transition-colors">
            <h3 className="text-2xl font-bold text-netcrab-text mb-4">For Product Teams</h3>
            <p className="text-netcrab-muted mb-6 leading-relaxed">
              Understand how users actually interact with your product. Find friction points, abandoned flows, and rage-click patterns before they become support tickets.
            </p>
            <ul className="space-y-3 text-netcrab-text">
              <li className="flex items-start gap-3">
                <span className="text-netcrab-shell mt-1">✓</span>
                <span>Real-time friction and efficiency scores</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-netcrab-shell mt-1">✓</span>
                <span>AI-powered Crab Notes highlight actionable insights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-netcrab-shell mt-1">✓</span>
                <span>Flow analysis shows where users drop off</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-netcrab-shell mt-1">✓</span>
                <span>Hotspot detection identifies problem screens</span>
              </li>
            </ul>
          </div>

          {/* Data Buyers Card */}
          <div className="bg-netcrab-surface rounded-lg border border-netcrab-border p-8 hover:border-netcrab-shell/30 transition-colors">
            <h3 className="text-2xl font-bold text-netcrab-text mb-4">For Data Buyers</h3>
            <p className="text-netcrab-muted mb-6 leading-relaxed">
              Access anonymized, aggregated behavioral benchmarks from hundreds of products in your vertical. Compare your UX metrics against industry standards.
            </p>
            <ul className="space-y-3 text-netcrab-text">
              <li className="flex items-start gap-3">
                <span className="text-netcrab-shell mt-1">✓</span>
                <span>Vertical-specific UX benchmark packs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-netcrab-shell mt-1">✓</span>
                <span>Task-flow archetype libraries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-netcrab-shell mt-1">✓</span>
                <span>Release delta and trend analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-netcrab-shell mt-1">✓</span>
                <span>API access for BI tools and dashboards</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
