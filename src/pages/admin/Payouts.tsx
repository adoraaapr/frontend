import {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api, messageOf} from '../../api/client';
import {Card, Empty, ErrorState, Loading, PageTitle, Status} from '../../components/UI';
import toast from 'react-hot-toast';

type Payout = {
  id: string;
  periodStart: string;
  periodEnd: string;
  totalKm: string;
  ratePerKmPaise: number;
  amountPaise: string;
  status: string;
  reference: string | null;
  rider: {name: string; phone: string; rider: {upiId: string | null}};
};

export default function Payouts() {
  const today = new Date();
  const end = today.toISOString().slice(0, 10);
  const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  const [from, setFrom] = useState(start);
  const [to, setTo] = useState(end);
  const [refs, setRefs] = useState<Record<string, string>>({});
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ['payouts'],
    queryFn: async () => (await api.get('/admin/payouts')).data.data
  });

  const generate = useMutation({
    mutationFn: () => api.post('/admin/payouts/generate', {periodStart: from, periodEnd: to}),
    onSuccess: r => {
      toast.success(`Generated ${r.data.data.generated} payout records`);
      void qc.invalidateQueries({queryKey: ['payouts']});
    },
    onError: e => toast.error(messageOf(e))
  });

  const paid = useMutation({
    mutationFn: ({id, reference}: {id: string; reference: string}) =>
      api.patch(`/admin/payouts/${id}/paid`, {reference}),
    onSuccess: () => {
      toast.success('Payout marked as paid');
      void qc.invalidateQueries({queryKey: ['payouts']});
    },
    onError: e => toast.error(messageOf(e))
  });

  return (
    <>
      <PageTitle
        title="Rider payouts"
        sub="Generate payable amounts from verified kilometres and record transfer references."
      />

      <Card className="mb-6">
        <h2 className="font-bold text-slate-900 text-lg">Generate payout period</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="label">Period start</label>
            <input className="field" type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="label">Period end</label>
            <input className="field" type="date" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <button
            className="btn btn-primary self-end py-2.5"
            disabled={generate.isPending || !from || !to || from > to}
            onClick={() => generate.mutate()}
          >
            {generate.isPending ? 'Generating…' : 'Generate payouts'}
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500 font-medium">
          Only verified logs are included. Overlapping periods for a rider are automatically skipped.
        </p>
      </Card>

      {q.isLoading ? (
        <Loading />
      ) : q.error ? (
        <ErrorState text={messageOf(q.error)} />
      ) : (
        <Card className="p-0">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rider</th>
                  <th>Period</th>
                  <th>Verified km</th>
                  <th>Rate / km</th>
                  <th>Amount</th>
                  <th>Status / reference</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {q.data.items.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <Empty text="No payouts generated yet" />
                    </td>
                  </tr>
                ) : (
                  q.data.items.map((p: Payout) => (
                    <tr key={p.id}>
                      <td>
                        <p className="font-semibold text-slate-900">{p.rider.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500 font-medium">
                          {p.rider.phone} · {p.rider.rider.upiId || 'No UPI ID'}
                        </p>
                      </td>
                      <td className="text-xs text-slate-600 font-medium">
                        {new Date(p.periodStart).toLocaleDateString()} –{' '}
                        {new Date(p.periodEnd).toLocaleDateString()}
                      </td>
                      <td className="font-semibold text-slate-800">
                        {Number(p.totalKm).toFixed(1)}
                      </td>
                      <td className="text-slate-700">₹{(p.ratePerKmPaise / 100).toFixed(2)}</td>
                      <td className="font-bold text-slate-900">
                        ₹{(Number(p.amountPaise) / 100).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <Status value={p.status} />
                        {p.reference && (
                          <p className="mt-1 text-xs font-mono text-slate-600 font-medium">
                            Ref: {p.reference}
                          </p>
                        )}
                      </td>
                      <td>
                        {p.status === 'PENDING' && (
                          <div className="flex min-w-48 gap-2">
                            <input
                              className="field min-w-0 py-1.5 text-xs font-mono"
                              placeholder="UPI transfer ref"
                              value={refs[p.id] || ''}
                              onChange={e =>
                                setRefs(s => ({...s, [p.id]: e.target.value}))
                              }
                            />
                            <button
                              className="btn btn-primary text-xs shrink-0"
                              disabled={
                                paid.isPending || (refs[p.id] || '').trim().length < 3
                              }
                              onClick={() => paid.mutate({id: p.id, reference: refs[p.id]!})}
                            >
                              Mark paid
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
