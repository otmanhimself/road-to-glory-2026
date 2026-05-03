import React from 'react';
import { motion } from 'framer-motion';
import { getFlagUrl } from '@/data/groups';

interface GroupCardProps {
  groupId: string;
  teams: string[];
  selection: { first: string | null; second: string | null };
  onSelect: (groupId: string, team: string) => void;
}

export function GroupCard({ groupId, teams, selection, onSelect }: GroupCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-4 flex flex-col gap-3 shadow-lg"
      data-testid={`group-card-${groupId}`}
    >
      <h3 className="text-xl font-display font-bold text-primary text-center tracking-widest border-b border-border/50 pb-2">
        GROUP {groupId}
      </h3>
      
      <div className="flex flex-col gap-2">
        {teams.map((team) => {
          const isFirst = selection.first === team;
          const isSecond = selection.second === team;
          const isSelected = isFirst || isSecond;

          return (
            <button
              key={team}
              onClick={() => onSelect(groupId, team)}
              className={`relative flex items-center justify-between p-3 rounded-xl transition-all duration-300 border ${
                isFirst 
                  ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]' 
                  : isSecond
                  ? 'bg-slate-300/10 border-slate-300/40 shadow-[0_0_10px_rgba(203,213,225,0.1)]'
                  : 'bg-background/50 border-transparent hover:bg-white/5'
              }`}
              data-testid={`button-team-${groupId}-${team.replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center gap-3">
                <img 
                  src={getFlagUrl(team)} 
                  alt={`${team} flag`} 
                  className="w-8 h-6 object-cover rounded-sm shadow-sm"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className={`font-semibold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {team}
                </span>
              </div>

              {isFirst && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-black rounded-md border border-yellow-500/50"
                >
                  1ST
                </motion.div>
              )}
              {isSecond && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 bg-slate-300/20 text-slate-300 text-xs font-black rounded-md border border-slate-300/50"
                >
                  2ND
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
