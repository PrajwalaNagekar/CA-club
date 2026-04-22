import { useState, useMemo } from "react";
import { ChevronLeft, Bell, FileCheck2, AlertCircle, MessageSquare, Receipt, X } from "lucide-react";
import type { ScreenProps, ScreenKey } from "@/lib/screen-types";

interface Notif {
  id: string;
  icon: typeof Bell;
  color: string;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  channel?: string;
  category: "Tasks" | "Documents" | "Billing" | "WhatsApp";
  target: ScreenKey;
}

const initial: Notif[] = [
  { id: "n1", icon: AlertCircle, color: "danger", title: "Action required", body: "Bank statement pending for GSTR-3B March", time: "2m ago", unread: true, category: "Tasks", target: "upload" },
  { id: "n2", icon: FileCheck2, color: "success", title: "Form 16 ready", body: "Your annual TDS certificate has been issued", time: "1h ago", unread: true, channel: "WhatsApp", category: "WhatsApp", target: "documents" },
  { id: "n3", icon: MessageSquare, color: "info", title: "Rajeev replied", body: "I've reviewed your computation. Looks good — let's…", time: "3h ago", unread: true, category: "Tasks", target: "chat" },
  { id: "n4", icon: Receipt, color: "accent", title: "Acknowledgement #A-2049", body: "GSTR-1 February filed successfully with portal", time: "Yesterday", category: "Documents", target: "ack" },
  { id: "n5", icon: Bell, color: "primary", title: "Reminder", body: "Advance tax Q1 is due in 4 days", time: "Yesterday", category: "Billing", target: "calendar" },
];

const filters: ("All" | Notif["category"])[] = ["All", "Tasks", "Documents", "Billing", "WhatsApp"];

export const NotificationsScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const visible = useMemo(
    () => items.filter((n) => filter === "All" || n.category === filter),
    [items, filter],
  );
  const unread = items.filter((n) => n.unread).length;

  const dismiss = (id: string) =>
    setItems((p) => p.filter((n) => n.id !== id));

  const open = (n: Notif) => {
    setItems((p) => p.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
    onNavigate?.(n.target);
  };

  const markAll = () => setItems((p) => p.map((n) => ({ ...n, unread: false })));

  return (
    <div className="relative h-full bg-gradient-screen pb-6 overflow-y-auto no-scrollbar">
      <div className="px-5 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.("home")}
            className="w-9 h-9 rounded-full glass flex items-center justify-center active:scale-95 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="font-display text-lg font-bold">Notifications</p>
            <p className="text-[10px] text-muted-foreground">{unread} unread</p>
          </div>
        </div>
        <button onClick={markAll} className="text-[10px] text-primary font-semibold active:scale-95 transition">
          Mark all read
        </button>
      </div>

      {/* Filter */}
      <div className="px-5 mt-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {filters.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 h-7 rounded-full text-[10px] font-semibold whitespace-nowrap active:scale-95 transition ${
              t === filter
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "bg-surface-elevated border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-5 mt-4 space-y-2">
        {visible.length === 0 && (
          <div className="rounded-2xl glass p-6 text-center text-[11px] text-muted-foreground">
            You're all caught up ✨
          </div>
        )}
        {visible.map((n) => (
          <div
            key={n.id}
            className={`group relative rounded-xl p-3 flex items-start gap-3 transition ${
              n.unread ? "glass" : "bg-surface-elevated/60 border border-border"
            }`}
          >
            <button
              onClick={() => open(n)}
              className="flex items-start gap-3 flex-1 min-w-0 text-left active:scale-[0.99] transition"
            >
              <div className={`w-9 h-9 rounded-xl bg-${n.color}/15 flex items-center justify-center shrink-0`}>
                <n.icon className={`h-4 w-4 text-${n.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-xs font-semibold truncate">{n.title}</p>
                  <span className="text-[9px] text-muted-foreground shrink-0">{n.time}</span>
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2">{n.body}</p>
                {n.channel && (
                  <span className="mt-1.5 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-success/15 text-success">
                    via {n.channel}
                  </span>
                )}
              </div>
            </button>
            <div className="flex flex-col items-center gap-1 shrink-0">
              {n.unread && <span className="w-2 h-2 rounded-full bg-primary mt-1" />}
              <button
                onClick={() => dismiss(n.id)}
                className="opacity-0 group-hover:opacity-100 transition w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center active:scale-90"
                aria-label="Dismiss"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
