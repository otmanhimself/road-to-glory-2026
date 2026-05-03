import React, { useEffect, useRef, useState } from 'react';
import { BracketState } from '@/utils/bracket';
import { MatchBox } from './MatchBox';
import { Trophy, Medal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KnockoutBracketProps {
  state: BracketState;
  onAdvanceTeam: (round: keyof BracketState['knockout'], matchIndex: number, team: string) => void;
}

interface Particle {
  id: number;
  x: number;
  color: string;
  duration: number;
  delay: number;
  size: number;
}

function ChampionConfetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ['#D4AF37', '#F0D060', '#fff8dc', '#C0A030', '#FFE066', '#ffffff'];
    const generated: Particle[] = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 1.8 + Math.random() * 1.5,
      delay: Math.random() * 1.2,
      size: 5 + Math.random() * 7,
    }));
    setParticles(generated);
    const timer = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle absolute bottom-0"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function RoundLabel({ label }: { label: string }) {
  return (
    <div
      className="text-center mb-3 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase w-full"
      style={{
        background: 'rgba(212,175,55,0.07)',
        border: '1px solid rgba(212,175,55,0.15)',
        color: 'rgba(212,175,55,0.7)',
      }}
    >
      {label}
    </div>
  );
}

export function KnockoutBracket({ state, onAdvanceTeam }: KnockoutBracketProps) {
  const { r16, qf, sf, final, thirdPlace, champion } = state.knockout;
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

  const matchGap = 'gap-3';

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Title */}
      <div className="text-center pt-6 pb-4 px-4">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-widest font-display"
          style={{ color: '#D4AF37' }}
        >
          Knockout Stage
        </h2>
        <p className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">
          Click a team to advance them
        </p>
      </div>

      {/* Bracket — horizontally scrollable */}
      <div className="flex-1 overflow-x-auto pb-8 px-4">
        <div
          className="flex items-stretch justify-start md:justify-center gap-0 min-w-max"
          style={{ minHeight: '700px' }}
        >

          {/* ===== R16 LEFT (matches 0-5) ===== */}
          <div className="flex flex-col w-[172px]">
            <RoundLabel label="Round of 16" />
            <div className={`flex flex-col ${matchGap} flex-1 justify-around py-2`}>
              {r16.slice(0, 6).map((match, i) => (
                <MatchBox
                  key={`r16-l-${i}`}
                  matchId={`r16-${i}`}
                  {...match}
                  onSelect={(team) => onAdvanceTeam('r16', i, team)}
                />
              ))}
            </div>
          </div>

          {/* Connector: R16 left → QF left */}
          <BracketConnector count={6} pairTo={3} />

          {/* ===== QF LEFT (matches 0-2) ===== */}
          <div className="flex flex-col w-[172px]">
            <RoundLabel label="Quarterfinals" />
            <div className={`flex flex-col ${matchGap} flex-1 justify-around py-2`}>
              {qf.slice(0, 3).map((match, i) => (
                <MatchBox
                  key={`qf-l-${i}`}
                  matchId={`qf-${i}`}
                  {...match}
                  onSelect={(team) => onAdvanceTeam('qf', i, team)}
                />
              ))}
            </div>
          </div>

          {/* Connector: QF left → SF left */}
          <BracketConnector count={3} pairTo={2} />

          {/* ===== SF LEFT (matches 0-1) ===== */}
          <div className="flex flex-col w-[172px]">
            <RoundLabel label="Semifinals" />
            <div className={`flex flex-col ${matchGap} flex-1 justify-around py-2`}>
              {sf.slice(0, 2).map((match, i) => (
                <MatchBox
                  key={`sf-l-${i}`}
                  matchId={`sf-${i}`}
                  {...match}
                  onSelect={(team) => onAdvanceTeam('sf', i, team)}
                />
              ))}
            </div>
          </div>

          {/* Connector: SF left → Final */}
          <BracketConnector count={2} pairTo={1} slim />

          {/* ===== CENTER: Final + Champion ===== */}
          <div className="flex flex-col items-center justify-center w-[200px] gap-6">
            <RoundLabel label="Grand Final" />

            {/* Champion display */}
            <AnimatePresence>
              {champion && (
                <motion.div
                  key="champion"
                  initial={{ scale: 0.6, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  className="relative flex flex-col items-center text-center gap-3 px-4 py-5 rounded-2xl champion-glow"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)',
                    border: '1px solid rgba(212,175,55,0.5)',
                  }}
                >
                  {showConfetti && <ChampionConfetti />}
                  {/* Spotlight */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none spotlight"
                    style={{ background: 'radial-gradient(circle at 50% 20%, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
                  />
                  <Trophy
                    className="w-10 h-10 trophy-float relative z-10"
                    style={{ color: '#D4AF37', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.7))' }}
                  />
                  <div className="relative z-10">
                    <div
                      className="text-[9px] font-black tracking-[0.25em] uppercase mb-1"
                      style={{ color: 'rgba(212,175,55,0.7)' }}
                    >
                      World Champion
                    </div>
                    <div className="text-lg font-black font-display leading-tight gold-shimmer-text">
                      {champion}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Final match */}
            {final && (
              <div className="relative">
                <div
                  className="absolute -inset-3 rounded-2xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)' }}
                />
                <MatchBox
                  matchId="final"
                  {...final}
                  isFinal
                  onSelect={(team) => onAdvanceTeam('final', 0, team)}
                />
              </div>
            )}

            {/* 3rd place */}
            {thirdPlace && (thirdPlace.team1 || thirdPlace.team2) && (
              <div className="flex flex-col items-center gap-2 mt-2">
                <div
                  className="flex items-center gap-1.5 text-[9px] font-black tracking-widest uppercase"
                  style={{ color: 'rgba(180,180,190,0.6)' }}
                >
                  <Medal size={10} />
                  3rd Place
                </div>
                <MatchBox
                  matchId="thirdPlace"
                  {...thirdPlace}
                  label="3rd Place"
                  onSelect={(team) => onAdvanceTeam('thirdPlace', 0, team)}
                />
              </div>
            )}
          </div>

          {/* Connector: Final ← SF right */}
          <BracketConnector count={2} pairTo={1} slim reverse />

          {/* ===== SF RIGHT (match 2 only) ===== */}
          <div className="flex flex-col w-[172px]">
            <RoundLabel label="Semifinals" />
            <div className={`flex flex-col ${matchGap} flex-1 justify-around py-2`}>
              {sf.slice(2, 3).map((match, i) => (
                <MatchBox
                  key={`sf-r-${i}`}
                  matchId={`sf-${i + 2}`}
                  {...match}
                  onSelect={(team) => onAdvanceTeam('sf', i + 2, team)}
                />
              ))}
            </div>
          </div>

          {/* Connector: QF right → SF right */}
          <BracketConnector count={3} pairTo={2} reverse />

          {/* ===== QF RIGHT (matches 3-5) ===== */}
          <div className="flex flex-col w-[172px]">
            <RoundLabel label="Quarterfinals" />
            <div className={`flex flex-col ${matchGap} flex-1 justify-around py-2`}>
              {qf.slice(3, 6).map((match, i) => (
                <MatchBox
                  key={`qf-r-${i}`}
                  matchId={`qf-${i + 3}`}
                  {...match}
                  onSelect={(team) => onAdvanceTeam('qf', i + 3, team)}
                />
              ))}
            </div>
          </div>

          {/* Connector: R16 right → QF right */}
          <BracketConnector count={6} pairTo={3} reverse />

          {/* ===== R16 RIGHT (matches 6-11) ===== */}
          <div className="flex flex-col w-[172px]">
            <RoundLabel label="Round of 16" />
            <div className={`flex flex-col ${matchGap} flex-1 justify-around py-2`}>
              {r16.slice(6, 12).map((match, i) => (
                <MatchBox
                  key={`r16-r-${i}`}
                  matchId={`r16-${i + 6}`}
                  {...match}
                  onSelect={(team) => onAdvanceTeam('r16', i + 6, team)}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function BracketConnector({
  count,
  pairTo,
  slim = false,
  reverse = false,
}: {
  count: number;
  pairTo: number;
  slim?: boolean;
  reverse?: boolean;
}) {
  const width = slim ? 24 : 32;
  const pairs = Math.floor(count / pairTo);

  return (
    <div
      className="flex flex-col justify-around items-center flex-shrink-0 mt-10"
      style={{ width, alignSelf: 'stretch' }}
    >
      {Array.from({ length: pairs }).map((_, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col justify-center"
          style={{ maxHeight: `${100 / pairs}%` }}
        >
          <svg
            width={width}
            height="100%"
            style={{ display: 'block', overflow: 'visible' }}
            preserveAspectRatio="none"
          >
            {reverse ? (
              <path
                d={`M ${width} 25% L ${width / 2} 25% L ${width / 2} 75% L ${width} 75%`}
                stroke="rgba(212,175,55,0.2)"
                strokeWidth="1.5"
                fill="none"
              />
            ) : (
              <path
                d={`M 0 25% L ${width / 2} 25% L ${width / 2} 75% L 0 75%`}
                stroke="rgba(212,175,55,0.2)"
                strokeWidth="1.5"
                fill="none"
              />
            )}
          </svg>
        </div>
      ))}
    </div>
  );
}
