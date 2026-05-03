import React from 'react';
import { motion } from 'framer-motion';
import { GroupCard } from './GroupCard';
import { GROUPS } from '@/data/groups';
import { Button } from '@/components/ui/button';

interface GroupStageProps {
  groups: Record<string, { first: string | null; second: string | null }>;
  onSelect: (groupId: string, team: string) => void;
  onGenerate: () => void;
}

export function GroupStage({ groups, onSelect, onGenerate }: GroupStageProps) {
  const completedGroupsCount = Object.values(groups).filter(g => g.first && g.second).length;
  const isComplete = completedGroupsCount === 12;

  return (
    <div className="min-h-[100dvh] flex flex-col pb-32">
      <div className="p-6 max-w-7xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2 mt-8">
          <h2 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-widest font-display">
            Group Stage Predictions
          </h2>
          <p className="text-muted-foreground">Select 1st and 2nd place for each group</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(GROUPS).map(([groupId, teams]) => (
            <GroupCard
              key={groupId}
              groupId={groupId}
              teams={teams}
              selection={groups[groupId]}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Progress</span>
            <span className="text-2xl font-black text-foreground">
              <span className={isComplete ? 'text-primary' : ''}>{completedGroupsCount}</span> / 12 Groups
            </span>
          </div>
          <Button
            onClick={onGenerate}
            disabled={!isComplete}
            className="w-full md:w-auto h-14 px-8 text-lg font-black bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:shadow-[0_0_25px_rgba(57,255,20,0.4)] disabled:shadow-none rounded-xl uppercase tracking-wider"
            data-testid="button-generate-bracket"
          >
            Generate Bracket
          </Button>
        </div>
      </div>
    </div>
  );
}
