import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-md flex flex-col items-center text-center space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-primary drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">
            ROAD TO GLORY 2026
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium tracking-wide uppercase">
            World Cup Prediction Bracket
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl font-bold">@</span>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 h-16 text-xl bg-card/50 backdrop-blur-md border-primary/30 focus-visible:ring-primary text-foreground placeholder:text-muted-foreground/50 rounded-xl"
              data-testid="input-username"
              autoFocus
            />
          </div>
          <Button 
            type="submit" 
            disabled={!username.trim()}
            className="w-full h-16 text-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] rounded-xl uppercase tracking-wider"
            data-testid="button-start"
          >
            Start Prediction
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
