import React from 'react';
import { motion } from 'framer-motion';
import { getFlagUrl } from '@/data/groups';

interface MatchBoxProps {
  matchId: string;
  team1: string;
  team2: string;
  winner: string | null;
  onSelect: (team: string) => void;
  isFinal?: boolean;
}

export function MatchBox({ matchId, team1, team2, winner, onSelect, isFinal }: MatchBoxProps) {
  const t1Win = winner === team1;
  const t2Win = winner === team2;

  const renderTeam = (team: string, isWinner: boolean, isOtherWinner: boolean) => {
    if (!team) {
      return (
        <div className="flex items-center p-2 h-10 bg-black/20 text-muted-foreground/30 text-xs font-bold italic border-b border-border/30 last:border-0">
          TBD
        </div>
      );
    }

    return (
      <button
        onClick={() => onSelect(team)}
        className={`w-full flex items-center gap-2 p-2 h-10 transition-all duration-200 border-b border-border/30 last:border-0 hover:bg-white/5 ${
          isWinner 
            ? 'bg-primary/20 text-foreground shadow-[inset_4px_0_0_rgba(57,255,20,1)]' 
            : isOtherWinner
            ? 'opacity-40 text-muted-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        data-testid={`button-match-${matchId}-${team.replace(/\s+/g, '-')}`}
      >
        <img 
          src={getFlagUrl(team)} 
          alt="" 
          className="w-6 h-4 object-cover rounded-[2px]"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <span className="font-semibold text-sm truncate">{team}</span>
      </button>
    );
  };

  return (
    <div 
      className={`w-48 bg-card/60 backdrop-blur-md border rounded-lg overflow-hidden flex flex-col shadow-lg z-10 ${
        isFinal ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-border/50'
      }`}
      data-testid={`match-box-${matchId}`}
    >
      {isFinal && (
        <div className="bg-yellow-500/20 text-yellow-500 text-[10px] font-black text-center py-1 border-b border-yellow-500/30 uppercase tracking-widest">
          Final
        </div>
      )}
      {renderTeam(team1, t1Win, t2Win)}
      {renderTeam(team2, t2Win, t1Win)}
    </div>
  );
}
