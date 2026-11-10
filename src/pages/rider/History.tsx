import {useQuery} from '@tanstack/react-query';
import {api, messageOf} from '../../api/client';
import {Card, Empty, ErrorState, Loading, PageTitle, Status} from '../../components/UI';

type Log = {
  id: string;
  logDate: string;
  startKm: string;
  endKm: string | null;
  status: string;
  adminNote: string | null;
  ad: {title: string | null};
};

export default function History() {
  const q = useQuery({
    queryKey: ['rider-logs'],
    queryFn: async () =>
      (await api.get('/rider/logs', {params: {page: 1, pageSize: 100}})).data.data
  });

  return (
    <>
      <PageTitle
        title="Log history"
        sub="Track submitted distance, verification status, and review notes."
      />

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
                  <th>Date</th>
                  <th>Campaign</th>
                  <th>Odometer</th>
                  <th>Distance</th>
                  <th>Status</th>
                  <th>Admin note</th>
                </tr>
              </thead>
              <tbody>
                {q.data.items.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <Empty text="No logs submitted yet" />
                    </td>
                  </tr>
                ) : (
                  q.data.items.map((l: Log) => (
                    <tr key={l.id}>
                      <td className="text-slate-600 font-medium">
                        {new Date(l.logDate).toLocaleDateString()}
                      </td>
                      <td className="font-semibold text-slate-900">
                        {l.ad.title || 'Campaign'}
                      </td>
                      <td className="font-mono text-xs text-slate-700">
                        {l.startKm} → {l.endKm || 'Open'}
                      </td>
                      <td className="font-semibold text-slate-800">
                        {l.endKm ? `${(Number(l.endKm) - Number(l.startKm)).toFixed(1)} km` : '—'}
                      </td>
                      <td>
                        <Status value={l.status} />
                      </td>
                      <td className="max-w-48 text-xs text-slate-500 font-medium">
                        {l.adminNote || '—'}
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
