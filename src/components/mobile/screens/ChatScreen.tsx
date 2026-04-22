import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Phone,
  Video,
  Paperclip,
  Mic,
  Send,
  CheckCheck,
  Smile,
  Camera,
  Plus,
  MoreVertical,
  Play,
  Pause,
  Sparkles,
  Image as ImageIcon,
  FileText,
  MapPin,
  X,
  Reply,
  Copy,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { ScreenProps } from "@/lib/screen-types";

type Status = "sent" | "delivered" | "read";

type Message =
  | { id: string; from: "me" | "them"; kind: "text"; text: string; time: string; status?: Status; reactions?: string[]; replyTo?: string }
  | { id: string; from: "me" | "them"; kind: "voice"; duration: string; time: string; waveform: number[]; status?: Status }
  | { id: string; from: "me" | "them"; kind: "doc"; name: string; size: string; time: string; status?: Status }
  | { id: string; from: "me" | "them"; kind: "image"; caption?: string; time: string; status?: Status }
  | { id: string; kind: "system"; text: string };

const initialMessages: Message[] = [
  { id: "s0", kind: "system", text: "Today" },
  { id: "m1", from: "them", kind: "text", text: "Hi Priya — quick check on your salary slip for March. Could you share it when free?", time: "9:24 AM" },
  { id: "m2", from: "me", kind: "text", text: "Sure! Uploading now via the app.", time: "9:26 AM", status: "read" },
  { id: "m3", from: "me", kind: "doc", name: "Salary-Mar.pdf", size: "186 KB", time: "9:27 AM", status: "read" },
  { id: "m4", from: "them", kind: "voice", duration: "0:18", waveform: [4, 8, 14, 10, 18, 22, 16, 12, 20, 14, 9, 16, 22, 18, 12, 8, 14, 10, 6, 4], time: "9:30 AM" },
  { id: "m5", from: "them", kind: "text", text: "Got it. Will finalize your computation by EOD ✨", time: "9:31 AM", reactions: ["👍", "🙏"] },
];

const QUICK_REPLIES = ["Thanks!", "On it 👍", "Will check & revert", "Sharing now", "Got it ✨"];
const EMOJIS = ["😀", "😂", "❤️", "👍", "🙏", "🎉", "🔥", "💯", "✨", "👏", "🤝", "💼"];
const REACTIONS = ["❤️", "👍", "😂", "😮", "😢", "🙏"];

