export default function Privacy() {
  const pillars = [
    {
      icon: '🔒',
      title: 'No PII',
      description: 'We never capture keystrokes, passwords, or personally identifiable information. Only behavioral patterns.',
    },
    {
      icon: '🏠',
      title: 'On-Prem Control',
      description: 'The NetCrab Agent runs on your infrastructure. You control exactly what data leaves your network.',
    },
    {
      icon: '📊',
      title: 'Aggregated Only',
      description: 'Marketplace packs contain only aggregated, anonymized benchmarks. No individual user data is ever shared.',
    },
  ];

  return (
    <section className="bg-netcrab-surface py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-8 text-netcrab-text">Privacy First</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-netcrab-card rounded-lg p-6 border border-netcrab-surface hover:border-netcrab-aqua/20 transition-colors"
            >
              <div className="text-4xl mb-4">{pillar.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-netcrab-text">{pillar.title}</h3>
              <p className="text-netcrab-muted">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

