import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, RotateCcw, ChevronRight } from 'lucide-react';

interface SavedProgress {
  username: string;
  phase: number;
  groupsDone: number;
}

interface UsernameEntryProps {
  onStart: (username: string) => void;
  savedProgress?: SavedProgress;
  onResume?: () => void;
  onStartFresh?: () => void;
}

function phaseLabel(phase: number, groupsDone: number): string {
  if (phase === 2) {
    if (groupsDone === 0) return 'Group Stage — just started';
    if (groupsDone === 12) return 'Group Stage — all 12 groups done';
    return `Group Stage — ${groupsDone}/12 groups complete`;
  }
  if (phase === 3) return 'Best 3rd-Place Selection';
  if (phase === 4) return 'Knockout Bracket';
  return 'In progress';
}

export function UsernameEntry({ onStart, savedProgress, onResume, onStartFresh }: UsernameEntryProps) {
  const [username, setUsername] = useState('');
  const [showNewForm, setShowNewForm] = useState(!savedProgress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onStart(username.trim());
    }
  };

  const handleStartFreshClick = () => {
    onStartFresh?.();
    setShowNewForm(true);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Layered background atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.12) 0%, transparent 65%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212,175,55,0.06) 0%, transparent 65%)',
        }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full spotlight"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="z-10 w-full max-w-md flex flex-col items-center text-center gap-8"
      >
        {/* Trophy icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 150 }}
          className="trophy-float"
        >
          <Trophy
            className="w-16 h-16 md:w-20 md:h-20 drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]"
            style={{ color: '#D4AF37' }}
          />
        </motion.div>

        {/* Title */}
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-display leading-none gold-shimmer-text"
          >
            ROAD TO<br />GLORY 2026
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl font-medium tracking-[0.2em] uppercase"
            style={{ color: 'rgba(212,175,55,0.6)' }}
          >
            World Cup Prediction Bracket
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {/* Resume card — shown when saved progress exists and user hasn't chosen "Start Fresh" */}
          {savedProgress && !showNewForm ? (
            <motion.div
              key="resume"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="w-full space-y-4"
            >
              {/* Saved bracket card */}
              <div
                className="w-full rounded-2xl p-5 text-left space-y-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.04) 100%)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  boxShadow: '0 0 30px rgba(212,175,55,0.06)',
                }}
              >
                <div className="flex items-center gap-2" style={{ color: 'rgba(212,175,55,0.5)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#D4AF37' }} />
                  <span className="text-xs font-semibold uppercase tracking-widest">Saved Bracket</span>
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: '#D4AF37' }}>
                    @{savedProgress.username}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {phaseLabel(savedProgress.phase, savedProgress.groupsDone)}
                  </p>
                </div>
              </div>

              {/* Continue button */}
              <Button
                onClick={onResume}
                className="w-full h-14 sm:h-16 text-lg font-black rounded-xl uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  color: '#0a0808',
                  boxShadow: '0 0 25px rgba(212,175,55,0.35), 0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                Continue My Bracket
                <ChevronRight className="w-5 h-5" />
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: 'rgba(212,175,55,0.1)' }} />
                <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>or</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(212,175,55,0.1)' }} />
              </div>

              {/* Start fresh link */}
              <button
                onClick={handleStartFreshClick}
                className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold py-2 transition-opacity duration-200 hover:opacity-80"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Start a New Bracket
              </button>
            </motion.div>
          ) : (
            /* New bracket form */
            <motion.form
              key="new-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: savedProgress ? 0 : 0.7, duration: 0.5 }}
              className="w-full space-y-3"
            >
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold"
                  style={{ color: 'rgba(212,175,55,0.7)' }}
                >
                  @
                </span>
                <Input
                  type="text"
                  placeholder="your X username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-14 sm:h-16 text-lg glass-card rounded-xl font-semibold placeholder:text-muted-foreground/40"
                  style={{
                    borderColor: username ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.15)',
                    boxShadow: username ? '0 0 20px rgba(212,175,55,0.1)' : 'none',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  data-testid="input-username"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                disabled={!username.trim()}
                className="w-full h-14 sm:h-16 text-lg font-black rounded-xl uppercase tracking-widest transition-all duration-300 disabled:opacity-40"
                style={{
                  background: username.trim()
                    ? 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)'
                    : undefined,
                  color: '#0a0808',
                  boxShadow: username.trim()
                    ? '0 0 25px rgba(212,175,55,0.35), 0 4px 20px rgba(0,0,0,0.4)'
                    : undefined,
                }}
                data-testid="button-start"
              >
                Start Your Prediction
              </Button>

              {/* Back to resume link — only if there was saved progress and user chose "start fresh" */}
              {savedProgress && (
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold py-2 transition-opacity duration-200 hover:opacity-80"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  ← Back to my saved bracket
                </button>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-xs text-muted-foreground/50"
        >
          Build your bracket. Share your glory.
        </motion.p>
      </motion.div>
    </div>
  );
}
