import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getMe } from '../lib/auth';
import type { User } from '../lib/auth';
// Open Doodles (CC0), recolored to the app palette
import meditatingImg from '../assets/illustrations/meditating.svg';

type State = { status: 'checking' } | { status: 'guest' } | { status: 'authed'; user: User };

// Layout route: renders child routes only for logged-in users and hands them the user
export default function ProtectedRoute() {
  const [state, setState] = useState<State>({ status: 'checking' });

  useEffect(() => {
    getMe()
      .then((user) => setState({ status: 'authed', user }))
      .catch(() => setState({ status: 'guest' }));
  }, []);

  if (state.status === 'checking') {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center gap-6 px-4" aria-busy>
        <div className="relative w-64 max-w-full">
          <div className="absolute inset-x-6 inset-y-2 rounded-full bg-[#E9DCFA] blur-2xl motion-safe:animate-breathe" />
          <img src={meditatingImg} alt="" className="relative w-full motion-safe:animate-breathe" />
        </div>
        <div className="text-center">
          <p className="font-medium text-slate-700">Settling in…</p>
          <p className="text-sm text-slate-400 mt-1">Breathe in, breathe out. We'll be right with you. 🌿</p>
        </div>
      </div>
    );
  }

  if (state.status === 'guest') return <Navigate to="/" replace />;

  return <Outlet context={{user:state.user}} />;
}
