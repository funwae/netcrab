export default function HowItWorks() {
  const steps = [
    {
      icon: '📡',
      title: 'Collect',
      description: 'NetCrab agent sits quietly in your network, capturing behavioral events without touching PII.',
    },
    {
      icon: '🧠',
      title: 'Understand',
      description: 'AI-powered clustering and pattern detection turn raw clicks into actionable insights about user frustration and efficiency.',
    },
    {
      icon: '🔧',
      title: 'Improve',
      description: 'Crab Notes highlight friction hotspots, abandoned flows, and rage-click patterns so you can fix what matters.',
    },
    {
      icon: '💰',
      title: 'Share & Earn',
      description: 'Opt into anonymized benchmark packs and earn revenue when other teams buy aggregated insights from your vertical.',
    },
  ];

  return (
    <section className="bg-netcrab-surface py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-netcrab-text mb-12 text-center">
          How NetCrab Works
        </h2>
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-netcrab-card rounded-lg border border-netcrab-border p-6 hover:border-netcrab-shell/30 transition-colors"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-netcrab-text mb-3">{step.title}</h3>
              <p className="text-netcrab-muted leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
