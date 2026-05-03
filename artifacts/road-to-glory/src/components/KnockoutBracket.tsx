import React, { useEffect, useRef, useState } from 'react';
import { BracketState } from '@/utils/bracket';
import { MatchBox } from './MatchBox';
import { Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KnockoutBracketProps {
  state: BracketState;
  onAdvanceTeam: (round: keyof BracketState['knockout'], matchIndex: number, team: string) => void;
}

interface Particle { id: number; x: number; color: string; duration: number; delay: number; size: number; }

function ChampionConfetti() {
  const [particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => {
    const colors = ['#D4AF37', '#F0D060', '#fff8dc', '#C0A030', '#FFE066', '#ffffff'];
    setParticles(Array.from({ length: 30 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: colors[i % colors.length],
      duration: 1.8 + Math.random() * 1.5,
      delay: Math.random() * 1.2,
      size: 5 + Math.random() * 7,
    })));
    const t = setTimeout(() => setParticles([]), 4500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div key={p.id} className="confetti-particle absolute bottom-0"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, background: p.color,
            animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
            borderRadius: p.id % 2 === 0 ? '50%' : '2px' }} />
      ))}
    </div>
  );
}

function RoundLabel({ label, matchCount }: { label: string; matchCount?: number }) {
  return (
    <div className="mb-3 px-2 py-1.5 rounded-lg text-center" style={{
      background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.14)',
    }}>
      <div className="text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: 'rgba(212,175,55,0.75)' }}>
        {label}
      </div>
      {matchCount !== undefined && (
        <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {matchCount} {matchCount === 1 ? 'match' : 'matches'}
        </div>
      )}
    </div>
  );
}

