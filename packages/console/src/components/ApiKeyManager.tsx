'use client';

import { useEffect, useState } from 'react';

interface ApiKey {
  apiKeyId: string;
  label: string;
  createdAt: string;
  lastUsedAt?: string;
  revoked: boolean;
}

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [createdKey, setCreatedKey] = useState<{ apiKeyId: string; key: string } | null>(null);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      const marketplaceUrl = process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${marketplaceUrl}/v1/marketplace/api-keys`, {
        headers: {
          'X-Org-Id': 'acme',
        },
      });
      const data = await res.json();
      setKeys(data.keys || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load API keys:', err);
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newKeyLabel.trim()) return;

    try {
      const marketplaceUrl = process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${marketplaceUrl}/v1/marketplace/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Org-Id': 'acme',
        },
        body: JSON.stringify({ label: newKeyLabel }),
      });
      const data = await res.json();
      setCreatedKey({ apiKeyId: data.apiKeyId, key: data.key });
      setNewKeyLabel('');
      setShowCreateModal(false);
      loadKeys();
    } catch (err) {
      console.error('Failed to create API key:', err);
    }
  };

  const handleRevoke = async (apiKeyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key?')) return;

    try {
      const marketplaceUrl = process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || 'http://localhost:5000';
      await fetch(`${marketplaceUrl}/v1/marketplace/api-keys/${apiKeyId}`, {
        method: 'DELETE',
        headers: {
          'X-Org-Id': 'acme',
        },
      });
      loadKeys();
    } catch (err) {
      console.error('Failed to revoke API key:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-navy-900">API Keys</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-coral-500 text-white rounded hover:bg-coral-600 text-sm"
        >
          Generate New Key
        </button>
      </div>

      {createdKey && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-sm font-medium text-green-900 mb-2">API Key Created</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm font-mono">
              {createdKey.key}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(createdKey.key);
              }}
              className="px-3 py-2 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
            >
              Copy
            </button>
          </div>
          <p className="text-xs text-green-700 mt-2">
            ⚠️ You won't see this key again. Save it securely.
          </p>
          <button
            onClick={() => setCreatedKey(null)}
            className="mt-2 text-xs text-green-700 hover:text-green-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-navy-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : keys.length === 0 ? (
        <p className="text-navy-600 text-sm">No API keys yet. Generate one to get started.</p>
      ) : (
        <div className="space-y-2">
          {keys.map((key) => (
            <div
              key={key.apiKeyId}
              className="flex items-center justify-between p-3 border border-navy-200 rounded"
            >
              <div>
                <div className="font-medium text-navy-900">{key.label}</div>
                <div className="text-xs text-navy-500">
                  Created {new Date(key.createdAt).toLocaleDateString()}
                  {key.lastUsedAt && ` • Last used ${new Date(key.lastUsedAt).toLocaleDateString()}`}
                </div>
              </div>
              <button
                onClick={() => handleRevoke(key.apiKeyId)}
                className="px-3 py-1 text-coral-600 hover:text-coral-700 text-sm"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Create API Key</h3>
            <input
              type="text"
              placeholder="Label (e.g., Production API Key)"
              value={newKeyLabel}
              onChange={(e) => setNewKeyLabel(e.target.value)}
              className="w-full px-3 py-2 border border-navy-300 rounded mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewKeyLabel('');
                }}
                className="px-4 py-2 bg-navy-100 text-navy-700 rounded hover:bg-navy-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newKeyLabel.trim()}
                className="px-4 py-2 bg-coral-500 text-white rounded hover:bg-coral-600 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

