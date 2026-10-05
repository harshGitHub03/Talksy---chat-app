import { useEffect, useState } from 'react';

const CYCLE_MS = 4000;

export default function BreathingCircle() {
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p === 'in' ? 'out' : 'in')), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full bg-[#CDB4DB]/50 transition-transform ease-in-out"
          style={{
            transitionDuration: `${CYCLE_MS}ms`,
            transform: phase === 'in' ? 'scale(1)' : 'scale(0.6)',
          }}
        />
        <div
          className="absolute inset-4 rounded-full bg-[#B5EAD7]/70 transition-transform ease-in-out"
          style={{
            transitionDuration: `${CYCLE_MS}ms`,
            transform: phase === 'in' ? 'scale(1)' : 'scale(0.7)',
          }}
        />
        <span className="relative text-sm font-medium text-slate-600">
          {phase === 'in' ? 'Breathe in…' : 'Breathe out…'}
        </span>
      </div>
    </div>
  );
}
