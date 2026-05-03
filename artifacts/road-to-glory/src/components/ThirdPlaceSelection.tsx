import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFlagUrl } from '@/data/groups';
import { GroupSelection } from '@/utils/bracket';
import { ChevronRight, Info } from 'lucide-react';

interface ThirdPlaceSelectionProps {
  groups: Record<string, GroupSelection>;
  selected: string[];
  onToggle: (team: string) => void;
  onContinue: () => void;
}

const REQUIRED = 8;

// Canonical group order A→L — never changes
const GROUP_ORDER = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const;

export function ThirdPlaceSelection({ groups, selected, onToggle, onContinue }: ThirdPlaceSelectionProps) {
  // Extract ONLY the user's actual third-place picks, in fixed A→L order
  const thirdPlaceTeams: { groupId: string; team: string }[] = GROUP_ORDER
    .map(groupId => ({ groupId: groupId as string, team: groups[groupId]?.third ?? null }))
    .filter((entry): entry is { groupId: string; team: string } => entry.team !== null);

  const count = selected.length;
  const isComplete = count === REQUIRED;

  return (
    <div className="min-h-[100dvh] flex flex-col pb-36">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 max-w-3xl mx-auto w-full text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-2"
          style={{
            background: 'rgba(180,110,50,0.15)',
            border: '1px solid rgba(200,130,60,0.35)',
            color: 'rgba(205,145,75,0.95)',
          }}
        >
          Step 2 of 3
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-2xl sm:text-3xl font-black uppercase tracking-widest font-display"
          style={{ color: '#D4AF37' }}
        >
          Best 3rd-Place Teams
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed"
        >
          Select the <span className="font-bold text-foreground">{REQUIRED} best</span> 3rd-place teams that will advance to the Round of 32
        </motion.p>

        {/* Info callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-start gap-2 text-left max-w-sm mx-auto mt-3 px-3 py-2.5 rounded-xl"
          style={{
            background: 'rgba(212,175,55,0.05)',
            border: '1px solid rgba(212,175,55,0.15)',
          }}
        >
          <Info size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'rgba(212,175,55,0.7)' }} />
          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(212,175,55,0.7)' }}>In the 2026 World Cup, 8 of the 12 third-place teams advance. You choose which ones qualify </p>
        </motion.div>
      </div>
      {/* Teams grid */}
      <div className="px-4 max-w-3xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {thirdPlaceTeams.map(({ groupId, team }, idx) => {
            const isSelected = selected.includes(team);
            const isMaxed = !isSelected && count >= REQUIRED;

            return (
              <motion.button
                key={team}
                onClick={() => !isMaxed && onToggle(team)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileTap={!isMaxed ? { scale: 0.97 } : {}}
                className="flex items-center gap-3 px-4 rounded-xl w-full text-left transition-all duration-250"
                style={{
                  minHeight: '60px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  background: isSelected
                    ? 'linear-gradient(90deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.06) 100%)'
                    : isMaxed
                    ? 'rgba(255,255,255,0.015)'
                    : 'rgba(255,255,255,0.03)',
                  border: isSelected
                    ? '1px solid rgba(212,175,55,0.5)'
                    : '1px solid rgba(255,255,255,0.07)',
                  borderLeft: isSelected ? '3px solid #D4AF37' : '3px solid transparent',
                  opacity: isMaxed ? 0.35 : 1,
                  cursor: isMaxed ? 'not-allowed' : 'pointer',
                  boxShadow: isSelected ? '0 0 16px rgba(212,175,55,0.1)' : 'none',
                }}
                data-testid={`button-third-${team.replace(/\s+/g, '-')}`}
              >
                {/* Group badge */}
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black"
                  style={{
                    background: isSelected ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)',
                    color: isSelected ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                    border: isSelected ? '1px solid rgba(212,175,55,0.35)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {groupId}
                </span>
                {/* Flag */}
                <img
                  src={getFlagUrl(team)}
                  alt={`${team} flag`}
                  className="w-9 h-6 object-cover rounded-sm flex-shrink-0"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                {/* Name */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className="font-semibold text-sm truncate"
                    style={{ color: isSelected ? '#F0D060' : 'rgba(255,255,255,0.7)' }}
                  >
                    {team}
                  </span>
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Group {groupId} — 3rd Place
                  </span>
                </div>
                {/* Selection indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black"
                      style={{ background: '#D4AF37', color: '#0a0808' }}
                    >
                      ✓
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
      {/* Sticky bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(10,9,15,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(212,175,55,0.15)',
        }}
      >
        {/* Progress bar */}
        <div className="h-0.5 w-full bg-white/5">
          <motion.div
            className="h-full"
            style={{ background: 'linear-gradient(90deg, #D4AF37, #F0D060)' }}
            animate={{ width: `${(count / REQUIRED) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              Teams Selected
            </div>
            <div className="text-2xl font-black font-display leading-tight">
              <span style={{ color: isComplete ? '#D4AF37' : 'white' }}>{count}</span>
              <span className="text-muted-foreground text-lg"> / {REQUIRED}</span>
            </div>
          </div>

          <motion.button
            onClick={isComplete ? onContinue : undefined}
            disabled={!isComplete}
            whileTap={isComplete ? { scale: 0.97 } : {}}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed min-h-[52px]"
            style={isComplete ? {
              background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
              color: '#0a0808',
              boxShadow: '0 0 30px rgba(212,175,55,0.3), 0 4px 20px rgba(0,0,0,0.4)',
            } : {
              background: 'rgba(212,175,55,0.08)',
              color: 'rgba(212,175,55,0.4)',
              border: '1px solid rgba(212,175,55,0.15)',
            }}
            data-testid="button-continue-bracket"
          >
            Generate R32 Bracket
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
