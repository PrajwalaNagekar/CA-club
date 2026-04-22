import { motion } from "framer-motion";
import {
  ChevronLeft,
  FileCheck2,
  Upload,
  Calculator,
  ShieldCheck,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Receipt,
  IndianRupee,
  ArrowUpRight,
  Lock,
  Download,
} from "lucide-react";
import { BottomNav } from "../BottomNav";
import type { ScreenProps } from "@/lib/screen-types";

const stages = [
  { key: "docs", label: "Documents", icon: Upload, status: "done" as const, date: "Apr 12", note: "8 of 8 collected" },
  { key: "compute", label: "Computation", icon: Calculator, status: "current" as const, date: "Apr 18", note: "Tax liability under review by Rajeev" },
  { key: "review", label: "Your review", icon: ShieldCheck, status: "upcoming" as const, date: "Apr 24", note: "You'll approve the final return" },
  { key: "file", label: "E-file & ITR-V", icon: Send, status: "upcoming" as const, date: "Apr 28", note: "Submitted to Income Tax portal" },
];

const docs = [
  { name: "Form 16 — FY 24-25", size: "242 KB" },
  { name: "Salary slips (Apr-Mar)", size: "1.8 MB" },
  { name: "Form 26AS", size: "186 KB" },
  { name: "Bank interest certificate", size: "112 KB" },
  { name: "ELSS / 80C proofs", size: "604 KB" },
];

export const ItrScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  return (
    <div className="relative h-full flex flex-col aurora-bg overflow-y-auto no-scrollbar">
      {/* Masthead */}
      <div className="px-4 pt-3 pb-2 hairline-bottom">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => onNavigate?.("home")}
            className="w-8 h-8 rounded-md ledger-tile flex items-center justify-center active:scale-95 transition"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" strokeWidth={1.8} />
          </button>
          <div className="flex-1 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>FILE · ITR-2 · AY 2025-26</span>
            <span className="text-primary font-bold">LIVE</span>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary font-bold">
              Income Tax Return
            </p>
            <h1 className="font-display text-[24px] font-bold leading-none text-foreground mt-0.5">
              ITR <span className="font-serif-italic text-primary">Filing</span>
            </h1>
          </div>
          <button
            onClick={() => onNavigate?.("chat")}
            className="h-9 px-3 rounded-md text-primary-foreground font-mono text-[9px] uppercase tracking-[0.18em] font-bold flex items-center gap-1.5 active:scale-95"
            style={{ background: "hsl(var(--primary))" }}
          >
            <Sparkles className="h-3 w-3" /> Ask CA
          </button>
        </div>
      </div>

      {/* HERO — refund headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-4 mt-3 ledger-tile rounded-md p-4"
        style={{ borderLeft: "3px solid hsl(var(--secondary))" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" /> In progress
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-foreground font-bold">
            65% complete
          </span>
        </div>

        <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground">
          Estimated refund
        </p>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="font-display text-[40px] leading-none font-bold text-secondary tracking-tight">
            ₹18,420
          </span>
        </div>
        <p className="font-serif-italic text-[12px] text-muted-foreground mt-1.5 leading-snug">
          Salary + capital gains, post 80C deductions. Filed by{" "}
          <span className="text-foreground font-bold not-italic font-display">Apr 28</span>.
        </p>

        <div className="mt-3 hairline-top pt-2">
          <div className="h-[3px] w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-primary"
            />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>DOCS ✓</span>
            <span className="text-warning font-bold">COMPUTE ●</span>
            <span>REVIEW</span>
            <span>FILE</span>
          </div>
        </div>
      </motion.div>

      {/* MONEY BREAKDOWN */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Gross income", value: "12.4L", icon: IndianRupee, tone: "primary" as const },
          { label: "Tax payable", value: "1.18L", icon: Receipt, tone: "warning" as const },
          { label: "TDS paid", value: "1.36L", icon: ShieldCheck, tone: "success" as const },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="rounded-2xl glass p-2.5"
          >
            <div className={`w-7 h-7 rounded-lg bg-${s.tone}/20 flex items-center justify-center`}>
              <s.icon className={`h-3.5 w-3.5 text-${s.tone}`} />
            </div>
            <p className="mt-2 font-display text-sm font-bold leading-none text-foreground">₹{s.value}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* TIMELINE */}
      <div className="px-4 mt-5">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              Filing journey
            </p>
            <h3 className="font-display text-sm font-bold text-foreground">4 stages · 2 done</h3>
          </div>
          <span className="text-[10px] text-muted-foreground">Est. 6 days left</span>
        </div>

        <div className="relative">
          <div className="absolute left-[19px] top-3 bottom-3 w-px bg-border" />
          <div className="space-y-2.5">
            {stages.map((s, i) => {
              const isDone = s.status === "done";
              const isCurrent = s.status === "current";
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                  className="relative pl-12"
                >
                  <div
                    className={`absolute left-0 top-1 w-10 h-10 rounded-2xl ring-4 ring-background flex items-center justify-center ${
                      isDone
                        ? "text-primary-foreground shadow-glow"
                        : isCurrent
                        ? "bg-warning/20 text-warning border border-warning/40"
                        : "bg-muted text-muted-foreground"
                    }`}
                    style={isDone ? { background: "var(--gradient-aurora)" } : undefined}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                  </div>
                  <div
                    className={`rounded-2xl p-3 ${
                      isCurrent ? "bg-warning/10 border border-warning/30" : "glass"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-display text-xs font-bold leading-none text-foreground">{s.label}</p>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          isDone
                            ? "bg-success/20 text-success"
                            : isCurrent
                            ? "bg-warning/20 text-warning"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isDone ? "Done" : isCurrent ? "In progress" : "Upcoming"}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">{s.note}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-[9px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{s.date}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="px-4 mt-5">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              Vault
            </p>
            <h3 className="font-display text-sm font-bold text-foreground">Documents</h3>
          </div>
          <button
            onClick={() => onNavigate?.("upload")}
            className="text-[10px] text-primary font-bold flex items-center gap-0.5 active:scale-95"
          >
            Add more <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        <div className="rounded-2xl glass p-2 space-y-1">
          {docs.map((d) => (
            <div
              key={d.name}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-foreground/5 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                <FileCheck2 className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold truncate text-foreground">{d.name}</p>
                <p className="text-[9px] text-muted-foreground">PDF · {d.size}</p>
              </div>
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-success">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-3">
        <div className="rounded-2xl bg-primary/8 border border-primary/20 p-2.5 flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-primary shrink-0" />
          <p className="text-[9.5px] text-muted-foreground leading-snug">
            Your data is end-to-end encrypted and stored in India. Only your assigned CA can view it.
          </p>
        </div>
      </div>

      <div className="px-4 mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => onNavigate?.("ack")}
          className="h-11 rounded-2xl glass text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 text-foreground"
        >
          <Download className="h-3.5 w-3.5" /> Draft return
        </button>
        <button
          onClick={() => onNavigate?.("chat")}
          className="h-11 rounded-2xl text-primary-foreground text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95"
          style={{ background: "var(--gradient-aurora)", boxShadow: "0 8px 24px -6px hsl(152 76% 56% / 0.6)" }}
        >
          Approve & e-file <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <BottomNav active="tasks" onNavigate={onNavigate} />
    </div>
  );
};
