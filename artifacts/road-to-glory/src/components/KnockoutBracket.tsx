import React, { useEffect, useRef, useState } from 'react';
import { BracketState } from '@/utils/bracket';
import { MatchBox } from './MatchBox';
import { Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChampionReveal } from './ChampionReveal';

const SLOT_H = 96;
const TOTAL_H = 8 * SLOT_H; // 768px — total height of bracket
const MATCH_W = 152;
const FINAL_W = 172;
const CONN_W = 28;
const SF_CONN_W = 18;
const LABEL_H = 32;
const GOLD = 'rgba(212,175,55,0.45)';
const GOLD_WIN = 'rgba(212,175,55,0.85)';

interface KnockoutBracketProps {
  state: BracketState;
  onAdvanceTeam: (round: keyof BracketState['knockout'], matchIndex: number, team: string) => void;
}

interface Particle {
  id: number; x: number; color: string; duration: number; delay: number; size: number;
}

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
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: 16 }}>
      {particles.map(p => (
        <div key={p.id} className="confetti-particle absolute bottom-0"
          style={{
            left: `${p.x}%`, width: p.size, height: p.size, background: p.color,
            animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
            borderRadius: p.id % 2 === 0 ? '50%' : '2px',
          }} />
      ))}
    </div>
  );
}

// SVG connector between two rounds.
// fromCount = number of matches on the "from" side (e.g. 8 for R32→R16).
// Lines go left→right (normal) or right→left (reverse, for mirrored side).
function BracketConnector({
  fromCount, width, reverse = false,
}: {
  fromCount: number; width: number; reverse?: boolean;
}) {
  const fromSlotH = TOTAL_H / fromCount;
  const groupCount = Math.floor(fromCount / 2);
  const vx = width / 2;

  // fromCount=1 → SF to Final: just a horizontal line at the vertical center
  if (fromCount === 1) {
    const midY = TOTAL_H / 2;
    return (
      <svg width={width} height={TOTAL_H} style={{ display: 'block', flexShrink: 0 }}>
        <line
          x1={0} y1={midY} x2={width} y2={midY}
          stroke={GOLD} strokeWidth={1.5}
        />
      </svg>
    );
  }

  return (
    <svg width={width} height={TOTAL_H} style={{ display: 'block', flexShrink: 0, overflow: 'visible' }}>
      {Array.from({ length: groupCount }).map((_, i) => {
        const gTop = i * 2 * fromSlotH;
        const m0Y = gTop + fromSlotH / 2;
        const m1Y = gTop + 3 * fromSlotH / 2;
        const midY = gTop + fromSlotH;
        const inX = reverse ? width : 0;
        const outX = reverse ? 0 : width;
        return (
          <g key={i} stroke={GOLD} strokeWidth={1.5} fill="none">
            {/* Horizontal: match 0 → vertical bar */}
            <line x1={inX} y1={m0Y} x2={vx} y2={m0Y} />
            {/* Horizontal: match 1 → vertical bar */}
            <line x1={inX} y1={m1Y} x2={vx} y2={m1Y} />
            {/* Vertical bar connecting the pair */}
            <line x1={vx} y1={m0Y} x2={vx} y2={m1Y} />
            {/* Horizontal exit to next column at midpoint */}
            <line x1={vx} y1={midY} x2={outX} y2={midY} />
          </g>
        );
      })}
    </svg>
  );
}

// Round column header
function RoundLabel({ label, count }: { label: string; count?: number }) {
  return (
    <div
      style={{
        height: LABEL_H,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px',
        background: 'rgba(212,175,55,0.05)',
        border: '1px solid rgba(212,175,55,0.12)',
        borderRadius: 8,
        marginBottom: 2,
      }}
    >
      <div style={{
        fontSize: 9, fontWeight: 900, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'rgba(212,175,55,0.8)',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </div>
      {count !== undefined && (
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
          {count} {count === 1 ? 'match' : 'matches'}
        </div>
      )}
    </div>
  );
}

// A full round column with label on top and matches distributed via justify-around
function RoundColumn({
  label, count, matches, roundKey, onSelect, width = MATCH_W,
}: {
  label: string;
  count: number;
  matches: { team1: string; team2: string; winner: string | null }[];
  roundKey: string;
  onSelect: (i: number, t: string) => void;
  width?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, width }}>
      <RoundLabel label={label} count={count} />
      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-around', height: TOTAL_H,
      }}>
        {matches.map((match, i) => (
          <MatchBox
            key={`${roundKey}-${i}`}
            matchId={`${roundKey}-${i}`}
            {...match}
            width={width}
            onSelect={(t) => onSelect(i, t)}
          />
        ))}
      </div>
    </div>
  );
}

