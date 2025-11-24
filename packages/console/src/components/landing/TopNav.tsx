import Link from 'next/link';
import Image from 'next/image';

export default function TopNav() {
  return (
    <header className="bg-netcrab-ink border-b border-netcrab-surface/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/netcrab-logo.svg"
              alt="NetCrab"
              className="h-9 w-9"
            />
            <span className="text-xl font-bold text-netcrab-text">NetCrab</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className="text-netcrab-muted hover:text-netcrab-text transition-colors">
              Product
            </Link>
            <Link href="/marketplace" className="text-netcrab-muted hover:text-netcrab-text transition-colors">
              Marketplace
            </Link>
            <Link href="/docs" className="text-netcrab-muted hover:text-netcrab-text transition-colors">
              Docs
            </Link>
            <Link
              href="/app"
              className="px-4 py-2 bg-netcrab-crab text-white rounded-lg hover:bg-netcrab-crab/90 transition-colors font-medium"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

