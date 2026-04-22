import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Fingerprint, ChevronLeft } from "lucide-react";
import type { ScreenProps } from "@/lib/screen-types";

export const LoginScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState("priya.sharma@gmail.com");
  const [password, setPassword] = useState("supersecret");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  const canSubmit = email.includes("@") && password.length >= 4;

  return (
    <div className="relative h-full bg-gradient-screen px-6 pt-6 pb-6 flex flex-col">
      <button
        onClick={() => onNavigate?.("splash")}
        className="w-10 h-10 rounded-full glass-strong border border-primary/40 flex items-center justify-center text-foreground active:scale-95 transition"
        aria-label="Back"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
      </button>

      <div className="mt-8">
        <h1 className="font-display text-[26px] font-bold leading-tight">Welcome back</h1>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Sign in to track your filings and<br />upload documents securely.
        </p>
      </div>

      <div className="mt-8 space-y-3.5">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Email</label>
          <div className="mt-1.5 h-11 rounded-xl bg-surface-elevated border border-border focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15 flex items-center px-3 gap-2 transition">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Password</label>
          <div className="mt-1.5 h-11 rounded-xl bg-surface-elevated border border-primary/40 ring-2 ring-primary/15 flex items-center px-3 gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-xs text-foreground outline-none tracking-widest"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="text-muted-foreground active:scale-95 transition"
              aria-label="Toggle password visibility"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px]">
          <button
            onClick={() => setRemember((r) => !r)}
            className="flex items-center gap-2 text-muted-foreground active:scale-95 transition"
          >
            <span className={`h-3.5 w-3.5 rounded flex items-center justify-center transition ${remember ? "bg-primary" : "bg-muted border border-border"}`}>
              {remember && <span className="h-1.5 w-1.5 rounded-sm bg-primary-foreground" />}
            </span>
            Remember me
          </button>
          <button
            onClick={() => alert("Reset link sent to " + email)}
            className="text-primary font-semibold active:scale-95 transition"
          >
            Forgot password?
          </button>
        </div>
      </div>

      <button
        disabled={!canSubmit}
        onClick={() => onNavigate?.("otp")}
        className="mt-6 h-12 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow active:scale-95 transition disabled:opacity-50 disabled:active:scale-100"
      >
        Sign in
      </button>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button
        onClick={() => onNavigate?.("home")}
        className="mt-4 h-12 rounded-2xl border border-primary/50 bg-primary/10 text-foreground flex items-center justify-center gap-2 text-xs font-semibold active:scale-95 transition hover:bg-primary/15"
      >
        <Fingerprint className="h-4 w-4 text-primary" />
        Biometric sign-in
      </button>

      <p className="mt-auto text-center text-[10px] text-muted-foreground">
        New here?{" "}
        <button
          onClick={() => onNavigate?.("kyc")}
          className="text-primary font-semibold active:scale-95 transition"
        >
          Request access
        </button>
      </p>
    </div>
  );
};
