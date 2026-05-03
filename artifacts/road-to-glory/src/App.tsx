import React, { useState, useRef } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

import { UsernameEntry } from "@/components/UsernameEntry";
import { GroupStage } from "@/components/GroupStage";
import { KnockoutBracket } from "@/components/KnockoutBracket";
import { ShareButtons } from "@/components/ShareButtons";
import { GROUPS } from "@/data/groups";
import { BracketState, initialKnockoutState, generateR16, updateKnockoutRounds } from "@/utils/bracket";

const queryClient = new QueryClient();

function RoadToGloryApp() {
  const [state, setState] = useState<BracketState>({
    username: "",
    phase: 1,
    groups: Object.keys(GROUPS).reduce((acc, groupId) => {
      acc[groupId] = { first: null, second: null };
      return acc;
    }, {} as BracketState["groups"]),
    knockout: initialKnockoutState,
  });

  const bracketRef = useRef<HTMLDivElement>(null);

  const handleStart = (username: string) => {
    setState((prev) => ({ ...prev, username, phase: 2 }));
  };

  const handleGroupSelect = (groupId: string, team: string) => {
    setState((prev) => {
      const group = prev.groups[groupId];
      let newGroup = { ...group };

      if (group.first === team) {
        newGroup.first = null;
      } else if (group.second === team) {
        newGroup.second = null;
      } else if (!group.first) {
        newGroup.first = team;
      } else if (!group.second) {
        newGroup.second = team;
      }

      return {
        ...prev,
        groups: {
          ...prev.groups,
          [groupId]: newGroup,
        },
      };
    });
  };

  const handleGenerateBracket = () => {
    const r16 = generateR16(state.groups);
    setState((prev) => ({
      ...prev,
      phase: 3,
      knockout: updateKnockoutRounds({
        ...initialKnockoutState,
        r16,
      }),
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdvanceTeam = (round: keyof BracketState['knockout'], matchIndex: number, team: string) => {
    if (!team) return;

    setState((prev) => {
      const newKnockout = { ...prev.knockout };
      
      if (round === 'final' || round === 'thirdPlace') {
        const match = newKnockout[round];
        if (match && (match.team1 === team || match.team2 === team)) {
          match.winner = team;
        }
      } else if (round === 'r16' || round === 'qf' || round === 'sf') {
        const roundArray = [...newKnockout[round]];
        const match = roundArray[matchIndex];
        if (match && (match.team1 === team || match.team2 === team)) {
          roundArray[matchIndex] = { ...match, winner: team };
          newKnockout[round] = roundArray as any;
        }
      }

      return {
        ...prev,
        knockout: updateKnockoutRounds(newKnockout),
      };
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to start over? Your predictions will be lost.")) {
      setState((prev) => ({
        ...prev,
        phase: 2,
        knockout: initialKnockoutState,
      }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      {/* Progress Bar */}
      {state.phase > 1 && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: state.phase === 2 ? '33%' : '66%' }}
            animate={{ width: state.phase === 2 ? '66%' : '100%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {state.phase === 1 && (
          <motion.div
            key="phase-1"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <UsernameEntry onStart={handleStart} />
          </motion.div>
        )}

        {state.phase === 2 && (
          <motion.div
            key="phase-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GroupStage 
              groups={state.groups} 
              onSelect={handleGroupSelect} 
              onGenerate={handleGenerateBracket} 
            />
          </motion.div>
        )}

        {state.phase === 3 && (
          <motion.div
            key="phase-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pb-24"
          >
            <div ref={bracketRef} className="bg-background pt-8 pb-4 px-4 min-w-max md:min-w-0">
              <div className="text-center mb-8 hidden print:block" style={{ display: 'none' }}>
                <h1 className="text-4xl font-black text-primary uppercase tracking-widest font-display">
                  Road to Glory 2026
                </h1>
                <p className="text-xl text-muted-foreground mt-2">@{state.username}'s Prediction</p>
              </div>
              <KnockoutBracket state={state} onAdvanceTeam={handleAdvanceTeam} />
            </div>
            
            <div className="max-w-4xl mx-auto px-4">
              <ShareButtons bracketRef={bracketRef} username={state.username} />
              
              <div className="text-center pb-12">
                <button
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-foreground underline underline-offset-4 font-bold text-sm transition-colors"
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
