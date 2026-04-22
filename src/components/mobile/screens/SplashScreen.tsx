import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { ScreenProps } from "@/lib/screen-types";

export const SplashScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  return (
    <div className="relative h-full bg-gradient-screen overflow-hidden">
      {/* Mesh background */}
      <div className="absolute inset-0 opacity-60">
        <motion.div
          className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-primary/30 blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 -right-16 w-72 h-72 rounded-full bg-info/30 blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-accent/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Animated A&C monogram */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-50 animate-pulse-glow rounded-full" />
          <div className="relative w-28 h-28 rounded-[2rem] bg-gradient-primary shadow-glow flex items-center justify-center overflow-hidden">
            {/* shine sweep */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
            />
            <div className="relative flex items-baseline font-display font-bold text-primary-foreground leading-none">
              <motion.span
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-[44px] tracking-tighter"
              >
                C
              </motion.span>
              <motion.span
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-[44px] tracking-tighter"
              >
                A
              </motion.span>
            </div>
          </div>
          {/* orbiting dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50% 50%" }}
          >
            <div className="absolute -translate-y-[68px] w-3 h-3 rounded-full bg-info shadow-glow" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="font-display text-[28px] font-bold tracking-tight leading-none"
        >
          <span className="text-gradient-primary">CA</span>
          <span className="text-foreground"> Hub</span>
        </motion.h1>
        <motion.p
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="mt-2 text-[11px] text-muted-foreground tracking-wide"
        >
          Your Chartered Accountant, in your pocket.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-12 flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground"
        >
          <Sparkles className="h-3 w-3 text-primary" />
          Secured by 256-bit encryption
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="absolute bottom-10 inset-x-6"
      >
        <button
          onClick={() => onNavigate?.("login")}
          className="w-full h-12 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-glow active:scale-95 transition"
        >
          Get started <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-4 text-center text-[10px] text-muted-foreground">
          Already a client?{" "}
          <button
            onClick={() => onNavigate?.("login")}
            className="text-primary font-semibold active:scale-95 transition"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
};
