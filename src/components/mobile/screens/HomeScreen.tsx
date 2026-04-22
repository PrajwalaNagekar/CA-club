import {
  Bell,
  ArrowUpRight,
  FileCheck2,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Receipt,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { BottomNav } from "../BottomNav";
import type { ScreenProps } from "@/lib/screen-types";
import priyaAvatar from "@/assets/priya-avatar.jpg";

export const HomeScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const unreadNotifs = 3;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).toUpperCase();

  return (
    <div className="relative h-full flex flex-col aurora-bg overflow-y-auto no-scrollbar">
      {/* ===== MASTHEAD ===== */}
      <div className="px-5 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => onNavigate?.("profile")}
            className="flex items-center gap-2 active:scale-95 transition"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-border">
              <img src={priyaAvatar} alt="Priya Sharma" className="w-full h-full object-cover" />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-secondary ring-2 ring-background" />
            </div>
            <div className="text-left leading-tight">
              <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground">
                Engagement partner
              </p>
              <p className="font-display text-[12px] font-bold text-foreground">CA Priya Sharma</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate?.("notifications")}
            className="relative w-9 h-9 rounded-md ledger-tile flex items-center justify-center active:scale-95 transition"
            aria-label={`Notifications, ${unreadNotifs} unread`}
          >
            <Bell className="h-4 w-4 text-foreground" strokeWidth={1.8} />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 rounded-full text-[8px] font-bold flex items-center justify-center ring-2 ring-background bg-primary text-primary-foreground font-mono">
                {unreadNotifs}
              </span>
            )}
          </button>
        </div>

        {/* Date strip */}
        <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground hairline-bottom pb-1.5">
          <span>FY 24-25 · WK 21</span>
          <span className="text-foreground/70">{today.slice(0, 22)}</span>
        </div>

        {/* Edition meta */}
        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary font-bold">
              Compliance Desk
            </p>
            <div className="editorial-rule mt-1.5 w-16" />
          </div>
          <div className="text-right leading-tight">
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
              Edition
            </p>
            <p className="font-mono text-[10px] text-foreground font-bold">FY 24-25 · Q1</p>
          </div>
        </div>
      </div>

      {/* ===== HERO LEAD STORY — serif italic headline ===== */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => onNavigate?.("tasks")}
        className="mx-5 mt-3 relative text-left rounded-md overflow-hidden ledger-tile active:scale-[0.99] transition"
        style={{
          borderLeft: "3px solid hsl(var(--primary))",
        }}
      >
        <div className="p-4">
          {/* Section eyebrow */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-primary font-bold">
                Compliance Desk
              </span>
              <span className="text-muted-foreground text-[8px]">·</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                Brief
              </span>
            </div>
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              09:42 IST
            </span>
          </div>

          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Good morning, CA Priya
          </p>

          {/* Editorial headline — serif + italic */}
          <h2 className="mt-1.5 font-display text-[26px] leading-[1.05] text-foreground tracking-tight">
            3 statutory filings due today,{" "}
            <span className="font-serif-italic text-primary">11 pending</span>{" "}
            this week.
          </h2>

          <p className="mt-2.5 text-[10.5px] leading-snug text-muted-foreground font-sans">
            Books are reconciled, audit trail current. Two GST returns and one TDS quarterly
            challan await partner approval before Friday's window closes.
          </p>

          {/* Open board CTA */}
          <div className="mt-3 hairline-top pt-2.5 flex items-center justify-between">
            <span className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-muted-foreground">
              Due today
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary font-bold flex items-center gap-1">
              Open board <ArrowUpRight className="h-3 w-3" strokeWidth={2.2} />
            </span>
          </div>

          {/* Two due-today rows */}
          <div className="mt-2 space-y-1">
            {[
              { time: "11:30", code: "TDS", title: "Form 16 issuance", client: "HEX CORP", who: "VN", tone: "primary" },
              { time: "14:00", code: "GST", title: "Bank statement collection", client: "PIXEL VENTURES", who: "AR", tone: "muted" },
            ].map((r) => (
              <div key={r.title} className="flex items-center gap-2.5 py-1.5">
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {r.time}
                </span>
                <span
                  className={`font-mono text-[8px] font-bold px-1.5 py-0.5 rounded ${
                    r.tone === "primary"
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {r.code}
                </span>
                <div className="flex-1 min-w-0 leading-tight">
                  <p className="font-display text-[12px] font-bold text-foreground truncate">
                    {r.title}
                  </p>
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground truncate">
                    {r.client}
                  </p>
                </div>
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[9px] font-bold text-primary-foreground shrink-0"
                  style={{ background: "hsl(var(--primary))" }}
                >
                  {r.who}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.button>

      {/* ===== KPI ROW — newspaper "by the numbers" ===== */}
      <div className="px-5 mt-3 grid grid-cols-2 gap-2">
        {/* Filings due */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="ledger-tile rounded-md p-3 relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-primary/15 flex items-center justify-center">
                <FileCheck2 className="h-3 w-3 text-primary" strokeWidth={2} />
              </div>
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                Filings<br />due
              </p>
            </div>
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground text-right">
              This<br />week
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-display text-[40px] leading-none text-primary font-bold tracking-tight">
              14
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">/ 22 TOTAL</span>
          </div>
          <div className="mt-2 hairline-top pt-1.5 flex justify-between font-mono text-[8px] text-muted-foreground tabular-nums">
            <span><span className="text-foreground font-bold">2</span> OVERDUE</span>
            <span><span className="text-foreground font-bold">5</span> 7 DAYS</span>
            <span><span className="text-foreground font-bold">3</span></span>
          </div>
        </motion.div>

        {/* On-time rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="ledger-tile rounded-md p-3 relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-secondary/20 flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-secondary" strokeWidth={2} />
              </div>
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                On-time rate
              </p>
            </div>
            <span className="font-mono text-[8px] text-secondary font-bold">↗ 2.1%</span>
          </div>
          <div className="flex items-baseline gap-0.5 mt-1">
            <span className="font-display text-[40px] leading-none text-secondary font-bold tracking-tight">
              98.6
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">%</span>
          </div>
          <p className="font-mono text-[8px] text-muted-foreground mt-1">SLA · TARGET 95%</p>
          {/* Bar sparkline */}
          <div className="mt-2 hairline-top pt-1.5 flex items-end gap-0.5 h-5">
            {[40, 55, 50, 70, 65, 80, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${h}%`,
                  background: i === 6 ? "hsl(var(--secondary))" : "hsl(var(--secondary) / 0.35)",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Billed MTD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => onNavigate?.("ack")}
          className="ledger-tile rounded-md p-3 cursor-pointer active:scale-[0.99] transition"
        >
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-primary/15 flex items-center justify-center">
                <span className="font-display text-[10px] text-primary font-bold">₹</span>
              </div>
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                Billed MTD
              </p>
            </div>
            <span className="font-mono text-[8px] text-secondary font-bold">↗ 18%</span>
          </div>
          <div className="flex items-baseline gap-0.5 mt-1">
            <span className="font-display text-[32px] leading-none text-primary font-bold tracking-tight">
              ₹24.8
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">L</span>
          </div>
          <p className="font-mono text-[8px] text-muted-foreground mt-1">VS ₹21L LAST MO</p>
        </motion.div>

        {/* Active clients */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => onNavigate?.("chatList")}
          className="ledger-tile rounded-md p-3 cursor-pointer active:scale-[0.99] transition"
        >
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-info/20 flex items-center justify-center">
                <span className="font-display text-[10px] text-foreground font-bold">◎</span>
              </div>
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                Active<br />clients
              </p>
            </div>
            <span className="font-mono text-[8px] text-secondary font-bold">+5 NEW</span>
          </div>
          <div className="flex items-baseline gap-0.5 mt-1">
            <span className="font-display text-[40px] leading-none text-foreground font-bold tracking-tight">
              42
            </span>
          </div>
          <p className="font-mono text-[8px] text-muted-foreground mt-1">3 PRIME · 39 STD</p>
        </motion.div>
      </div>

      {/* ===== SECTIONS — newspaper sidebar ===== */}
      <div className="px-5 mt-4">
        <div className="flex items-center justify-between hairline-bottom pb-1.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-bold">
            Sections
          </p>
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
            18 active
          </span>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {[
            { icon: Plus, label: "File", num: "01", target: "upload" as const },
            { icon: Search, label: "Track", num: "02", target: "tasks" as const },
            { icon: CalendarIcon, label: "Diary", num: "03", target: "calendar" as const },
            { icon: Receipt, label: "Vault", num: "04", target: "ack" as const },
          ].map((a, i) => (
            <motion.button
              key={a.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.04 }}
              onClick={() => onNavigate?.(a.target)}
              className="ledger-tile rounded p-2 flex flex-col items-start gap-1 active:scale-95 transition hover:border-primary/40"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[7.5px] text-muted-foreground/70 tracking-wider">
                  {a.num}
                </span>
                <a.icon className="h-3 w-3 text-primary" strokeWidth={1.8} />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground font-bold">
                {a.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ===== PRACTICE SUITE — story list ===== */}
      <div className="px-5 mt-4">
        <div className="flex items-end justify-between hairline-bottom pb-1.5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary font-bold">
              Practice Suite
            </p>
            <h3 className="font-display text-[16px] font-bold leading-tight text-foreground mt-0.5">
              My services
            </h3>
          </div>
          <button
            onClick={() => onNavigate?.("tasks")}
            className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary font-bold active:scale-95 flex items-center gap-1"
          >
            See all <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        <div className="mt-2.5 space-y-2.5">
          {[
            {
              num: "01",
              title: "ITR Filing",
              sub: "AY 2025-26 · ITR-2",
              status: "In Progress",
              statusTone: "primary",
              progress: 65,
              icon: FileCheck2,
              stage: "Computation under review",
              target: "itr" as const,
              owner: "RM",
              ownerName: "Rajeev Menon",
              amount: "₹18,420",
              amountLabel: "Refund est.",
            },
            {
              num: "02",
              title: "GSTR-3B",
              sub: "March 2026 · Filing window",
              status: "Awaiting docs",
              statusTone: "warning",
              progress: 30,
              icon: Clock,
              stage: "2 of 6 invoices missing",
              target: "upload" as const,
              owner: "AS",
              ownerName: "Anita Sharma",
              amount: "4 days",
              amountLabel: "Deadline",
            },
            {
              num: "03",
              title: "TDS Q4",
              sub: "FY 24-25 · Quarterly return",
              status: "Action needed",
              statusTone: "danger",
              progress: 80,
              icon: AlertCircle,
              stage: "Approve challan to proceed",
              target: "tasks" as const,
              owner: "RM",
              ownerName: "Rajeev Menon",
              amount: "₹42,180",
              amountLabel: "Tax payable",
            },
          ].map((t, i) => (
            <motion.button
              key={t.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onNavigate?.(t.target)}
              className="w-full text-left ledger-tile rounded-md p-3 active:scale-[0.99] transition relative hover:border-primary/40"
              style={{
                borderLeft: `3px solid hsl(var(--${t.statusTone}))`,
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <span className="font-mono text-[9px] text-muted-foreground/70 tracking-wider mt-0.5">
                    {t.num}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="font-display text-[15px] font-bold leading-tight text-foreground">
                        {t.title}
                      </p>
                      <span
                        className={`font-mono text-[8px] font-bold uppercase tracking-[0.16em] px-1.5 py-0.5 rounded text-${t.statusTone}`}
                        style={{ background: `hsl(var(--${t.statusTone}) / 0.15)` }}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted-foreground">
                      {t.sub}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-[16px] font-bold leading-none text-foreground tracking-tight">
                    {t.amount}
                  </p>
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                    {t.amountLabel}
                  </p>
                </div>
              </div>

              {/* Stage line */}
              <p className="mt-2 font-serif-italic text-[11px] text-muted-foreground leading-snug">
                "{t.stage}"
              </p>

              {/* Footer */}
              <div className="mt-2.5 hairline-top pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[8px] font-bold text-primary-foreground"
                    style={{ background: "hsl(var(--primary))" }}
                  >
                    {t.owner}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/85">
                    {t.ownerName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Progress bar */}
                  <div className="w-12 h-[3px] rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[8px] text-muted-foreground tabular-nums">
                    {t.progress}%
                  </span>
                  <ArrowUpRight className="h-3 w-3 text-primary" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ===== PARTNER'S NOTE — italic pull-quote ===== */}
      <div className="px-5 mt-4">
        <div className="ledger-tile rounded-md p-3.5 relative">
          <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-primary font-bold mb-1.5">
            — Partner's note
          </p>
          <p className="font-serif-italic text-[13px] leading-snug text-foreground">
            "Numbers don't lie — but they need someone to read them."
          </p>
        </div>
      </div>

      {/* Billing snapshot */}
      <div className="px-5 mt-3 mb-2">
        <button
          onClick={() => onNavigate?.("ack")}
          className="w-full ledger-tile rounded-md p-3 flex items-center gap-3 active:scale-[0.99] transition hover:border-primary/40"
        >
          <div className="w-9 h-9 rounded bg-primary/15 flex items-center justify-center">
            <Wallet className="h-4 w-4 text-primary" strokeWidth={1.8} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
              Billing & invoices
            </p>
            <p className="font-display text-[13px] font-bold text-foreground mt-0.5">
              1 paid this month <span className="text-muted-foreground font-sans font-normal text-[11px]">· ₹4,720</span>
            </p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
};
