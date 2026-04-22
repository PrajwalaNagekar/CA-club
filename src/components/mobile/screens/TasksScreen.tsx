import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Plus,
  X,
  Sparkles,
  ArrowUpRight,
  Flame,
  ListChecks,
  Hourglass,
} from "lucide-react";
import { BottomNav } from "../BottomNav";
import type { ScreenProps, ScreenKey } from "@/lib/screen-types";

type TaskStatus = "Active" | "Blocked" | "Done" | "Queued";
type Tab = "All" | "In progress" | "Awaiting" | "Completed";

interface Task {
  id: string;
  title: string;
  desc: string;
  status: TaskStatus;
  color: "primary" | "warning" | "success" | "info";
  iconKey: "clock" | "alert" | "check" | "spark";
  target: ScreenKey;
  dueIn?: string;
  amount?: string;
  category: string;
}

const ICONS = { clock: Clock, alert: AlertOctagon, check: CheckCircle2, spark: Sparkles };
const CATEGORIES = ["Income Tax", "GST", "TDS", "Compliance", "Advisory"] as const;

const initialTasks: Task[] = [
  { id: "t1", title: "ITR Filing AY 25-26", desc: "Tax computation in progress", iconKey: "clock", color: "primary", status: "Active", target: "itr", dueIn: "6 days", amount: "₹18,420", category: "Income Tax" },
  { id: "t2", title: "GSTR-3B March", desc: "Awaiting purchase invoices", iconKey: "alert", color: "warning", status: "Blocked", target: "upload", dueIn: "4 days", amount: "₹12.4L", category: "GST" },
  { id: "t3", title: "Form 16 Issued", desc: "Sent to your registered email", iconKey: "check", color: "success", status: "Done", target: "ack", category: "Income Tax" },
  { id: "t4", title: "TDS Quarterly Return", desc: "Computation phase", iconKey: "spark", color: "info", status: "Queued", target: "tasks", dueIn: "12 days", amount: "₹42,180", category: "TDS" },
];

