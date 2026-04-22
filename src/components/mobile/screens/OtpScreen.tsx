import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import type { ScreenProps } from "@/lib/screen-types";

export const OtpScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(24);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  const set = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "").slice(-1);
    setDigits((d) => {
      const n = [...d];
      n[i] = clean;
      return n;
    });
    if (clean && i < 5) inputs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const complete = digits.every((d) => d !== "");
  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="relative h-full bg-gradient-screen px-6 pt-6 flex flex-col">
      <button
        onClick={() => onNavigate?.("login")}
        className="w-10 h-10 rounded-full glass-strong border border-primary/40 flex items-center justify-center text-foreground active:scale-95 transition"
        aria-label="Back"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
      </button>

      <div className="mt-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <h1 className="mt-4 font-display text-[24px] font-bold">Verify your phone</h1>
        <p className="mt-1.5 text-xs text-muted-foreground">
          We sent a 6-digit code to <span className="text-foreground">+91 98••• •••42</span>
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            value={d}
            onChange={(e) => set(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            inputMode="numeric"
            maxLength={1}
            className={`w-10 h-12 rounded-xl border text-center font-display font-bold text-lg outline-none transition ${
              d
                ? "bg-primary/10 border-primary text-primary"
                : "border-border bg-surface-elevated text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">Didn't get a code?</span>
        {seconds > 0 ? (
          <span className="text-primary font-semibold font-mono">Resend in {mm}:{ss}</span>
        ) : (
          <button
            onClick={() => setSeconds(24)}
            className="text-primary font-semibold active:scale-95 transition"
          >
            Resend code
          </button>
        )}
      </div>

      <button
        disabled={!complete}
        onClick={() => onNavigate?.("kyc")}
        className="mt-8 h-12 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow active:scale-95 transition disabled:opacity-50 disabled:active:scale-100"
      >
        Verify &amp; continue
      </button>

      <div className="mt-auto pb-6">
        <div className="rounded-2xl glass p-3 flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-info/15 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-3.5 w-3.5 text-info" />
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Your firm uses bank-grade RBAC. We never share your data with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};
