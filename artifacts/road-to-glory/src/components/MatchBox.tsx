import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFlagUrl } from '@/data/groups';

interface MatchBoxProps {
  matchId: string;
  team1: string;
  team2: string;
  winner: string | null;
  onSelect: (team: string) => void;
  isFinal?: boolean;
  label?: string;
  width?: number;
}

export function MatchBox({ matchId, team1, team2, winner, onSelect, isFinal, label, width }: MatchBoxProps) {
  const t1Win = winner === team1;
  const t2Win = winner === team2;

  const renderTeam = (team: string, isWinner: boolean, isLoser: boolean) => {
    if (!team) {
      return (
        <div className="flex items-center gap-2 px-3 py-2.5 h-11">
          <div className="w-6 h-4 rounded-sm flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <span className="text-xs font-bold italic" style={{ color: 'rgba(255,255,255,0.2)' }}>
            TBD
          </span>
        </div>
      );
    }

    return (
      <motion.button
        onClick={() => onSelect(team)}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center gap-2 px-3 py-2.5 h-11 transition-all duration-200 text-left"
        style={{
          background: isWinner
            ? 'linear-gradient(90deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 100%)'
            : 'transparent',
          borderLeft: isWinner
            ? '3px solid #D4AF37'
            : '3px solid transparent',
          opacity: isLoser ? 0.35 : 1,
          cursor: !team ? 'default' : 'pointer',
        }}
        data-testid={`button-match-${matchId}-${team.replace(/\s+/g, '-')}`}
      >
        <img
          src={getFlagUrl(team)}
          alt=""
          className="w-6 h-4 object-cover rounded-[2px] flex-shrink-0"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <span
          className="font-semibold text-xs truncate flex-1"
          style={{
            color: isWinner
              ? '#F0D060'
              : isLoser
              ? 'rgba(255,255,255,0.3)'
              : 'rgba(255,255,255,0.7)',
          }}
        >
          {team}
        </span>
        <AnimatePresence>
          {isWinner && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex-shrink-0 text-[10px] font-black"
              style={{ color: '#D4AF37' }}
            >
              ✓
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };

  return (
    <div
      className="flex flex-col rounded-lg overflow-hidden z-10 relative"
      style={{
        width: width ? `${width}px` : isFinal ? '172px' : '152px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: isFinal
          ? '1px solid rgba(212,175,55,0.5)'
          : '1px solid rgba(212,175,55,0.12)',
        boxShadow: isFinal
          ? '0 0 24px rgba(212,175,55,0.2), 0 8px 32px rgba(0,0,0,0.5)'
          : '0 4px 20px rgba(0,0,0,0.4)',
      }}
      data-testid={`match-box-${matchId}`}
    >
      {/* Label bar */}
      {(isFinal || label) && (
        <div
          className="text-[9px] font-black text-center py-1 tracking-widest uppercase"
          style={{
            background: 'linear-gradient(90deg, rgba(212,175,55,0.25), rgba(212,175,55,0.1))',
            color: '#D4AF37',
            borderBottom: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          {label || 'Final'}
        </div>
      )}

      {/* Divider between teams */}
      <div
        className="flex flex-col divide-y"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {renderTeam(team1, t1Win, t2Win)}
        {renderTeam(team2, t2Win, t1Win)}
      </div>
    </div>
  );
}
