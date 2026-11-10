import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {api, messageOf} from '../../api/client';
import {Bike, ArrowUpRight} from 'lucide-react';

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    vehicleNo: '',
    city: '',
    upiId: ''
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form, value: string) =>
    setForm(s => ({...s, [key]: value}));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/auth/riders/signup', {
        ...form,
        email: form.email.trim() || undefined,
        vehicleNo: form.vehicleNo.trim() || undefined,
        city: form.city.trim() || undefined,
        upiId: form.upiId.trim() || undefined
      });
      nav('/login', {
        state: {message: 'Registration received. Wait for admin approval.'}
      });
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <form onSubmit={submit} className="panel w-full max-w-2xl p-6 md:p-9 shadow-md">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-[.18em] text-emerald-800">
          <Bike size={16} className="text-emerald-600" />
          Join the rider network
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Rider Registration</h1>
        <p className="mt-1.5 text-sm text-slate-600 font-medium">
          Create your rider profile. Accounts are verified by an administrator before assignment.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {(
            [
              ['name', 'Full name *', 'text', true],
              ['phone', 'Phone number *', 'tel', true],
              ['email', 'Email (optional)', 'email', false],
              ['vehicleNo', 'Vehicle number (e.g. MH02AB1234)', 'text', false],
              ['city', 'Operating city', 'text', false],
              ['upiId', 'Payout UPI ID (e.g. name@okhdfcbank)', 'text', false]
            ] as const
          ).map(([key, label, type, req]) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input
                className="field"
                type={type}
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                required={req}
                placeholder={label.replace(' *', '')}
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="label">Password (10+ characters) *</label>
            <input
              className="field"
              type="password"
              minLength={10}
              value={form.password}
              onChange={e => set('password', e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Create a secure password"
            />
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 font-medium"
          >
            {error}
          </p>
        )}

        <button
          className="btn btn-primary mt-6 w-full py-3 flex items-center justify-center gap-2"
          disabled={busy}
        >
          {busy ? 'Submitting…' : (
            <>
              Submit Registration
              <ArrowUpRight size={17} />
            </>
          )}
        </button>

        <p className="mt-5 text-center text-sm text-slate-600 font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-700 font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </form>
    </div>
  );
}
