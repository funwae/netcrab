export default function Privacy() {
  const pillars = [
    {
      icon: '🔒',
      title: 'No PII',
      description: 'All user identifiers are hashed and scrubbed before leaving your network. NetCrab never sees names, emails, or personal data.',
    },
    {
      icon: '🖥️',
      title: 'On-Prem Control',
      description: 'The NetCrab agent runs inside your infrastructure. You control what data leaves your network and when.',
    },
    {
      icon: '📊',
      title: 'Aggregated Only',
      description: 'Marketplace packs contain only aggregated patterns—median clicks, friction scores, flow completion rates. No individual session data.',
    },
  ];

  return (
    <section className="bg-netcrab-surface/80 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-netcrab-text mb-4 text-center">
          Privacy First
        </h2>
        <p className="text-netcrab-muted text-center mb-12 max-w-2xl mx-auto">
          NetCrab is built from the ground up to respect user privacy and data sovereignty.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="bg-netcrab-card rounded-lg border border-netcrab-border p-6 text-center"
            >
              <div className="text-4xl mb-4">{pillar.icon}</div>
              <h3 className="text-xl font-semibold text-netcrab-text mb-3">{pillar.title}</h3>
              <p className="text-netcrab-muted leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
