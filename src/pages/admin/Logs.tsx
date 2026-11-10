import {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api, messageOf} from '../../api/client';
import {Card, Empty, ErrorState, Loading, PageTitle, Status} from '../../components/UI';
import toast from 'react-hot-toast';

type Log = {
  id: string;
  logDate: string;
  startKm: string;
  endKm: string | null;
  startPhotoUrl: string;
  endPhotoUrl: string | null;
  adPhotoUrl: string | null;
  status: string;
  suspicious: boolean;
  suspiciousReason: string | null;
  adminNote: string | null;
  rider: {name: string; phone: string};
  ad: {title: string | null; creativeUrl: string | null};
};

export default function Logs() {
  const [status, setStatus] = useState('SUBMITTED');
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ['admin-logs', status],
    queryFn: async () => (await api.get('/admin/logs', {params: {status}})).data.data
  });

  const review = useMutation({
    mutationFn: ({id, decision}: {id: string; decision: 'VERIFIED' | 'REJECTED'}) =>
      api.patch(`/admin/logs/${id}`, {
        status: decision,
        note: decision === 'REJECTED' ? 'Rejected during admin review' : undefined
      }),
    onSuccess: () => {
      toast.success('Log reviewed');
      void qc.invalidateQueries({queryKey: ['admin-logs']});
    },
    onError: e => toast.error(messageOf(e))
  });

  return (
    <>
      <PageTitle
        title="Daily log verification"
        sub="Compare rider odometer evidence before verifying payable kilometres."
      />

      <div className="mb-5 flex gap-2">
        {['SUBMITTED', 'VERIFIED', 'REJECTED'].map(s => (
          <button
            className={`btn text-sm ${status === s ? 'btn-primary' : 'btn-muted'}`}
            key={s}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {q.isLoading ? (
        <Loading />
      ) : q.error ? (
        <ErrorState text={messageOf(q.error)} />
      ) : q.data.items.length === 0 ? (
        <Card>
          <Empty text="No completed logs to review" />
        </Card>
      ) : (
        <div className="space-y-4">
          {q.data.items.map((l: Log) => (
            <Card key={l.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">
                    {l.rider.name}{' '}
                    <span className="font-medium text-slate-500 text-sm">
                      · {l.rider.phone}
                    </span>
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 font-medium">
                    {new Date(l.logDate).toLocaleDateString()} · {l.ad.title || 'Campaign'} ·{' '}
                    <span className="font-bold text-slate-800">
                      {Number(l.endKm) - Number(l.startKm)} km
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Status value={l.status} />
                  {l.suspicious && <span className="badge badge-red">Flagged</span>}
                </div>
              </div>

              {l.suspiciousReason && (
                <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
                  Fraud flag: {l.suspiciousReason}
                </p>
              )}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="label">Start odometer · {l.startKm} km</p>
                  <a href={l.startPhotoUrl} target="_blank" rel="noreferrer">
                    <img
                      src={l.startPhotoUrl}
                      alt="Start odometer evidence"
                      className="h-56 w-full rounded-xl bg-slate-900 object-contain border border-slate-200"
                    />
                  </a>
                </div>
                <div>
                  <p className="label">End odometer · {l.endKm ?? '—'} km</p>
                  {l.endPhotoUrl ? (
                    <a href={l.endPhotoUrl} target="_blank" rel="noreferrer">
                      <img
                        src={l.endPhotoUrl}
                        alt="End odometer evidence"
                        className="h-56 w-full rounded-xl bg-slate-900 object-contain border border-slate-200"
                      />
                    </a>
                  ) : (
                    <div className="flex h-56 items-center justify-center rounded-xl bg-slate-100 text-slate-500 border border-slate-200 font-medium text-sm">
                      No end photo
                    </div>
                  )}
                </div>
              </div>

              {l.adPhotoUrl && (
                <div className="mt-4">
                  <p className="label">Ad on vehicle</p>
                  <a href={l.adPhotoUrl} target="_blank" rel="noreferrer">
                    <img
                      src={l.adPhotoUrl}
                      alt="Ad on vehicle evidence"
                      className="h-40 rounded-xl object-cover border border-slate-200"
                    />
                  </a>
                </div>
              )}

              {status === 'SUBMITTED' && (
                <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    className="btn btn-danger"
                    disabled={review.isPending}
                    onClick={() => review.mutate({id: l.id, decision: 'REJECTED'})}
                  >
                    Reject log
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={review.isPending}
                    onClick={() => review.mutate({id: l.id, decision: 'VERIFIED'})}
                  >
                    Verify kilometres
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
