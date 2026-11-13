import {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api, messageOf} from '../../api/client';
import {Card, ErrorState, Loading, PageTitle} from '../../components/UI';
import toast from 'react-hot-toast';

type Log = {
  id: string;
  adId: string;
  startKm: string | number;
  endKm: string | number | null;
  logDate: string;
  status: string;
  ad: {title: string | null};
};

export default function End() {
  const [logId, setLogId] = useState('');
  const [km, setKm] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [adPhoto, setAdPhoto] = useState<File | null>(null);
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ['rider-logs'],
    queryFn: async () =>
      (await api.get('/rider/logs', {params: {page: 1, pageSize: 100}})).data.data
  });

  const m = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('logId', logId);
      fd.append('endKm', km);
      if (photo) fd.append('endPhoto', photo);
      if (adPhoto) fd.append('adPhoto', adPhoto);
      return api.post('/rider/logs/end', fd);
    },
    onSuccess: () => {
      toast.success('Day ended. Log sent for verification.');
      void qc.invalidateQueries({queryKey: ['rider-logs']});
      void qc.invalidateQueries({queryKey: ['rider-me']});
      setLogId('');
      setKm('');
      setPhoto(null);
      setAdPhoto(null);
    },
    onError: e => toast.error(messageOf(e))
  });

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorState text={messageOf(q.error)} />;

  const open = (q.data.items as Log[]).filter(l => !l.endKm);

  return (
    <>
      <PageTitle
        title="End your day"
        sub="Capture the closing reading and ad proof. Completed logs are locked from rider edits."
      />

      <div className="mx-auto max-w-2xl">
        <Card>
          <form
            className="space-y-5"
            onSubmit={e => {
              e.preventDefault();
              m.mutate();
            }}
          >
            <div>
              <label className="label">Open daily log</label>
              <select
                className="field"
                value={logId}
                onChange={e => {
                  setLogId(e.target.value);
                  setKm(String(open.find(l => l.id === e.target.value)?.startKm ?? ''));
                }}
                required
              >
                <option value="">Select a log to finish</option>
                {open.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.ad.title || 'Campaign'} · started at {l.startKm} km
                  </option>
                ))}
              </select>
              {open.length === 0 && (
                <p className="mt-2 text-xs text-slate-500 font-medium">
                  No open logs. Start your day first.
                </p>
              )}
            </div>

            {logId && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Starting reading
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {open.find(l => l.id === logId)?.startKm} km
                </p>
                <p className="mt-1 text-xs text-slate-600 font-medium">
                  The ending reading must be higher than the starting reading.
                </p>
              </div>
            )}

            <div>
              <label className="label">Ending odometer (km)</label>
              <input
                className="field"
                type="number"
                step="0.1"
                min="0"
                value={km}
                onChange={e => setKm(e.target.value)}
                required
                placeholder="e.g. 12520.3"
              />
            </div>

            <div>
              <label className="label">Closing odometer photo · required</label>
              <input
                className="field"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                required
                onChange={e => setPhoto(e.target.files?.[0] || null)}
              />
              {photo && (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Closing odometer preview"
                  className="mt-3 h-44 rounded-xl object-contain border border-slate-200 bg-slate-900"
                />
              )}
            </div>

            <div>
              <label className="label">Photo of ad on vehicle · recommended</label>
              <input
                className="field"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                onChange={e => setAdPhoto(e.target.files?.[0] || null)}
              />
              <p className="mt-1.5 text-xs text-slate-500 font-medium">
                Attach closing proof of the ad banner on your vehicle.
              </p>
              {adPhoto && (
                <img
                  src={URL.createObjectURL(adPhoto)}
                  alt="Closing ad photo preview"
                  className="mt-3 h-44 rounded-xl object-contain border border-slate-200 bg-slate-900"
                />
              )}
            </div>

            <button
              className="btn btn-primary w-full py-3"
              disabled={m.isPending || !open.length}
            >
              {m.isPending ? 'Submitting securely…' : 'Submit ending reading'}
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}
