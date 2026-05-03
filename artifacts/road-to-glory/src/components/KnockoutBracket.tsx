import React from 'react';
import { BracketState } from '@/utils/bracket';
import { MatchBox } from './MatchBox';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface KnockoutBracketProps {
  state: BracketState;
  onAdvanceTeam: (round: keyof BracketState['knockout'], matchIndex: number, team: string) => void;
}

export function KnockoutBracket({ state, onAdvanceTeam }: KnockoutBracketProps) {
  const { r16, qf, sf, final, thirdPlace, champion } = state.knockout;

  return (
    <div className="min-h-[100dvh] flex flex-col p-4">
      <div className="w-full max-w-[1400px] mx-auto mb-8 text-center mt-4">
        <h2 className="text-3xl md:text-5xl font-black text-primary uppercase tracking-widest font-display">
          Knockout Stage
        </h2>
      </div>

      <div className="flex-1 w-full overflow-x-auto pb-12">
        <div className="min-w-[1200px] w-full flex justify-between px-8 relative">
          
          {/* Round of 16 - Left */}
          <div className="flex flex-col justify-around gap-4 py-8">
            {r16.slice(0, 6).map((match, i) => (
              <MatchBox
                key={`r16-l-${i}`}
                matchId={`r16-${i}`}
                {...match}
                onSelect={(team) => onAdvanceTeam('r16', i, team)}
              />
            ))}
          </div>

          {/* QF - Left */}
          <div className="flex flex-col justify-around gap-12 py-16">
            {qf.slice(0, 3).map((match, i) => (
              <MatchBox
                key={`qf-l-${i}`}
                matchId={`qf-${i}`}
                {...match}
                onSelect={(team) => onAdvanceTeam('qf', i, team)}
              />
            ))}
          </div>

          {/* SF - Left */}
          <div className="flex flex-col justify-around gap-24 py-32">
            {sf.slice(0, 2).map((match, i) => (
              <MatchBox
                key={`sf-l-${i}`}
                matchId={`sf-${i}`}
                {...match}
                onSelect={(team) => onAdvanceTeam('sf', i, team)}
              />
            ))}
          </div>

          {/* Final & Champion - Center */}
          <div className="flex flex-col items-center justify-center gap-12 px-8 min-w-[300px]">
            {champion && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-30 rounded-full"></div>
                  <Trophy className="w-24 h-24 text-yellow-500 relative z-10 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                </div>
                <div>
                  <div className="text-yellow-500 font-black tracking-widest text-sm uppercase mb-1">World Champion</div>
                  <div className="text-4xl font-display font-black text-foreground drop-shadow-md">
                    {champion}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="w-full flex flex-col items-center gap-8 mt-auto">
              {final && (
                <div className="relative">
                  <div className="absolute -inset-4 bg-yellow-500/10 blur-xl rounded-full z-0 pointer-events-none"></div>
                  <MatchBox
                    matchId="final"
                    {...final}
                    isFinal
                    onSelect={(team) => onAdvanceTeam('final', 0, team)}
                  />
                </div>
              )}
            </div>
            
            {thirdPlace && (
              <div className="mt-8">
                <div className="text-center text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">3rd Place Match</div>
                <MatchBox
                  matchId="thirdPlace"
                  {...thirdPlace}
                  onSelect={(team) => onAdvanceTeam('thirdPlace', 0, team)}
                />
              </div>
            )}
          </div>

          {/* SF - Right (Wait, the bracket says SF has 3 matches... wait, no! SF has 3 matches?! Let's check instructions!)
          "Semifinals - 3 matches (winners of QF): SF1: W(QF1) vs W(QF2), SF2: W(QF3) vs W(QF4), SF3: W(QF5) vs W(QF6)"
          Wait! 24 teams advance -> 12 R16 -> 6 QF -> 3 SF!
          Final: W(SF1) vs W(SF2), 3rd place is W(SF3).
          This is an unusual bracket shape! I need to adjust my layout.
          Left side: 6 R16 -> 3 QF -> SF1 and half of SF3?
          Right side: 6 R16 -> 3 QF -> SF2 and half of SF3?
          Let's lay out sequentially from left to right, or symmetrical?
          Since it's 12 matches in R16, let's do 6 on left, 6 on right.
          Left QF: 3. Right QF: 3.
          SF: 3 matches total. We can put SF1 on left, SF2 on right. And SF3... where? Below the final?
          Let's do exactly that. SF3 on the left or right, or center below.
          Wait! QF is 6 matches.
          QF1 = W(Match1) vs W(Match2). (Left)
          QF2 = W(Match3) vs W(Match4). (Left)
          QF3 = W(Match5) vs W(Match6). (Left)
          QF4 = W(Match7) vs W(Match8). (Right)
          QF5 = W(Match9) vs W(Match10). (Right)
          QF6 = W(Match11) vs W(Match12). (Right)
          
          SF1 = W(QF1) vs W(QF2). (Left)
          SF2 = W(QF4) vs W(QF5). WAIT! 
          The instructions say:
          SF1: W(QF1) vs W(QF2)
          SF2: W(QF3) vs W(QF4)
          SF3: W(QF5) vs W(QF6)
          This means the bracket doesn't split neatly left/right. 
          QF1, QF2 -> SF1.
          QF3, QF4 -> SF2.
          QF5, QF6 -> SF3.
          This is a straight tree. I should render it left-to-right!
          */}

          {/* SF - Right (Temporarily adapting to standard left/right, let's read carefully above logic) */}
          <div className="flex flex-col justify-around gap-24 py-32">
            {sf.slice(2, 3).map((match, i) => (
              <MatchBox
                key={`sf-r-${i}`}
                matchId={`sf-${i+2}`}
                {...match}
                onSelect={(team) => onAdvanceTeam('sf', i+2, team)}
              />
            ))}
          </div>

          <div className="flex flex-col justify-around gap-12 py-16">
            {qf.slice(3, 6).map((match, i) => (
              <MatchBox
                key={`qf-r-${i}`}
                matchId={`qf-${i+3}`}
                {...match}
                onSelect={(team) => onAdvanceTeam('qf', i+3, team)}
              />
            ))}
          </div>

          <div className="flex flex-col justify-around gap-4 py-8">
            {r16.slice(6, 12).map((match, i) => (
              <MatchBox
                key={`r16-r-${i}`}
                matchId={`r16-${i+6}`}
                {...match}
                onSelect={(team) => onAdvanceTeam('r16', i+6, team)}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
