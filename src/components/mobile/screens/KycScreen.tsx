import { useState } from "react";
import { Check, Camera, FileText, ChevronRight } from "lucide-react";
import type { ScreenProps } from "@/lib/screen-types";

interface Step {
  name: string;
  desc: string;
  done: boolean;
}

const initial: Step[] = [
  { name: "PAN card", desc: "Verified via NSDL", done: true },
  { name: "Aadhaar (eKYC)", desc: "OTP authenticated", done: true },
  { name: "GSTIN", desc: "Tap to verify", done: false },
  { name: "Bank proof", desc: "Cancelled cheque or statement", done: false },
];

export const KycScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [steps, setSteps] = useState<Step[]>(initial);
  const [active, setActive] = useState(2);

  const completedCount = steps.filter((s) => s.done).length;

  const verify = (i: number) => {
    setSteps((p) => p.map((s, idx) => (idx === i ? { ...s, done: true, desc: "Verified just now" } : s)));
    const nextPending = steps.findIndex((s, idx) => !s.done && idx !== i);
    if (nextPending !== -1) setActive(nextPending);
  };

  return (
    <div className="relative h-full bg-gradient-screen pb-6 overflow-y-auto no-scrollbar">
      <div className="px-5 pt-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Step {Math.min(completedCount + 1, 4)} of 4</p>
        <h1 className="mt-1 font-display text-xl font-bold">KYC verification</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          We need a few documents to onboard you securely.
        </p>

        {/* Stepper */}
        <div className="mt-5 flex items-center gap-1.5">
          {steps.map((s, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition ${s.done ? "bg-gradient-primary" : "bg-muted"}`} />
          ))}
        </div>
      </div>

      <div className="px-5 mt-6 space-y-2.5">
        {steps.map((s, i) => {
          const isActive = i === active && !s.done;
          return (
            <button
              key={i}
              onClick={() => !s.done && setActive(i)}
              className={`w-full text-left rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.99] transition ${
                isActive ? "border-2 border-primary bg-primary/5" : "glass"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                s.done ? "bg-success" : isActive ? "bg-gradient-primary" : "bg-muted"
              }`}>
                {s.done ? <Check className="h-5 w-5 text-primary-foreground" strokeWidth={3} /> : <FileText className="h-5 w-5 text-primary-foreground" />}
              </div>
              <div className="flex-1">
                <p className="font-display text-xs font-semibold">{s.name}</p>
                <p className={`text-[10px] ${s.done ? "text-success" : "text-muted-foreground"}`}>{s.desc}</p>
              </div>
              {!s.done && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </button>
          );
        })}
      </div>

      {/* Capture */}
      <button
        onClick={() => verify(active)}
        disabled={steps[active]?.done}
        className="mx-5 mt-5 w-[calc(100%-2.5rem)] rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-5 text-center active:scale-[0.99] transition disabled:opacity-50"
      >
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Camera className="h-6 w-6 text-primary-foreground" />
        </div>
        <p className="mt-3 font-display text-xs font-semibold">
          Scan {steps[active]?.name ?? "document"}
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          Auto-captured &amp; encrypted on your device
        </p>
      </button>

      <div className="px-5 mt-5 grid grid-cols-2 gap-2">
        <button
          onClick={() => onNavigate?.("home")}
          className="h-11 rounded-2xl border border-primary/50 bg-primary/10 text-foreground text-xs font-semibold active:scale-95 transition hover:bg-primary/15"
        >
          Skip for now
        </button>
        <button
          onClick={() => onNavigate?.("home")}
          className="h-11 rounded-2xl bg-gradient-primary text-primary-foreground text-xs font-semibold shadow-glow active:scale-95 transition"
        >
          {completedCount === 4 ? "Continue" : `Continue (${completedCount}/4)`}
        </button>
      </div>
    </div>
  );
};
