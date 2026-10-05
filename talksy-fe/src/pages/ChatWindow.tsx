import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import ChatAvatar from "../components/ChatAvatar";
// Open Doodles (CC0), recolored to the app palette
import selfieImg from "../assets/illustrations/selfie.svg";
import type { Contact } from "../lib/users";
import { socket } from "../socket/socket";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { listMessages, upsertConverAndGetId } from "../lib/conversation";

// Tapping one fills the message box, ready to send
const STARTERS = ["Hey! 👋", "How's your day? 🌸", "Got a minute?"];

// Matches the server's "newmessage" payload; Dates arrive as ISO strings over the socket
type Message = {
  id: string;
  senderId: string;
  message: string;
  createdAt: string;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

// The sidebar passes the contact in router state; a fresh page load won't have it
export default function ChatWindow() {
  const { userId } = useParams();
  const contact = (useLocation().state as { contact?: Contact } | null)
    ?.contact;
  const [conversationId, setConversationId] = useState<null | string>(null);

  if (!contact || contact.id !== userId)
    return <Navigate to="/chats" replace />;

  // restAPI : create/get conversation
  useEffect(() => {
    const loadConversation = async () => {
      const res = await upsertConverAndGetId(userId);

      setConversationId(res.id);
    };
    loadConversation();
  }, [userId]);

  // join conversation
  useEffect(() => {
    if (!conversationId) return;

    socket.emit("joinconversation", { conversationId });
    return () => {
      socket.emit("leaveconversation", { conversationId });
    };
  }, [conversationId]);

  // key resets the conversation when switching people
  return (
    <Conversation
      key={contact.id}
      contact={contact}
      conversationId={conversationId}
    />
  );
}

function Conversation({
  contact,
  conversationId,
}: {
  contact: Contact;
  conversationId: string | null;
}) {
  const {user,liveUsers} = useCurrentUser();
  const log = useCurrentUser();
  console.log(log)
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const msgLimit = 40;
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const displayName = contact.name || contact.email.split("@")[0];
  const firstName = displayName.split(" ")[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Load the first page of saved messages once the conversation exists.
  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;
    setMessagesLoading(true);
    setMessagesError(null);
    listMessages(conversationId,0,msgLimit)
      .then((res) => {
        if (cancelled) return;
        setMessages(
          res.messages
            .map((message) => ({
              id: message.id,
              message: message.content,
              senderId: message.senderId ?? message.sender?.id ?? "",
              createdAt: message.createdAt,
            }))
            .reverse(),
        );

        setHasMore(res.hasMore);
      })
      .catch((err) => {
        if (!cancelled)
          setMessagesError(
            err instanceof Error ? err.message : "Could not load messages.",
          );
      })
      .finally(() => {
        if (!cancelled) setMessagesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  const loadMore = async () => {
    try {
      if (!conversationId || loadingMore) return;
      setLoadingMore(true);
      const res = await listMessages(conversationId, messages.length, msgLimit);
      const revMessages = res.messages
        .map((message) => ({
          id: message.id,
          message: message.content,
          senderId: message.senderId ?? message.sender?.id ?? "",
          createdAt: message.createdAt,
        }))
        .reverse();
      setMessages((prev) => [...revMessages, ...prev]);
      setHasMore(res.hasMore);
    } catch (err) {
      setMessagesError(
        err instanceof Error ? err.message : "Could not load messages.",
      );
    } finally {
      setLoadingMore(false);
    }
  };

  // // attach live users fetch socket event
  // useEffect(() => {
  //   const handleInitialUsers = (data: { onlineUsers: string[] }) => {
  //     setLiveUsers(new Set(data.onlineUsers));
  //   };

  //   const handler = (data: { userId: string; isOnline: boolean }) => {
  //     console.log("online handle", data);
  //     if (data.isOnline) {
  //       setLiveUsers((prev) => {
  //         const newset = new Set(prev);
  //         newset.add(data.userId);
  //         return newset;
  //       });
  //     } else {
  //       setLiveUsers((prev) => {
  //         const newset = new Set(prev);
  //         newset.delete(data.userId);
  //         return newset;
  //       });
  //     }
  //   };

  //   socket.emit("online-users", handleInitialUsers);
  //   socket.on("user:online-stat", handler);
  //   return () => {
  //     socket.off("already-online-users", handleInitialUsers);
  //     socket.off("user:online-stat", handler);
  //   };
  // }, [conversationId]);

  // recieve socket new messages
  useEffect(() => {
    const handler = (data: {
      id: string;
      senderId: string;
      content: string;
      createdAt: string;
    }) => {
      setMessages((prev) => [...prev, { ...data, message: data.content }]);
    };
    socket.on("newmessage", handler);
    return () => {
      socket.off("newmessage", handler);
    };
  }, []);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    socket.emit("sendmessage", {
      conversationId,
      content: text,
    });

    // const time = new Date().toLocaleTimeString([], {
    //   hour: "numeric",
    //   minute: "2-digit",
    // });
    // setMessages((prev) => [
    //   ...prev,
    //   { id: crypto.randomUUID(), senderId: me.id, message: text, time },
    // ]);
    setDraft("");
  }

  console.log("online", liveUsers.has(contact.id));
  console.log("online", liveUsers);

  return (
    <div className="h-[calc(100dvh-4rem)] md:h-dvh flex flex-col">
      <header className="flex items-center gap-3 px-4 sm:px-6 h-16 shrink-0 bg-white/90 backdrop-blur border-b border-[#FFE1D6]">
        <ChatAvatar id={contact.id} size="sm" />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {liveUsers.has(contact.id) && (
              <span className="w-2 h-2 rounded-full bg-green-500" />
            )}

            <p className="font-semibold text-slate-800 truncate">
              {displayName}
            </p>
          </div>

          <p className="text-xs text-slate-400 truncate">{contact.email}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-6 space-y-3">
        {hasMore && messages.length > 0 && (
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="text-sm text-[#6B4B9A] hover:underline disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          </div>
        )}

        {messagesLoading && messages.length === 0 ? (
          <p className="text-center text-sm text-slate-400">
            Loading messages…
          </p>
        ) : messagesError && messages.length === 0 ? (
          <p role="alert" className="text-center text-sm text-[#B5542C]">
            {messagesError}
          </p>
        ) : messages.length === 0 ? (
          <div className="min-h-full flex flex-col items-center justify-center text-center gap-3">
            <div className="relative w-80 max-w-full">
              <div className="absolute inset-6 rounded-full bg-[#E9DCFA] blur-2xl" />
              <img
                src={selfieImg}
                alt="Person waving hi"
                className="relative w-full"
              />
            </div>
            <p className="text-lg font-semibold text-slate-800">
              Say hi to {firstName} 👋
            </p>
            <p className="text-sm text-slate-400 max-w-xs">
              This is the start of something lovely. No pressure.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {STARTERS.map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => {
                    setDraft(text);
                    inputRef.current?.focus();
                  }}
                  className="px-4 py-2 rounded-full bg-white border border-[#EEE3FA] text-sm text-slate-600 shadow-sm hover:bg-[#EEE3FA] hover:text-[#6B4B9A] transition-colors"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === user?.id;
            console.log("user",user)
            return (
              <div
                key={m.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 text-sm shadow-sm text-slate-800 rounded-3xl ${
                    mine
                      ? "bg-[#E9DCFA] rounded-br-lg"
                      : "bg-white rounded-bl-lg"
                  }`}
                >
                  <p className="break-words">{m.message}</p>
                  <p
                    className={`text-[10px] mt-1 text-right ${
                      mine ? "text-[#6B4B9A]/70" : "text-slate-400"
                    }`}
                  >
                    {formatTime(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-4 sm:px-6 py-4 shrink-0 bg-white/90 border-t border-[#FFE1D6]"
      >
        <input
          ref={inputRef}
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message ${firstName}…`}
          className="flex-1 min-w-0 border border-slate-200 bg-[#FFFDF9] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#CDB4DB] transition-shadow"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="px-5 py-2.5 rounded-full bg-[#C8553D] text-white text-sm font-semibold hover:bg-[#B5482F] transition-colors disabled:bg-[#FFE1D6] disabled:text-[#B5542C] disabled:cursor-not-allowed shadow-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
}
