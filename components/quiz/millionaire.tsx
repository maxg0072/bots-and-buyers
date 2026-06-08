"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Users, Phone, Check, X, Trophy, RotateCcw, Home } from "lucide-react";
import { LioMark } from "@/components/lio-logo";
import {
  Q_EASY,
  Q_MED,
  Q_HARD,
  LEVELS,
  SAFE,
  fmtPrize,
  QUIZ_T,
  type QuizQuestion,
  type Locale,
} from "@/lib/content/quiz";
import { saveQuizResult } from "@/app/(app)/millionaire/actions";
import { QuizLeaderboard } from "./quiz-leaderboard";
import type { QuizLeaderRow } from "@/lib/quiz";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D"];

/* ---- tiny Web-Audio helper (lazy, gesture-initialised) ---- */
function createAudio() {
  let ctx: AudioContext | null = null;
  const get = () => {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch {
        ctx = null;
      }
    }
    return ctx;
  };
  const tone = (f: number, d: number, type: OscillatorType = "sine", v = 0.06) => {
    const c = get();
    if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = f;
    g.gain.setValueAtTime(v, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d);
    o.connect(g);
    g.connect(c.destination);
    o.start();
    o.stop(c.currentTime + d);
  };
  return {
    resume: () => get()?.resume(),
    select: () => {
      tone(440, 0.08);
      tone(554, 0.06);
    },
    correct: () =>
      [0, 80, 160, 240, 320].forEach((dl, i) =>
        setTimeout(() => tone([523, 659, 784, 1047, 1319][i], 0.15 + i * 0.03), dl),
      ),
    wrong: () => tone(150, 0.5, "sawtooth", 0.08),
    levelUp: () =>
      [0, 60, 120].forEach((dl, i) =>
        setTimeout(() => tone([784, 988, 1175][i], 0.1, "sine", 0.05), dl),
      ),
  };
}