export const ChatScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [reactingTo, setReactingTo] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const recordTimer = useRef<number | null>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (recording) {
      recordTimer.current = window.setInterval(() => setRecordTime((t) => t + 1), 1000);
    } else {
      if (recordTimer.current) clearInterval(recordTimer.current);
      setRecordTime(0);
    }
    return () => {
      if (recordTimer.current) clearInterval(recordTimer.current);
    };
  }, [recording]);

  const nowTime = () =>
    new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const id = `m${Date.now()}`;
    setMessages((m) => [
      ...m,
      { id, from: "me", kind: "text", text, time: nowTime(), status: "sent", replyTo: replyTo?.id },
    ]);
    setInput("");
    setReplyTo(null);
    setShowEmoji(false);
    setTimeout(() => {
      setMessages((m) => m.map((x) => (x.id === id ? ({ ...x, status: "delivered" } as Message) : x)));
    }, 600);
    setTimeout(() => {
      setMessages((m) => m.map((x) => (x.id === id ? ({ ...x, status: "read" } as Message) : x)));
      setTyping(true);
    }, 1400);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: `r${Date.now()}`,
          from: "them",
          kind: "text",
          text: "Noted Priya — I'll get back shortly 👍",
          time: nowTime(),
        },
      ]);
    }, 3200);
  };

  const stopRecording = (cancel = false) => {
    const seconds = recordTime;
    setRecording(false);
    if (cancel || seconds < 1) return;
    const mm = Math.floor(seconds / 60);
    const ss = String(seconds % 60).padStart(2, "0");
    const waveform = Array.from({ length: 22 }, () => Math.round(4 + Math.random() * 20));
    setMessages((m) => [
      ...m,
      {
        id: `v${Date.now()}`,
        from: "me",
        kind: "voice",
        duration: `${mm}:${ss}`,
        waveform,
        time: nowTime(),
        status: "sent",
      },
    ]);
  };

  const addReaction = (msgId: string, emoji: string) => {
    setMessages((m) =>
      m.map((x) => {
        if (x.id !== msgId || x.kind === "system") return x;
        const reactions = "reactions" in x && x.reactions ? x.reactions : [];
        const next = reactions.includes(emoji)
          ? reactions.filter((r) => r !== emoji)
          : [...reactions, emoji];
        return { ...x, reactions: next } as Message;
      }),
    );
    setReactingTo(null);
  };

  const handleAttach = (kind: "doc" | "image" | "location") => {
    setShowAttach(false);
    if (kind === "doc") {
      setMessages((m) => [
        ...m,
        { id: `d${Date.now()}`, from: "me", kind: "doc", name: "Form-16.pdf", size: "240 KB", time: nowTime(), status: "sent" },
      ]);
    } else if (kind === "image") {
      setMessages((m) => [
        ...m,
        { id: `i${Date.now()}`, from: "me", kind: "image", caption: "Receipt scan", time: nowTime(), status: "sent" },
      ]);
    } else {
      setMessages((m) => [
        ...m,
        { id: `t${Date.now()}`, from: "me", kind: "text", text: "📍 Sharing my location", time: nowTime(), status: "sent" },
      ]);
    }
  };

  const Tick = ({ status }: { status?: Status }) => {
    if (!status) return null;
    return <CheckCheck className={`h-3 w-3 ${status === "read" ? "tick-read" : "text-foreground/55"}`} />;
  };

  const replyPreviewText = (id?: string) => {
    if (!id) return null;
    const target = messages.find((x) => x.id === id);
    if (!target || target.kind === "system") return null;
    if (target.kind === "text") return target.text;
    if (target.kind === "doc") return `📄 ${target.name}`;
    if (target.kind === "voice") return `🎙 Voice · ${target.duration}`;
    return "📷 Photo";
  };

  return (
    <div className="relative h-full flex flex-col aurora-bg overflow-hidden">
      {/* Masthead — newsroom dispatch */}
      <div className="px-3 pt-3 pb-2.5 flex items-center gap-2 hairline-bottom shrink-0 bg-surface">
        <button
          onClick={() => onNavigate?.("chatList")}
          className="w-9 h-9 rounded-md ledger-tile flex items-center justify-center active:scale-95 transition shrink-0"
          aria-label="Back"
        >
          <ChevronLeft className="h-4 w-4 text-foreground" strokeWidth={1.8} />
        </button>
        <button onClick={() => onNavigate?.("profile")} className="relative shrink-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-display text-[12px] font-bold text-primary-foreground"
            style={{ background: "hsl(var(--primary))" }}
          >
            RM
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-background" />
        </button>
        <button onClick={() => onNavigate?.("profile")} className="relative flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1.5">
            <p className="font-display text-[14px] font-bold text-foreground truncate">
              Rajeev Menon
            </p>
            <span
              className="font-mono text-[7.5px] font-bold uppercase tracking-[0.16em] px-1.5 py-0.5 rounded text-primary-foreground"
              style={{ background: "hsl(var(--primary))" }}
            >
              CA
            </span>
          </div>
          <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1 mt-0.5">
            {typing ? (
              <>
                <span className="inline-flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-primary animate-typing-dot" />
                  <span className="w-1 h-1 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-1 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "300ms" }} />
                </span>
                Typing…
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Active · E2E
              </>
            )}
          </p>
        </button>
        {[
          { Icon: Video, label: "Video", action: () => toast("Video call ringing Rajeev…", { description: "Connecting secure line · E2E" }) },
          { Icon: Phone, label: "Call", action: () => toast("Calling Rajeev Menon…", { description: "+91 98XXX XXX21 · Voice" }) },
          { Icon: MoreVertical, label: "More", action: () => toast("Chat options", { description: "Mute · Archive · Search · Clear" }) },
        ].map(({ Icon, action, label }) => (
          <button
            key={label}
            onClick={action}
            aria-label={label}
            className="w-9 h-9 rounded-md ledger-tile flex items-center justify-center active:scale-95 shrink-0 hover:border-primary/40 transition"
          >
            <Icon className="h-3.5 w-3.5 text-foreground" strokeWidth={1.8} />
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto no-scrollbar px-3 pt-4 pb-2 space-y-2"
        onClick={() => {
          setReactingTo(null);
          setShowEmoji(false);
        }}
      >
        {messages.map((m) => {
          if (m.kind === "system") {
            return (
              <div key={m.id} className="text-center my-3">
                <span className="text-[9px] text-muted-foreground glass px-3 py-1 rounded-full font-mono uppercase tracking-wider">
                  {m.text}
                </span>
              </div>
            );
          }

          const isMe = m.from === "me";
          const meStyle = isMe
            ? {
                background: "hsl(var(--primary))",
                boxShadow: "0 4px 14px -4px hsl(var(--primary) / 0.45)",
              }
            : undefined;
          const bubbleCls = isMe
            ? "text-primary-foreground rounded-md rounded-br-sm ml-auto"
            : "ledger-tile text-foreground rounded-md rounded-bl-sm";

          const replyText = m.kind === "text" ? replyPreviewText(m.replyTo) : null;

          return (
            <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"} gap-1.5 relative`}>
              {!isMe && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-primary-foreground shrink-0 self-end"
                  style={{ background: "var(--gradient-violet)" }}
                >
                  RM
                </div>
              )}
              <div className="relative max-w-[78%]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setReactingTo(m.id);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setReactingTo(m.id);
                  }}
                  style={meStyle}
                  className={`${bubbleCls} ${m.kind === "text" ? "px-3 py-2" : "p-2"} cursor-pointer`}
                >
                  {replyText && (
                    <div
                      className="mb-1.5 px-2 py-1 rounded-lg border-l-2 text-[10px] leading-snug truncate"
                      style={{
                        background: isMe ? "hsl(220 30% 96% / 0.18)" : "hsl(220 30% 96% / 0.06)",
                        borderColor: isMe ? "hsl(220 30% 96% / 0.6)" : "hsl(258 90% 70%)",
                        color: isMe ? "hsl(220 30% 96% / 0.9)" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      <span className="font-semibold">↩ Reply</span> · {replyText}
                    </div>
                  )}

                  {m.kind === "text" && <p className="text-[11.5px] leading-snug whitespace-pre-wrap break-words">{m.text}</p>}

                  {m.kind === "doc" && (
                    <button
                      onClick={() => onNavigate?.("documents")}
                      className={`rounded-xl p-2 flex items-center gap-2 min-w-[180px] active:scale-95 transition`}
                      style={{
                        background: isMe ? "hsl(220 30% 96% / 0.18)" : "hsl(220 30% 96% / 0.05)",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: isMe ? "hsl(220 30% 96% / 0.25)" : "var(--gradient-aurora)",
                        }}
                      >
                        <FileText className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className={`text-[11px] font-semibold truncate ${isMe ? "text-primary-foreground" : "text-foreground"}`}>
                          {m.name}
                        </p>
                        <p className={`text-[9px] ${isMe ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          PDF · {m.size}
                        </p>
                      </div>
                    </button>
                  )}

                  {m.kind === "image" && (
                    <div className="rounded-xl overflow-hidden min-w-[200px]">
                      <div
                        className="w-full h-36 flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, hsl(258 60% 30%), hsl(195 70% 35%), hsl(152 60% 35%))",
                        }}
                      >
                        <ImageIcon className="h-10 w-10 text-foreground/60" />
                      </div>
                      {m.caption && (
                        <p className={`text-[11px] mt-1.5 px-1 ${isMe ? "text-primary-foreground" : "text-foreground"}`}>
                          {m.caption}
                        </p>
                      )}
                    </div>
                  )}

                  {m.kind === "voice" && (
                    <div className="flex items-center gap-2 px-1 py-0.5 min-w-[210px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingId(playingId === m.id ? null : m.id);
                        }}
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 active:scale-95"
                        style={{
                          background: isMe ? "hsl(220 30% 96% / 0.25)" : "var(--gradient-aurora)",
                        }}
                      >
                        {playingId === m.id ? (
                          <Pause className="h-3.5 w-3.5 text-primary-foreground" fill="currentColor" />
                        ) : (
                          <Play className="h-3.5 w-3.5 text-primary-foreground" fill="currentColor" />
                        )}
                      </button>
                      <div className="flex items-center gap-[2px] h-6 flex-1">
                        {m.waveform.map((h, i) => (
                          <motion.div
                            key={i}
                            animate={
                              playingId === m.id
                                ? { scaleY: [1, 1.4, 0.8, 1] }
                                : { scaleY: 1 }
                            }
                            transition={{
                              duration: 0.6,
                              repeat: playingId === m.id ? Infinity : 0,
                              delay: i * 0.04,
                            }}
                            className="w-[2.5px] rounded-full"
                            style={{
                              height: `${h}px`,
                              background: isMe
                                ? "hsl(220 30% 96% / 0.85)"
                                : "hsl(195 95% 60% / 0.85)",
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-[10px] font-mono ${
                          isMe ? "text-primary-foreground/85" : "text-muted-foreground"
                        }`}
                      >
                        {m.duration}
                      </span>
                    </div>
                  )}

                  <div className={`flex items-center justify-end gap-1 mt-1 ${m.kind === "text" ? "" : "px-1"}`}>
                    <span className={`text-[9px] ${isMe ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                      {m.time}
                    </span>
                    {isMe && <Tick status={m.status} />}
                  </div>
                </motion.div>

                {/* Reactions */}
                {"reactions" in m && m.reactions && m.reactions.length > 0 && (
                  <div
                    className={`absolute -bottom-2 ${isMe ? "right-2" : "left-2"} flex items-center gap-0.5 glass-strong rounded-full px-1.5 py-0.5 shadow`}
                  >
                    {m.reactions.map((r, i) => (
                      <span key={i} className="text-[10px]">{r}</span>
                    ))}
                  </div>
                )}

                {/* Reaction picker */}
                <AnimatePresence>
                  {reactingTo === m.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.85 }}
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute -top-12 ${isMe ? "right-0" : "left-0"} glass-strong rounded-full px-2 py-1.5 flex items-center gap-1 z-20 shadow-glow`}
                    >
                      {REACTIONS.map((r) => (
                        <button
                          key={r}
                          onClick={() => addReaction(m.id, r)}
                          className="text-base hover:scale-125 transition active:scale-95"
                        >
                          {r}
                        </button>
                      ))}
                      <span className="w-px h-4 bg-border mx-0.5" />
                      <button
                        onClick={() => {
                          setReplyTo(m);
                          setReactingTo(null);
                        }}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-foreground/10 active:scale-95"
                      >
                        <Reply className="h-3 w-3 text-foreground" />
                      </button>
                      {m.kind === "text" && (
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(m.text);
                            setReactingTo(null);
                          }}
                          className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-foreground/10 active:scale-95"
                        >
                          <Copy className="h-3 w-3 text-foreground" />
                        </button>
                      )}
                      {isMe && (
                        <button
                          onClick={() => {
                            setMessages((all) => all.filter((x) => x.id !== m.id));
                            setReactingTo(null);
                          }}
                          className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-danger/20 active:scale-95"
                        >
                          <Trash2 className="h-3 w-3 text-danger" />
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}

        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start gap-1.5"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-primary-foreground self-end"
              style={{ background: "var(--gradient-violet)" }}
            >
              RM
            </div>
            <div className="glass rounded-2xl rounded-bl-sm px-3 py-2.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-typing-dot" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "200ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "400ms" }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Reply preview */}
      <AnimatePresence>
        {replyTo && replyTo.kind !== "system" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 overflow-hidden"
          >
            <div
              className="glass-strong rounded-xl px-3 py-2 flex items-center gap-2 border-l-2"
              style={{ borderColor: "hsl(258 90% 70%)" }}
            >
              <Reply className="h-3.5 w-3.5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-primary">
                  Replying to {replyTo.from === "me" ? "yourself" : "Rajeev"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {replyPreviewText(replyTo.id)}
                </p>
              </div>
              <button
                onClick={() => setReplyTo(null)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-foreground/10 active:scale-95"
              >
                <X className="h-3 w-3 text-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick replies */}
      {!recording && (
        <div className="px-3 pb-2 pt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <Sparkles className="h-3 w-3 text-primary shrink-0" />
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="shrink-0 text-[10px] px-2.5 py-1 rounded-full glass text-foreground active:scale-95 transition font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Attach panel */}
      <AnimatePresence>
        {showAttach && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-2 overflow-hidden"
          >
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Document", icon: FileText, color: "primary", action: () => handleAttach("doc") },
                { label: "Camera", icon: Camera, color: "secondary", action: () => onNavigate?.("upload") },
                { label: "Photo", icon: ImageIcon, color: "info", action: () => handleAttach("image") },
                { label: "Location", icon: MapPin, color: "warning", action: () => handleAttach("location") },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={a.action}
                  className="flex flex-col items-center gap-1 p-2 rounded-2xl glass active:scale-95 transition"
                >
                  <div className={`w-10 h-10 rounded-xl bg-${a.color}/15 flex items-center justify-center`}>
                    <a.icon className={`h-4 w-4 text-${a.color}`} />
                  </div>
                  <span className="text-[9px] font-semibold text-foreground">{a.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji panel */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-2 overflow-hidden"
          >
            <div className="glass rounded-2xl p-3 grid grid-cols-6 gap-1">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setInput((v) => v + e)}
                  className="h-9 rounded-lg text-xl hover:bg-foreground/10 active:scale-90 transition"
                >
                  {e}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Composer */}
      <div className="px-2 pt-2 pb-3 border-t border-border glass-strong flex items-end gap-1.5 shrink-0">
        {recording ? (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 h-10 rounded-3xl glass flex items-center justify-between px-3"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex w-2.5 h-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-danger opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-danger" />
              </span>
              <span className="text-[11px] font-mono font-bold text-foreground">
                {`${Math.floor(recordTime / 60)}:${String(recordTime % 60).padStart(2, "0")}`}
              </span>
              <span className="text-[10px] text-muted-foreground">Recording…</span>
            </div>
            <button
              onClick={() => stopRecording(true)}
              className="text-[10px] text-danger font-bold active:scale-95"
            >
              Cancel
            </button>
          </motion.div>
        ) : (
          <>
            <button
              onClick={() => {
                setShowAttach((v) => !v);
                setShowEmoji(false);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition shrink-0 ${
                showAttach ? "rotate-45" : ""
              }`}
              style={{
                background: showAttach ? "var(--gradient-aurora)" : "hsl(234 25% 18%)",
                color: showAttach ? "hsl(240 40% 6%)" : "hsl(220 15% 65%)",
              }}
              aria-label="Attach"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div className="flex-1 min-h-[40px] rounded-3xl bg-muted/60 border border-border flex items-center px-2 gap-1.5">
              <button
                onClick={() => {
                  setShowEmoji((v) => !v);
                  setShowAttach(false);
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center active:scale-95 transition ${
                  showEmoji ? "text-primary" : "text-muted-foreground"
                }`}
                aria-label="Emoji"
              >
                <Smile className="h-4 w-4" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                onFocus={() => {
                  setShowEmoji(false);
                  setShowAttach(false);
                }}
                placeholder="Message Rajeev…"
                className="flex-1 bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground outline-none py-2"
              />
              <button
                onClick={() => onNavigate?.("upload")}
                className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground active:scale-95"
                aria-label="Camera"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
        <button
          onClick={() => {
            if (recording) {
              stopRecording(false);
            } else if (input.trim()) {
              send();
            } else {
              setRecording(true);
            }
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition shrink-0 text-primary-foreground"
          style={{
            background: recording
              ? "linear-gradient(135deg, hsl(350 88% 60%), hsl(0 90% 60%))"
              : "var(--gradient-aurora)",
            boxShadow: recording
              ? "0 6px 20px -4px hsl(350 88% 50% / 0.6)"
              : "0 6px 20px -4px hsl(195 95% 50% / 0.55)",
          }}
          aria-label={recording ? "Send voice" : input.trim() ? "Send message" : "Record voice"}
        >
          {recording ? <Send className="h-4 w-4" /> : input.trim() ? <Send className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};
