import { useEffect, useState } from 'react';
import { ApiError } from '../lib/api';
import { ROLES, createUser, deleteUser, listUsers, updateUser } from '../lib/users';
import type { ManagedUser, Role, UserInput } from '../lib/users';
import { useCurrentUser } from '../hooks/useCurrentUser';
// Open Doodles (CC0), recolored to the app palette
import readingImg from '../assets/illustrations/reading-side.svg';

const PAGE_SIZE = 10;

const ROLE_STYLES: Record<Role, { label: string; badge: string; avatar: string }> = {
  admin: { label: 'Admin', badge: 'bg-[#EEE3FA] text-[#6B4B9A]', avatar: 'bg-[#E9DCFA] text-[#6B4B9A]' },
  user: { label: 'User', badge: 'bg-[#DDF6EC] text-[#2F8A66]', avatar: 'bg-[#D6F5E8] text-[#2F8A66]' },
};

const EMPTY_FORM = { name: '', email: '', password: '', role: 'user' as Role };

const inputClass =
  'w-full border border-slate-200 bg-[#FFFDF9] rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#CDB4DB] transition-shadow';

function errorMessage(err: unknown) {
  if (err instanceof ApiError && err.status === 403) return 'Only admins can manage users.';
  if (err instanceof Error && err.message === 'Already exists') return 'Someone already uses that email.';
  return err instanceof Error ? err.message : 'Something went wrong.';
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-800/20 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-[#FFB4A2]/10 p-6">{children}</div>
    </div>
  );
}

