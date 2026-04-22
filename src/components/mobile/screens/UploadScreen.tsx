import { useRef, useState } from "react";
import { ChevronLeft, Camera, Image as ImageIcon, FileText, Check, Clock, Upload, Sparkles } from "lucide-react";
import type { ScreenProps } from "@/lib/screen-types";

interface DocItem {
  name: string;
  status: "received" | "pending";
  time: string;
}

const initialDocs: DocItem[] = [
  { name: "Sales register (March)", status: "received", time: "Mar 28" },
  { name: "Purchase invoices", status: "received", time: "Mar 29" },
  { name: "ITC reversal sheet", status: "received", time: "Apr 02" },
  { name: "Bank statement", status: "pending", time: "Required" },
  { name: "E-way bill summary", status: "pending", time: "Required" },
];

export const UploadScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [docs, setDocs] = useState<DocItem[]>(initialDocs);
  const fileInput = useRef<HTMLInputElement>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);

  const received = docs.filter((d) => d.status === "received").length;
  const total = docs.length;
  const pct = Math.round((received / total) * 100);
  const dashOffset = 94.2 - (94.2 * pct) / 100;

  const markUploaded = (name: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.name === name ? { ...d, status: "received", time: "Just now" } : d)),
    );
  };

  const triggerFile = (name: string) => {
    setPendingName(name);
    fileInput.current?.click();
  };

  const onFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (f && pendingName) markUploaded(pendingName);
    setPendingName(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div className="relative h-full bg-gradient-screen pb-6 overflow-y-auto no-scrollbar">
      <input ref={fileInput} type="file" className="hidden" onChange={onFile} />
      <div className="px-5 pt-4 flex items-center gap-3">
        <button
          onClick={() => onNavigate?.("home")}
          className="w-9 h-9 rounded-full glass flex items-center justify-center active:scale-95 transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground">GSTR-3B March</p>
          <p className="font-display text-sm font-semibold">Document checklist</p>
        </div>
        <button
          onClick={() => onNavigate?.("documents")}
          className="text-[10px] text-primary font-semibold active:scale-95 transition"
        >
          Vault
        </button>
      </div>

      {/* Progress */}
      <div className="mx-5 mt-4 rounded-2xl glass p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Smart checklist</p>
            <p className="mt-1 font-display text-lg font-bold">{received} of {total} received</p>
          </div>
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke="hsl(var(--primary))" strokeWidth="3"
                strokeDasharray="94.2"
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.22,1,0.36,1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-display text-xs font-bold text-primary">{pct}%</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-info">
          <Sparkles className="h-3 w-3" />
          {pct === 100 ? "All documents in — ready to file!" : `Upload ${total - received} more to unlock processing`}
        </div>
      </div>

      {/* Checklist */}
      <div className="px-5 mt-5 space-y-2">
        {docs.map((d) => (
          <div key={d.name} className="rounded-xl glass p-3 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
              d.status === "received" ? "bg-success/15" : "bg-warning/15"
            }`}>
              {d.status === "received"
                ? <Check className="h-4 w-4 text-success" strokeWidth={3} />
                : <Clock className="h-4 w-4 text-warning" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{d.name}</p>
              <p className="text-[10px] text-muted-foreground">{d.time}</p>
            </div>
            {d.status === "pending" && (
              <button
                onClick={() => triggerFile(d.name)}
                className="h-7 px-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-[10px] font-bold active:scale-95 transition shadow-glow"
              >
                Upload
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Upload methods */}
      <div className="px-5 mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">Quick add</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Camera, label: "Scan" },
            { icon: ImageIcon, label: "Gallery" },
            { icon: FileText, label: "Files" },
          ].map((m) => (
            <button
              key={m.label}
              onClick={() => fileInput.current?.click()}
              className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-3 flex flex-col items-center gap-1.5 active:scale-95 transition hover:bg-primary/10"
            >
              <m.icon className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-semibold text-primary">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-5">
        <button
          onClick={() => pct === 100 ? onNavigate?.("ack") : triggerFile("Bank statement")}
          className="w-full h-12 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-glow active:scale-95 transition"
        >
          <Upload className="h-4 w-4" />
          {pct === 100 ? "View acknowledgement" : "Upload bank statement"}
        </button>
      </div>
    </div>
  );
};
