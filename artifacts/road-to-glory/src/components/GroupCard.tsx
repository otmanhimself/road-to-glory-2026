import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFlagUrl, FIFA_RANKINGS, CONFEDERATION, CONFEDERATION_STYLE } from '@/data/groups';
import { GroupSelection } from '@/utils/bracket';

interface GroupCardProps {
  groupId: string;
  teams: string[];
  selection: GroupSelection;
  onSelect: (groupId: string, team: string) => void;
}

const BADGE_CONFIG = {
  first:  { label: '1st', bg: 'rgba(212,175,55,0.2)',   border: 'rgba(212,175,55,0.55)',  color: '#D4AF37',               leftBorder: '#D4AF37',              rowBg: 'rgba(212,175,55,0.1)' },
  second: { label: '2nd', bg: 'rgba(180,180,190,0.12)', border: 'rgba(180,180,190,0.45)', color: 'rgba(200,200,210,0.95)', leftBorder: 'rgba(180,180,190,0.6)', rowBg: 'rgba(255,255,255,0.05)' },
  third:  { label: '3rd', bg: 'rgba(180,110,50,0.18)',  border: 'rgba(200,130,60,0.5)',   color: 'rgba(205,145,75,0.95)', leftBorder: 'rgba(190,120,55,0.7)',  rowBg: 'rgba(180,110,50,0.06)' },
};

export function GroupCard({ groupId, teams, selection, onSelect }: GroupCardProps) {
  const isComplete = !!(selection.first && selection.second && selection.third);
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);
  const [tappedTeam, setTappedTeam] = useState<string | null>(null);

  const getPlacement = (team: string): 'first' | 'second' | 'third' | null => {
    if (selection.first === team) return 'first';
    if (selection.second === team) return 'second';
    if (selection.third === team) return 'third';
    return null;
  };

  const allTaken = !!(selection.first && selection.second && selection.third);

  const handleRowClick = (team: string, isDisabled: boolean) => {
    if (isDisabled) return;
    if (tappedTeam === team) {
      setTappedTeam(null);
      onSelect(groupId, team);
    } else {
      setTappedTeam(team);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.025)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isComplete ? '1px solid rgba(212,175,55,0.45)' : '1px solid rgba(212,175,55,0.1)',
        boxShadow: isComplete
          ? '0 0 20px rgba(212,175,55,0.1), 0 8px 32px rgba(0,0,0,0.4)'
          : '0 8px 32px rgba(0,0,0,0.3)',
        transition: 'border-color 0.4s, box-shadow 0.4s',
      }}
      data-testid={`group-card-${groupId}`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: isComplete
            ? 'linear-gradient(90deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.04) 100%)'
            : 'rgba(212,175,55,0.04)',
          borderBottom: '1px solid rgba(212,175,55,0.1)',
        }}
      >
        <span className="text-sm font-black tracking-[0.2em] font-display uppercase" style={{ color: '#D4AF37' }}>
          Group {groupId}
        </span>
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
              style={{ background: '#D4AF37', color: '#0a0808' }}
            >
              ✓
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Column labels */}
      <div
        className="grid grid-cols-[1fr_auto] gap-1 px-3 py-1"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground">Team</span>
        <span className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground">Place</span>
      </div>

      {/* Teams */}
      <div className="flex flex-col">
        {teams.map((team) => {
          const placement = getPlacement(team);
          const cfg = placement ? BADGE_CONFIG[placement] : null;
          const isDisabled = !placement && allTaken;
          const rank = FIFA_RANKINGS[team];
          const conf = CONFEDERATION[team];
          const confStyle = conf ? CONFEDERATION_STYLE[conf] : null;
          const showInfo = hoveredTeam === team || tappedTeam === team;

          return (
            <motion.button
              key={team}
              onClick={() => handleRowClick(team, isDisabled)}
              onMouseEnter={() => setHoveredTeam(team)}
              onMouseLeave={() => setHoveredTeam(null)}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className="flex items-center justify-between px-3 w-full text-left"
              style={{
                minHeight: '48px',
                paddingTop: '8px',
                paddingBottom: '8px',
                background: cfg
                  ? cfg.rowBg
                  : showInfo
                  ? 'rgba(212,175,55,0.03)'
                  : 'transparent',
                borderLeft: `3px solid ${cfg ? cfg.leftBorder : showInfo ? 'rgba(212,175,55,0.25)' : 'transparent'}`,
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                opacity: isDisabled ? 0.35 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              data-testid={`button-team-${groupId}-${team.replace(/\s+/g, '-')}`}
            >
              {/* Flag + name + meta */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <img
                  src={getFlagUrl(team)}
                  alt={`${team} flag`}
                  className="w-8 h-5 object-cover rounded-sm flex-shrink-0"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="flex flex-col min-w-0">
                  <span
                    className="font-semibold text-sm truncate leading-tight"
                    style={{ color: cfg ? cfg.color : 'rgba(255,255,255,0.55)' }}
                  >
                    {team}
                  </span>

                  {/* Ranking + confederation — visible on hover/tap */}
                  <AnimatePresence>
                    {showInfo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.16 }}
                        className="flex items-center gap-1.5 overflow-hidden"
                      >
                        {conf && confStyle && (
                          <span
                            className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{
                              background: confStyle.bg,
                              color: confStyle.color,
                              border: `1px solid ${confStyle.border}`,
                            }}
                          >
                            {conf}
                          </span>
                        )}
                        {tappedTeam === team && !cfg && (
                          <span
                            className="text-[8px] font-medium"
                            style={{ color: 'rgba(255,255,255,0.22)' }}
                          >
                            tap again to pick
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Placement badge */}
              <AnimatePresence mode="wait">
                {cfg && (
                  <motion.span
                    key={placement}
                    initial={{ scale: 0, opacity: 0, x: 8 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0, opacity: 0, x: 8 }}
                    className="flex-shrink-0 ml-2 px-2 py-0.5 text-[10px] font-black tracking-widest rounded uppercase"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
                  >
                    {cfg.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