export default function ManageUsers() {
  const me = useCurrentUser();
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');

  // null = closed, 'new' = adding, otherwise the user being edited
  const [editing, setEditing] = useState<ManagedUser | 'new' | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleting, setDeleting] = useState<ManagedUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wait for typing to pause, then search from page 1
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(query.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    listUsers(page, PAGE_SIZE, search)
      .then((res) => {
        if (cancelled) return;
        // Page 1 starts a fresh list; later pages are added to the end
        setUsers((prev) => (page === 1 ? res.users : [...prev, ...res.users]));
        setCount(res.count);
        setLoaded(true);
        setLoadError(null);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoadingMore(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search, reloadKey]);

  const hasMore = users.length < count;

  // Refetch from page 1 (after add/edit/delete, or retrying a failed load)
  function reload() {
    setPage(1);
    setReloadKey((k) => k + 1);
  }

  function loadMore() {
    setLoadingMore(true);
    setPage((p) => p + 1);
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setError(null);
    setEditing('new');
  }

  function openEdit(user: ManagedUser) {
    setForm({ name: user.name ?? '', email: user.email, password: '', role: user.role });
    setError(null);
    setEditing(user);
  }

  function openDelete(user: ManagedUser) {
    setError(null);
    setDeleting(user);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;

    const input: UserInput = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
    };
    // Blank password on edit means "keep the current one"
    if (form.password) input.password = form.password;

    setSaving(true);
    setError(null);
    try {
      if (editing === 'new') await createUser(input);
      else await updateUser(editing.id, input);
      setEditing(null);
      reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setSaving(true);
    setError(null);
    try {
      await deleteUser(deleting.id);
      setDeleting(null);
      reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (!loaded && !loadError) {
    return (
      <div aria-busy className="max-w-4xl mx-auto px-4 sm:px-8 py-8 md:py-12 animate-pulse">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="space-y-2">
            <div className="h-7 w-48 rounded-full bg-[#FFE1D6]" />
            <div className="h-4 w-36 rounded-full bg-[#FFF0E8]" />
          </div>
          <div className="h-10 w-28 rounded-full bg-[#FFE1D6]" />
        </div>
        <div className="h-11 rounded-2xl bg-white mb-4" />
        <ul className="bg-white/90 rounded-3xl shadow-xl shadow-[#FFB4A2]/10 border border-white divide-y divide-[#FFF0E8] overflow-hidden">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-[#FFF0E8]" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 rounded-full bg-[#FFF0E8]" style={{ width: `${30 + ((i * 13) % 25)}%` }} />
                <div className="h-3 w-1/2 rounded-full bg-[#FFF8F0]" />
              </div>
              <div className="hidden sm:block h-6 w-14 rounded-full bg-[#EEE3FA]" />
              <div className="h-7 w-24 rounded-full bg-[#FFF8F0]" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Manage users</h1>
          {loaded && (
            <p className="text-sm text-slate-400 mt-1">
              {search ? `${count} found` : `${count} ${count === 1 ? 'person' : 'people'} in your space 🌿`}
            </p>
          )}
        </div>
        {loaded && (
          <button
            onClick={openAdd}
            className="px-5 py-2.5 rounded-full bg-[#FFB4A2] text-white text-sm font-medium hover:bg-[#ff9d86] transition-colors shadow-sm"
          >
            + Add user
          </button>
        )}
      </div>

      {loadError && (
        <div className="mb-4 flex items-center justify-between gap-3 text-sm text-[#B5542C] bg-[#FFE1D6] rounded-2xl px-4 py-3">
          <span>{loadError}</span>
          <button onClick={reload} className="font-medium underline underline-offset-2 shrink-0">
            Try again
          </button>
        </div>
      )}

      {loaded && (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name or email…"
            className={`${inputClass} mb-4 bg-white`}
          />

          <ul className="bg-white/90 rounded-3xl shadow-xl shadow-[#FFB4A2]/10 border border-white divide-y divide-[#FFF0E8] overflow-hidden">
            {users.map((u) => {
              const style = ROLE_STYLES[u.role] ?? ROLE_STYLES.user;
              const displayName = u.name || u.email.split('@')[0];
              const isMe = u.id === me.id;
              return (
                <li key={u.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4">
                  <div
                    className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-semibold uppercase ${style.avatar}`}
                  >
                    {displayName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800 truncate">
                      {displayName}
                      {isMe && <span className="ml-2 text-xs font-normal text-slate-400">(you)</span>}
                    </p>
                    <p className="text-sm text-slate-400 truncate">{u.email}</p>
                  </div>
                  <span className={`hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-medium ${style.badge}`}>
                    {style.label}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(u)}
                      className="px-3 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:bg-[#FFF8F0] transition-colors"
                    >
                      Edit
                    </button>
                    {!isMe && (
                      <button
                        onClick={() => openDelete(u)}
                        className="px-3 py-1.5 rounded-full text-sm font-medium text-[#B5542C] hover:bg-[#FFE1D6] transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
            {users.length === 0 && (
              <li className="flex flex-col items-center gap-2 text-center text-sm text-slate-400 py-10">
                <img src={readingImg} alt="" className="w-48 max-w-full" />
                {search ? 'No one matches that search 🌱' : 'No users yet. Add your first one 🌱'}
              </li>
            )}
          </ul>

          {hasMore && (
            <div className="flex flex-col items-center gap-2 mt-4">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-medium shadow-sm hover:shadow transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
              <span className="text-xs text-slate-400">
                Showing {users.length} of {count}
              </span>
            </div>
          )}
        </>
      )}

      {editing && (
        <Modal onClose={() => !saving && setEditing(null)}>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">{editing === 'new' ? 'Add user' : 'Edit user'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Name</label>
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Password
                {editing !== 'new' && <span className="font-normal text-slate-400"> (leave blank to keep)</span>}
              </label>
              <input
                type="password"
                required={editing === 'new'}
                minLength={4}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Role</label>
              <div className="flex gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                      form.role === role ? ROLE_STYLES[role].badge : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {ROLE_STYLES[role].label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-[#B5542C] bg-[#FFE1D6] rounded-2xl px-4 py-2.5">{error}</p>}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => setEditing(null)}
                className="flex-1 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 rounded-full bg-[#FFB4A2] text-white text-sm font-medium hover:bg-[#ff9d86] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving…' : editing === 'new' ? 'Add' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <Modal onClose={() => !saving && setDeleting(null)}>
          <h2 className="text-lg font-semibold text-slate-800">Remove {deleting.name || deleting.email}?</h2>
          <p className="text-sm text-slate-500 mt-2">They'll lose access to this space. This can't be undone.</p>
          {error && <p className="mt-4 text-sm text-[#B5542C] bg-[#FFE1D6] rounded-2xl px-4 py-2.5">{error}</p>}
          <div className="flex gap-2 mt-6">
            <button
              disabled={saving}
              onClick={() => setDeleting(null)}
              className="flex-1 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Keep
            </button>
            <button
              disabled={saving}
              onClick={handleDelete}
              className="flex-1 py-2.5 rounded-full bg-[#B5542C] text-white text-sm font-medium hover:bg-[#9c4624] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Removing…' : 'Remove'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
