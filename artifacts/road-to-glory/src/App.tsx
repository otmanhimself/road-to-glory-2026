import React, { useState, useRef } from "react";
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

const STEP_LABELS = ['', 'Group Stage', '3rd Place', 'Knockout'];

function StepIndicator({ phase }: { phase: 1 | 2 | 3 | 4 }) {
  if (phase === 1) return null;
  const steps = [
    { num: 1, label: 'Groups', phase: 2 },
    { num: 2, label: '3rd Place', phase: 3 },
    { num: 3, label: 'Knockout', phase: 4 },
  ];
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Progress bar */}
      <div className="h-0.5 w-full" style={{ background: 'rgba(212,175,55,0.1)' }}>
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, #D4AF37, #F0D060)' }}
          animate={{ width: phase === 2 ? '33%' : phase === 3 ? '66%' : '100%' }}
          transition={{ duration: 0.5 }}
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
                <span
                  className="text-[11px] font-bold tracking-wide"
                  style={{ color: isActive ? '#D4AF37' : isDone ? 'rgba(212,175,55,0.6)' : 'rgba(255,255,255,0.3)' }}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoadToGloryApp() {
  const [state, setState] = useState<BracketState>({
    username: "",
    phase: 1,
    groups: Object.keys(GROUPS).reduce((acc, groupId) => {
      acc[groupId] = { first: null, second: null, third: null };
      return acc;
    }, {} as BracketState["groups"]),
    selectedThirdPlace: [],
    knockout: initialKnockoutState,
  });

  const bracketRef = useRef<HTMLDivElement>(null);

  const handleStart = (username: string) => {
    setState(prev => ({ ...prev, username, phase: 2 }));
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
    setState(prev => ({ ...prev, phase: 3 }));
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
      setState(prev => ({
        ...prev,
        phase: 2,
        selectedThirdPlace: [],
        knockout: initialKnockoutState,
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const topPad = state.phase >= 2 ? 'pt-12 md:pt-20' : '';

  return (
    <div className={`min-h-[100dvh] bg-background text-foreground overflow-x-hidden ${topPad}`}>
      <StepIndicator phase={state.phase} />

      <AnimatePresence mode="wait">
        {state.phase === 1 && (
          <motion.div key="phase-1" exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <UsernameEntry onStart={handleStart} />
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
              {/* Hidden print header for image export */}
              <div className="text-center mb-6 px-4" style={{ display: 'none' }} aria-hidden>
                <h1 className="text-3xl font-black text-primary uppercase tracking-widest font-display">
                  Road to Glory 2026
                </h1>
                <p className="text-lg text-muted-foreground mt-1">@{state.username}'s Prediction</p>
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
