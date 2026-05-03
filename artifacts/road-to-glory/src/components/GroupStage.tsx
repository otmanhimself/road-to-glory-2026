import React from 'react';
import { motion } from 'framer-motion';
import { GroupCard } from './GroupCard';
import { GROUPS } from '@/data/groups';
import { GroupSelection } from '@/utils/bracket';
import { ChevronRight } from 'lucide-react';

interface GroupStageProps {
  groups: Record<string, GroupSelection>;
  onSelect: (groupId: string, team: string) => void;
  onGenerate: () => void;
}

export function GroupStage({ groups, onSelect, onGenerate }: GroupStageProps) {
  const completedGroupsCount = Object.values(groups).filter(
    g => g.first && g.second && g.third
  ).length;
  const isComplete = completedGroupsCount === 12;
  const progressPercent = (completedGroupsCount / 12) * 100;

  return (
    <div className="min-h-[100dvh] flex flex-col pb-36">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 max-w-7xl mx-auto w-full text-center space-y-1">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-2"
          style={{
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.2)',
            color: 'rgba(212,175,55,0.8)',
          }}
        >
          Step 1 of 3
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-widest font-display"
          style={{ color: '#D4AF37' }}
        >
          Group Stage
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground"
        >
          Select 1st, 2nd, and 3rd place for each group
        </motion.p>
      </div>

      {/* Group grid */}
      <div className="px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(GROUPS).map(([groupId, teams], idx) => (
            <motion.div
              key={groupId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.4 }}
            >
              <GroupCard
                groupId={groupId}
                teams={teams}
                selection={groups[groupId]}
                onSelect={onSelect}
              />
            </motion.div>
          ))}
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
        <div className="h-0.5 w-full bg-white/5">
          <motion.div
            className="h-full"
            style={{ background: 'linear-gradient(90deg, #D4AF37, #F0D060)' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
            <div className="text-center sm:text-left">
              <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                Groups Complete
              </div>
              <div className="text-2xl font-black font-display leading-tight">
                <span style={{ color: isComplete ? '#D4AF37' : 'white' }}>
                  {completedGroupsCount}
                </span>
                <span className="text-muted-foreground text-lg"> / 12</span>
              </div>
            </div>

            {/* Group pills */}
            <div className="hidden sm:flex flex-wrap gap-1 max-w-xs">
              {Object.entries(groups).map(([id, g]) => {
                const done = g.first && g.second && g.third;
                const partial = (g.first || g.second || g.third) && !done;
                return (
                  <div
                    key={id}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-black transition-all duration-300"
                    style={{
                      background: done
                        ? 'rgba(212,175,55,0.25)'
                        : partial
                        ? 'rgba(212,175,55,0.1)'
                        : 'rgba(255,255,255,0.05)',
                      border: done
                        ? '1px solid rgba(212,175,55,0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                      color: done ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {id}
                  </div>
                );
              })}
            </div>
          </div>

          <motion.button
            onClick={isComplete ? onGenerate : undefined}
            disabled={!isComplete}
            whileTap={isComplete ? { scale: 0.97 } : {}}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed min-h-[52px]"
            style={isComplete ? {
              background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
              color: '#0a0808',
              boxShadow: '0 0 30px rgba(212,175,55,0.3), 0 4px 20px rgba(0,0,0,0.4)',
            } : {
              background: 'rgba(212,175,55,0.08)',
              color: 'rgba(212,175,55,0.4)',
              border: '1px solid rgba(212,175,55,0.15)',
            }}
            data-testid="button-generate-bracket"
          >
            Select 3rd Place Teams
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
