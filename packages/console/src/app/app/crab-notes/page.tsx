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
          <div className="text-navy-600">Loading Crab Notes...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-coral-50 border border-coral-200 rounded-lg p-4 text-coral-800">
          Error: {error}
        </div>
      </Layout>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-coral-100 text-coral-800 border-coral-300';
      case 'medium':
        return 'bg-sand-100 text-sand-800 border-sand-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-navy-100 text-navy-800 border-navy-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'friction':
        return 'text-coral-600';
      case 'confusion':
        return 'text-sand-600';
      case 'efficiency':
        return 'text-green-600';
      case 'adoption':
        return 'text-blue-600';
      case 'conversion':
        return 'text-purple-600';
      default:
        return 'text-navy-600';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-navy-900">Crab Notes</h1>
          <div className="text-sm text-navy-600">
            AI-generated insights from your user behavior data
          </div>
        </div>

        {notes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-lg shadow border border-navy-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-4xl">🦀</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-navy-900">{note.title}</h3>
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
                      <p className="text-navy-700 mb-4">{note.summary}</p>
                      {note.recommendations && note.recommendations.length > 0 && (
                        <div className="bg-navy-50 rounded-lg p-4">
                          <div className="text-sm font-medium text-navy-900 mb-2">
                            Recommendations:
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-sm text-navy-700">
                            {note.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-navy-500">
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
          <div className="bg-navy-50 rounded-lg border border-navy-200 p-12 text-center">
            <div className="text-6xl mb-4">🦀</div>
            <p className="text-navy-600">No Crab Notes yet. Check back soon!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

