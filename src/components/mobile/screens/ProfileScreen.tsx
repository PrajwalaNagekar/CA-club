import { useEffect, useState } from "react";
import {
  ChevronRight,
  Pencil,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  Building2,
  FileBadge2,
  MessageSquare,
  Wallet,
  Camera,
  Check,
  X,
  Star,
  Sparkles,
  Crown,
  QrCode,
  Share2,
  Mail,
  Phone,
  TrendingUp,
  Award,
  Zap,
  ChevronLeft,
  Lock,
  Globe,
  Palette,
  CreditCard,
  Receipt,
  FileText,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { BottomNav } from "../BottomNav";
import type { ScreenProps } from "@/lib/screen-types";
import priyaAvatar from "@/assets/priya-avatar.jpg";

export const ProfileScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Priya Sharma");
  const [draft, setDraft] = useState(name);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [whatsapp, setWhatsapp] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "preferences" | "billing">("overview");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const currentTheme = mounted ? (theme === "system" ? resolvedTheme : theme) : "light";
  const isDark = currentTheme === "dark";

  const saveName = () => {
    setName(draft.trim() || name);
    setEditing(false);
  };

  return (
    <div className="relative h-full flex flex-col aurora-bg overflow-y-auto no-scrollbar">
      {/* Masthead */}
      <div className="px-5 pt-3 pb-2 hairline-bottom">
        <div className="flex items-center justify-between mb-1.5">
          <button
            onClick={() => onNavigate?.("home")}
            className="w-8 h-8 rounded-md ledger-tile flex items-center justify-center active:scale-95 transition"
            aria-label="Back"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" strokeWidth={1.8} />
          </button>
          <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground">
            SECTION 05 · EDITOR
          </span>
          <button
            className="w-8 h-8 rounded-md ledger-tile flex items-center justify-center active:scale-95 transition"
            aria-label="Show QR"
          >
            <QrCode className="h-4 w-4 text-foreground" strokeWidth={1.8} />
          </button>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary font-bold">
              Engagement Partner
            </p>
            <h1 className="font-display text-[24px] font-bold leading-none text-foreground mt-0.5">
              The <span className="font-serif-italic text-primary">Author</span>
            </h1>
          </div>
          <span
            className="px-2 py-1 rounded font-mono text-[8.5px] uppercase tracking-[0.2em] font-bold text-primary-foreground flex items-center gap-1"
            style={{ background: "hsl(var(--primary))" }}
          >
            <Crown className="h-2.5 w-2.5" fill="currentColor" /> Prime
          </span>
        </div>
      </div>

      {/* HERO — portrait + identity card */}
      <div
        className="mx-5 mt-4 rounded-2xl p-5 glass relative"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--surface-elevated) / 0.55), hsl(var(--surface) / 0.35))",
          border: "1px solid hsl(var(--border) / 0.6)",
          boxShadow: "0 10px 30px -16px hsl(var(--primary) / 0.25)",
        }}
      >
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative shrink-0"
          >
            <div
              className="relative w-20 h-20 rounded-full overflow-hidden"
              style={{
                border: "3px solid hsl(var(--primary))",
                boxShadow: "0 8px 24px -8px hsl(var(--primary) / 0.5)",
              }}
            >
              <img
                src={priyaAvatar}
                alt="Priya Sharma"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => alert("Open camera to update photo")}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-background active:scale-95 transition text-primary-foreground"
              style={{ background: "hsl(var(--primary))" }}
              aria-label="Change photo"
            >
              <Camera className="h-3 w-3" strokeWidth={2} />
            </button>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              className="absolute -top-0.5 -left-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-background bg-secondary"
            >
              <Check className="h-2.5 w-2.5 text-secondary-foreground" strokeWidth={3} />
            </motion.div>
          </motion.div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-1.5">
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                  className="font-display text-[18px] font-bold ledger-tile rounded px-2 py-1 outline-none focus:border-primary text-foreground w-full"
                />
                <button
                  onClick={saveName}
                  className="w-7 h-7 rounded-md bg-secondary/25 text-secondary flex items-center justify-center active:scale-95 shrink-0"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </button>
                <button
                  onClick={() => { setDraft(name); setEditing(false); }}
                  className="w-7 h-7 rounded-md bg-muted text-muted-foreground flex items-center justify-center active:scale-95 shrink-0"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={3} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setDraft(name); setEditing(true); }}
                className="flex items-center gap-2 active:scale-95 transition group text-left max-w-full"
              >
                <p className="font-display text-[20px] font-bold text-foreground tracking-tight leading-tight truncate">
                  {name}
                </p>
                <Pencil className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition shrink-0" />
              </button>
            )}
            <p className="font-serif-italic text-[12px] text-muted-foreground mt-1.5 truncate">
              priya.sharma@cahub.in
            </p>
            <p className="font-serif-italic text-[11px] text-muted-foreground mt-0.5">
              Salaried · Bengaluru, IN
            </p>
          </div>
        </div>

        <div className="mt-4 hairline-top pt-3 grid grid-cols-2 gap-y-1.5 gap-x-4">
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">PAN</p>
            <p className="font-mono text-[11px] text-foreground font-bold mt-0.5">ABCDE1234F</p>
          </div>
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">Since</p>
            <p className="font-mono text-[11px] text-foreground font-bold mt-0.5">APR 2025</p>
          </div>
        </div>
      </div>

      {/* Quick contact pills */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-5 mt-4 grid grid-cols-3 gap-2.5 relative z-10"
      >
        <a
          href="mailto:priya.sharma@cahub.in?subject=Hello%20Priya"
          className="h-14 rounded-2xl glass flex flex-col items-center justify-center gap-1 active:scale-95 transition group"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary) / 0.10), hsl(var(--surface-elevated) / 0.35))",
            border: "1px solid hsl(var(--border) / 0.5)",
          }}
        >
          <Mail className="h-5 w-5 text-primary group-hover:scale-110 transition" strokeWidth={1.8} />
          <span className="text-[12px] font-semibold text-foreground">Email</span>
        </a>
        <a
          href="tel:+919876543210"
          className="h-14 rounded-2xl glass flex flex-col items-center justify-center gap-1 active:scale-95 transition group"
          style={{
            background: "linear-gradient(135deg, hsl(var(--secondary) / 0.12), hsl(var(--surface-elevated) / 0.35))",
            border: "1px solid hsl(var(--border) / 0.5)",
          }}
        >
          <Phone className="h-5 w-5 text-secondary group-hover:scale-110 transition" strokeWidth={1.8} />
          <span className="text-[12px] font-semibold text-foreground">Call</span>
        </a>
        <button
          onClick={() => onNavigate?.("chat")}
          className="h-14 rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--accent) / 0.18))",
            border: "1px solid hsl(var(--primary) / 0.35)",
            boxShadow: "0 6px 18px -10px hsl(var(--primary) / 0.4)",
          }}
        >
          <MessageSquare className="h-5 w-5 text-primary relative" strokeWidth={1.8} />
          <span className="text-[12px] font-semibold text-foreground relative">Chat</span>
        </button>
      </motion.div>

      {/* Hero stats — 2x2 premium */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mx-5 mt-4 grid grid-cols-2 gap-2.5"
      >
        {[
          {
            value: "47",
            label: "Total filings",
            sublabel: "Lifetime",
            icon: FileBadge2,
            glow: "hsl(258 90% 65% / 0.4)",
            tone: "hsl(258 90% 75%)",
          },
          {
            value: "₹2.4L",
            label: "Tax saved",
            sublabel: "FY 24-25",
            icon: TrendingUp,
            glow: "hsl(152 76% 56% / 0.4)",
            tone: "hsl(152 76% 65%)",
          },
          {
            value: "12",
            label: "Active tasks",
            sublabel: "In progress",
            icon: Zap,
            glow: "hsl(195 95% 60% / 0.4)",
            tone: "hsl(195 95% 70%)",
          },
          {
            value: "4.9",
            label: "Your rating",
            sublabel: "★★★★★",
            icon: Award,
            glow: "hsl(38 95% 55% / 0.4)",
            tone: "hsl(38 95% 70%)",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl glass p-4 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--surface-elevated) / 0.5), hsl(var(--surface) / 0.25))",
              border: "1px solid hsl(var(--border) / 0.5)",
              boxShadow: "inset 0 1px 0 hsl(var(--foreground) / 0.04)",
            }}
          >
            <div className="relative flex items-center justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "hsl(var(--foreground) / 0.05)",
                  border: "1px solid hsl(var(--border) / 0.5)",
                }}
              >
                <s.icon className="h-5 w-5" style={{ color: s.tone }} strokeWidth={1.8} />
              </div>
              <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                {s.sublabel}
              </p>
            </div>
            <p className="font-display text-2xl font-bold text-foreground mt-3 tracking-tight">{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Tab switcher */}
      <div className="px-5 mt-5">
        <div className="rounded-2xl glass p-1 flex items-center gap-1">
          {(["overview", "preferences", "billing"] as const).map((t) => {
            const active = activeTab === t;
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="flex-1 h-9 rounded-xl text-[11px] font-bold capitalize transition relative"
                style={
                  active
                    ? {
                        background: "var(--gradient-aurora)",
                        color: "hsl(240 40% 6%)",
                        boxShadow: "0 4px 14px -4px hsl(195 95% 50% / 0.5)",
                      }
                    : { color: "hsl(var(--muted-foreground))" }
                }
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* KYC card */}
            <button
              onClick={() => onNavigate?.("kyc")}
              className="mx-5 mt-4 w-[calc(100%-2.5rem)] rounded-2xl p-4 active:scale-[0.99] transition relative overflow-hidden glass"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--success) / 0.10), hsl(var(--surface-elevated) / 0.4))",
                border: "1px solid hsl(var(--border) / 0.55)",
              }}
            >
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--success) / 0.2), hsl(var(--primary) / 0.15))",
                      border: "1px solid hsl(var(--border) / 0.5)",
                    }}
                  >
                    <FileBadge2 className="h-5 w-5 text-success" strokeWidth={1.8} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="font-display text-[15px] font-bold text-foreground">KYC Verified</p>
                      <Check className="h-3.5 w-3.5 text-success" strokeWidth={3} />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">PAN · Aadhaar · GSTIN linked</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full text-success"
                    style={{ background: "hsl(var(--success) / 0.15)", border: "1px solid hsl(var(--success) / 0.3)" }}
                  >
                    100%
                  </span>
                  <p className="text-[9px] text-muted-foreground mt-1">Verified Apr 2025</p>
                </div>
              </div>
            </button>

            {/* Firm card */}
            <button
              onClick={() => onNavigate?.("chat")}
              className="mx-5 mt-3 w-[calc(100%-2.5rem)] rounded-2xl glass p-4 active:scale-[0.99] transition relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--surface-elevated) / 0.4))",
                border: "1px solid hsl(var(--border) / 0.55)",
              }}
            >
              <div className="relative flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--accent) / 0.14))",
                    border: "1px solid hsl(var(--border) / 0.5)",
                  }}
                >
                  <Building2 className="h-5 w-5 text-primary" strokeWidth={1.8} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-display text-[15px] font-bold text-foreground">CA Hub</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Bengaluru · Rajeev Menon, CA</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-success">Online</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-1" />
              </div>
            </button>

            {/* Communication log */}
            <div className="px-5 mt-6">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Quick access
              </p>
              <div
                className="rounded-2xl glass divide-y divide-border/40 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, hsl(var(--surface-elevated) / 0.45), hsl(var(--surface) / 0.25))",
                  border: "1px solid hsl(var(--border) / 0.5)",
                }}
              >
                {[
                  { icon: MessageSquare, label: "Communication log", sub: "12 threads", color: "primary", target: "chatList" as const },
                  { icon: FileText, label: "Documents vault", sub: "47 files", color: "info", target: "documents" as const },
                  { icon: Receipt, label: "Acknowledgements", sub: "8 receipts", color: "success", target: "ack" as const },
                  { icon: HelpCircle, label: "Help & support", sub: "24/7 chat", color: "warning", target: "chat" as const },
                ].map((m) => (
                  <button
                    key={m.label}
                    onClick={() => onNavigate?.(m.target)}
                    className="w-full flex items-center gap-4 p-4 active:bg-foreground/5 transition text-left"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-${m.color}/12 flex items-center justify-center border border-border/40`}>
                      <m.icon className={`h-5 w-5 text-${m.color}`} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground">{m.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{m.sub}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "preferences" && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="px-5 mt-4"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2.5">
              Security & alerts
            </p>
            <div
              className="rounded-2xl glass divide-y divide-border/40 overflow-hidden"
              style={{
                background: "linear-gradient(180deg, hsl(var(--surface-elevated) / 0.45), hsl(var(--surface) / 0.25))",
                border: "1px solid hsl(var(--border) / 0.5)",
              }}
            >
              {[
                { icon: Shield, label: "Biometric sign-in", sub: "Face ID enabled", value: biometric, set: setBiometric, color: "primary" },
                { icon: Bell, label: "Push notifications", sub: "Real-time alerts", value: notifEnabled, set: setNotifEnabled, color: "secondary" },
                { icon: MessageSquare, label: "WhatsApp alerts", sub: "+91 98XXX XX234", value: whatsapp, set: setWhatsapp, color: "success" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-4 p-4">
                  <div className={`w-11 h-11 rounded-xl bg-${t.color}/12 flex items-center justify-center border border-border/40`}>
                    <t.icon className={`h-5 w-5 text-${t.color}`} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground">{t.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t.sub}</p>
                  </div>
                  <button
                    onClick={() => t.set(!t.value)}
                    className="relative w-11 h-6 rounded-full transition-colors shrink-0"
                    style={t.value ? { background: "hsl(var(--primary))" } : { background: "hsl(var(--muted))" }}
                    aria-pressed={t.value}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow transition-all ${t.value ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2.5 mt-5">
              App
            </p>
            <div
              className="rounded-2xl glass divide-y divide-border/40 overflow-hidden"
              style={{
                background: "linear-gradient(180deg, hsl(var(--surface-elevated) / 0.45), hsl(var(--surface) / 0.25))",
                border: "1px solid hsl(var(--border) / 0.5)",
              }}
            >
              {[
                { icon: Lock, label: "Privacy & data", sub: "Manage permissions", color: "info" },
                { icon: Globe, label: "Language", sub: "English (India)", color: "secondary" },
              ].map((m) => (
                <button
                  key={m.label}
                  className="w-full flex items-center gap-4 p-4 active:bg-foreground/5 transition text-left"
                >
                  <div className={`w-11 h-11 rounded-xl bg-${m.color}/12 flex items-center justify-center border border-border/40`}>
                    <m.icon className={`h-5 w-5 text-${m.color}`} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-foreground">{m.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{m.sub}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}

              {/* Appearance — functional theme switcher */}
              <div className="flex items-center gap-4 p-4">
                <div className="w-11 h-11 rounded-xl bg-primary/12 flex items-center justify-center border border-border/40">
                  <Palette className="h-5 w-5 text-primary" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground">Appearance</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">
                    {mounted ? `${currentTheme} mode` : "Loading…"}
                  </p>
                </div>
                <div
                  className="flex items-center gap-1 p-1 rounded-full shrink-0"
                  style={{
                    background: "hsl(var(--muted) / 0.6)",
                    border: "1px solid hsl(var(--border) / 0.6)",
                  }}
                  role="group"
                  aria-label="Theme switcher"
                >
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    aria-pressed={!isDark}
                    aria-label="Light theme"
                    className="relative h-7 w-7 rounded-full flex items-center justify-center transition-colors"
                    style={
                      !isDark
                        ? {
                            background: "hsl(var(--primary))",
                            color: "hsl(var(--primary-foreground))",
                            boxShadow: "0 2px 8px -2px hsl(var(--primary) / 0.5)",
                          }
                        : { color: "hsl(var(--muted-foreground))" }
                    }
                  >
                    <Sun className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    aria-pressed={isDark}
                    aria-label="Dark theme"
                    className="relative h-7 w-7 rounded-full flex items-center justify-center transition-colors"
                    style={
                      isDark
                        ? {
                            background: "hsl(var(--primary))",
                            color: "hsl(var(--primary-foreground))",
                            boxShadow: "0 2px 8px -2px hsl(var(--primary) / 0.5)",
                          }
                        : { color: "hsl(var(--muted-foreground))" }
                    }
                  >
                    <Moon className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "billing" && (
          <motion.div
            key="billing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="px-5 mt-4"
          >
            <div
              className="rounded-2xl p-5 relative overflow-hidden glass"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--accent) / 0.14))",
                border: "1px solid hsl(var(--border) / 0.6)",
              }}
            >
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Crown className="h-4 w-4 text-warning" fill="currentColor" />
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-foreground/90">
                      Prime Plan
                    </p>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full text-success"
                    style={{
                      background: "hsl(var(--success) / 0.15)",
                      border: "1px solid hsl(var(--success) / 0.3)",
                    }}
                  >
                    ACTIVE
                  </span>
                </div>
                <p className="font-display text-3xl font-bold text-foreground mt-3">₹24,999</p>
                <p className="text-[11px] text-muted-foreground mt-1">per year · renews 12 Mar 2026</p>
                <div className="mt-4 flex gap-2.5">
                  <button className="flex-1 h-10 rounded-xl glass text-[12px] font-bold text-foreground active:scale-95 transition border border-border/50">
                    Manage
                  </button>
                  <button
                    className="flex-1 h-10 rounded-xl text-[12px] font-bold text-primary-foreground active:scale-95 transition"
                    style={{ background: "hsl(var(--primary))" }}
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3 mt-6">
              Payment & invoices
            </p>
            <div
              className="rounded-2xl glass divide-y divide-border/40 overflow-hidden"
              style={{
                background: "linear-gradient(180deg, hsl(var(--surface-elevated) / 0.45), hsl(var(--surface) / 0.25))",
                border: "1px solid hsl(var(--border) / 0.5)",
              }}
            >
              {[
                { icon: CreditCard, label: "Payment method", sub: "HDFC •••• 4421", color: "primary" },
                { icon: Wallet, label: "Billing address", sub: "Bengaluru, KA 560001", color: "info" },
                { icon: Receipt, label: "Invoice history", sub: "8 invoices", color: "success" },
              ].map((m) => (
                <button
                  key={m.label}
                  className="w-full flex items-center gap-4 p-4 active:bg-foreground/5 transition text-left"
                >
                  <div className={`w-11 h-11 rounded-xl bg-${m.color}/12 flex items-center justify-center border border-border/40`}>
                    <m.icon className={`h-5 w-5 text-${m.color}`} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-foreground">{m.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{m.sub}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign out + footer */}
      <div className="px-5 mt-5">
        <button
          onClick={() => onNavigate?.("splash")}
          className="w-full h-11 rounded-2xl border border-danger/30 bg-danger/10 text-danger text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <LogOut className="h-4 w-4" /> Sign out of CA Hub
        </button>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          <Sparkles className="h-2.5 w-2.5 text-primary" />
          <p className="text-center text-[9px] text-muted-foreground font-mono">
            CA Hub v1.0.0 · Build 2604
          </p>
        </div>
      </div>

      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
};
