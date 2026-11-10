import {NavLink, Outlet, useNavigate} from 'react-router-dom';
import {useAuth} from '../auth/AuthContext';
import {Activity, ClipboardCheck, LayoutDashboard, LogOut, MapPinned, PanelTop, Settings2, Users, Wallet, Route} from 'lucide-react';

const adminNav = [
  ['/admin', 'Overview', LayoutDashboard],
  ['/admin/ads', 'Campaign queue', PanelTop],
  ['/admin/riders', 'Riders', Users],
  ['/admin/logs', 'Daily logs', ClipboardCheck],
  ['/admin/payouts', 'Payouts', Wallet],
  ['/admin/plans', 'Plans', Settings2]
] as const;

const riderNav = [
  ['/rider', 'My dashboard', LayoutDashboard],
  ['/rider/start', 'Start day', MapPinned],
  ['/rider/end', 'End day', Route],
  ['/rider/history', 'History', Activity]
] as const;

export default function Shell() {
  const {user, logout} = useAuth();
  const nav = useNavigate();
  const links = user?.role === 'ADMIN' ? adminNav : riderNav;

  return (
    <div className="min-h-screen md:flex">
      {/* Sidebar */}
      <aside className="border-b border-[#d6c8b1] bg-[#064E3B] px-4 py-4 md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-b-0 md:border-r md:px-5">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#10B981] font-black text-slate-950 shadow-sm">
            A.
          </div>
          <div>
            <p className="font-bold tracking-tight text-white text-lg">
              adora<span className="text-[#10B981]">.</span>
            </p>
            <p className="text-[10px] uppercase tracking-[.18em] text-emerald-200/80 font-semibold">
              Campaign operations
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="mt-6 hidden rounded-xl border border-emerald-700/60 bg-emerald-950/70 p-3.5 md:block">
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          <p className="mt-1 text-xs text-emerald-300 font-medium">
            {user?.role === 'ADMIN' ? 'Administrator' : 'Verified Rider'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 md:mt-7 md:flex-col">
          {links.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin' || to === '/rider'}
              className={({isActive}) =>
                `flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#10B981] text-slate-950 shadow-sm'
                    : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Sign Out Desktop */}
        <div className="mt-auto hidden border-t border-emerald-800/80 pt-4 md:block">
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-900/60 hover:text-white transition"
            onClick={async () => {
              await logout();
              nav('/login');
            }}
          >
            <LogOut size={17} />
            Sign out
          </button>
          <p className="mt-3 px-3 text-[11px] text-emerald-400/60 font-medium">
            Adora platform · v1.0
          </p>
        </div>

        {/* Sign Out Mobile */}
        <div className="mt-3 flex justify-end md:hidden">
          <button
            className="btn btn-muted flex items-center gap-2 text-xs"
            onClick={async () => {
              await logout();
              nav('/login');
            }}
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="min-h-screen px-4 py-6 md:ml-64 md:px-8 md:py-9">
        <div className="mx-auto max-w-7xl">
          {/* Top Bar */}
          <div className="mb-7 flex items-center justify-between border-b border-[#e4d9c6] pb-4">
            <div>
              <p className="text-xs uppercase tracking-[.18em] text-slate-500 font-bold">
                Workspace / {user?.role === 'ADMIN' ? 'Administration' : 'Rider portal'}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                Welcome back, {user?.name?.split(' ')[0] || 'there'}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              System workspace
            </div>
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}
