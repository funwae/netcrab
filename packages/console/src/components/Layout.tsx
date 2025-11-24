'use client';

import ConsoleSidebar from './console/ConsoleSidebar';
import ConsoleTopbar from './console/ConsoleTopbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-netcrab-ink text-netcrab-text flex">
      <ConsoleSidebar />
      <main className="flex-1 flex flex-col">
        <ConsoleTopbar />
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

