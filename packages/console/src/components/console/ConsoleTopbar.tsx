'use client';

export default function ConsoleTopbar() {
  return (
    <header className="bg-netcrab-surface border-b border-netcrab-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="bg-netcrab-card border border-netcrab-surface text-netcrab-text px-3 py-1.5 rounded text-sm">
            <option>demo-netcr</option>
          </select>
          <select className="bg-netcrab-card border border-netcrab-surface text-netcrab-text px-3 py-1.5 rounded text-sm">
            <option>crm-web</option>
          </select>
          <input
            type="date"
            className="bg-netcrab-card border border-netcrab-surface text-netcrab-text px-3 py-1.5 rounded text-sm"
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="px-2 py-1 bg-netcrab-aqua/20 text-netcrab-aqua text-xs rounded">Demo Mode</span>
          <div className="w-8 h-8 rounded-full bg-netcrab-card border border-netcrab-surface"></div>
        </div>
      </div>
    </header>
  );
}

