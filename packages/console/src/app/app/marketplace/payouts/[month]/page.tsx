'use client';

import { api, type OrgMonthlyStatement } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StatementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const month = params.month as string;
  const [statement, setStatement] = useState<OrgMonthlyStatement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!month) return;

    api.getStatements(month)
      .then((data) => {
        setStatement(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message.includes('404') || err.message.includes('not found')) {
          setError('Statement not found for that month');
        } else {
          setError(err.message);
        }
        setLoading(false);
      });
  }, [month]);

      if (loading) {
        return (

            <div className="space-y-6">
              <div className="h-8 bg-netcrab-surface rounded w-1/3 animate-pulse"></div>
              <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
                <div className="h-12 bg-netcrab-surface rounded w-1/4 mb-4 animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 bg-netcrab-surface rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>

        );
      }

      if (error || !statement) {
        return (

            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-netcrab-text">Statement</h1>
              <div className="bg-netcrab-crab/20 border border-netcrab-crab rounded-lg p-4">
                <p className="text-netcrab-crab">{error || 'Statement not found'}</p>
              </div>
            </div>

        );
      }

      const monthDate = new Date(statement.month);
      const monthName = monthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

      return (

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-netcrab-text">Statement for {monthName}</h1>
              <p className="text-netcrab-muted mt-1">NetCrab marketplace revenue share.</p>
            </div>

            {/* Summary Banner */}
            <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-netcrab-muted mb-1">Total Amount</div>
                  <div className="text-4xl font-bold text-netcrab-text">
                    ${statement.totalAmount} {statement.currency}
                  </div>
                </div>
                <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded font-medium">
                  Paid
                </span>
              </div>
            </div>

            {/* Pack Breakdown */}
            <div className="bg-netcrab-card rounded-lg border border-netcrab-surface">
              <div className="p-6 border-b border-netcrab-surface">
                <h2 className="text-xl font-semibold text-netcrab-text">Pack Breakdown</h2>
              </div>
              <div className="p-6">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-netcrab-surface">
                      <th className="text-left py-3 px-4 font-medium text-netcrab-text">Pack</th>
                      <th className="text-right py-3 px-4 font-medium text-netcrab-text">Sessions</th>
                      <th className="text-right py-3 px-4 font-medium text-netcrab-text">Share Amount</th>
                      <th className="text-right py-3 px-4 font-medium text-netcrab-text">Gross Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statement.packs.map((pack) => (
                      <tr key={pack.packId} className="border-b border-netcrab-surface/50">
                        <td className="py-3 px-4 text-netcrab-text">{pack.packTitle}</td>
                        <td className="text-right py-3 px-4 text-netcrab-muted">
                          {pack.orgContributionSessions.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 font-semibold text-netcrab-text">
                          ${pack.orgShareAmount}
                        </td>
                        <td className="text-right py-3 px-4 text-netcrab-muted">${pack.grossRevenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Download Options */}
            <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
              <h2 className="text-lg font-semibold text-netcrab-text mb-4">Download</h2>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-netcrab-surface text-netcrab-text rounded hover:bg-netcrab-surface/80 transition-colors">
                  Download CSV
                </button>
                <button
                  className="px-4 py-2 bg-netcrab-surface text-netcrab-text rounded hover:bg-netcrab-surface/80 opacity-50 cursor-not-allowed"
                  disabled
                >
                  Download PDF (Coming soon)
                </button>
              </div>
            </div>
          </div>

      );
}

