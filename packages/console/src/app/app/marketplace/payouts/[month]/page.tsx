'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

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
      <Layout>
        <div className="space-y-6">
          <div className="h-8 bg-navy-200 rounded w-1/3 animate-pulse"></div>
          <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
            <div className="h-12 bg-navy-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-navy-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !statement) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-navy-900">Statement</h1>
          <div className="bg-coral-50 border border-coral-200 rounded-lg p-4">
            <p className="text-coral-800">{error || 'Statement not found'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const monthDate = new Date(statement.month);
  const monthName = monthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Statement for {monthName}</h1>
          <p className="text-navy-600 mt-1">NetCrab marketplace revenue share.</p>
        </div>

        {/* Summary Banner */}
        <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-navy-600 mb-1">Total Amount</div>
              <div className="text-4xl font-bold text-navy-900">
                ${statement.totalAmount} {statement.currency}
              </div>
            </div>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded font-medium">
              Paid
            </span>
          </div>
        </div>

        {/* Pack Breakdown */}
        <div className="bg-white rounded-lg shadow border border-navy-200">
          <div className="p-6 border-b border-navy-200">
            <h2 className="text-xl font-semibold text-navy-900">Pack Breakdown</h2>
          </div>
          <div className="p-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-navy-200">
                  <th className="text-left py-3 px-4 font-medium text-navy-700">Pack</th>
                  <th className="text-right py-3 px-4 font-medium text-navy-700">Sessions</th>
                  <th className="text-right py-3 px-4 font-medium text-navy-700">Share Amount</th>
                  <th className="text-right py-3 px-4 font-medium text-navy-700">Gross Revenue</th>
                </tr>
              </thead>
              <tbody>
                {statement.packs.map((pack) => (
                  <tr key={pack.packId} className="border-b border-navy-100">
                    <td className="py-3 px-4 text-navy-900">{pack.packTitle}</td>
                    <td className="text-right py-3 px-4 text-navy-600">
                      {pack.orgContributionSessions.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 font-semibold text-navy-900">
                      ${pack.orgShareAmount}
                    </td>
                    <td className="text-right py-3 px-4 text-navy-600">${pack.grossRevenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Download Options */}
        <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Download</h2>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-navy-100 text-navy-700 rounded hover:bg-navy-200">
              Download CSV
            </button>
            <button
              className="px-4 py-2 bg-navy-100 text-navy-700 rounded hover:bg-navy-200 opacity-50 cursor-not-allowed"
              disabled
            >
              Download PDF (Coming soon)
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

