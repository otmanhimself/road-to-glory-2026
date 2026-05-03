import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFlagUrl } from '@/data/groups';

interface Particle {
  id: number; x: number; y: number; color: string;
  duration: number; delay: number; size: number; rotate: number;
}

function Confetti({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const colors = ['#D4AF37', '#F0D060', '#fff8dc', '#C0A030', '#FFE066', '#ffffff', '#F5E6A3'];
    setParticles(Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: -10 - Math.random() * 20,
      color: colors[i % colors.length],
      duration: 1.8 + Math.random() * 2,
      delay: Math.random() * 1.4,
      size: 5 + Math.random() * 9,
      rotate: Math.random() * 360,
    })));
    const t = setTimeout(() => setParticles([]), 5500);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-particle absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            borderRadius: p.id % 3 === 0 ? '50%' : p.id % 3 === 1 ? '2px' : '0',
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

interface ChampionRevealProps {
  champion: string | null;
}

export function ChampionReveal({ champion }: ChampionRevealProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const prevChampion = useRef<string | null>(null);

  useEffect(() => {
    if (champion && champion !== prevChampion.current) {
      setShowConfetti(true);
      prevChampion.current = champion;
      const t = setTimeout(() => setShowConfetti(false), 5500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [champion]);

  const flagUrl = champion ? getFlagUrl(champion).replace('/w40/', '/w160/') : '';

  return (
    <AnimatePresence>
      {champion && (
        <motion.section
          key={`champion-reveal-${champion}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full flex flex-col items-center justify-center py-16 px-4 overflow-hidden"
          data-champion-reveal="true"
          style={{ minHeight: 420 }}
        >
          {/* Deep radial glow behind everything */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 40%, transparent 70%)',
            }}
          />
          {/* Subtle grid */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
            backgroundImage: 'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />

          {/* Confetti */}
          <Confetti trigger={showConfetti} />

          {/* Trophy — drops in from top */}
          <motion.div
            initial={{ y: -60, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7, type: 'spring', stiffness: 140, damping: 14 }}
            className="relative z-10 mb-4 trophy-float"
          >
            <img
              src="/trophy.png"
              alt="World Cup Trophy"
              className="trophy-img-glow"
              style={{ width: 110, height: 148, objectFit: 'contain' }}
            />
          </motion.div>

          {/* "WORLD CHAMPION" label */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.25em' }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="relative z-10 text-xs sm:text-sm font-black uppercase mb-5"
            style={{ color: 'rgba(212,175,55,0.65)' }}
          >
            World Champion
          </motion.p>

          {/* Champion card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center gap-5 px-10 py-8 rounded-3xl champion-glow"
            style={{
              background: 'linear-gradient(145deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.04) 60%, rgba(0,0,0,0.2) 100%)',
              border: '1px solid rgba(212,175,55,0.4)',
              boxShadow: '0 0 60px rgba(212,175,55,0.2), 0 20px 60px rgba(0,0,0,0.6)',
              minWidth: 260,
              maxWidth: 360,
            }}
          >
            {/* Inner radial glow */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 20%, rgba(212,175,55,0.1) 0%, transparent 60%)' }}
            />

            {/* Flag */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="relative z-10 rounded-lg overflow-hidden flex-shrink-0"
              style={{
                boxShadow: '0 0 30px rgba(212,175,55,0.4), 0 8px 30px rgba(0,0,0,0.6)',
                border: '2px solid rgba(212,175,55,0.5)',
              }}
            >
              {flagUrl ? (
                <img
                  src={flagUrl}
                  alt={champion}
                  className="block"
                  style={{ width: 120, height: 80, objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div style={{ width: 120, height: 80, background: 'rgba(212,175,55,0.1)' }} />
              )}
            </motion.div>

            {/* Team name */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="relative z-10 font-black font-display text-center leading-tight gold-shimmer-text"
              style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)' }}
            >
              {champion}
            </motion.h2>

            {/* Gold star row */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="relative z-10 flex gap-1"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + i * 0.07, duration: 0.3 }}
                  style={{ color: '#D4AF37', fontSize: 14, filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.8))' }}
                >
                  ★
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Divider below */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="relative z-10 mt-10 w-40 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)' }}
          />
        </motion.section>
      )}
    </AnimatePresence>
  );
}
