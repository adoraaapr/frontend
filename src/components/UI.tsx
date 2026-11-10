import type {ReactNode} from 'react';
import {Inbox, AlertCircle} from 'lucide-react';
import ScootyLoader from './ScootyLoader';

export function PageTitle({title, sub, action}: {title: string; sub?: string; action?: ReactNode}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{title}</h1>
        {sub && <p className="mt-1.5 text-sm text-slate-600 font-medium">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({children, className = ''}: {children: ReactNode; className?: string}) {
  return <section className={`panel p-5 md:p-6 ${className}`}>{children}</section>;
}

export function Loading({message}: {message?: string} = {}) {
  return (
    <div className="flex min-h-60 items-center justify-center">
      <ScootyLoader message={message || 'Loading your ride…'} />
    </div>
  );
}

export function Empty({text = 'Nothing here yet'}: {text?: string}) {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center gap-2 text-sm text-slate-500 font-medium">
      <Inbox size={26} className="text-slate-400" />
      {text}
    </div>
  );
}

export function ErrorState({text}: {text: string}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800 font-medium">
      <AlertCircle size={18} className="text-rose-600 shrink-0" />
      {text}
    </div>
  );
}

export function Status({value}: {value: string}) {
  const v = value.toLowerCase();
  const cls = ['active', 'verified', 'paid', 'running', 'approved', 'completed'].includes(v)
    ? 'badge-green'
    : ['pending', 'submitted', 'pending_approval', 'created'].includes(v)
    ? 'badge-yellow'
    : ['blocked', 'rejected', 'failed', 'refunded'].includes(v)
    ? 'badge-red'
    : '';
  return <span className={`badge ${cls}`}>{value.replaceAll('_', ' ')}</span>;
}

export function Stat({label, value, detail}: {label: string; value: string | number; detail?: string}) {
  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2.5 text-3xl font-extrabold text-slate-900">{value}</p>
      {detail && <p className="mt-1.5 text-xs text-slate-600 font-medium">{detail}</p>}
    </Card>
  );
}
