import {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api, messageOf} from '../../api/client';
import {Card, Empty, ErrorState, Loading, PageTitle, Status} from '../../components/UI';
import toast from 'react-hot-toast';

type Plan = {
  id: string;
  name: string;
  description: string | null;
  durationDays: number;
  ridersCount: number;
  pricePaise: string;
  ratePerKmPaise: number;
  active: boolean;
};

const blank = {
  name: '',
  description: '',
  durationDays: 15,
  ridersCount: 3,
  priceRupees: '9999',
  rateRupees: 2,
  active: true
};

export default function Plans() {
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ['admin-plans'],
    queryFn: async () => (await api.get('/admin/plans')).data.data.items
  });

  const save = useMutation({
    mutationFn: () => {
      const body = {
        name: form.name,
        description: form.description || undefined,
        durationDays: Number(form.durationDays),
        ridersCount: Number(form.ridersCount),
        pricePaise: String(Math.round(Number(form.priceRupees) * 100)),
        ratePerKmPaise: Math.round(Number(form.rateRupees) * 100),
        active: form.active
      };
      return editing ? api.patch(`/admin/plans/${editing}`, body) : api.post('/admin/plans', body);
    },
    onSuccess: () => {
      toast.success('Plan saved');
      void qc.invalidateQueries({queryKey: ['admin-plans']});
      setForm(blank);
      setEditing(null);
    },
    onError: e => toast.error(messageOf(e))
  });

  const edit = (p: Plan) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      durationDays: p.durationDays,
      ridersCount: p.ridersCount,
      priceRupees: (Number(p.pricePaise) / 100).toString(),
      rateRupees: p.ratePerKmPaise / 100,
      active: p.active
    });
  };

  return (
    <>
      <PageTitle
        title="Plan catalogue"
        sub="Control pricing, campaign duration, rider counts, and payout rates."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)]">
        <Card className="p-0">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Duration</th>
                  <th>Riders</th>
                  <th>Price</th>
                  <th>Rate / km</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {q.isLoading ? (
                  <tr>
                    <td colSpan={7}>
                      <Loading />
                    </td>
                  </tr>
                ) : q.error ? (
                  <tr>
                    <td colSpan={7}>
                      <ErrorState text={messageOf(q.error)} />
                    </td>
                  </tr>
                ) : q.data.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <Empty />
                    </td>
                  </tr>
                ) : (
                  q.data.map((p: Plan) => (
                    <tr key={p.id}>
                      <td>
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="max-w-48 text-xs text-slate-500 font-medium truncate">
                          {p.description || '—'}
                        </p>
                      </td>
                      <td className="font-medium text-slate-800">{p.durationDays} days</td>
                      <td className="font-medium text-slate-800">{p.ridersCount}</td>
                      <td className="font-bold text-slate-900">
                        ₹{(Number(p.pricePaise) / 100).toLocaleString('en-IN')}
                      </td>
                      <td className="text-slate-800 font-medium">
                        ₹{(p.ratePerKmPaise / 100).toFixed(2)}
                      </td>
                      <td>
                        <Status value={p.active ? 'active' : 'disabled'} />
                      </td>
                      <td>
                        <button className="btn btn-muted text-xs" onClick={() => edit(p)}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-slate-900 text-lg">
            {editing ? 'Edit plan' : 'Create a plan'}
          </h2>
          <form
            className="mt-5 space-y-4"
            onSubmit={e => {
              e.preventDefault();
              save.mutate();
            }}
          >
            <div>
              <label className="label">Plan name</label>
              <input
                className="field"
                value={form.name}
                onChange={e => setForm(s => ({...s, name: e.target.value}))}
                required
                maxLength={80}
                placeholder="e.g. City Prime 15"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="field min-h-20"
                value={form.description}
                onChange={e => setForm(s => ({...s, description: e.target.value}))}
                placeholder="Short description of the campaign package"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Duration (days)</label>
                <input
                  className="field"
                  type="number"
                  min={1}
                  max={365}
                  value={form.durationDays}
                  onChange={e => setForm(s => ({...s, durationDays: Number(e.target.value)}))}
                  required
                />
              </div>
              <div>
                <label className="label">Riders</label>
                <input
                  className="field"
                  type="number"
                  min={1}
                  max={100}
                  value={form.ridersCount}
                  onChange={e => setForm(s => ({...s, ridersCount: Number(e.target.value)}))}
                  required
                />
              </div>
              <div>
                <label className="label">Price (₹)</label>
                <input
                  className="field"
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={form.priceRupees}
                  onChange={e => setForm(s => ({...s, priceRupees: e.target.value}))}
                  required
                />
              </div>
              <div>
                <label className="label">Payout rate (₹/km)</label>
                <input
                  className="field"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.rateRupees}
                  onChange={e => setForm(s => ({...s, rateRupees: Number(e.target.value)}))}
                  required
                />
              </div>
            </div>
            {editing && (
              <div>
                <label className="label">Plan availability</label>
                <select
                  className="field"
                  value={String(
                    (q.data as Plan[] | undefined)?.find(p => p.id === editing)?.active ?? true
                  )}
                  onChange={e => setForm(s => ({...s, active: e.target.value === 'true'}))}
                >
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            )}
            <button className="btn btn-primary w-full py-2.5" disabled={save.isPending}>
              {save.isPending ? 'Saving…' : editing ? 'Save changes' : 'Create plan'}
            </button>
            {editing && (
              <button
                type="button"
                className="btn btn-muted w-full py-2"
                onClick={() => {
                  setEditing(null);
                  setForm(blank);
                }}
              >
                Cancel edit
              </button>
            )}
          </form>
        </Card>
      </div>
    </>
  );
}
