import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Open Doodles (CC0), recolored to the app palette
import plantImg from '../assets/illustrations/plant.svg';
import Mascot from '../components/Mascot';
import { getMe, login } from '../lib/auth';

const inputClass =
  'w-full border border-slate-200 bg-[#FFFDF9] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#CDB4DB] transition-shadow';

export default function Login() {
  const navigate = useNavigate();

  // Skip the form if the session cookie is still valid
  useEffect(() => {
    getMe()
      .then(() => navigate('/home', { replace: true }))
      .catch(() => {});
  }, [navigate]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/home', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message === 'Invalid' ? 'Email or password is incorrect.' : message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#FFE1D6] blur-3xl opacity-70" />
      <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-[#E9DCFA] blur-3xl opacity-70" />

      <div className="relative w-full max-w-sm md:max-w-4xl grid md:grid-cols-2 bg-white/90 backdrop-blur rounded-[2rem] shadow-xl shadow-[#FFB4A2]/15 border border-white overflow-hidden">
        {/* Illustration panel */}
        <div className="relative bg-[#FFEDE5] px-8 pt-8 pb-6 md:p-10 flex flex-col">
          <div className="flex items-center gap-2">
            <Mascot color="#FFB4A2" className="w-8 h-8" />
            <span className="font-semibold text-slate-800">Talksy</span>
          </div>

          <div className="flex-1 flex items-center justify-center py-4 md:py-8">
            <div className="relative">
              <div className="absolute inset-6 rounded-full bg-white/70 blur-2xl" />
              <img src={plantImg} alt="Person happily hugging a houseplant" className="relative w-48 md:w-80" />
            </div>
          </div>

          <p className="hidden md:block text-slate-600 text-lg font-medium leading-snug">
            A soft little corner
            <br />
            for your conversations. 🌿
          </p>
        </div>

        {/* Form panel */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-slate-800">Welcome back!</h1>
          <p className="text-sm text-slate-500 mt-1 mb-8">Your chats missed you. Let's catch up.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {error && (
              <p className="text-sm text-[#B5542C] bg-[#FFE1D6] rounded-2xl px-4 py-2.5">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#FFB4A2] text-white font-medium hover:bg-[#ff9d86] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? 'Taking a breath…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
