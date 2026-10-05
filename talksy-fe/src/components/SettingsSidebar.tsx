import { Link, NavLink } from 'react-router-dom';

const SETTINGS_ITEMS = [{ label: 'Manage users', icon: '👥', to: '/settings/users' }];

// Shown in place of the main nav while on /settings
export default function SettingsSidebar({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <Link
        to="/home"
        onClick={onNavigate}
        className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-slate-500 hover:bg-[#FFF8F0] hover:text-slate-700 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </Link>

      <div className="px-2 mt-3 mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-400">Tidy things up, gently ✨</p>
      </div>

      <nav className="flex-1 space-y-1">
        {SETTINGS_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                isActive ? 'bg-[#EEE3FA] text-[#6B4B9A]' : 'text-slate-600 hover:bg-[#FFF8F0]'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
