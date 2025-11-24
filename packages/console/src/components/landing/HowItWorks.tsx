export default function HowItWorks() {
  const steps = [
    {
      icon: '📊',
      title: 'Collect',
      description: 'On-premise agent captures behavioral events—clicks, scrolls, navigation—anonymized and secure.',
    },
    {
      icon: '🧠',
      title: 'Understand',
      description: 'AI-powered insights surface friction points, flow patterns, and efficiency scores automatically.',
    },
    {
      icon: '⚡',
      title: 'Improve',
      description: 'Actionable Crab Notes and hotspot analysis help you fix what\'s broken, fast.',
    },
    {
      icon: '💰',
      title: 'Share & Earn',
      description: 'Opt-in to contribute anonymized patterns to benchmark packs and earn revenue shares.',
    },
  ];

  return (
    <section id="how-it-works" className="bg-netcrab-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-netcrab-text">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="bg-netcrab-card rounded-lg p-6 border border-netcrab-surface hover:border-netcrab-aqua/30 transition-colors"
            >
              <div className="w-16 h-16 bg-netcrab-crab/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{step.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-netcrab-text text-center">{step.title}</h3>
              <p className="text-netcrab-muted text-center">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

