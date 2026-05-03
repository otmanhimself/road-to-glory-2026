import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFlagUrl } from '@/data/groups';

interface GroupCardProps {
  groupId: string;
  teams: string[];
  selection: { first: string | null; second: string | null };
  onSelect: (groupId: string, team: string) => void;
}

export function GroupCard({ groupId, teams, selection, onSelect }: GroupCardProps) {
  const isComplete = selection.first && selection.second;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-2xl overflow-hidden flex flex-col shadow-xl"
      style={{
        background: 'rgba(255,255,255,0.025)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isComplete
          ? '1px solid rgba(212,175,55,0.45)'
          : '1px solid rgba(212,175,55,0.1)',
        boxShadow: isComplete
          ? '0 0 24px rgba(212,175,55,0.1), 0 8px 32px rgba(0,0,0,0.4)'
          : '0 8px 32px rgba(0,0,0,0.3)',
        transition: 'border-color 0.4s, box-shadow 0.4s',
      }}
      data-testid={`group-card-${groupId}`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: isComplete
            ? 'linear-gradient(90deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)'
            : 'rgba(212,175,55,0.05)',
          borderColor: 'rgba(212,175,55,0.12)',
        }}
      >
        <h3
          className="text-base font-black tracking-[0.2em] font-display uppercase"
          style={{ color: '#D4AF37' }}
        >
          Group {groupId}
        </h3>
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

      {/* Teams */}
      <div className="flex flex-col divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        {teams.map((team) => {
          const isFirst = selection.first === team;
          const isSecond = selection.second === team;
          const isSelected = isFirst || isSecond;
          const isDisabled = !isSelected && !!(selection.first && selection.second);

          return (
            <motion.button
              key={team}
              onClick={() => onSelect(groupId, team)}
              whileTap={{ scale: 0.97 }}
              className="relative flex items-center justify-between px-4 py-3 w-full text-left transition-colors duration-200 min-h-[52px]"
              style={{
                background: isFirst
                  ? 'rgba(212,175,55,0.12)'
                  : isSecond
                  ? 'rgba(180,180,190,0.08)'
                  : 'transparent',
                borderLeft: isFirst
                  ? '3px solid #D4AF37'
                  : isSecond
                  ? '3px solid rgba(200,200,210,0.5)'
                  : '3px solid transparent',
                opacity: isDisabled ? 0.4 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
              }}
              data-testid={`button-team-${groupId}-${team.replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={getFlagUrl(team)}
                  alt={`${team} flag`}
                  className="w-8 h-5 object-cover rounded-sm shadow-md flex-shrink-0"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span
                  className="font-semibold text-sm truncate"
                  style={{
                    color: isFirst
                      ? '#F0D060'
                      : isSecond
                      ? 'rgba(210,210,220,0.9)'
                      : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {team}
                </span>
              </div>

              <AnimatePresence>
                {isFirst && (
                  <motion.span
                    key="first-badge"
                    initial={{ scale: 0, opacity: 0, x: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0, opacity: 0, x: 10 }}
                    className="flex-shrink-0 px-2 py-0.5 text-[10px] font-black tracking-widest rounded-md uppercase"
                    style={{
                      background: 'rgba(212,175,55,0.2)',
                      border: '1px solid rgba(212,175,55,0.5)',
                      color: '#D4AF37',
                    }}
                  >
                    1st
                  </motion.span>
                )}
                {isSecond && (
                  <motion.span
                    key="second-badge"
                    initial={{ scale: 0, opacity: 0, x: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0, opacity: 0, x: 10 }}
                    className="flex-shrink-0 px-2 py-0.5 text-[10px] font-black tracking-widest rounded-md uppercase"
                    style={{
                      background: 'rgba(180,180,190,0.12)',
                      border: '1px solid rgba(180,180,190,0.4)',
                      color: 'rgba(200,200,210,0.9)',
                    }}
                  >
                    2nd
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
