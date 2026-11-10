import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, messageOf } from '../../api/client';
import { Card, Empty, ErrorState, Loading, PageTitle, Status } from '../../components/UI';
import toast from 'react-hot-toast';

type Rider = {
  userId: string;
  status: string;
  city: string | null;
  vehicleNo: string | null;
  upiId: string | null;
  user: { id: string; name: string; phone: string; email: string | null; createdAt: string };
};

export default function Riders() {
  const [filter, setFilter] = useState('ALL');
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ['riders', filter],
    queryFn: async () =>
      (await api.get('/admin/riders', { params: filter === 'ALL' ? {} : { status: filter } })).data
        .data
  });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/riders/${id}`, { status }),
    onSuccess: () => {
      toast.success('Rider status updated');
      void qc.invalidateQueries({ queryKey: ['riders'] });
    },
    onError: e => toast.error(messageOf(e))
  });

  return (
    <>
      <PageTitle
        title="Rider network"
        sub="Approve new riders, manage access, and review rider profiles."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {['ALL', 'PENDING', 'ACTIVE', 'BLOCKED'].map(s => (
          <button
            key={s}
            className={`btn text-sm ${filter === s ? 'btn-primary' : 'btn-muted'}`}
            onClick={() => setFilter(s)}
          >
            {s.replaceAll('_', ' ')}
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
                  <th>Rider</th>
                  <th>Vehicle / city</th>
                  <th>UPI</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {q.data.items.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <Empty text="No riders found" />
                    </td>
                  </tr>
                ) : (
                  q.data.items.map((r: Rider) => (
                    <tr key={r.userId}>
                      <td>
                        <p className="font-semibold text-slate-900">{r.user.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500 font-medium">
                          {r.user.phone} · {r.user.email || 'No email'}
                        </p>
                      </td>
                      <td>
                        <p className="font-semibold text-slate-900">{r.vehicleNo || '—'}</p>
                        <p className="mt-0.5 text-xs text-slate-500 font-medium">
                          {r.city || 'City not set'}
                        </p>
                      </td>
                      <td className="text-xs font-mono text-slate-600 font-medium">
                        {r.upiId || '—'}
                      </td>
                      <td className="text-xs text-slate-600 font-medium">
                        {new Date(r.user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Status value={r.status} />
                      </td>
                      <td>
                        <select
                          className="field min-w-32 py-1.5 text-xs font-semibold"
                          value={r.status}
                          disabled={update.isPending}
                          onChange={e => update.mutate({ id: r.userId, status: e.target.value })}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="ACTIVE">Active</option>
                          <option value="BLOCKED">Blocked</option>
                        </select>
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
