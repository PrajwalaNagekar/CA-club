import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Filter,
  Flame,
  X,
  Trash2,
  CalendarDays,
  Scale,
  Building2,
  Receipt,
} from "lucide-react";
import { BottomNav } from "../BottomNav";
import type { ScreenProps } from "@/lib/screen-types";
import { toast } from "sonner";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

type FilterKey = "all" | "gst" | "tds" | "income" | "roc";
type Priority = "high" | "med" | "low";

interface CalEvent {
  id: string;
  title: string;
  type: FilterKey;
  time: string;
  priority: Priority;
  statute: string;          // section / rule reference
  client?: string;
  done?: boolean;
}

interface EventMap {
  [dateKey: string]: CalEvent[]; // key = `${year}-${month}-${day}`
}

const FILTERS: { key: FilterKey; label: string; icon: typeof Scale }[] = [
  { key: "all", label: "All", icon: CalendarDays },
  { key: "gst", label: "GST", icon: Receipt },
  { key: "tds", label: "TDS", icon: Scale },
  { key: "income", label: "Income Tax", icon: Building2 },
  { key: "roc", label: "ROC", icon: Building2 },
];

const TYPE_TONE: Record<FilterKey, string> = {
  all: "primary",
  gst: "warning",
  tds: "info",
  income: "danger",
  roc: "secondary",
};

const seedEvents = (year: number, month: number): EventMap => ({
  [`${year}-${month}-7`]: [
    { id: "e1", title: "Audit kickoff — HEX Corp", type: "income", time: "10:30", priority: "med", statute: "Sec 44AB", client: "HEX CORP" },
  ],
  [`${year}-${month}-10`]: [
    { id: "e2", title: "TDS Deposit (Q4)", type: "tds", time: "23:59", priority: "high", statute: "Sec 200 r/w Rule 30", client: "ALL CLIENTS" },
  ],
  [`${year}-${month}-11`]: [
    { id: "e3", title: "GSTR-1 — Outward Supplies", type: "gst", time: "23:59", priority: "high", statute: "Sec 37 · CGST", client: "PIXEL VENTURES" },
    { id: "e4", title: "Partner sign-off — Trial Balance", type: "income", time: "16:00", priority: "med", statute: "ICAI SA-700", client: "MERIDIAN LLP" },
  ],
  [`${year}-${month}-15`]: [
    { id: "e5", title: "Advance Tax — Q1 Instalment", type: "income", time: "23:59", priority: "high", statute: "Sec 211 · 15%", client: "INDIVIDUAL CLIENTS" },
  ],
  [`${year}-${month}-20`]: [
    { id: "e6", title: "GSTR-3B — March Return", type: "gst", time: "23:59", priority: "med", statute: "Sec 39 · CGST", client: "PIXEL VENTURES" },
  ],
  [`${year}-${month}-25`]: [
    { id: "e7", title: "Internal compliance review", type: "income", time: "14:00", priority: "low", statute: "Firm SOP", client: "INTERNAL" },
  ],
  [`${year}-${month}-30`]: [
    { id: "e8", title: "TDS Return — Form 26Q", type: "tds", time: "23:59", priority: "med", statute: "Rule 31A", client: "HEX CORP" },
    { id: "e9", title: "DPT-3 Filing", type: "roc", time: "23:59", priority: "med", statute: "Companies Act · Rule 16", client: "MERIDIAN LLP" },
  ],
});

