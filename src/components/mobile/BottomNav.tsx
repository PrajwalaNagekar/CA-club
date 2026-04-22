import { useState } from "react";
import { Home, FileText, Calendar, MessageCircle, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ScreenKey } from "@/lib/screen-types";

interface BottomNavProps {
  active: "home" | "tasks" | "calendar" | "chat" | "profile";
  onNavigate?: (screen: ScreenKey) => void;
}

const items: { key: ScreenKey; icon: typeof Home; label: string; matchKey: BottomNavProps["active"] }[] = [
  { key: "home", icon: Home, label: "Desk", matchKey: "home" },
  { key: "tasks", icon: FileText, label: "Tasks", matchKey: "tasks" },
  { key: "calendar", icon: Calendar, label: "Diary", matchKey: "calendar" },
  { key: "chatList", icon: MessageCircle, label: "Inbox", matchKey: "chat" },
  { key: "profile", icon: User, label: "Profile", matchKey: "profile" },
];

export const BottomNav = ({ active, onNavigate }: BottomNavProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-auto sticky bottom-0 left-0 right-0 flex w-full justify-end px-3 pb-3 pt-6 pointer-events-none z-30 bg-gradient-to-t from-background via-background/90 to-transparent">
      <div className="pointer-events-auto ml-auto">
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="bar"
              initial={{ width: 56, opacity: 0.6, x: 12 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 56, opacity: 0, x: 12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong flex items-center gap-0 overflow-hidden origin-right"
              style={{
                borderRadius: "12px",
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 12px 32px -8px hsl(0 0% 0% / 0.6)",
              }}
            >
              {items.map(({ key, icon: Icon, label, matchKey }, i) => {
                const isActive = matchKey === active;
                return (
                  <motion.button
                    key={key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.04, duration: 0.22 }}
                    onClick={() => {
                      onNavigate?.(key);
                      setOpen(false);
                    }}
                    aria-label={label}
                    className={`relative flex items-center justify-center px-4 py-3 transition-all active:scale-95 border-r border-border last:border-r-0 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-rule"
                        className="absolute top-0 left-2 right-2 h-[2px] bg-primary"
                      />
                    )}
                    <Icon className="h-6 w-6" strokeWidth={isActive ? 2.4 : 1.9} />
                  </motion.button>
                );
              })}
              <button
                onClick={() => setOpen(false)}
                className="ml-1 mr-1 w-8 h-8 rounded-md text-muted-foreground text-[14px] font-display font-bold flex items-center justify-center active:scale-90 transition hover:bg-muted/40"
                aria-label="Collapse navigation"
              >
                ×
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="orb"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setOpen(true)}
              className="relative h-14 px-5 flex items-center text-primary-foreground font-display italic text-[18px] font-bold leading-none"
              style={{
                background: "hsl(var(--primary))",
                borderRadius: "10px",
                boxShadow:
                  "0 10px 28px -6px hsl(18 88% 40% / 0.55), inset 0 1px 0 hsl(36 100% 90% / 0.25)",
              }}
              aria-label="Open navigation"
            >
              CA
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
