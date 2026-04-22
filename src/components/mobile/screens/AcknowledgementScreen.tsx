import { ChevronLeft, CheckCircle2, Download, Share2, Building2 } from "lucide-react";
import type { ScreenProps } from "@/lib/screen-types";

export const AcknowledgementScreen: React.FC<ScreenProps> = ({ onNavigate }) => (
  <div className="relative h-full bg-gradient-screen pb-6 overflow-y-auto no-scrollbar">
    <div className="px-5 pt-4 flex items-center gap-3">
      <button
        onClick={() => onNavigate?.("documents")}
        className="w-9 h-9 rounded-full glass flex items-center justify-center active:scale-95 transition"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <p className="font-display text-sm font-semibold">Acknowledgement</p>
    </div>

    {/* Receipt */}
    <div className="mx-5 mt-5 rounded-3xl bg-card border border-border shadow-card overflow-hidden">
      {/* Top */}
      <div className="bg-gradient-primary p-5 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
        <div className="relative">
          <div className="w-14 h-14 mx-auto rounded-full bg-primary-foreground/20 backdrop-blur flex items-center justify-center mb-2">
            <CheckCircle2 className="h-8 w-8 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <p className="font-display text-sm font-bold text-primary-foreground">Filed successfully</p>
          <p className="text-[10px] text-primary-foreground/85 mt-0.5">GSTR-1 · February 2026</p>
        </div>
      </div>

      {/* Perforation */}
      <div className="relative h-3 bg-card flex items-center">
        <div className="absolute -left-2 w-4 h-4 rounded-full bg-background" />
        <div className="absolute -right-2 w-4 h-4 rounded-full bg-background" />
        <div className="flex-1 mx-3 border-t-2 border-dashed border-border" />
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        {[
          { label: "Acknowledgement No.", value: "AA29022602049X1" },
          { label: "Filed on", value: "11 Apr 2026, 9:42 AM" },
          { label: "Period", value: "Feb 2026" },
          { label: "GSTIN", value: "29ABCDE1234F1Z5" },
          { label: "Status", value: "Accepted by portal", success: true },
        ].map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">{r.label}</span>
            <span className={`text-[11px] font-semibold font-mono ${r.success ? "text-success" : "text-foreground"}`}>
              {r.value}
            </span>
          </div>
        ))}

        <div className="pt-3 border-t border-dashed border-border flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-ocean flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-semibold">Sharma Mehta & Co.</p>
            <p className="text-[9px] text-muted-foreground">Filed by Rajeev Menon, CA</p>
          </div>
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="px-5 mt-5 grid grid-cols-2 gap-2">
      <button
        onClick={() => onNavigate?.("documents")}
        className="h-11 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-2 shadow-glow active:scale-95 transition"
      >
        <Download className="h-4 w-4" /> Download
      </button>
      <button
        onClick={() => onNavigate?.("chat")}
        className="h-11 rounded-2xl glass text-foreground font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
      >
        <Share2 className="h-4 w-4" /> Share
      </button>
    </div>

    <button
      onClick={() => onNavigate?.("home")}
      className="mt-4 mx-5 block text-center text-[11px] text-primary font-semibold w-[calc(100%-2.5rem)] active:scale-95 transition"
    >
      Back to dashboard
    </button>
  </div>
);