export const CalendarScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const initialMonth = 3, initialYear = 2026;
  const [monthIdx, setMonthIdx] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [selected, setSelected] = useState(11);
  const [view, setView] = useState<"month" | "agenda">("month");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [events, setEvents] = useState<EventMap>(() => seedEvents(initialYear, initialMonth));
  const [showCompose, setShowCompose] = useState(false);
  const [draft, setDraft] = useState<{
    day: number;
    title: string;
    type: FilterKey;
    time: string;
    statute: string;
    client: string;
    priority: Priority;
  }>({
    day: 11,
    title: "",
    type: "gst",
    time: "23:59",
    statute: "",
    client: "",
    priority: "med",
  });

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const firstDay = new Date(year, monthIdx, 1).getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const today = 11;

  const keyFor = (d: number) => `${year}-${monthIdx}-${d}`;

  const filteredEvents = (d: number) =>
    (events[keyFor(d)] || []).filter((e) => filter === "all" || e.type === filter);

  const upcoming = useMemo(() => {
    return Object.entries(events)
      .flatMap(([k, evs]) => {
        const [y, m, d] = k.split("-").map(Number);
        if (y !== year || m !== monthIdx) return [];
        return evs
          .filter((e) => filter === "all" || e.type === filter)
          .map((e) => ({ ...e, date: d }));
      })
      .sort((a, b) => a.date - b.date || a.time.localeCompare(b.time));
  }, [events, filter, year, monthIdx]);

  const groupedAgenda = useMemo(() => {
    const groups: Record<number, typeof upcoming> = {};
    upcoming.forEach((e) => {
      groups[e.date] = groups[e.date] || [];
      groups[e.date].push(e);
    });
    return Object.entries(groups)
      .map(([d, evs]) => ({ date: Number(d), events: evs }))
      .sort((a, b) => a.date - b.date);
  }, [upcoming]);

  const prev = () => {
    if (monthIdx === 0) { setMonthIdx(11); setYear((y) => y - 1); } else setMonthIdx((m) => m - 1);
  };
  const next = () => {
    if (monthIdx === 11) { setMonthIdx(0); setYear((y) => y + 1); } else setMonthIdx((m) => m + 1);
  };

  const totalDeadlines = upcoming.length;
  const highPrioCount = upcoming.filter((e) => e.priority === "high" && !e.done).length;
  const completedCount = upcoming.filter((e) => e.done).length;

  const openCompose = (day = selected) => {
    setDraft({ day, title: "", type: "gst", time: "23:59", statute: "", client: "", priority: "med" });
    setShowCompose(true);
  };

  const saveEvent = () => {
    if (!draft.title.trim()) {
      toast.error("Title required", { description: "Add a brief description of the deadline" });
      return;
    }
    const k = keyFor(draft.day);
    const newEvent: CalEvent = {
      id: `u${Date.now()}`,
      title: draft.title.trim(),
      type: draft.type,
      time: draft.time,
      priority: draft.priority,
      statute: draft.statute.trim() || "—",
      client: draft.client.trim() || "—",
    };
    setEvents((m) => ({ ...m, [k]: [...(m[k] || []), newEvent] }));
    setSelected(draft.day);
    setShowCompose(false);
    toast.success("Entry added to register", { description: `${draft.title} · ${draft.day} ${MONTHS_SHORT[monthIdx]}` });
  };

  const toggleDone = (day: number, id: string) => {
    const k = keyFor(day);
    setEvents((m) => ({
      ...m,
      [k]: (m[k] || []).map((e) => (e.id === id ? { ...e, done: !e.done } : e)),
    }));
    const evt = (events[k] || []).find((e) => e.id === id);
    if (evt) toast(evt.done ? "Marked pending" : "Marked filed", { description: evt.title });
  };

  const removeEvent = (day: number, id: string) => {
    const k = keyFor(day);
    setEvents((m) => ({ ...m, [k]: (m[k] || []).filter((e) => e.id !== id) }));
    toast("Entry removed from register");
  };

  const selectedEvents = filteredEvents(selected);
  const selectedDateLabel = `${selected} ${MONTHS_SHORT[monthIdx]} ${year}`;

  return (
    <div className="relative h-full flex flex-col aurora-bg overflow-y-auto no-scrollbar">
      {/* ===== CA LETTERHEAD HEADER ===== */}
      <div className="px-5 pt-3 pb-2 shrink-0">
        <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground hairline-bottom pb-1.5">
          <span>SECTION 03 · COMPLIANCE DIARY</span>
          <span className="text-foreground/70">FY 24-25 · Q1</span>
        </div>

        <div className="mt-2.5 flex items-start justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary font-bold">
              Statutory Due-Date Register
            </p>
            <h1 className="mt-1 font-display text-[30px] leading-none text-foreground tracking-tight">
              {MONTHS[monthIdx]}{" "}
              <span className="font-serif-italic text-primary">{year}</span>
            </h1>
            <div className="editorial-rule mt-2 w-16" />
            <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
              <span><span className="font-bold text-foreground">{totalDeadlines}</span> entries</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span className="flex items-center gap-1 text-secondary font-bold">
                <CheckCircle2 className="h-2.5 w-2.5" /> {completedCount}
              </span>
              {highPrioCount > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                  <span className="flex items-center gap-1 text-danger font-bold">
                    <Flame className="h-2.5 w-2.5" /> {highPrioCount} crit
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={() => openCompose(today)}
            aria-label="Add deadline"
            className="w-10 h-10 rounded-md flex items-center justify-center active:scale-95 transition text-primary-foreground hover:opacity-90"
            style={{ background: "hsl(var(--primary))", boxShadow: "var(--shadow-glow)" }}
          >
            <Plus className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>

        {/* Segmented view toggle */}
        <div className="mt-3 inline-flex p-0.5 rounded-md ledger-tile relative">
          {(["month", "agenda"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="relative z-10 px-4 py-1 rounded-sm text-[9px] font-mono font-bold uppercase tracking-[0.18em] transition"
            >
              {view === v && (
                <motion.span
                  layoutId="view-pill"
                  className="absolute inset-0 rounded-sm"
                  style={{ background: "hsl(var(--primary))" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative ${view === v ? "text-primary-foreground" : "text-muted-foreground"}`}>{v}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== STATUTE FILTER PILLS ===== */}
      <div className="px-5 mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 shrink-0">
        <Filter className="h-3 w-3 text-muted-foreground shrink-0" />
        {FILTERS.map((f) => {
          const Active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 text-[9.5px] font-mono uppercase tracking-[0.16em] px-2.5 py-1 rounded-sm font-bold transition active:scale-95 flex items-center gap-1 border ${
                Active
                  ? "text-primary-foreground border-primary"
                  : "ledger-tile text-muted-foreground hover:text-foreground"
              }`}
              style={Active ? { background: "hsl(var(--primary))" } : undefined}
            >
              <f.icon className="h-2.5 w-2.5" strokeWidth={2} />
              {f.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {view === "month" ? (
          <motion.div
            key="month"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="shrink-0 pb-28"
          >
            {/* ===== LEDGER CALENDAR CARD ===== */}
            <div className="mx-5 mt-3 ledger-tile rounded-md p-3.5 relative overflow-hidden">
              {/* Month nav */}
              <div className="relative flex items-center justify-between mb-3 hairline-bottom pb-2">
                <button
                  onClick={prev}
                  aria-label="Previous month"
                  className="w-7 h-7 rounded-sm border border-border flex items-center justify-center active:scale-90 transition hover:border-primary/60"
                >
                  <ChevronLeft className="h-3.5 w-3.5 text-foreground" />
                </button>
                <div className="text-center">
                  <p className="font-display text-[15px] font-bold leading-none text-foreground">
                    {MONTHS[monthIdx]} <span className="font-serif-italic text-primary">{year}</span>
                  </p>
                  <p className="text-[8px] text-muted-foreground font-mono uppercase tracking-[0.2em] mt-1">
                    Wk {Math.ceil((firstDay + daysInMonth) / 7)} · {daysInMonth} days
                  </p>
                </div>
                <button
                  onClick={next}
                  aria-label="Next month"
                  className="w-7 h-7 rounded-sm border border-border flex items-center justify-center active:scale-90 transition hover:border-primary/60"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-foreground" />
                </button>
              </div>

              {/* Day headers */}
              <div className="relative grid grid-cols-7 gap-1 mb-1.5">
                {days.map((d, i) => (
                  <div
                    key={i}
                    className={`text-center text-[9px] font-mono font-bold uppercase tracking-wider ${
                      i === 0 || i === 6 ? "text-danger/70" : "text-muted-foreground"
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="relative grid grid-cols-7 gap-1">
                {cells.map((d, i) => {
                  const evs = d ? filteredEvents(d) : [];
                  const hasEvents = evs.length > 0;
                  const allDone = hasEvents && evs.every((e) => e.done);
                  const isSelected = d === selected;
                  const isToday = d === today;
                  const highPrio = evs.some((e) => e.priority === "high" && !e.done);
                  const isWeekend = i % 7 === 0 || i % 7 === 6;

                  return (
                    <button
                      key={i}
                      disabled={!d}
                      onClick={() => d && setSelected(d)}
                      className="relative aspect-square rounded-sm flex flex-col items-center justify-center text-[11px] font-medium transition active:scale-90"
                    >
                      {isSelected && d && (
                        <motion.div
                          layoutId="day-selector"
                          className="absolute inset-0 rounded-sm"
                          style={{ background: "hsl(var(--primary))", boxShadow: "var(--shadow-glow)" }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span
                        className={`relative z-10 tabular ${
                          !d
                            ? "text-muted-foreground/20"
                            : isSelected
                            ? "text-primary-foreground font-bold"
                            : isToday
                            ? "text-secondary font-bold"
                            : isWeekend
                            ? "text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {d || ""}
                      </span>
                      {isToday && !isSelected && (
                        <span className="absolute inset-0 rounded-sm border border-secondary/60" />
                      )}
                      {hasEvents && (
                        <div className="absolute bottom-0.5 flex items-center gap-[2px] z-10">
                          {evs.slice(0, 3).map((e, idx) => (
                            <span
                              key={idx}
                              className={`w-1 h-1 rounded-full ${
                                isSelected
                                  ? "bg-primary-foreground"
                                  : allDone
                                  ? "bg-secondary/60"
                                  : `bg-${TYPE_TONE[e.type]}`
                              } ${highPrio && !isSelected ? "animate-pulse" : ""}`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-3 hairline-top pt-2 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-warning" /> GST</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-info" /> TDS</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-danger" /> IT</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-secondary" /> ROC</span>
              </div>
            </div>

            {/* ===== SELECTED DAY ENTRIES ===== */}
            <div className="px-5 mt-4">
              <div className="flex items-center justify-between mb-2 hairline-bottom pb-1.5">
                <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                  Day register · <span className="font-bold text-foreground tabular">{selectedDateLabel}</span>
                </p>
                <div className="flex items-center gap-1.5">
                  {selected === today && (
                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-secondary/15 text-secondary uppercase tracking-wider">Today</span>
                  )}
                  <button
                    onClick={() => openCompose(selected)}
                    className="text-[9px] font-mono uppercase tracking-[0.18em] text-primary font-bold flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="h-3 w-3" strokeWidth={2.4} /> Add
                  </button>
                </div>
              </div>

              {selectedEvents.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedEvents.map((e, i) => (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="ledger-tile rounded-md relative overflow-hidden"
                      style={{ borderLeft: `3px solid hsl(var(--${TYPE_TONE[e.type]}))` }}
                    >
                      <div className="p-3 flex items-start gap-2.5">
                        <button
                          onClick={() => toggleDone(selected, e.id)}
                          aria-label={e.done ? "Mark pending" : "Mark filed"}
                          className={`mt-0.5 w-5 h-5 rounded-sm border-2 flex items-center justify-center shrink-0 transition active:scale-90 ${
                            e.done
                              ? "bg-secondary border-secondary"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          {e.done && <CheckCircle2 className="h-3 w-3 text-secondary-foreground" strokeWidth={3} />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <p className={`font-display text-[14px] font-bold leading-tight ${e.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                              {e.title}
                            </p>
                            {e.priority === "high" && !e.done && (
                              <span className="text-[7.5px] font-mono font-bold px-1 py-0.5 rounded-sm bg-danger/15 text-danger uppercase tracking-wider">
                                Critical
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted-foreground mt-1 flex items-center gap-1.5 flex-wrap">
                            <Clock className="h-2.5 w-2.5" /> {e.time}
                            <span className="text-muted-foreground/50">·</span>
                            <Scale className="h-2.5 w-2.5" /> {e.statute}
                          </p>
                          {e.client && (
                            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-foreground/70 mt-1 truncate">
                              ▸ {e.client}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => removeEvent(selected, e.id)}
                          aria-label="Delete"
                          className="w-7 h-7 rounded-sm hover:bg-danger/15 text-muted-foreground hover:text-danger flex items-center justify-center shrink-0 active:scale-90 transition"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="ledger-tile rounded-md p-6 text-center">
                  <CheckCircle2 className="h-8 w-8 text-secondary mx-auto mb-2" strokeWidth={1.5} />
                  <p className="font-display text-[13px] font-bold text-foreground">Register clear</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                    No statutory entries logged
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* ============ AGENDA VIEW ============ */
          <motion.div
            key="agenda"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="px-5 mt-3 pb-28 shrink-0"
          >
            {/* Agenda summary strip */}
            <div className="ledger-tile rounded-md p-3 mb-3 grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="font-display text-[22px] font-bold text-foreground leading-none tabular">
                  {totalDeadlines}
                </p>
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                  Entries
                </p>
              </div>
              <div className="text-center border-x border-border">
                <p className="font-display text-[22px] font-bold text-secondary leading-none tabular">
                  {completedCount}
                </p>
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                  Filed
                </p>
              </div>
              <div className="text-center">
                <p className="font-display text-[22px] font-bold text-danger leading-none tabular">
                  {highPrioCount}
                </p>
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                  Critical
                </p>
              </div>
            </div>

            {groupedAgenda.length === 0 ? (
              <div className="ledger-tile rounded-md p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-secondary mx-auto mb-2" strokeWidth={1.5} />
                <p className="font-display text-[13px] font-bold text-foreground">No upcoming deadlines</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                  Apply a filter or add a new entry
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {groupedAgenda.map((group, gi) => {
                  const isPast = group.date < today;
                  const isToday = group.date === today;
                  return (
                    <motion.div
                      key={group.date}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: gi * 0.04 }}
                    >
                      {/* Date header */}
                      <div className="flex items-baseline justify-between hairline-bottom pb-1 mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-[24px] font-bold text-primary leading-none tabular">
                            {String(group.date).padStart(2, "0")}
                          </span>
                          <div>
                            <p className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-foreground font-bold">
                              {MONTHS_SHORT[monthIdx]} {year}
                            </p>
                            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                              {new Date(year, monthIdx, group.date).toLocaleDateString("en-IN", { weekday: "long" })}
                            </p>
                          </div>
                        </div>
                        {isToday && (
                          <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-secondary/15 text-secondary uppercase tracking-wider">
                            Today
                          </span>
                        )}
                        {isPast && (
                          <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                            Closed
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {group.events.map((e) => (
                          <div
                            key={e.id}
                            className="ledger-tile rounded-md p-2.5 flex items-center gap-2.5"
                            style={{ borderLeft: `3px solid hsl(var(--${TYPE_TONE[e.type]}))` }}
                          >
                            <button
                              onClick={() => toggleDone(group.date, e.id)}
                              aria-label={e.done ? "Mark pending" : "Mark filed"}
                              className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center shrink-0 transition active:scale-90 ${
                                e.done
                                  ? "bg-secondary border-secondary"
                                  : "border-border hover:border-primary"
                              }`}
                            >
                              {e.done && <CheckCircle2 className="h-3 w-3 text-secondary-foreground" strokeWidth={3} />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={`font-display text-[12.5px] font-bold truncate ${e.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                {e.title}
                              </p>
                              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground mt-0.5 truncate">
                                {e.time} · {e.statute} {e.client && `· ${e.client}`}
                              </p>
                            </div>
                            {e.priority === "high" && !e.done && (
                              <AlertCircle className="h-3.5 w-3.5 text-danger animate-pulse shrink-0" />
                            )}
                            <button
                              onClick={() => {
                                setSelected(group.date);
                                setView("month");
                              }}
                              className="font-mono text-[8px] uppercase tracking-[0.18em] text-primary font-bold active:scale-95 shrink-0"
                            >
                              Open
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== COMPOSE / ADD-ENTRY MODAL ===== */}
      <AnimatePresence>
        {showCompose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCompose(false)}
            className="absolute inset-0 z-40 flex items-end justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full glass-strong rounded-t-2xl p-5 max-h-[85%] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between mb-4 hairline-bottom pb-2">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-primary font-bold">
                    New ledger entry
                  </p>
                  <h3 className="font-display text-[20px] font-bold text-foreground leading-tight">
                    Add <span className="font-serif-italic text-primary">deadline</span>
                  </h3>
                </div>
                <button
                  onClick={() => setShowCompose(false)}
                  aria-label="Close"
                  className="w-8 h-8 rounded-sm border border-border hover:border-primary/60 flex items-center justify-center active:scale-90"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Title */}
                <div>
                  <label className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-muted-foreground font-bold block mb-1">
                    Particulars
                  </label>
                  <input
                    autoFocus
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder="e.g. GSTR-1 Filing — March return"
                    className="w-full ledger-tile rounded-sm px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                  />
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-muted-foreground font-bold block mb-1">
                      Day
                    </label>
                    <select
                      value={draft.day}
                      onChange={(e) => setDraft({ ...draft, day: Number(e.target.value) })}
                      className="w-full ledger-tile rounded-sm px-3 py-2 text-[12px] text-foreground outline-none focus:border-primary tabular"
                    >
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>{d} {MONTHS_SHORT[monthIdx]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-muted-foreground font-bold block mb-1">
                      Time (24h)
                    </label>
                    <input
                      type="time"
                      value={draft.time}
                      onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                      className="w-full ledger-tile rounded-sm px-3 py-2 text-[12px] text-foreground outline-none focus:border-primary tabular"
                    />
                  </div>
                </div>

                {/* Statute */}
                <div>
                  <label className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-muted-foreground font-bold block mb-1">
                    Statute / Section
                  </label>
                  <input
                    value={draft.statute}
                    onChange={(e) => setDraft({ ...draft, statute: e.target.value })}
                    placeholder="e.g. Sec 200, Rule 31A, Sec 139(1)"
                    className="w-full ledger-tile rounded-sm px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                  />
                </div>

                {/* Client */}
                <div>
                  <label className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-muted-foreground font-bold block mb-1">
                    Client / Assessee
                  </label>
                  <input
                    value={draft.client}
                    onChange={(e) => setDraft({ ...draft, client: e.target.value })}
                    placeholder="e.g. HEX Corp, Self"
                    className="w-full ledger-tile rounded-sm px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-muted-foreground font-bold block mb-1">
                    Heading
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(["gst", "tds", "income", "roc"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setDraft({ ...draft, type: t })}
                        className={`py-2 rounded-sm text-[9px] font-mono uppercase tracking-[0.16em] font-bold transition active:scale-95 border ${
                          draft.type === t
                            ? "border-primary text-primary-foreground"
                            : "ledger-tile text-muted-foreground hover:text-foreground"
                        }`}
                        style={draft.type === t ? { background: "hsl(var(--primary))" } : undefined}
                      >
                        {t === "income" ? "IT" : t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-muted-foreground font-bold block mb-1">
                    Priority
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["low", "med", "high"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setDraft({ ...draft, priority: p })}
                        className={`py-2 rounded-sm text-[9px] font-mono uppercase tracking-[0.16em] font-bold transition active:scale-95 border ${
                          draft.priority === p
                            ? p === "high"
                              ? "bg-danger border-danger text-destructive-foreground"
                              : p === "med"
                              ? "bg-warning border-warning text-primary-foreground"
                              : "bg-secondary border-secondary text-secondary-foreground"
                            : "ledger-tile text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {p === "med" ? "Medium" : p === "high" ? "Critical" : "Routine"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowCompose(false)}
                    className="flex-1 ledger-tile rounded-sm py-2.5 text-[10px] font-mono uppercase tracking-[0.18em] font-bold text-muted-foreground hover:text-foreground active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEvent}
                    className="flex-[2] rounded-sm py-2.5 text-[10px] font-mono uppercase tracking-[0.18em] font-bold text-primary-foreground active:scale-95"
                    style={{ background: "hsl(var(--primary))", boxShadow: "var(--shadow-glow)" }}
                  >
                    Post to register
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav active="calendar" onNavigate={onNavigate} />
    </div>
  );
};
