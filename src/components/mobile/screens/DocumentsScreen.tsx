import { useState, useMemo } from "react";
import { ChevronLeft, FolderOpen, FileText, Image as ImageIcon, Download, Lock, Search } from "lucide-react";
import type { ScreenProps, ScreenKey } from "@/lib/screen-types";

interface FileEntry {
  name: string;
  size: string;
  icon: typeof FileText;
  color: string;
  date: string;
}

const recent: FileEntry[] = [
  { name: "Form 16 - FY24-25.pdf", size: "2.1 MB", icon: FileText, color: "primary", date: "Today" },
  { name: "GSTR-3B-Feb-receipt.pdf", size: "486 KB", icon: FileText, color: "success", date: "Yesterday" },
  { name: "Aadhaar-front.jpg", size: "1.2 MB", icon: ImageIcon, color: "info", date: "Mar 28" },
  { name: "ITC-reversal.xlsx", size: "342 KB", icon: FileText, color: "accent", date: "Mar 24" },
];

const folders: { name: string; count: number; color: string; target: ScreenKey }[] = [
  { name: "Income Tax", count: 24, color: "primary", target: "tasks" },
  { name: "GST Filings", count: 36, color: "info", target: "tasks" },
  { name: "TDS / TCS", count: 18, color: "accent", target: "tasks" },
  { name: "KYC", count: 12, color: "warning", target: "kyc" },
];

export const DocumentsScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => recent.filter((f) => f.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div className="relative h-full bg-gradient-screen pb-6 overflow-y-auto no-scrollbar">
      <div className="px-5 pt-4 flex items-center gap-3">
        <button
          onClick={() => onNavigate?.("home")}
          className="w-9 h-9 rounded-full glass flex items-center justify-center active:scale-95 transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <p className="font-display text-sm font-semibold">Document vault</p>
          <p className="text-[10px] text-muted-foreground">128 files · 1.4 GB encrypted</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-success/15 flex items-center justify-center">
          <Lock className="h-3.5 w-3.5 text-success" />
        </div>
      </div>

      {/* Search */}
      <div className="px-5 mt-3">
        <div className="h-9 rounded-xl bg-surface-elevated border border-border focus-within:border-primary/50 flex items-center px-3 gap-2 transition">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files…"
            className="flex-1 bg-transparent text-[11px] outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[10px] text-primary font-semibold">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Folders */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-2.5">
        {folders.map((f) => (
          <button
            key={f.name}
            onClick={() => onNavigate?.(f.target)}
            className="rounded-2xl glass p-3.5 text-left active:scale-95 transition"
          >
            <div className={`w-9 h-9 rounded-xl bg-${f.color}/15 flex items-center justify-center mb-2.5`}>
              <FolderOpen className={`h-4 w-4 text-${f.color}`} />
            </div>
            <p className="font-display text-xs font-semibold">{f.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{f.count} files</p>
          </button>
        ))}
      </div>

      {/* Recent */}
      <div className="px-5 mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
          {query ? `Results for "${query}"` : "Recently shared"}
        </p>
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="rounded-xl glass p-4 text-center text-[11px] text-muted-foreground">
              No files match "{query}"
            </div>
          )}
          {filtered.map((f) => (
            <button
              key={f.name}
              onClick={() => onNavigate?.("ack")}
              className="w-full text-left rounded-xl glass p-3 flex items-center gap-3 active:scale-[0.99] transition"
            >
              <div className={`w-9 h-9 rounded-lg bg-${f.color}/15 flex items-center justify-center`}>
                <f.icon className={`h-4 w-4 text-${f.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{f.name}</p>
                <p className="text-[10px] text-muted-foreground">{f.size} · {f.date}</p>
              </div>
              <span className="w-7 h-7 rounded-lg bg-surface-elevated flex items-center justify-center">
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
