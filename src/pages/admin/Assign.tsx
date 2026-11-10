import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api, messageOf} from '../../api/client';
import {Card, Empty, ErrorState, Loading, PageTitle} from '../../components/UI';
import toast from 'react-hot-toast';

type Rider = {
  userId: string;
  city: string | null;
  vehicleNo: string | null;
  user: {name: string; phone: string};
};

export default function Assign() {
  const {id = ''} = useParams();
  const nav = useNavigate();
  const [city, setCity] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const qc = useQueryClient();

  const adq = useQuery({
    queryKey: ['assign-ad', id],
    queryFn: async () => {
      const r = await api.get('/admin/ads', {params: {pageSize: 100}});
      return (
        r.data.data.items as {
          id: string;
          status: string;
          plan: {ridersCount: number; durationDays: number; name: string};
        }[]
      ).find(a => a.id === id);
    }
  });

  const rq = useQuery({
    queryKey: ['available-riders', city],
    queryFn: async () =>
      (await api.get('/admin/riders/available', {params: city ? {city} : {}})).data.data
  });

  const assign = useMutation({
    mutationFn: () =>
      api.post(`/admin/ads/${id}/assign`, {riderIds: selected, city: city || undefined}),
    onSuccess: () => {
      toast.success('Riders assigned; campaign is running');
      void qc.invalidateQueries({queryKey: ['admin-ads']});
      nav('/admin/ads');
    },
    onError: e => toast.error(messageOf(e))
  });

  const plan = adq.data?.plan;

  return (
    <>
      <PageTitle
        title="Assign riders"
        sub="Choose active riders for this approved campaign."
      />

      <Card className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Campaign plan</p>
        {adq.isLoading ? (
          <Loading />
        ) : adq.error ? (
          <ErrorState text={messageOf(adq.error)} />
        ) : !plan ? (
          <Empty text="Campaign not found in the current queue" />
        ) : (
          <>
            <h2 className="mt-1.5 text-2xl font-bold text-slate-900">{plan.name}</h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Select up to <b className="text-slate-900 font-bold">{plan.ridersCount} riders</b> for{' '}
              {plan.durationDays} days.
            </p>
          </>
        )}
      </Card>

      <Card>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <label className="label">Filter by city</label>
            <input
              className="field min-w-64"
              value={city}
              onChange={e => {
                setCity(e.target.value);
                setSelected([]);
              }}
              placeholder="e.g. Mumbai, Delhi, Bengaluru"
            />
          </div>
          <div className="text-sm font-medium text-slate-600">
            Selected <b className="text-slate-900 font-bold">{selected.length}/{plan?.ridersCount || 0}</b>
          </div>
        </div>

        {rq.isLoading ? (
          <Loading />
        ) : rq.error ? (
          <ErrorState text={messageOf(rq.error)} />
        ) : rq.data.length === 0 ? (
          <Empty text="No eligible active riders available" />
        ) : (
          <div className="space-y-2.5">
            {rq.data.map((r: Rider) => {
              const isSelected = selected.includes(r.userId);
              return (
                <label
                  key={r.userId}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/80 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-emerald-600 rounded"
                    checked={isSelected}
                    disabled={!isSelected && selected.length >= (plan?.ridersCount || 0)}
                    onChange={e =>
                      setSelected(s =>
                        e.target.checked ? [...s, r.userId] : s.filter(x => x !== r.userId)
                      )
                    }
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{r.user.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500 font-medium">
                      {r.user.phone} · {r.vehicleNo || 'No vehicle'} · {r.city || 'No city'}
                    </p>
                  </div>
                  <span className="badge badge-green">Active</span>
                </label>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button className="btn btn-muted" onClick={() => nav('/admin/ads')}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={
              !plan ||
              selected.length < 1 ||
              selected.length > plan.ridersCount ||
              assign.isPending
            }
            onClick={() => assign.mutate()}
          >
            {assign.isPending ? 'Assigning…' : `Assign ${selected.length} riders`}
          </button>
        </div>
      </Card>
    </>
  );
}
