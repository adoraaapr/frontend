import {useQuery} from '@tanstack/react-query';
import {api, messageOf} from '../../api/client';
import {Card, ErrorState, Loading, PageTitle, Stat, Status} from '../../components/UI';

export default function Overview() {
  const q = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => (await api.get('/admin/dashboard')).data.data
  });

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorState text={messageOf(q.error)} />;

  const d = q.data;
  const total = (x: {_count: {_all: number}}[]) => x.reduce((n, v) => n + v._count._all, 0);

  return (
    <>
      <PageTitle
        title="Operations overview"
        sub="A live pulse across campaigns, field activity, and payouts."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total campaigns" value={total(d.ads)} detail="Across all campaign statuses" />
        <Stat label="Registered riders" value={total(d.riders)} detail="Including pending approval" />
        <Stat label="Daily logs" value={total(d.logs)} detail="Submitted and reviewed" />
        <Stat
          label="Pending payouts"
          value={`₹${(Number(d.pendingPayouts.amountPaise) / 100).toLocaleString('en-IN')}`}
          detail={`${d.pendingPayouts.count} payout records`}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-bold text-slate-900 text-lg">Campaign pipeline</h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">Count by current status</p>
          <div className="mt-5 space-y-4">
            {d.ads.map((x: {status: string; _count: {_all: number}}) => (
              <div key={x.status} className="flex items-center justify-between">
                <Status value={x.status} />
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-36 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${Math.min(100, (x._count._all / Math.max(1, total(d.ads))) * 100)}%`
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-bold text-slate-900">
                    {x._count._all}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-slate-900 text-lg">Rider status</h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">Riders by verification status</p>
          <div className="mt-5 space-y-4">
            {d.riders.map((x: {status: string; _count: {_all: number}}) => (
              <div className="flex items-center justify-between" key={x.status}>
                <Status value={x.status} />
                <span className="font-bold text-slate-900">{x._count._all}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