async function burst() {
  try {
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#DC9D09", "#659F9D", "#447279", "#BB9681", "#0A1624"],
    });
  } catch {
    /* no-op */
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRun(): QuizQuestion[] {
  return [
    ...shuffle(Q_EASY).slice(0, 5),
    ...shuffle(Q_MED).slice(0, 5),
    ...shuffle(Q_HARD).slice(0, 5),
  ];
}

type Phase = "intro" | "play" | "end";

export function Millionaire({
  initialLeaderboard,
  meId,
}: {
  initialLeaderboard: QuizLeaderRow[];
  meId?: string;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [locale, setLocale] = useState<Locale>("de");
  const [name, setName] = useState("");
  const [qs, setQs] = useState<QuizQuestion[]>([]);
  const [level, setLevel] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [hidden, setHidden] = useState<number[]>([]);
  const [poll, setPoll] = useState<number[] | null>(null);
  const [phoneMsg, setPhoneMsg] = useState<string | null>(null);
  const [lifelines, setLifelines] = useState({ fifty: true, audience: true, phone: true });
  const [result, setResult] = useState<"win" | "lose" | null>(null);

  const audio = useRef<ReturnType<typeof createAudio> | null>(null);
  const ladderRef = useRef<HTMLDivElement>(null);
  const t = (k: string) => QUIZ_T[locale][k] as string;
  const tArr = (k: string) => QUIZ_T[locale][k] as string[];

  useEffect(() => {
    ladderRef.current
      ?.querySelector('[data-current="true"]')
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [level, phase]);

  function start() {
    if (!audio.current) audio.current = createAudio();
    audio.current?.resume();
    setQs(pickRun());
    setLevel(0);
    setCorrectCount(0);
    resetQuestion();
    setResult(null);
    setLifelines({ fifty: true, audience: true, phone: true });
    setPhase("play");
  }

  function resetQuestion() {
    setSelected(null);
    setLocked(false);
    setRevealed(false);
    setHidden([]);
    setPoll(null);
    setPhoneMsg(null);
  }

  const finish = useCallback(
    (res: "win" | "lose", correct: number) => {
      const prize = res === "win" ? LEVELS[LEVELS.length - 1] : bankedPrize(correct);
      setResult(res);
      setPhase("end");
      void saveQuizResult({
        score: prize,
        levelReached: correct,
        correctCount: correct,
        totalAnswered: res === "win" ? 15 : correct + 1,
        locale,
      }).catch(() => {});
    },
    [locale],
  );

  function lockIn() {
    if (selected === null || locked) return;
    setLocked(true);
    const q = qs[level];
    setTimeout(() => {
      setRevealed(true);
      if (selected === q.c) {
        audio.current?.correct();
        const nextCorrect = correctCount + 1;
        setCorrectCount(nextCorrect);
        if (level === 14) {
          void burst();
          setTimeout(() => finish("win", 15), 1200);
        } else {
          audio.current?.levelUp();
          void burst();
          setTimeout(() => {
            setLevel((l) => l + 1);
            resetQuestion();
          }, 1400);
        }
      } else {
        audio.current?.wrong();
        setTimeout(() => finish("lose", correctCount), 1600);
      }
    }, 1100);
  }

  function useFifty() {
    if (!lifelines.fifty || revealed) return;
    const q = qs[level];
    const wrong = [0, 1, 2, 3].filter((i) => i !== q.c);
    const toHide = shuffle(wrong).slice(0, 2);
    setHidden(toHide);
    setLifelines((l) => ({ ...l, fifty: false }));
  }

  function useAudience() {
    if (!lifelines.audience || revealed) return;
    const q = qs[level];
    const base = [0, 0, 0, 0].map((_, i) => (hidden.includes(i) ? 0 : 5 + Math.random() * 10));
    base[q.c] += 45 + Math.random() * 20;
    const sum = base.reduce((a, b) => a + b, 0);
    setPoll(base.map((v) => Math.round((v / sum) * 100)));
    setLifelines((l) => ({ ...l, audience: false }));
  }

  function usePhone() {
    if (!lifelines.phone || revealed) return;
    const q = qs[level];
    const names = tArr("phone_names");
    const who = names[Math.floor(Math.random() * names.length)];
    // 80% confident in the correct answer
    const guess = Math.random() < 0.8 ? q.c : [0, 1, 2, 3].filter((i) => i !== q.c)[0];
    setPhoneMsg(`${who}: ${t("phone_pre")}${LETTERS[guess]}${t("phone_suf")}`);
    setLifelines((l) => ({ ...l, phone: false }));
  }

  /* -------------------------------- INTRO -------------------------------- */
  if (phase === "intro") {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center text-center" data-agent="p2s">
        <Host />
        <p className="lio-rise mt-5 max-w-xs text-sm italic leading-relaxed text-muted-foreground">
          {t("welcome")}
        </p>
        <h1 className="lio-rise lio-rise-1 mt-5 text-4xl leading-[1.05] text-foreground">
          Wer wird <span className="lio-mega">Millionär</span>
        </h1>

        <div className="lio-rise lio-rise-2 mt-7 w-full max-w-xs space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("name_ph")}
            className="h-11 w-full rounded-md border border-border bg-card px-4 text-center text-sm outline-none focus:border-agent"
          />
          <div className="flex justify-center gap-2">
            {(["de", "en"] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={cn(
                  "rounded-md border px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors",
                  locale === l ? "border-agent bg-agent/10 text-agent" : "border-border text-muted-foreground",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            onClick={start}
            className="h-12 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground transition-transform active:scale-[0.99]"
          >
            {t("start")}
          </button>
        </div>

        <div className="lio-rise lio-rise-3 mt-12 w-full max-w-sm">
          <QuizLeaderboard initial={initialLeaderboard} meId={meId} />
        </div>
      </div>
    );
  }

  /* --------------------------------- END --------------------------------- */
  if (phase === "end") {
    const won = result === "win";
    const prize = won ? LEVELS[LEVELS.length - 1] : bankedPrize(correctCount);
    const sub = won
      ? t("won_sub")
      : (prize > 0 ? t("lost_sub_safe") : t("lost_sub_zero")).replace("{amt}", fmtPrize(prize));
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center text-center" data-agent="p2s">
        <span className="lio-rise flex h-16 w-16 items-center justify-center rounded-full bg-agent/12 text-agent">
          <Trophy className="h-7 w-7" />
        </span>
        <p className="label-uppercase lio-rise lio-rise-1 mt-5 text-muted-foreground">
          {won ? t("won") : t("lost")}
        </p>
        <p className="display-num lio-rise lio-rise-1 mt-1 text-5xl text-agent">{fmtPrize(prize)}</p>
        <p className="lio-rise lio-rise-2 mt-3 text-sm text-muted-foreground">
          {correctCount} / 15 {locale === "de" ? "richtig" : "correct"}
        </p>
        <p className="lio-rise lio-rise-2 mt-4 max-w-xs text-sm italic leading-relaxed text-muted-foreground">
          {sub}
        </p>
        <div className="lio-rise lio-rise-3 mt-8 flex w-full max-w-xs flex-col gap-2">
          <button
            onClick={start}
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
          >
            <RotateCcw className="h-4 w-4" /> {t("play_again")}
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
        </div>

        <div className="lio-rise mt-10 w-full max-w-sm">
          <QuizLeaderboard initial={initialLeaderboard} meId={meId} />
        </div>
      </div>
    );
  }

  /* --------------------------------- PLAY -------------------------------- */
  const q = qs[level];
  const view = q[locale];

  return (
    <div className="space-y-5" data-agent="p2s">
      {/* prize ladder */}
      <div ref={ladderRef} className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 py-1">
        {LEVELS.map((amt, i) => {
          const isCurrent = i === level;
          const isPast = i < level;
          const isSafe = SAFE.includes(i);
          return (
            <span
              key={i}
              data-current={isCurrent}
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[0.65rem] font-medium tabular-nums transition-colors",
                isCurrent
                  ? "border-agent bg-agent text-agent-foreground"
                  : isPast
                    ? "border-agent/30 bg-agent/10 text-agent"
                    : "border-border text-muted-foreground",
              )}
            >
              {isSafe && <span className="text-[0.6rem]">★</span>}
              {fmtPrize(amt)}
            </span>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="label-uppercase text-muted-foreground">
          {locale === "de" ? "Frage" : "Question"} {level + 1} / 15
        </p>
        <p className="text-xs italic text-muted-foreground">{tArr("q_intro")[level]}</p>
      </div>

      {/* lifelines */}
      <div className="flex gap-2">
        <Lifeline label="50:50" active={lifelines.fifty} onClick={useFifty} disabled={revealed}>
          <span className="text-sm font-semibold">50:50</span>
        </Lifeline>
        <Lifeline label={t("aud_title")} active={lifelines.audience} onClick={useAudience} disabled={revealed}>
          <Users className="h-4 w-4" />
        </Lifeline>
        <Lifeline label="Phone" active={lifelines.phone} onClick={usePhone} disabled={revealed}>
          <Phone className="h-4 w-4" />
        </Lifeline>
      </div>

      {/* phone / audience output */}
      {phoneMsg && (
        <div className="lio-rise rounded-md border border-agent/30 bg-agent/8 px-4 py-3 text-sm italic text-foreground">
          {phoneMsg}
        </div>
      )}
      {poll && (
        <div className="lio-rise space-y-1.5 rounded-md border border-border bg-card p-3">
          {poll.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-4 text-xs text-muted-foreground">{LETTERS[i]}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-agent" style={{ width: `${p}%` }} />
              </div>
              <span className="display-num w-9 text-right text-xs tabular-nums text-foreground">{p}%</span>
            </div>
          ))}
        </div>
      )}

      {/* question */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-lio">
        <p className="text-lg leading-snug text-foreground">{view.q}</p>
      </div>

      {/* answers */}
      <div className="space-y-2.5">
        {view.a.map((ans, i) => {
          const isHidden = hidden.includes(i);
          const isSelected = selected === i;
          const isCorrect = revealed && i === q.c;
          const isWrong = revealed && isSelected && i !== q.c;
          return (
            <button
              key={i}
              disabled={isHidden || locked}
              onClick={() => {
                setSelected(i);
                audio.current?.select();
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-md border px-4 py-3.5 text-left transition-all",
                isHidden && "pointer-events-none opacity-25",
                isCorrect && "border-emerald-500 bg-emerald-500/10",
                isWrong && "border-destructive bg-destructive/10",
                !revealed && isSelected && "border-agent bg-agent/10",
                !revealed && !isSelected && "border-border bg-card hover:border-agent/40",
                revealed && !isCorrect && !isWrong && "border-border opacity-60",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  isCorrect && "border-emerald-500 bg-emerald-500 text-white",
                  isWrong && "border-destructive bg-destructive text-white",
                  !revealed && isSelected && "border-agent bg-agent text-agent-foreground",
                  !revealed && !isSelected && "border-border text-muted-foreground",
                  revealed && !isCorrect && !isWrong && "border-border text-muted-foreground",
                )}
              >
                {isCorrect ? <Check className="h-4 w-4" /> : isWrong ? <X className="h-4 w-4" /> : LETTERS[i]}
              </span>
              <span className={cn("text-sm leading-snug", isHidden && "invisible")}>{ans}</span>
            </button>
          );
        })}
      </div>

      {/* lock-in */}
      {!revealed && (
        <button
          onClick={lockIn}
          disabled={selected === null || locked}
          className={cn(
            "h-12 w-full rounded-md text-sm font-medium transition-all",
            selected === null || locked
              ? "bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground active:scale-[0.99]",
          )}
        >
          {locked
            ? locale === "de"
              ? "…"
              : "…"
            : locale === "de"
              ? "Loggen"
              : "Lock it in"}
        </button>
      )}
    </div>
  );
}

function bankedPrize(correct: number): number {
  let banked = 0;
  for (const s of SAFE) if (s <= correct - 1) banked = LEVELS[s];
  return banked;
}

function Lifeline({
  active,
  onClick,
  disabled,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!active || disabled}
      aria-label={label}
      className={cn(
        "flex h-11 flex-1 items-center justify-center rounded-md border transition-colors",
        active && !disabled
          ? "border-agent/40 bg-agent/8 text-agent hover:bg-agent/15"
          : "border-border text-muted-foreground line-through opacity-50",
      )}
    >
      {children}
    </button>
  );
}

function Host() {
  return (
    <span className="lio-rise flex h-20 w-20 items-center justify-center rounded-full border border-agent/30 bg-agent/10 text-agent">
      <LioMark className="h-9 w-9" />
    </span>
  );
}
