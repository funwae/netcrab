import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-netcrab-ink flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🦀</div>
        <h1 className="text-4xl font-bold text-netcrab-text mb-4">That page scuttled away.</h1>
        <p className="text-netcrab-muted mb-8">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-netcrab-crab text-white rounded-lg hover:bg-netcrab-crab/90 transition-colors font-medium inline-block"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}

