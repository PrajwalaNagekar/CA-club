import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Signal, Wifi, BatteryFull } from "lucide-react";

interface PhoneFrameProps {
  children: ReactNode;
  time?: string;
  delay?: number;
}

/**
 * iPhone — matte espresso bezel, editorial newsroom rim.
 */
export const PhoneFrame = ({
  children,
  time = "9:41",
  delay = 0,
}: PhoneFrameProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Warm ambient — subtle press-room glow */}
      <div
        className="absolute -inset-24 -z-10 opacity-40 blur-3xl rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, hsl(18 88% 45% / 0.35), transparent 55%), radial-gradient(circle at 70% 70%, hsl(36 25% 30% / 0.4), transparent 55%)",
        }}
      />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-[hsl(18_88%_30%_/_0.3)] blur-3xl rounded-full -z-10" />

      {/* Outer rim — espresso titanium */}
      <div
        className="relative w-[390px] h-[844px] rounded-[58px] p-[3px]"
        style={{
          background:
            "linear-gradient(145deg, #2a241e 0%, #443a30 25%, #1a1612 50%, #443a30 75%, #2a241e 100%)",
          boxShadow:
            "0 60px 120px -20px rgba(0,0,0,0.85), 0 30px 60px -30px rgba(80,40,15,0.4), inset 0 0 0 1px rgba(255,235,200,0.06)",
        }}
      >
        {/* Inner rim */}
        <div
          className="relative w-full h-full rounded-[55px] p-[8px]"
          style={{ background: "#0f0c0a" }}
        >
          {/* Side buttons */}
          <div className="absolute -left-[5px] top-[110px] w-[4px] h-[34px] rounded-l-md bg-gradient-to-b from-[#3a3128] to-[#1a1612]" />
          <div className="absolute -left-[5px] top-[170px] w-[4px] h-[58px] rounded-l-md bg-gradient-to-b from-[#3a3128] to-[#1a1612]" />
          <div className="absolute -left-[5px] top-[240px] w-[4px] h-[58px] rounded-l-md bg-gradient-to-b from-[#3a3128] to-[#1a1612]" />
          <div className="absolute -right-[5px] top-[200px] w-[4px] h-[90px] rounded-r-md bg-gradient-to-b from-[#3a3128] to-[#1a1612]" />

          {/* Screen */}
          <div
            className="relative w-full h-full rounded-[47px] overflow-hidden bg-background"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(255,235,200,0.04), inset 0 0 24px rgba(255,140,80,0.05)",
            }}
          >
            {/* Status bar */}
            <div className="absolute top-0 inset-x-0 z-30 h-[44px] px-7 flex items-center justify-between text-[13px] font-semibold text-foreground">
              <span className="font-mono tracking-tight">{time}</span>
              <div className="flex items-center gap-1.5">
                <Signal className="h-3 w-3" />
                <Wifi className="h-3 w-3" />
                <BatteryFull className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 pt-[44px] overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
