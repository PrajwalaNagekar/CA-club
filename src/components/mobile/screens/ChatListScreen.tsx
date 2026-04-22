import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Pencil,
  Pin,
  CheckCheck,
  Mic,
  Camera,
  Paperclip,
  Lock,
  Plus,
  Users,
  MessageSquareText,
} from "lucide-react";
import { BottomNav } from "../BottomNav";
import type { ScreenProps } from "@/lib/screen-types";

interface Conversation {
  id: string;
  name: string;
  role: string;
  initials: string;
  preview: string;
  time: string;
  unread?: number;
  online?: boolean;
  pinned?: boolean;
  ticks?: "sent" | "delivered" | "read";
  type?: "text" | "voice" | "photo" | "doc";
  meta?: string;
  gradient: "aurora" | "violet" | "ocean" | "warm";
}

const conversations: Conversation[] = [
  { id: "rajeev", name: "Rajeev Menon, CA", role: "Lead engagement", initials: "RM", preview: "Got it. Will finalize your computation by EOD ✨", time: "9:31 AM", unread: 2, online: true, pinned: true, gradient: "aurora" },
  { id: "firm", name: "Sharma Mehta & Co.", role: "Firm broadcast", initials: "SM", preview: "GSTR-3B reminder: 4 days remaining", time: "8:14 AM", type: "doc", meta: "Reminder", gradient: "ocean", unread: 1 },
  { id: "ananya", name: "Ananya Kapoor", role: "Junior associate", initials: "AK", preview: "Voice message", time: "Yesterday", type: "voice", meta: "0:42", ticks: "read", gradient: "violet", online: true },
  { id: "support", name: "CA Hub Support", role: "Help desk", initials: "CA", preview: "Photo", time: "Yesterday", type: "photo", ticks: "delivered", gradient: "warm" },
  { id: "tax", name: "Tax Notifications", role: "Govt portal alerts", initials: "TN", preview: "GSTR-1 February acknowledged · AA29022602049X1", time: "Mon", ticks: "read", gradient: "aurora" },
  { id: "billing", name: "Billing & Invoices", role: "CA Hub", initials: "₹", preview: "Invoice #INV-204 · ₹4,720 paid", time: "Apr 02", ticks: "read", gradient: "violet" },
];

const gradientStyles: Record<Conversation["gradient"], string> = {
  aurora: "linear-gradient(135deg, hsl(152 76% 56%), hsl(195 95% 60%))",
  violet: "linear-gradient(135deg, hsl(258 90% 70%), hsl(220 90% 65%))",
  ocean: "linear-gradient(135deg, hsl(195 95% 55%), hsl(220 90% 60%))",
  warm: "linear-gradient(135deg, hsl(38 95% 60%), hsl(350 88% 65%))",
};

