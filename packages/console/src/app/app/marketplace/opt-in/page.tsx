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
          <div className="h-8 bg-navy-200 rounded w-1/3 animate-pulse"></div>
          <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-navy-200 rounded animate-pulse"></div>
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
        <div className="bg-coral-50 border border-coral-200 rounded-lg p-4">
          <p className="text-coral-800">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!settings) return null;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Data Sharing & Marketplace Participation</h1>
          <p className="text-navy-600 mt-1">
            Control which of your anonymized patterns help train benchmarks—and earn revenue.
          </p>
        </div>

        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            Settings saved successfully!
          </div>
        )}

        {error && (
          <div className="bg-coral-50 border border-coral-200 rounded-lg p-4 text-coral-800">
            {error}
          </div>
        )}

        {/* Global Toggle */}
        <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-navy-900">Participate in NetCrab Marketplace</h2>
              <p className="text-sm text-navy-600 mt-1">
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
              <div className="w-11 h-6 bg-navy-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-500"></div>
            </label>
          </div>
        </div>

        {/* Per-Product Table */}
        <div className="bg-white rounded-lg shadow border border-navy-200">
          <div className="p-6 border-b border-navy-200">
            <h2 className="text-lg font-semibold text-navy-900">Per-Product Settings</h2>
          </div>
          <div className="p-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-navy-200">
                  <th className="text-left py-3 px-4 font-medium text-navy-700">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-navy-700">Vertical</th>
                  <th className="text-left py-3 px-4 font-medium text-navy-700">Packs</th>
                </tr>
              </thead>
              <tbody>
                {settings.products.map((product) => (
                  <tr key={product.productId} className="border-b border-navy-100">
                    <td className="py-3 px-4 text-navy-900">{product.productName}</td>
                    <td className="py-3 px-4 text-navy-600">{product.vertical}</td>
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
                              className="rounded border-navy-300"
                            />
                            <span className={`text-sm ${!settings.globalOptIn ? 'text-navy-400' : 'text-navy-700'}`}>
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
            className="px-6 py-2 bg-coral-500 text-white rounded hover:bg-coral-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </Layout>
  );
}

