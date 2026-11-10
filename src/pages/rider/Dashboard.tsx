import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api, messageOf } from '../../api/client';
import { Card, Empty, ErrorState, Loading, PageTitle, Stat, Status } from '../../components/UI';

export default function Dashboard() {
  const q = useQuery({
    queryKey: ['rider-me'],
    queryFn: async () => (await api.get('/rider/me')).data.data
  });

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorState text={messageOf(q.error)} />;

  const d = q.data;

  return (
    <>
      <PageTitle
        title="Your riding dashboard"
        sub="Your active campaigns, daily progress, and earnings at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active campaigns" value={d.ads.length} />
        <Stat label="Rider status" value={d.status} />
        <Stat
          label="Paid earnings"
          value={`₹${(Number(d.paidEarningsPaise) / 100).toLocaleString('en-IN')}`}
        />
        <Stat label="Recent logs" value={d.logs.length} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Assigned campaigns</h2>
              <p className="mt-1 text-sm text-slate-500 font-medium">
                Only active campaigns are shown here.
              </p>
            </div>
            <Link className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline" to="/rider/history">
              View history →
            </Link>
          </div>

          {d.ads.length === 0 ? (
            <Empty text="No active campaigns assigned yet" />
          ) : (
            <div className="mt-5 space-y-3">
              {d.ads.map(
                (a: {
                  id: string;
                  title: string | null;
                  creativeUrl: string | null;
                  startDate: string | null;
                  endDate: string | null;
                }) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    {a.creativeUrl ? (
                      <img
                        src={a.creativeUrl}
                        alt="Campaign"
                        className="h-14 w-14 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-slate-200 border border-slate-300" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{a.title || 'Campaign'}</p>
                      <p className="mt-0.5 text-xs text-slate-500 font-medium">
                        {a.startDate ? new Date(a.startDate).toLocaleDateString() : '—'} to{' '}
                        {a.endDate ? new Date(a.endDate).toLocaleDateString() : '—'}
                      </p>
                    </div>
                    <Status value="running" />
                  </div>
                )
              )}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-bold text-slate-900 text-lg">Daily check-in</h2>
          <p className="mt-2 text-sm text-slate-600 font-medium">
            Submit a clear odometer photo at the start and end of your day.
          </p>
          <div className="mt-5 space-y-3">
            <Link to="/rider/start" className="btn btn-primary block text-center py-2.5">
              Start day
            </Link>
            <Link to="/rider/end" className="btn btn-muted block text-center py-2.5">
              End day
            </Link>
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500 font-medium">
            Keep odometer photos genuine. Suspicious distances may be flagged for admin review.
          </p>
        </Card>
      </div>
    </>
  );
}
