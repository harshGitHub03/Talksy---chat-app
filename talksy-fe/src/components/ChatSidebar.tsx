import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { listContacts } from "../lib/users";
import type { Contact } from "../lib/users";
import ChatAvatar from "./ChatAvatar";
// import { useCurrentUser } from "../hooks/useCurrentUser";

const PAGE_SIZE = 10;
const SEARCH_DELAY_MS = 300;

// Shown in place of the main nav while on /chats
export default function ChatSidebar({
  liveUsers,
  onNavigate,
}: {
  liveUsers:Set<string>
  onNavigate: () => void;
}) {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const sentinelRef = useRef<HTMLLIElement>(null);

  const hasMore = contacts.length < count;

  // Wait for typing to pause, then restart from page 1 with the new search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === search) return;
    const id = setTimeout(() => {
      setSearch(trimmed);
      setPage(1);
      setContacts([]);
      setCount(0);
      setLoading(true);
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(id);
  }, [query, search]);

  useEffect(() => {
    let cancelled = false;
    listContacts(page, PAGE_SIZE, search)
      .then((res) => {
        if (cancelled) return;
        setContacts((prev) =>
          page === 1 ? res.users : [...prev, ...res.users],
        );
        setCount(res.count);
        setError(null);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Could not load people.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search, reloadKey]);

  // Load the next page when the bottom of the list scrolls into view
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || loading || error || !hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoading(true);
        setPage((p) => p + 1);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, error, hasMore]);

  function retry() {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  }

  return (
    <>
      <Link
        to="/home"
        onClick={onNavigate}
        className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-slate-500 hover:bg-[#FFF8F0] hover:text-slate-700 transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </Link>

      <div className="px-2 mt-3 mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Chats</h2>
        <p className="text-sm text-slate-400">
          Your people, all in one cozy place 🌸
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search people…"
        className="w-full border border-slate-200 bg-[#FFFDF9] rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#CDB4DB] transition-shadow mb-3"
      />

      <ul className="flex-1 overflow-y-auto scrollbar-thin -mx-1 px-1 space-y-1">
        {contacts.map((c) => {
          const displayName = c.name || c.email.split("@")[0];
          const isOnline = liveUsers?.has(c.id);
          console.log("from",liveUsers)
          return (
            <li key={c.id}>
              <NavLink
                to={`/chats/${c.id}`}
                state={{ contact: c }}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-colors ${
                    isActive ? "bg-[#FFE1D6]" : "hover:bg-[#FFF8F0]"
                  }`
                }
              >
                <div className="relative shrink-0">
                  <ChatAvatar id={c.id} />

                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800 truncate">
                    {displayName}
                  </p>
                  <p className="text-sm text-slate-400 truncate">{c.email}</p>
                </div>
              </NavLink>
            </li>
          );
        })}

        {hasMore && <li ref={sentinelRef} aria-hidden className="h-1" />}

        {loading &&
          Array.from({ length: contacts.length ? 2 : 6 }, (_, i) => (
            <li
              key={`skeleton-${i}`}
              aria-hidden
              className="flex items-center gap-3 px-3 py-3 animate-pulse"
            >
              <div className="w-12 h-12 shrink-0 rounded-full bg-[#FFF0E8]" />
              <div className="flex-1 space-y-2">
                <div
                  className="h-3.5 rounded-full bg-[#FFF0E8]"
                  style={{ width: `${55 + ((i * 17) % 30)}%` }}
                />
                <div className="h-3 w-4/5 rounded-full bg-[#FFF8F0]" />
              </div>
            </li>
          ))}

        {error && (
          <li className="text-sm text-[#B5542C] bg-[#FFE1D6] rounded-2xl px-4 py-3">
            {error}{" "}
            <button
              onClick={retry}
              className="font-medium underline underline-offset-2"
            >
              Try again
            </button>
          </li>
        )}

        {!loading && !error && contacts.length === 0 && (
          <li className="text-center text-sm text-slate-400 py-10">
            {search ? "No one by that name… yet 🌱" : "No one else here yet 🌱"}
          </li>
        )}
      </ul>
    </>
  );
}
