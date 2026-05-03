import React, { useState, useRef, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

import { UsernameEntry } from "@/components/UsernameEntry";
import { GroupStage } from "@/components/GroupStage";
import { ThirdPlaceSelection } from "@/components/ThirdPlaceSelection";
import { KnockoutBracket } from "@/components/KnockoutBracket";
import { ShareButtons } from "@/components/ShareButtons";
import { GROUPS } from "@/data/groups";
import {
  BracketState,
  GroupSelection,
  initialKnockoutState,
  generateR32,
  updateKnockoutRounds,
} from "@/utils/bracket";

const queryClient = new QueryClient();

function getProgressPct(
  phase: number,
  groupsDone: number,
  thirdsDone: number,
  knockoutDone: number,
): number {
  if (phase <= 1) return 0;
  if (phase === 2) return (groupsDone / 12) * 33.33;
  if (phase === 3) return 33.33 + (thirdsDone / 8) * 33.33;
  // Phase 4: 31 total matches (16 r32 + 8 r16 + 4 qf + 2 sf + 1 final)
  return 66.67 + Math.min(knockoutDone / 31, 1) * 33.33;
}

interface StepIndicatorProps {
  phase: 1 | 2 | 3 | 4;
  groupsDone: number;
  thirdsDone: number;
  knockoutDone: number;
}

function StepIndicator({ phase, groupsDone, thirdsDone, knockoutDone }: StepIndicatorProps) {
  if (phase === 1) return null;

  const pct = getProgressPct(phase, groupsDone, thirdsDone, knockoutDone);

  const steps = [
    { num: 1, label: 'Groups', phase: 2 },
    { num: 2, label: '3rd Place', phase: 3 },
    { num: 3, label: 'Knockout', phase: 4 },
  ];

  // Sub-label shown on the active step
  const subLabel = (() => {
    if (phase === 2 && groupsDone > 0) return `${groupsDone}/12`;
    if (phase === 3 && thirdsDone > 0) return `${thirdsDone}/8`;
    if (phase === 4 && knockoutDone > 0) return `${knockoutDone}/31`;
    return null;
  })();

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Granular progress bar */}
      <div className="h-0.5 w-full" style={{ background: 'rgba(212,175,55,0.1)' }}>
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, #D4AF37, #F0D060)' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Step dots — only on md+ */}
      <div
        className="hidden md:flex items-center justify-center gap-8 py-2"
        style={{ background: 'rgba(10,9,15,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(212,175,55,0.08)' }}
      >
        {steps.map((step, i) => {
          const isActive = phase === step.phase;
          const isDone = phase > step.phase;
          return (
            <div key={step.num} className="flex items-center gap-2">
              {i > 0 && (
                <div className="w-12 h-px" style={{ background: isDone || isActive ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)' }} />
              )}
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-400"
                  style={{
                    background: isDone
                      ? '#D4AF37'
                      : isActive
                      ? 'rgba(212,175,55,0.2)'
                      : 'rgba(255,255,255,0.06)',
                    border: isActive || isDone ? '1px solid rgba(212,175,55,0.6)' : '1px solid rgba(255,255,255,0.1)',
                    color: isDone ? '#0a0808' : isActive ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {isDone ? '✓' : step.num}
                </div>
                <div className="flex flex-col items-start leading-none gap-0.5">
                  <span
                    className="text-[11px] font-bold tracking-wide"
                    style={{ color: isActive ? '#D4AF37' : isDone ? 'rgba(212,175,55,0.6)' : 'rgba(255,255,255,0.3)' }}
                  >
                    {step.label}
                  </span>
                  {isActive && subLabel && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[9px] font-semibold"
                      style={{ color: 'rgba(212,175,55,0.45)' }}
                    >
                      {subLabel}
                    </motion.span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const STORAGE_KEY = 'rtg2026-bracket-v1';

const defaultState = (): BracketState => ({
  username: "",
  phase: 1,
  groups: Object.keys(GROUPS).reduce((acc, groupId) => {
    acc[groupId] = { first: null, second: null, third: null };
    return acc;
  }, {} as BracketState["groups"]),
  selectedThirdPlace: [],
  knockout: initialKnockoutState,
});

// Returns the saved state if it contains meaningful progress, otherwise null
const loadSavedProgress = (): BracketState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BracketState;
    if (!parsed.phase || !parsed.groups || !parsed.knockout) return null;
    const hasProgress =
      parsed.phase > 1 ||
      Object.values(parsed.groups).some(g => g.first !== null);
    return hasProgress ? parsed : null;
  } catch {
    return null;
  }
};

function RoadToGloryApp() {
  // Always start at the landing screen (phase 1) so the resume choice is shown
  const [state, setState] = useState<BracketState>(defaultState);

  // Saved progress snapshot — captured once on mount, never changes after
  const [savedProgress] = useState<BracketState | null>(loadSavedProgress);

  // Persist every state change to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage quota exceeded or unavailable — silently ignore
    }
  }, [state]);

  const bracketRef = useRef<HTMLDivElement>(null);

  const handleStart = (username: string) => {
    setState(prev => ({ ...prev, username, phase: 2 }));
  };

  // Restore the saved bracket exactly where the user left off
  const handleResume = () => {
    if (savedProgress) setState(savedProgress);
  };

  // Wipe storage and go to the username form as a fresh start
  const handleStartFresh = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setState(defaultState());
  };

  const handleGroupSelect = (groupId: string, team: string) => {
    setState(prev => {
      const group = prev.groups[groupId];
      let g: GroupSelection = { ...group };

      if (g.first === team) {
        g.first = null;
      } else if (g.second === team) {
        g.second = null;
      } else if (g.third === team) {
        g.third = null;
      } else if (!g.first) {
        g.first = team;
      } else if (!g.second) {
        g.second = team;
      } else if (!g.third) {
        g.third = team;
      }

      return { ...prev, groups: { ...prev.groups, [groupId]: g } };
    });
  };

  const handleGoToThirdPlace = () => {
    setState(prev => {
      // Get the exact set of teams the user picked as 3rd place, in A→L order
      const validThirds = new Set(
        ['A','B','C','D','E','F','G','H','I','J','K','L']
          .map(id => prev.groups[id]?.third)
          .filter((t): t is string => !!t)
      );
      // Keep only previously selected teams that are still valid 3rd-place picks
      const sanitized = prev.selectedThirdPlace.filter(t => validThirds.has(t));
      return { ...prev, phase: 3, selectedThirdPlace: sanitized };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleThirdPlace = (team: string) => {
    setState(prev => {
      const already = prev.selectedThirdPlace.includes(team);
      if (already) {
        return { ...prev, selectedThirdPlace: prev.selectedThirdPlace.filter(t => t !== team) };
      }
      if (prev.selectedThirdPlace.length >= 8) return prev;
      return { ...prev, selectedThirdPlace: [...prev.selectedThirdPlace, team] };
    });
  };

  const handleGenerateBracket = () => {
    const r32 = generateR32(state.groups, state.selectedThirdPlace);
    setState(prev => ({
      ...prev,
      phase: 4,
      knockout: updateKnockoutRounds({ ...initialKnockoutState, r32 }),
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdvanceTeam = (
    round: keyof BracketState['knockout'],
    matchIndex: number,
    team: string
  ) => {
    if (!team) return;
    setState(prev => {
      const newKnockout = { ...prev.knockout };

      if (round === 'final') {
        const match = newKnockout.final;
        if (match && (match.team1 === team || match.team2 === team)) {
          newKnockout.final = { ...match, winner: team };
        }
      } else if (round === 'r32' || round === 'r16' || round === 'qf' || round === 'sf') {
        const arr = [...newKnockout[round]] as typeof newKnockout[typeof round];
        const match = arr[matchIndex];
        if (match && (match.team1 === team || match.team2 === team)) {
          (arr as any)[matchIndex] = { ...match, winner: team };
          (newKnockout as any)[round] = arr;
        }
      }

      return { ...prev, knockout: updateKnockoutRounds(newKnockout) };
    });
  };

  const handleReset = () => {
    if (window.confirm("Start over? Your predictions will be lost.")) {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      setState(defaultState());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const topPad = state.phase >= 2 ? 'pt-12 md:pt-20' : '';

  return (
    <div className={`min-h-[100dvh] bg-background text-foreground overflow-x-hidden ${topPad}`}>
      <StepIndicator
        phase={state.phase}
        groupsDone={Object.values(state.groups).filter(g => g.first && g.second && g.third).length}
        thirdsDone={state.selectedThirdPlace.length}
        knockoutDone={
          [...state.knockout.r32, ...state.knockout.r16, ...state.knockout.qf, ...state.knockout.sf]
            .filter(m => m.winner).length + (state.knockout.champion ? 1 : 0)
        }
      />

      <AnimatePresence mode="wait">
        {state.phase === 1 && (
          <motion.div key="phase-1" exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <UsernameEntry
              onStart={handleStart}
              savedProgress={savedProgress ? {
                username: savedProgress.username,
                phase: savedProgress.phase,
                groupsDone: Object.values(savedProgress.groups).filter(
                  g => g.first && g.second && g.third
                ).length,
              } : undefined}
              onResume={handleResume}
              onStartFresh={handleStartFresh}
            />
          </motion.div>
        )}

        {state.phase === 2 && (
          <motion.div key="phase-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <GroupStage groups={state.groups} onSelect={handleGroupSelect} onGenerate={handleGoToThirdPlace} />
          </motion.div>
        )}

        {state.phase === 3 && (
          <motion.div key="phase-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <ThirdPlaceSelection
              groups={state.groups}
              selected={state.selectedThirdPlace}
              onToggle={handleToggleThirdPlace}
              onContinue={handleGenerateBracket}
            />
          </motion.div>
        )}

        {state.phase === 4 && (
          <motion.div key="phase-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pb-24"
          >
            <div ref={bracketRef} className="bg-background pt-4 pb-4 px-2 min-w-max md:min-w-0">
              {/* Print header — hidden normally, shown during image export */}
              <div
                data-print-header="true"
                className="text-center mb-4 px-4 py-4"
                style={{ display: 'none' }}
              >
                <h1
                  className="font-black uppercase tracking-widest font-display"
                  style={{ fontSize: 28, color: '#D4AF37' }}
                >
                  Road to Glory 2026
                </h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                  @{state.username}&apos;s World Cup Prediction
                </p>
              </div>
              <KnockoutBracket state={state} onAdvanceTeam={handleAdvanceTeam} />
            </div>

            <div className="max-w-4xl mx-auto px-4">
              <ShareButtons bracketRef={bracketRef} username={state.username} />
              <div className="text-center pb-12">
                <button
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-foreground underline underline-offset-4 text-sm transition-colors font-semibold"
                  data-testid="button-reset"
                >
                  Start Over
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RoadToGloryApp} />
      <Route component={() => (
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold">404 Not Found</h1>
        </div>
      )} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
