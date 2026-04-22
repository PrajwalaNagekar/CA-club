import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneFrame } from "@/components/mobile/PhoneFrame";
import { SplashScreen } from "@/components/mobile/screens/SplashScreen";
import { LoginScreen } from "@/components/mobile/screens/LoginScreen";
import { OtpScreen } from "@/components/mobile/screens/OtpScreen";
import { KycScreen } from "@/components/mobile/screens/KycScreen";
import { HomeScreen } from "@/components/mobile/screens/HomeScreen";
import { TasksScreen } from "@/components/mobile/screens/TasksScreen";
import { CalendarScreen } from "@/components/mobile/screens/CalendarScreen";
import { UploadScreen } from "@/components/mobile/screens/UploadScreen";
import { DocumentsScreen } from "@/components/mobile/screens/DocumentsScreen";
import { AcknowledgementScreen } from "@/components/mobile/screens/AcknowledgementScreen";
import { NotificationsScreen } from "@/components/mobile/screens/NotificationsScreen";
import { ChatScreen } from "@/components/mobile/screens/ChatScreen";
import { ChatListScreen } from "@/components/mobile/screens/ChatListScreen";
import { ProfileScreen } from "@/components/mobile/screens/ProfileScreen";
import { ItrScreen } from "@/components/mobile/screens/ItrScreen";
import { ThemeToggle } from "@/components/ThemeToggle";

import type { ScreenKey, ScreenProps } from "@/lib/screen-types";

const SCREEN_MAP: Record<ScreenKey, React.FC<ScreenProps>> = {
  splash: SplashScreen,
  login: LoginScreen,
  otp: OtpScreen,
  kyc: KycScreen,
  home: HomeScreen,
  tasks: TasksScreen,
  calendar: CalendarScreen,
  upload: UploadScreen,
  documents: DocumentsScreen,
  ack: AcknowledgementScreen,
  notifications: NotificationsScreen,
  chatList: ChatListScreen,
  chat: ChatScreen,
  profile: ProfileScreen,
  itr: ItrScreen,
};

const Index = () => {
  const [active, setActive] = useState<ScreenKey>("splash");
  const ActiveComp = SCREEN_MAP[active];

  const navigate = (screen: ScreenKey) => setActive(screen);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Subtle warm wash — adapts to theme via tokens */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 12% 18%, hsl(var(--primary) / 0.06), transparent 60%), radial-gradient(ellipse 50% 40% at 88% 82%, hsl(var(--secondary) / 0.05), transparent 60%)",
        }}
      />
      {/* Paper grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply dark:mix-blend-overlay dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Theme toggle — top right, all viewports */}
      <div className="fixed top-4 right-4 md:top-6 md:right-8 z-30">
        <ThemeToggle />
      </div>

      {/* CA letterhead masthead — desktop only */}
      <div className="hidden md:flex fixed top-6 left-8 right-44 z-20 items-baseline justify-between text-[10px] font-mono uppercase tracking-[0.3em] pointer-events-none text-muted-foreground">
        <span>CA Hub · Chartered Accountants</span>
        <span>Client Practice Suite · FY 2024-25</span>
      </div>

      {/* Bottom signature line — desktop only */}
      <div className="hidden md:flex fixed bottom-6 left-8 right-8 z-20 items-baseline justify-between text-[10px] font-mono uppercase tracking-[0.3em] pointer-events-none text-muted-foreground/70">
        <span>Confidential · For Client Use</span>
        <span>www.cahub.in</span>
      </div>

      {/* Stage */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 pb-16 min-h-screen">
        <div className="relative">
          <PhoneFrame>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full"
              >
                <ActiveComp onNavigate={navigate} onNext={() => navigate("home")} />
              </motion.div>
            </AnimatePresence>
          </PhoneFrame>
        </div>
      </main>
    </div>
  );
};

export default Index;
