import {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api, messageOf} from '../../api/client';
import {Card, ErrorState, Loading, PageTitle} from '../../components/UI';
import toast from 'react-hot-toast';

type Ad = {id: string; title: string | null; startDate: string | null; endDate: string | null};

export default function Start() {
  const [adId, setAdId] = useState('');
  const [km, setKm] = useState('');
  const [odo, setOdo] = useState<File | null>(null);
  const [adPhoto, setAdPhoto] = useState<File | null>(null);
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ['rider-me'],
    queryFn: async () => (await api.get('/rider/me')).data.data
  });

  const mutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('adId', adId);
      fd.append('startKm', km);
      if (odo) fd.append('startPhoto', odo);
      if (adPhoto) fd.append('adPhoto', adPhoto);
      return api.post('/rider/logs/start', fd);
    },
    onSuccess: () => {
      toast.success('Day started successfully');
      void qc.invalidateQueries({queryKey: ['rider-me']});
      void qc.invalidateQueries({queryKey: ['rider-logs']});
      setOdo(null);
      setAdPhoto(null);
      setKm('');
    },
    onError: e => toast.error(messageOf(e))
  });

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorState text={messageOf(q.error)} />;

  const ads = q.data.ads as Ad[];

  return (
    <>
      <PageTitle
        title="Start your day"
        sub="Record the opening odometer reading and attach real-world proof."
      />

      <div className="mx-auto max-w-2xl">
        <Card>
          <form
            className="space-y-5"
            onSubmit={e => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            <div>
              <label className="label">Assigned campaign</label>
              <select
                className="field"
                value={adId}
                onChange={e => setAdId(e.target.value)}
                required
              >
                <option value="">Select an active campaign</option>
                {ads.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.title || a.id}
                  </option>
                ))}
              </select>
              {ads.length === 0 && (
                <p className="mt-2 text-xs text-slate-500 font-medium">
                  You need an active campaign assignment before starting a log.
                </p>
              )}
            </div>

            <div>
              <label className="label">Starting odometer (km)</label>
              <input
                className="field"
                type="number"
                step="0.1"
                min="0"
                value={km}
                onChange={e => setKm(e.target.value)}
                required
                placeholder="e.g. 12450.6"
              />
            </div>

            <div>
              <label className="label">Odometer photo · required</label>
              <input
                className="field"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                required
                onChange={e => setOdo(e.target.files?.[0] || null)}
              />
              <p className="mt-1.5 text-xs text-slate-500 font-medium">
                Use your phone camera. JPEG, PNG, or WebP.
              </p>
              {odo && (
                <img
                  src={URL.createObjectURL(odo)}
                  alt="Odometer preview"
                  className="mt-3 h-44 rounded-xl object-contain border border-slate-200 bg-slate-900"
                />
              )}
            </div>

            <div>
              <label className="label">Photo of ad on your vehicle · optional</label>
              <input
                className="field"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                onChange={e => setAdPhoto(e.target.files?.[0] || null)}
              />
              {adPhoto && (
                <img
                  src={URL.createObjectURL(adPhoto)}
                  alt="Ad photo preview"
                  className="mt-3 h-44 rounded-xl object-contain border border-slate-200 bg-slate-900"
                />
              )}
            </div>

            <button
              className="btn btn-primary w-full py-3"
              disabled={mutation.isPending || !ads.length}
            >
              {mutation.isPending ? 'Submitting securely…' : 'Submit start reading'}
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}
