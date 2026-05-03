import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy } from 'lucide-react';

interface UsernameEntryProps {
  onStart: (username: string) => void;
}

export function UsernameEntry({ onStart }: UsernameEntryProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onStart(username.trim());
    }
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
        {/* Subtle grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Center spotlight */}
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

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
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
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xs text-muted-foreground/50"
        >
          Build your bracket. Share your glory.
        </motion.p>
      </motion.div>
    </div>
  );
}
