'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ConsoleSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/app', label: 'Overview', icon: '📊' },
    { href: '/app/flows', label: 'Flows', icon: '🌊' },
    { href: '/app/hotspots', label: 'Hotspots', icon: '🔥' },
    { href: '/app/crab-notes', label: 'Crab Notes', icon: '🦀' },
    { href: '/app/marketplace/seller', label: 'Marketplace', icon: '🏪' },
    { href: '/app/marketplace/my-packs', label: 'My Packs', icon: '📦' },
    { href: '/app/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-netcrab-surface border-r border-netcrab-card min-h-screen flex flex-col">
      <div className="p-6 border-b border-netcrab-card">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/netcrab-logo.svg"
            alt="NetCrab"
            className="h-8 w-8"
          />
          <div>
            <h1 className="text-lg font-bold text-netcrab-text">NetCrab</h1>
            <p className="text-xs text-netcrab-muted">Console</p>
          </div>
        </div>
        <div className="text-sm text-netcrab-muted">
          <div>demo-netcr</div>
          <div className="text-xs">crm-web</div>
        </div>
        <div className="mt-2">
          <span className="px-2 py-1 bg-netcrab-aqua/20 text-netcrab-aqua text-xs rounded">Demo Mode</span>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/app' && pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-netcrab-crab/20 text-netcrab-crab font-medium border border-netcrab-crab/30'
                      : 'text-netcrab-muted hover:bg-netcrab-card hover:text-netcrab-text'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

