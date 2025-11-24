import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-netcrab-ink border-t border-netcrab-surface py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center gap-3">
            <img
              src="/netcrab-logo.svg"
              alt="NetCrab"
              className="h-10 w-10"
            />
            <div>
              <h3 className="text-2xl font-bold mb-2 text-netcrab-text">NetCrab</h3>
              <p className="text-netcrab-muted">Turning network noise into product gold.</p>
            </div>
          </div>
          <nav className="flex gap-6">
            <Link href="/#how-it-works" className="text-netcrab-muted hover:text-netcrab-text transition-colors">
              Product
            </Link>
            <Link href="/marketplace" className="text-netcrab-muted hover:text-netcrab-text transition-colors">
              Marketplace
            </Link>
            <Link href="/app" className="text-netcrab-muted hover:text-netcrab-text transition-colors">
              Console
            </Link>
            <Link href="/docs" className="text-netcrab-muted hover:text-netcrab-text transition-colors">
              Docs
            </Link>
            <a href="mailto:hello@netcrab.net" className="text-netcrab-muted hover:text-netcrab-text transition-colors">
              Contact
            </a>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-netcrab-surface text-center text-netcrab-muted text-sm">
          © 2025 NetCrab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

