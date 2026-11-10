import {useState, useEffect} from 'react';
import {useNavigate, Link, useSearchParams} from 'react-router-dom';
import {useAuth} from '../../auth/AuthContext';
import {messageOf} from '../../api/client';
import {ArrowUpRight, ShieldCheck, Bike, Lock, Sparkles} from 'lucide-react';

interface LoginProps {
  initialRole?: 'RIDER' | 'ADMIN';
}

export default function Login({initialRole}: LoginProps){
  const {login} = useAuth();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();

  const roleFromQuery = params.get('role')?.toUpperCase();
  const [activeTab, setActiveTab] = useState<'RIDER' | 'ADMIN'>(
    initialRole || (roleFromQuery === 'ADMIN' ? 'ADMIN' : 'RIDER')
  );

  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialRole) {
      setActiveTab(initialRole);
    } else if (roleFromQuery === 'ADMIN') {
      setActiveTab('ADMIN');
    }
  }, [initialRole, roleFromQuery]);

  function handleTabChange(tab: 'RIDER' | 'ADMIN') {
    setActiveTab(tab);
    setError('');
    setParams(tab === 'ADMIN' ? { role: 'admin' } : {});
  }

  function fillAdminDemo() {
    setIdentity('admin@example.com');
    setPassword('AdminPassword123!');
    setError('');
  }

  async function submit(e: React.FormEvent){
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const u = await login(identity, password);
      nav(u.role === 'ADMIN' ? '/admin' : '/rider', { replace: true });
    } catch(err) {
      setError(messageOf(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Branding Showcase */}
      <section className="relative hidden overflow-hidden border-r border-slate-800/80 p-12 lg:flex lg:flex-col lg:justify-between bg-slate-950">
        <div className="absolute -left-28 top-36 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"/>
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 font-black text-slate-950 shadow-md">
            A.
          </div>
          <span className="text-xl font-bold text-white tracking-wide">
            adora<span className="text-emerald-400">.</span>
          </span>
        </div>

        <div className="relative max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <ShieldCheck size={15}/> Dual-role operations platform
          </div>
          <h1 className="text-5xl font-semibold leading-[1.12] tracking-tight text-white">
            Real-world reach.<br/>
            <span className="text-emerald-400">Measured daily.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
            Unified workspace for riders submitting daily odometer proof and administrators verifying campaigns, routes, and payouts.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              ['01', 'Campaigns', 'Review & assign ads'],
              ['02', 'Field proof', 'Odometer verification'],
              ['03', 'Payouts', 'Automated calculations']
            ].map(([n, t, desc]) => (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4" key={n}>
                <p className="text-xs font-semibold text-emerald-400">{n}</p>
                <p className="mt-1.5 text-sm font-medium text-white">{t}</p>
                <p className="mt-1 text-[11px] text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between text-xs text-slate-500">
          <span>ADORA OPERATIONS · SECURE ACCESS</span>
          <span>v1.0.0</span>
        </div>
      </section>

      {/* Right Login Section */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 lg:hidden flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 font-black text-slate-950">
              A.
            </div>
            <p className="text-xl font-bold text-slate-900">adora.</p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="mb-8 p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300 flex items-center gap-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => handleTabChange('RIDER')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'RIDER'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-300/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bike size={17} className={activeTab === 'RIDER' ? 'text-emerald-600' : 'text-slate-400'}/>
              Rider Login
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('ADMIN')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'ADMIN'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock size={16} className={activeTab === 'ADMIN' ? 'text-emerald-400' : 'text-slate-400'}/>
              Admin Portal
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-[.18em] px-2.5 py-1 rounded-md ${
                activeTab === 'ADMIN'
                  ? 'bg-slate-900 text-emerald-400'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {activeTab === 'ADMIN' ? 'Administrator Console' : 'Rider Portal'}
              </span>

              {activeTab === 'ADMIN' && (
                <button
                  type="button"
                  onClick={fillAdminDemo}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md transition-colors"
                  title="Fill default local admin credentials"
                >
                  <Sparkles size={13}/>
                  Auto-fill Admin
                </button>
              )}
            </div>

            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              {activeTab === 'ADMIN' ? 'Sign in to Admin Console' : 'Sign in to Rider Workspace'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              {activeTab === 'ADMIN'
                ? 'Manage campaigns, verify rider odometer logs, and oversee payouts.'
                : 'Upload daily odometer evidence, track ad assignments, and check earnings.'}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">
                {activeTab === 'ADMIN' ? 'Admin Email / Phone' : 'Phone or Email'}
              </label>
              <input
                className="field"
                autoComplete="username"
                value={identity}
                onChange={e => setIdentity(e.target.value)}
                required
                placeholder={activeTab === 'ADMIN' ? 'admin@example.com' : 'e.g. 9876543210 or rider@example.com'}
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                className="field"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 font-medium">
                {error}
              </p>
            )}

            <button
              disabled={busy}
              className={`btn flex w-full items-center justify-center gap-2 py-3 disabled:opacity-60 text-white font-semibold shadow-sm transition-colors ${
                activeTab === 'ADMIN'
                  ? 'bg-slate-900 hover:bg-slate-800'
                  : 'btn-primary'
              }`}
            >
              {busy ? 'Authenticating…' : (
                <>
                  {activeTab === 'ADMIN' ? 'Enter Admin Console' : 'Access Rider Workspace'}
                  <ArrowUpRight size={17}/>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            {activeTab === 'RIDER' ? (
              <p className="text-center text-sm text-slate-600">
                New rider?{' '}
                <Link className="font-semibold text-emerald-700 hover:underline" to="/signup">
                  Create rider account
                </Link>
              </p>
            ) : (
              <div className="text-center">
                <p className="text-xs text-slate-500">
                  Bootstrap admin credentials: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">admin@example.com</code> / <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">AdminPassword123!</code>
                </p>
              </div>
            )}

            <p className="mt-4 text-center text-xs text-slate-400">
              Protected by JWT authentication and secure session cookies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