export const ChatListScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<"All" | "Unread" | "Firm" | "Govt">("All");

  const visible = conversations.filter((c) => {
    if (filter === "Unread") return !!c.unread;
    if (filter === "Firm") return ["rajeev", "firm", "ananya"].includes(c.id);
    if (filter === "Govt") return c.id === "tax";
    return true;
  });

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unread || 0), 0);
  const activeNow = conversations.filter((c) => c.online).length;
  const onlineList = conversations.filter((c) => c.online);

  return (
    <div className="relative h-full flex flex-col aurora-bg overflow-y-auto no-scrollbar">
      {/* Masthead */}
      <div className="px-5 pt-3 pb-2 hairline-bottom">
        <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground mb-1.5">
          <span>SECTION 04 · CLIENT CORRESPONDENCE</span>
          <span className="flex items-center gap-1">
            <Lock className="h-2.5 w-2.5" /> E2E ENCRYPTED
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary font-bold">
              Engagements
            </p>
            <h1 className="font-display text-[26px] font-bold leading-none text-foreground mt-0.5">
              <span className="font-serif-italic text-primary">Inbox</span>
            </h1>
            <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
              {totalUnread} UNREAD · {activeNow} ACTIVE
            </p>
          </div>
          <button
            onClick={() => onNavigate?.("chat")}
            className="h-10 px-3 rounded-md flex items-center gap-1.5 active:scale-95 transition text-primary-foreground font-mono text-[9px] uppercase tracking-[0.18em] font-bold"
            style={{ background: "hsl(var(--primary))" }}
            aria-label="Compose"
          >
            <Pencil className="h-3.5 w-3.5" /> New
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="mx-5 mt-3 grid grid-cols-3 gap-2">
        {[
          { icon: MessageSquareText, value: totalUnread, label: "Unread" },
          { icon: Users, value: activeNow, label: "Active" },
          { icon: Pin, value: conversations.filter((c) => c.pinned).length, label: "Pinned" },
        ].map((s) => (
          <div key={s.label} className="ledger-tile rounded-md p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <s.icon className="h-3 w-3 text-primary" strokeWidth={1.8} />
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </p>
            </div>
            <p className="font-display text-[22px] leading-none font-bold text-foreground tracking-tight">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Stories */}
      <div className="px-5 mt-4">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => onNavigate?.("chat")}
            className="shrink-0 flex flex-col items-center gap-1.5"
          >
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary border-2 border-dashed border-primary/40">
              <Plus className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-semibold text-muted-foreground">New</span>
          </button>
          {onlineList.map((c) => (
            <button
              key={c.id}
              onClick={() => onNavigate?.("chat")}
              className="shrink-0 flex flex-col items-center gap-1.5"
            >
              <div
                className="relative p-[2px] rounded-full"
                style={{ background: "var(--gradient-aurora)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-display text-xs font-bold text-primary-foreground ring-2 ring-background"
                  style={{ background: gradientStyles[c.gradient] }}
                >
                  {c.initials}
                </div>
                <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-background" />
              </div>
              <span className="text-[9px] font-semibold max-w-[52px] truncate text-foreground">
                {c.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-5 mt-3">
        <div className="h-10 rounded-2xl glass flex items-center px-3 gap-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground flex-1">Search conversations, files…</span>
          <span className="text-[9px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">⌘K</span>
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 mt-3 flex items-center gap-1.5">
        {(["All", "Unread", "Firm", "Govt"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 h-7 rounded-full text-[10px] font-semibold transition active:scale-95 ${
              filter === f
                ? "text-primary-foreground shadow-glow"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
            style={
              filter === f
                ? { background: "var(--gradient-aurora)" }
                : undefined
            }
          >
            {f}
            {f === "Unread" && totalUnread > 0 && (
              <span
                className={`ml-1 inline-flex items-center justify-center min-w-[14px] h-3.5 px-1 rounded-full text-[8px] ${
                  filter === f ? "bg-foreground/25" : "bg-primary/20 text-primary"
                }`}
              >
                {totalUnread}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-3 px-3 space-y-1">
        {visible.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onNavigate?.("chat")}
            className={`w-full px-3 py-2.5 flex items-center gap-3 rounded-2xl active:scale-[0.99] transition text-left ${
              c.unread ? "glass" : "hover:bg-surface-elevated/50"
            }`}
            style={c.unread ? { borderColor: "hsl(152 76% 56% / 0.25)" } : undefined}
          >
            <div className="relative shrink-0">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-display text-xs font-bold text-primary-foreground"
                style={{
                  background: gradientStyles[c.gradient],
                  boxShadow: "0 4px 16px -4px hsl(195 95% 50% / 0.4)",
                }}
              >
                {c.initials}
              </div>
              {c.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success ring-2 ring-background" />
              )}
              {c.pinned && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-background"
                  style={{ background: "var(--gradient-aurora)" }}
                >
                  <Pin className="h-2 w-2 text-primary-foreground rotate-45" fill="currentColor" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-[13px] font-semibold truncate text-foreground">
                  {c.name}
                </p>
                <span className={`text-[9px] shrink-0 ${c.unread ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  {c.time}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mt-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  {c.ticks && (
                    <CheckCheck
                      className={`h-3 w-3 shrink-0 ${c.ticks === "read" ? "tick-read" : "text-muted-foreground"}`}
                    />
                  )}
                  {c.type === "voice" && <Mic className="h-3 w-3 text-primary shrink-0" />}
                  {c.type === "photo" && <Camera className="h-3 w-3 text-info shrink-0" />}
                  {c.type === "doc" && <Paperclip className="h-3 w-3 text-info shrink-0" />}
                  <p className={`text-[11px] truncate ${c.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {c.preview}
                  </p>
                  {c.meta && c.type === "voice" && (
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0">· {c.meta}</span>
                  )}
                </div>
                {c.unread ? (
                  <span
                    className="min-w-[18px] h-[18px] px-1 rounded-full text-primary-foreground text-[9px] font-bold flex items-center justify-center shrink-0"
                    style={{
                      background: "var(--gradient-aurora)",
                      boxShadow: "0 0 12px hsl(152 76% 56% / 0.5)",
                    }}
                  >
                    {c.unread}
                  </span>
                ) : null}
              </div>
              <p className="text-[9px] text-muted-foreground/70 mt-0.5">{c.role}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <BottomNav active="chat" onNavigate={onNavigate} />
    </div>
  );
};
