import {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api, messageOf} from '../../api/client';
import {Card, Empty, ErrorState, Loading, PageTitle, Status} from '../../components/UI';
import toast from 'react-hot-toast';

export default function Ads() {
  const [status, setStatus] = useState('PENDING_APPROVAL');
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ['admin-ads', status],
    queryFn: async () => (await api.get('/admin/ads', {params: {status}})).data.data
  });

  const action = useMutation({
    mutationFn: async ({id, kind}: {id: string; kind: 'approve' | 'reject'}) =>
      kind === 'approve'
        ? api.patch(`/admin/ads/${id}/approve`)
        : api.patch(`/admin/ads/${id}/reject`, {reason}),
    onSuccess: () => {
      toast.success('Campaign updated');
      void qc.invalidateQueries({queryKey: ['admin-ads']});
      setRejecting(null);
      setReason('');
    },
    onError: e => toast.error(messageOf(e))
  });

  return (
    <>
      <PageTitle
        title="Campaign queue"
        sub="Review paid campaigns, approve creatives, and assign field riders."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {[
          ['PENDING_APPROVAL', 'Needs review'],
          ['APPROVED', 'Approved'],
          ['RUNNING', 'Running'],
          ['REJECTED', 'Rejected'],
          ['COMPLETED', 'Completed']
        ].map(([v, l]) => (
          <button
            key={v}
            className={`btn text-sm ${status === v ? 'btn-primary' : 'btn-muted'}`}
            onClick={() => setStatus(v)}
          >
            {l}
          </button>
        ))}
      </div>

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
                  <th>Campaign / customer</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {q.data.items.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <Empty text="No campaigns in this queue" />
                    </td>
                  </tr>
                ) : (
                  q.data.items.map(
                    (a: {
                      id: string;
                      title: string | null;
                      creativeUrl: string | null;
                      customer: {name: string; email: string; phone: string; company: string | null};
                      plan: {name: string; ridersCount: number; durationDays: number};
                      order: {amountPaise: string; razorpayPaymentId: string | null};
                      status: string;
                      rejectionReason: string | null;
                    }) => (
                      <tr key={a.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            {a.creativeUrl ? (
                              <img
                                src={a.creativeUrl}
                                alt="Campaign creative"
                                className="h-12 w-12 rounded-lg object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-slate-200 border border-slate-300" />
                            )}
                            <div>
                              <p className="font-semibold text-slate-900">
                                {a.title || 'Untitled campaign'}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500 font-medium">
                                {a.customer.name} · {a.customer.company || a.customer.email}
                              </p>
                              <p className="text-xs text-slate-500">{a.customer.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="font-semibold text-slate-900">{a.plan.name}</p>
                          <p className="mt-0.5 text-xs text-slate-500 font-medium">
                            {a.plan.ridersCount} riders · {a.plan.durationDays} days
                          </p>
                        </td>
                        <td className="font-bold text-slate-900">
                          ₹{(Number(a.order.amountPaise) / 100).toLocaleString('en-IN')}
                        </td>
                        <td
                          className="max-w-32 truncate text-xs font-mono text-slate-600"
                          title={a.order.razorpayPaymentId || ''}
                        >
                          {a.order.razorpayPaymentId || '—'}
                        </td>
                        <td>
                          <Status value={a.status} />
                          {a.rejectionReason && (
                            <p className="mt-1 max-w-40 text-xs text-rose-700 font-medium">
                              {a.rejectionReason}
                            </p>
                          )}
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            {status === 'PENDING_APPROVAL' && (
                              <>
                                <button
                                  className="btn btn-primary text-xs"
                                  disabled={action.isPending}
                                  onClick={() => action.mutate({id: a.id, kind: 'approve'})}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-danger text-xs"
                                  onClick={() => {
                                    setRejecting(a.id);
                                    setReason('');
                                  }}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {status === 'APPROVED' && (
                              <a className="btn btn-primary text-xs" href={`/admin/ads/${a.id}/assign`}>
                                Assign riders
                              </a>
                            )}
                          </div>
                          {rejecting === a.id && (
                            <div className="mt-3 min-w-48 space-y-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                              <input
                                className="field"
                                placeholder="Reason for rejection"
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                              />
                              <div className="flex gap-2">
                                <button
                                  className="btn btn-danger text-xs"
                                  disabled={reason.trim().length < 3 || action.isPending}
                                  onClick={() => action.mutate({id: a.id, kind: 'reject'})}
                                >
                                  Confirm + refund
                                </button>
                                <button
                                  className="btn btn-muted text-xs"
                                  onClick={() => setRejecting(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
