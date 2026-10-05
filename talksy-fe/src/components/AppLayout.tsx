import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../lib/auth";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Mascot from "./Mascot";
import ChatSidebar from "./ChatSidebar";
import SettingsSidebar from "./SettingsSidebar";
import { socket } from "../socket/socket";

type NavItem = {
  label: string;
  icon: string;
  to?: string;
  activeClass: string;
};

// Items without `to` are pages that don't exist yet
const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    icon: "🏡",
    to: "/home",
    activeClass: "bg-[#FFE1D6] text-[#B5542C]",
  },
  {
    label: "Chats",
    icon: "💬",
    to: "/chats",
    activeClass: "bg-[#DDF6EC] text-[#2F8A66]",
  },
  { label: "Badges", icon: "🏅", activeClass: "bg-[#EEE3FA] text-[#6B4B9A]" },
  { label: "Breathe", icon: "🌿", activeClass: "bg-[#DDF6EC] text-[#2F8A66]" },
  {
    label: "Settings",
    icon: "⚙️",
    to: "/settings",
    activeClass: "bg-[#EEE3FA] text-[#6B4B9A]",
  },
];

export default function AppLayout() {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const { pathname } = useLocation();
  const inChats = pathname.startsWith("/chats");
  const inSettings = pathname.startsWith("/settings");

  const [liveUsers,setLiveUsers]=useState<Set<string>>(new Set())

  // attach live users fetch socket event
  useEffect(() => {
    const handleInitialUsers = (data: { onlineUsers: string[] }) => {
      setLiveUsers(new Set(data.onlineUsers));
    };

    const handler = (data: { userId: string; isOnline: boolean }) => {
      console.log("online handle", data);
      if (data.isOnline) {
        setLiveUsers((prev) => {
          const newset = new Set(prev);
          newset.add(data.userId);
          return newset;
        });
      } else {
        setLiveUsers((prev) => {
          const newset = new Set(prev);
          newset.delete(data.userId);
          return newset;
        });
      }
    };

    socket.emit("online-users", handleInitialUsers);
    socket.on("user:online-stat", handler);
    return () => {
      socket.off("already-online-users", handleInitialUsers);
      socket.off("user:online-stat", handler);
    };
  }, []);

  //socket connection
  useEffect(() => {
    socket.connect();
    const handleConnect = () => console.log("Socket connected:", socket.id);
    const handleDisconnect = () =>
      console.log("Socket disconnected", socket.id);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  async function handleSignOut() {
    await logout().catch(() => {});
    navigate("/", { replace: true });
  }

  const displayName = user.name || user.email.split("@")[0];

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-slate-700 md:flex">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-20 flex items-center justify-between h-16 px-4 bg-[#FFF8F0]/90 backdrop-blur border-b border-[#FFE1D6]">
        <div className="flex items-center gap-2">
          <Mascot color="#FFB4A2" className="w-8 h-8" />
          <span className="font-semibold text-slate-800">Talksy</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      {/* Backdrop for the mobile drawer */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-30 bg-slate-800/20 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen ${
          inChats ? "w-80 max-w-[85vw]" : "w-64"
        } shrink-0 flex flex-col bg-white/90 backdrop-blur border-r border-[#FFE1D6] px-4 py-6 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {inChats ? (
          <ChatSidebar liveUsers={liveUsers} onNavigate={() => setOpen(false)} />
        ) : inSettings ? (
          <SettingsSidebar onNavigate={() => setOpen(false)} />
        ) : (
          <>
            <div className="flex items-center gap-2 px-2 mb-8">
              <Mascot color="#FFB4A2" className="w-10 h-10" />
              <span className="font-semibold text-slate-800 text-lg">
                Talksy
              </span>
            </div>

            <nav className="flex-1 space-y-1">
              {NAV_ITEMS.map((item) =>
                item.to ? (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                        isActive
                          ? item.activeClass
                          : "text-slate-600 hover:bg-[#FFF8F0]"
                      }`
                    }
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ) : (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-slate-400 cursor-not-allowed"
                  >
                    <span className="text-base opacity-60">{item.icon}</span>
                    {item.label}
                    <span className="ml-auto text-[10px] uppercase tracking-wide bg-slate-100 text-slate-400 rounded-full px-2 py-0.5">
                      Soon
                    </span>
                  </div>
                ),
              )}
            </nav>

            <div className="rounded-3xl bg-[#FFF8F0] p-3 flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-full bg-[#E9DCFA] flex items-center justify-center font-semibold text-[#6B4B9A] uppercase">
                {displayName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setConfirmingSignOut(true)}
              className="mt-3 w-full py-2.5 rounded-full bg-white border border-slate-200 text-sm font-medium shadow-sm hover:shadow transition-shadow"
            >
              Sign out
            </button>
          </>
        )}
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet context={{user,liveUsers}} />
      </main>

      {confirmingSignOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setConfirmingSignOut(false)}
            className="absolute inset-0 bg-slate-800/20 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-[#FFB4A2]/10 p-6 text-center">
            <Mascot color="#CDB4DB" className="w-16 h-16 mx-auto" />
            <h2 className="text-lg font-semibold text-slate-800 mt-3">
              Heading out?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              You'll need to sign in again to get back to your chats.
            </p>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setConfirmingSignOut(false)}
                className="flex-1 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Stay
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 py-2.5 rounded-full bg-[#FFB4A2] text-white text-sm font-medium hover:bg-[#ff9d86] transition-colors shadow-sm"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
