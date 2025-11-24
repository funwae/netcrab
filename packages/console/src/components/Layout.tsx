'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/app', label: 'Overview' },
    { href: '/app/flows', label: 'Flows' },
    { href: '/app/hotspots', label: 'Hotspots' },
    { href: '/app/crab-notes', label: 'Crab Notes' },
    { href: '/app/marketplace/seller', label: 'Marketplace' },
    { href: '/app/marketplace/my-packs', label: 'My Packs' },
    { href: '/app/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Top Bar */}
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src="/netcrab-logo.svg"
                alt="NetCrab"
                className="h-8 w-8"
              />
              <h1 className="text-xl font-bold">NetCrab</h1>
              <span className="ml-2 text-sm text-navy-300">Console</span>
            </div>
            <div className="flex items-center space-x-4">
              <select className="bg-navy-800 text-white px-3 py-1 rounded text-sm">
                <option>acme-org</option>
              </select>
              <select className="bg-navy-800 text-white px-3 py-1 rounded text-sm">
                <option>crm-web</option>
              </select>
              <input
                type="date"
                className="bg-navy-800 text-white px-3 py-1 rounded text-sm"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              <div className="w-8 h-8 rounded-full bg-navy-700"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Nav */}
        <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-4rem)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-navy-100 text-navy-900 font-medium'
                          : 'text-navy-700 hover:bg-navy-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

