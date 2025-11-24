'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { api, type OptInSettings } from '@/lib/api';

export default function OptInPage() {
  const [settings, setSettings] = useState<OptInSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getOptInSettings()
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleGlobalToggle = (enabled: boolean) => {
    if (!settings) return;
    setSettings({ ...settings, globalOptIn: enabled });
  };

  const handlePackToggle = (productId: string, packId: string, enabled: boolean) => {
    if (!settings) return;
    const updated = {
      ...settings,
      products: settings.products.map((p) =>
        p.productId === productId
          ? {
              ...p,
              packs: p.packs.map((pack) =>
                pack.packId === packId ? { ...pack, optIn: enabled } : pack
              ),
            }
          : p
      ),
    };
    setSettings(updated);
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      await api.updateOptInSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="h-8 bg-netcrab-surface rounded w-1/3 animate-pulse"></div>
          <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-netcrab-surface rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !settings) {
    return (
      <Layout>
        <div className="bg-netcrab-crab/20 border border-netcrab-crab rounded-lg p-4">
          <p className="text-netcrab-crab">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!settings) return null;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-netcrab-text">Data Sharing & Marketplace Participation</h1>
          <p className="text-netcrab-muted mt-1">
            Control which of your anonymized patterns help train benchmarks—and earn revenue.
          </p>
        </div>

        {saveSuccess && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-400">
            Settings saved successfully!
          </div>
        )}

        {error && (
          <div className="bg-netcrab-crab/20 border border-netcrab-crab rounded-lg p-4 text-netcrab-crab">
            {error}
          </div>
        )}

        {/* Global Toggle */}
        <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-netcrab-text">Participate in NetCrab Marketplace</h2>
              <p className="text-sm text-netcrab-muted mt-1">
                NetCrab never shares PII or identifiers. Only aggregated patterns like 'median clicks to complete checkout'.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.globalOptIn}
                onChange={(e) => handleGlobalToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-netcrab-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-netcrab-crab"></div>
            </label>
          </div>
        </div>

        {/* Per-Product Table */}
        <div className="bg-netcrab-card rounded-lg border border-netcrab-surface">
          <div className="p-6 border-b border-netcrab-surface">
            <h2 className="text-lg font-semibold text-netcrab-text">Per-Product Settings</h2>
          </div>
          <div className="p-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-netcrab-surface">
                  <th className="text-left py-3 px-4 font-medium text-netcrab-text">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-netcrab-text">Vertical</th>
                  <th className="text-left py-3 px-4 font-medium text-netcrab-text">Packs</th>
                </tr>
              </thead>
              <tbody>
                {settings.products.map((product) => (
                  <tr key={product.productId} className="border-b border-netcrab-surface/50">
                    <td className="py-3 px-4 text-netcrab-text">{product.productName}</td>
                    <td className="py-3 px-4 text-netcrab-muted">{product.vertical}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-2">
                        {product.packs.map((pack) => (
                          <label
                            key={pack.packId}
                            className="flex items-center space-x-2"
                            title={pack.title}
                          >
                            <input
                              type="checkbox"
                              checked={pack.optIn && settings.globalOptIn}
                              onChange={(e) => handlePackToggle(product.productId, pack.packId, e.target.checked)}
                              disabled={!settings.globalOptIn}
                              className="rounded border-netcrab-surface"
                            />
                            <span className={`text-sm ${!settings.globalOptIn ? 'text-netcrab-muted/50' : 'text-netcrab-muted'}`}>
                              {pack.title}
                            </span>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-netcrab-crab text-white rounded hover:bg-netcrab-crab/90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </Layout>
  );
}

