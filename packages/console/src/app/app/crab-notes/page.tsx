'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { api, type CrabNote } from '@/lib/api';

export default function CrabNotesPage() {
  const [notes, setNotes] = useState<CrabNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = {
      orgId: 'acme',
      productId: 'crm-web',
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
      limit: 20,
    };

    api
      .getCrabNotes(params)
      .then((response) => setNotes(response.notes))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-netcrab-muted">Loading Crab Notes...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-netcrab-crab/20 border border-netcrab-crab rounded-lg p-4 text-netcrab-crab">
          Error: {error}
        </div>
      </Layout>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-netcrab-crab/20 text-netcrab-crab border-netcrab-crab/30';
      case 'medium':
        return 'bg-netcrab-aqua/20 text-netcrab-aqua border-netcrab-aqua/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-netcrab-surface text-netcrab-muted border-netcrab-surface';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'friction':
        return 'text-netcrab-crab';
      case 'confusion':
        return 'text-netcrab-aqua';
      case 'efficiency':
        return 'text-green-400';
      case 'adoption':
        return 'text-netcrab-aqua';
      case 'conversion':
        return 'text-netcrab-crab';
      default:
        return 'text-netcrab-muted';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-netcrab-text">Crab Notes</h1>
          <div className="text-sm text-netcrab-muted">
            AI-generated insights from your user behavior data
          </div>
        </div>

        {notes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6 hover:border-netcrab-aqua/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-4xl">🦀</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-netcrab-text">{note.title}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(
                            note.severity
                          )}`}
                        >
                          {note.severity}
                        </span>
                        <span
                          className={`text-xs font-medium ${getCategoryColor(note.category)}`}
                        >
                          {note.category}
                        </span>
                      </div>
                      <p className="text-netcrab-muted mb-4">{note.summary}</p>
                      {note.recommendations && note.recommendations.length > 0 && (
                        <div className="bg-netcrab-surface rounded-lg p-4">
                          <div className="text-sm font-medium text-netcrab-text mb-2">
                            Recommendations:
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-sm text-netcrab-muted">
                            {note.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-netcrab-muted">
                  <div>
                    Confidence: {(note.confidence * 100).toFixed(0)}%
                  </div>
                  <div>
                    {new Date(note.createdAt).toLocaleDateString()}{' '}
                    {new Date(note.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-12 text-center">
            <div className="text-6xl mb-4">🦀</div>
            <p className="text-netcrab-muted">No Crab Notes yet. Check back soon!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