function ConnectorLines({ count, reverse = false }: { count: number; reverse?: boolean }) {
  return (
    <div className="flex flex-col justify-around flex-shrink-0 mt-10" style={{ width: 24, alignSelf: 'stretch' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-1 relative flex items-center">
          <div className="absolute inset-0 flex flex-col justify-around">
            <div style={{
              position: 'absolute', top: '25%', bottom: '25%',
              left: reverse ? undefined : 0, right: reverse ? 0 : undefined,
              width: '50%',
              borderTop: '1px solid rgba(212,175,55,0.2)',
              borderBottom: '1px solid rgba(212,175,55,0.2)',
              [reverse ? 'borderLeft' : 'borderRight']: '1px solid rgba(212,175,55,0.2)',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RoundColumn({
  label, matches, matchIds, onSelect, matchCount,
}: {
  label: string;
  matches: { team1: string; team2: string; winner: string | null }[];
  matchIds: string[];
  onSelect: (matchIndex: number, team: string) => void;
  matchCount?: number;
}) {
  return (
    <div className="flex flex-col flex-shrink-0" style={{ width: 164 }}>
      <RoundLabel label={label} matchCount={matchCount} />
      <div className="flex flex-col gap-3 flex-1 justify-around py-2">
        {matches.map((match, i) => (
          <MatchBox
            key={matchIds[i]}
            matchId={matchIds[i]}
            {...match}
            onSelect={(team) => onSelect(i, team)}
          />
        ))}
      </div>
    </div>
  );
}

export function KnockoutBracket({ state, onAdvanceTeam }: KnockoutBracketProps) {
  const {
    r32 = [],
    r16 = [],
    qf = [],
    sf = [],
    final = null,
    champion = null,
  } = state.knockout;
  const [showConfetti, setShowConfetti] = useState(false);
  const prevChampion = useRef<string | null>(null);

  useEffect(() => {
    if (champion && champion !== prevChampion.current) {
      setShowConfetti(true);
      prevChampion.current = champion;
      const t = setTimeout(() => setShowConfetti(false), 4500);
      return () => clearTimeout(t);
    }
  }, [champion]);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Title */}
      <div className="text-center pt-6 pb-2 px-4">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest font-display" style={{ color: '#D4AF37' }}>
          Knockout Stage
        </h2>
        <p className="text-xs text-muted-foreground mt-1 tracking-wide">
          Tap a team to advance them through the bracket
        </p>
      </div>

      {/* Scrollable bracket */}
      <div className="flex-1 overflow-x-auto overflow-y-visible px-3 pb-8">
        <div className="flex items-stretch gap-0 min-w-max mx-auto py-4" style={{ justifyContent: 'center' }}>

          {/* === LEFT SIDE === */}
          <RoundColumn
            label="Round of 32" matchCount={8}
            matches={r32.slice(0, 8)}
            matchIds={r32.slice(0, 8).map((_, i) => `r32-${i}`)}
            onSelect={(i, t) => onAdvanceTeam('r32', i, t)}
          />
          <ConnectorLines count={4} />
          <RoundColumn
            label="Round of 16" matchCount={4}
            matches={r16.slice(0, 4)}
            matchIds={r16.slice(0, 4).map((_, i) => `r16-${i}`)}
            onSelect={(i, t) => onAdvanceTeam('r16', i, t)}
          />
          <ConnectorLines count={2} />
          <RoundColumn
            label="Quarterfinals" matchCount={2}
            matches={qf.slice(0, 2)}
            matchIds={qf.slice(0, 2).map((_, i) => `qf-${i}`)}
            onSelect={(i, t) => onAdvanceTeam('qf', i, t)}
          />
          <ConnectorLines count={1} />
          <RoundColumn
            label="Semifinals" matchCount={1}
            matches={sf.slice(0, 1)}
            matchIds={['sf-0']}
            onSelect={(i, t) => onAdvanceTeam('sf', i, t)}
          />
          <ConnectorLines count={1} />

          {/* === CENTER: Final + Champion === */}
          <div className="flex flex-col items-center justify-center flex-shrink-0 gap-4" style={{ width: 196, marginTop: 40 }}>
            <div className="text-center mb-1">
              <div className="text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: 'rgba(212,175,55,0.75)' }}>
                Grand Final
              </div>
            </div>

            {/* Champion */}
            <AnimatePresence>
              {champion && (
                <motion.div
                  key="champion"
                  initial={{ scale: 0.6, opacity: 0, y: 16 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 16 }}
                  className="relative flex flex-col items-center text-center gap-2 px-4 py-4 rounded-2xl champion-glow w-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 100%)',
                    border: '1px solid rgba(212,175,55,0.5)',
                  }}
                >
                  {showConfetti && <ChampionConfetti />}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none spotlight"
                    style={{ background: 'radial-gradient(circle at 50% 20%, rgba(212,175,55,0.12) 0%, transparent 70%)' }} />
                  <Trophy className="w-9 h-9 trophy-float relative z-10"
                    style={{ color: '#D4AF37', filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.7))' }} />
                  <div className="relative z-10">
                    <div className="text-[9px] font-black tracking-[0.25em] uppercase mb-0.5" style={{ color: 'rgba(212,175,55,0.7)' }}>
                      World Champion
                    </div>
                    <div className="text-base font-black font-display leading-tight gold-shimmer-text">
                      {champion}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Final match */}
            {final && (
              <div className="relative w-full">
                <div className="absolute -inset-3 rounded-2xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)' }} />
                <MatchBox
                  matchId="final"
                  {...final}
                  isFinal
                  onSelect={(team) => onAdvanceTeam('final', 0, team)}
                />
              </div>
            )}
          </div>

          {/* === RIGHT SIDE (mirror) === */}
          <ConnectorLines count={1} reverse />
          <RoundColumn
            label="Semifinals" matchCount={1}
            matches={sf.slice(1, 2)}
            matchIds={['sf-1']}
            onSelect={(i, t) => onAdvanceTeam('sf', i + 1, t)}
          />
          <ConnectorLines count={1} reverse />
          <RoundColumn
            label="Quarterfinals" matchCount={2}
            matches={qf.slice(2, 4)}
            matchIds={qf.slice(2, 4).map((_, i) => `qf-${i + 2}`)}
            onSelect={(i, t) => onAdvanceTeam('qf', i + 2, t)}
          />
          <ConnectorLines count={2} reverse />
          <RoundColumn
            label="Round of 16" matchCount={4}
            matches={r16.slice(4, 8)}
            matchIds={r16.slice(4, 8).map((_, i) => `r16-${i + 4}`)}
            onSelect={(i, t) => onAdvanceTeam('r16', i + 4, t)}
          />
          <ConnectorLines count={4} reverse />
          <RoundColumn
            label="Round of 32" matchCount={8}
            matches={r32.slice(8, 16)}
            matchIds={r32.slice(8, 16).map((_, i) => `r32-${i + 8}`)}
            onSelect={(i, t) => onAdvanceTeam('r32', i + 8, t)}
          />

        </div>
      </div>
    </div>
  );
}
