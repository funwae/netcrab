export default function Segments() {
  return (
    <section className="bg-netcrab-ink py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-netcrab-card rounded-lg p-8 border border-netcrab-surface hover:border-netcrab-crab/30 transition-colors">
            <h3 className="text-2xl font-bold mb-4 text-netcrab-text">For Product Teams</h3>
            <p className="text-netcrab-muted mb-4 leading-relaxed">
              Find and fix friction fast. NetCrab surfaces where users struggle, which flows break, and what's causing rage clicks—all without surveys or guesswork.
            </p>
            <ul className="space-y-2 text-netcrab-muted">
              <li className="flex items-start gap-2">
                <span className="text-netcrab-aqua mt-1">✓</span>
                <span>Real-time friction detection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-netcrab-aqua mt-1">✓</span>
                <span>Flow visualization and analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-netcrab-aqua mt-1">✓</span>
                <span>AI-generated insights (Crab Notes)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-netcrab-aqua mt-1">✓</span>
                <span>Version comparison and A/B testing</span>
              </li>
            </ul>
          </div>
          <div className="bg-netcrab-card rounded-lg p-8 border border-netcrab-surface hover:border-netcrab-aqua/30 transition-colors">
            <h3 className="text-2xl font-bold mb-4 text-netcrab-text">For Data Buyers</h3>
            <p className="text-netcrab-muted mb-4 leading-relaxed">
              Benchmark your UX against the market. Access anonymized, aggregated benchmarks from hundreds of products to see how you stack up.
            </p>
            <ul className="space-y-2 text-netcrab-muted">
              <li className="flex items-start gap-2">
                <span className="text-netcrab-crab mt-1">✓</span>
                <span>Industry-wide UX benchmarks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-netcrab-crab mt-1">✓</span>
                <span>Task flow archetypes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-netcrab-crab mt-1">✓</span>
                <span>Release delta analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-netcrab-crab mt-1">✓</span>
                <span>API access and downloads</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