export const TasksScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState(initialTasks);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ title: "", desc: "", category: "Income Tax" as typeof CATEGORIES[number] });

  const counts = useMemo(() => ({
    active: tasks.filter((t) => t.status === "Active").length,
    blocked: tasks.filter((t) => t.status === "Blocked").length,
    done: tasks.filter((t) => t.status === "Done").length,
  }), [tasks]);

  const visible = useMemo(() => {
    return tasks.filter((t) => {
      const matchesQ = !query || t.title.toLowerCase().includes(query.toLowerCase());
      const matchesTab =
        tab === "All" ||
        (tab === "In progress" && t.status === "Active") ||
        (tab === "Awaiting" && t.status === "Blocked") ||
        (tab === "Completed" && t.status === "Done");
      return matchesQ && matchesTab;
    });
  }, [tasks, tab, query]);

  const toggleDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? t.status === "Done"
            ? { ...t, status: "Active" as TaskStatus, color: "primary", iconKey: "clock" }
            : { ...t, status: "Done" as TaskStatus, color: "success", iconKey: "check" }
          : t,
      ),
    );
  };

  const submitDraft = () => {
    const title = draft.title.trim();
    if (!title) return;
    setTasks((p) => [
      {
        id: `t${Date.now()}`,
        title,
        desc: draft.desc.trim() || "Awaiting CA review",
        iconKey: "spark",
        color: "info",
        status: "Queued",
        target: "chat",
        dueIn: "—",
        category: draft.category,
      },
      ...p,
    ]);
    setDraft({ title: "", desc: "", category: "Income Tax" });
    setCreating(false);
  };

  const tabs: Tab[] = ["All", "In progress", "Awaiting", "Completed"];

  return (
    <div className="relative h-full flex flex-col aurora-bg overflow-y-auto no-scrollbar">
      {/* Masthead */}
      <div className="px-5 pt-3 pb-2 hairline-bottom">
        <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground mb-1.5">
          <span>SECTION 02 · PRACTICE</span>
          <span>{tasks.length} ON FILE</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary font-bold">
              Engagement
            </p>
            <h1 className="font-display text-[26px] font-bold leading-none text-foreground mt-0.5">
              Tasks <span className="font-serif-italic text-primary">Desk</span>
            </h1>
            <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
              {tasks.length} tracked · 47 completed YTD
            </p>
          </div>
          <button
            onClick={() => setCreating((v) => !v)}
            className="h-10 px-3 rounded-md flex items-center gap-1.5 active:scale-95 transition text-primary-foreground font-mono text-[9px] uppercase tracking-[0.18em] font-bold"
            style={{ background: "hsl(var(--primary))" }}
            aria-label={creating ? "Cancel" : "File a task"}
          >
            {creating ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {creating ? "Cancel" : "File a task"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="px-5 mt-3 overflow-hidden"
          >
            <div
              className="rounded-2xl p-3 text-foreground relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, hsl(258 60% 22% / 0.9) 0%, hsl(195 60% 22% / 0.9) 100%)",
                border: "1px solid hsl(220 30% 96% / 0.12)",
                boxShadow:
                  "0 16px 36px -16px hsl(258 90% 50% / 0.55), inset 0 1px 0 hsl(220 30% 96% / 0.1)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                  New service request
                </p>
                <button
                  onClick={() => setCreating(false)}
                  className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center active:scale-95"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <input
                autoFocus
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="e.g. Capital gains advisory"
                className="mt-2 w-full bg-foreground/8 border border-foreground/15 rounded-xl px-3 py-2 text-[12px] font-semibold placeholder:text-muted-foreground outline-none focus:border-primary/50"
                style={{ background: "hsl(220 30% 96% / 0.06)" }}
              />
              <input
                value={draft.desc}
                onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
                placeholder="Add a short note (optional)"
                className="mt-1.5 w-full border border-foreground/12 rounded-xl px-3 py-1.5 text-[11px] placeholder:text-muted-foreground outline-none focus:border-primary/50"
                style={{ background: "hsl(220 30% 96% / 0.04)" }}
              />
              <div className="mt-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setDraft({ ...draft, category: c })}
                    className={`shrink-0 text-[9px] font-bold px-2 py-1 rounded-full transition ${
                      draft.category === c
                        ? "text-primary-foreground"
                        : "text-muted-foreground border border-foreground/15"
                    }`}
                    style={
                      draft.category === c
                        ? { background: "var(--gradient-aurora)" }
                        : { background: "hsl(220 30% 96% / 0.05)" }
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => setCreating(false)}
                  className="flex-1 h-9 rounded-xl bg-foreground/8 text-[11px] font-bold active:scale-95 text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={submitDraft}
                  disabled={!draft.title.trim()}
                  className="flex-1 h-9 rounded-xl text-primary-foreground text-[11px] font-bold flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50"
                  style={{ background: "var(--gradient-aurora)" }}
                >
                  Create <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI strip */}
      <div className="px-5 mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Active", value: counts.active, icon: Flame, tone: "primary" as const },
          { label: "Awaiting", value: counts.blocked, icon: Hourglass, tone: "warning" as const },
          { label: "Done", value: counts.done, icon: ListChecks, tone: "success" as const },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl glass p-2.5 flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl bg-${k.tone}/20 flex items-center justify-center`}>
              <k.icon className={`h-3.5 w-3.5 text-${k.tone}`} />
            </div>
            <div className="leading-tight">
              <p className="font-display text-base font-bold text-foreground">{k.value}</p>
              <p className="text-[9px] text-muted-foreground">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="px-5 mt-3 flex items-center gap-2">
        <div className="flex-1 h-9 rounded-xl glass focus-within:border-primary/50 flex items-center px-3 gap-2 transition">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services…"
            className="flex-1 bg-transparent text-[11px] outline-none placeholder:text-muted-foreground text-foreground"
          />
        </div>
        <button className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center active:scale-95 transition">
          <Filter className="h-4 w-4 text-primary" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 h-7 rounded-full text-[10px] font-semibold whitespace-nowrap active:scale-95 transition ${
              t === tab ? "text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:text-foreground"
            }`}
            style={t === tab ? { background: "var(--gradient-aurora)" } : undefined}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Task cards */}
      <div className="px-5 mt-4 space-y-2.5">
        <AnimatePresence initial={false}>
          {visible.map((item, i) => {
            const Icon = ICONS[item.iconKey];
            const isDone = item.status === "Done";
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl glass p-3.5 relative overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${item.color}`} />
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleDone(item.id)}
                    className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center active:scale-90 transition ${
                      isDone
                        ? "text-primary-foreground shadow-glow"
                        : `bg-${item.color}/20 text-${item.color}`
                    }`}
                    style={isDone ? { background: "var(--gradient-aurora)" } : undefined}
                    aria-label={isDone ? "Mark active" : "Mark done"}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.4} />
                  </button>
                  <button
                    onClick={() => onNavigate?.(item.target)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`font-display text-[13px] font-bold leading-tight truncate text-foreground ${isDone ? "line-through text-muted-foreground" : ""}`}>
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground truncate">{item.desc}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-${item.color}/20 text-${item.color} shrink-0 whitespace-nowrap`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                          {item.category}
                        </span>
                        {item.dueIn && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-muted-foreground">
                            <Clock className="h-2.5 w-2.5" /> {item.dueIn}
                          </span>
                        )}
                      </div>
                      {item.amount && (
                        <span className="font-display text-[11px] font-bold text-foreground">
                          {item.amount}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visible.length === 0 && (
          <div className="rounded-2xl glass p-6 text-center">
            <Sparkles className="h-5 w-5 text-primary mx-auto" />
            <p className="mt-2 text-[12px] font-semibold text-foreground">No matching services</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Try a different filter or create a new request.
            </p>
          </div>
        )}
      </div>

      <BottomNav active="tasks" onNavigate={onNavigate} />
    </div>
  );
};