// Wrapper that vertically aligns a connector SVG with the round columns
function ConnectorCol({ children, width }: { children: React.ReactNode; width: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, width }}>
      <div style={{ height: LABEL_H + 2 }} />
      {children}
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
    return undefined;
  }, [champion]);

  const FINAL_COL_W = FINAL_W + 32;

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

      {/* Title */}
      <div className="text-center pt-6 pb-3 px-4">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest font-display"
          style={{ color: '#D4AF37' }}>
          Knockout Stage
        </h2>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Tap a team to advance them through the bracket
        </p>
      </div>

      {/* Horizontally scrollable bracket */}
      <div
        className="flex-1 overflow-x-auto overflow-y-visible"
        style={{ paddingLeft: 12, paddingRight: 12, paddingBottom: champion ? 0 : 40 }}
        data-bracket-scroll="true"
      >
        <div
          className="inline-flex items-start"
          style={{ gap: 0, paddingTop: 4, paddingBottom: 4 }}
          data-bracket-content="true"
        >

          {/* ──────── LEFT HALF ──────── */}

          {/* R32 Left (matches 0–7) */}
          <RoundColumn
            label="Round of 32" count={8}
            matches={r32.slice(0, 8)}
            roundKey="r32-l"
            onSelect={(i, t) => onAdvanceTeam('r32', i, t)}
          />
          <ConnectorCol width={CONN_W}>
            <BracketConnector fromCount={8} width={CONN_W} />
          </ConnectorCol>

          {/* R16 Left (matches 0–3) */}
          <RoundColumn
            label="Round of 16" count={4}
            matches={r16.slice(0, 4)}
            roundKey="r16-l"
            onSelect={(i, t) => onAdvanceTeam('r16', i, t)}
          />
          <ConnectorCol width={CONN_W}>
            <BracketConnector fromCount={4} width={CONN_W} />
          </ConnectorCol>

          {/* Quarterfinals Left (matches 0–1) */}
          <RoundColumn
            label="Quarterfinals" count={2}
            matches={qf.slice(0, 2)}
            roundKey="qf-l"
            onSelect={(i, t) => onAdvanceTeam('qf', i, t)}
          />
          <ConnectorCol width={CONN_W}>
            <BracketConnector fromCount={2} width={CONN_W} />
          </ConnectorCol>

          {/* Semifinals Left (match 0) */}
          <RoundColumn
            label="Semifinals" count={1}
            matches={sf.slice(0, 1)}
            roundKey="sf-l"
            onSelect={(i, t) => onAdvanceTeam('sf', i, t)}
          />
          <ConnectorCol width={SF_CONN_W}>
            <BracketConnector fromCount={1} width={SF_CONN_W} />
          </ConnectorCol>

          {/* ──────── CENTER: Final + Champion ──────── */}
          <div style={{
            display: 'flex', flexDirection: 'column', flexShrink: 0, width: FINAL_COL_W,
          }}>
            <RoundLabel label="Grand Final" />

            <div style={{
              height: TOTAL_H,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
              gap: 12, padding: '0 8px',
            }}>

              {/* Champion display */}
              <AnimatePresence>
                {champion && (
                  <motion.div
                    key="champion"
                    initial={{ scale: 0.7, opacity: 0, y: 12 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 16 }}
                    className="relative flex flex-col items-center text-center gap-2 px-4 py-4 rounded-2xl champion-glow w-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.06) 100%)',
                      border: '1px solid rgba(212,175,55,0.55)',
                    }}
                  >
                    {showConfetti && <ChampionConfetti />}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none spotlight"
                      style={{ background: 'radial-gradient(circle at 50% 20%, rgba(212,175,55,0.14) 0%, transparent 70%)' }} />
                    <Trophy
                      className="w-8 h-8 trophy-float relative z-10"
                      style={{ color: '#D4AF37', filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.8))' }}
                    />
                    <div className="relative z-10">
                      <div style={{
                        fontSize: 8, fontWeight: 900, letterSpacing: '0.25em',
                        textTransform: 'uppercase', color: 'rgba(212,175,55,0.75)', marginBottom: 3,
                      }}>
                        World Champion
                      </div>
                      <div className="font-black font-display gold-shimmer-text" style={{ fontSize: 14, lineHeight: 1.2 }}>
                        {champion}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Final match box */}
              {final && (
                <div style={{ position: 'relative', width: '100%' }}>
                  <div style={{
                    position: 'absolute', inset: -8, borderRadius: 20,
                    background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }} />
                  <MatchBox
                    matchId="final"
                    {...final}
                    isFinal
                    width={FINAL_W}
                    onSelect={(t) => onAdvanceTeam('final', 0, t)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ──────── RIGHT HALF (mirrored) ──────── */}

          <ConnectorCol width={SF_CONN_W}>
            <BracketConnector fromCount={1} width={SF_CONN_W} reverse />
          </ConnectorCol>

          {/* Semifinals Right (match 1) */}
          <RoundColumn
            label="Semifinals" count={1}
            matches={sf.slice(1, 2)}
            roundKey="sf-r"
            onSelect={(i, t) => onAdvanceTeam('sf', i + 1, t)}
          />
          <ConnectorCol width={CONN_W}>
            <BracketConnector fromCount={2} width={CONN_W} reverse />
          </ConnectorCol>

          {/* Quarterfinals Right (matches 2–3) */}
          <RoundColumn
            label="Quarterfinals" count={2}
            matches={qf.slice(2, 4)}
            roundKey="qf-r"
            onSelect={(i, t) => onAdvanceTeam('qf', i + 2, t)}
          />
          <ConnectorCol width={CONN_W}>
            <BracketConnector fromCount={4} width={CONN_W} reverse />
          </ConnectorCol>

          {/* R16 Right (matches 4–7) */}
          <RoundColumn
            label="Round of 16" count={4}
            matches={r16.slice(4, 8)}
            roundKey="r16-r"
            onSelect={(i, t) => onAdvanceTeam('r16', i + 4, t)}
          />
          <ConnectorCol width={CONN_W}>
            <BracketConnector fromCount={8} width={CONN_W} reverse />
          </ConnectorCol>

          {/* R32 Right (matches 8–15) */}
          <RoundColumn
            label="Round of 32" count={8}
            matches={r32.slice(8, 16)}
            roundKey="r32-r"
            onSelect={(i, t) => onAdvanceTeam('r32', i + 8, t)}
          />

        </div>
      </div>

      {/* Cinematic champion reveal — full-width section below the bracket */}
      <ChampionReveal champion={champion} />

    </div>
  );
}
