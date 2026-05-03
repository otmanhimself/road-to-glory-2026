import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VolumeX } from 'lucide-react';
import { toggleMute, isMuted, isPlaying } from '@/utils/audio';

// Equalizer bar — each pulses at a different speed and height
function EqBar({ delay, minH, maxH }: { delay: number; minH: number; maxH: number }) {
  return (
    <motion.span
      style={{
        display: 'inline-block',
        width: 3,
        borderRadius: 2,
        background: '#D4AF37',
        originY: 1,
      }}
      animate={{ scaleY: [minH / maxH, 1, minH / maxH * 0.6, 1, minH / maxH] }}
      transition={{
        duration: 0.9,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      initial={{ scaleY: minH / maxH }}
      // Use height as the base; scaleY animates around it
      className="self-end"
      // absolute height set via inline style
      {...{ style: {
        display: 'inline-block',
        width: 3,
        height: maxH,
        borderRadius: 2,
        background: '#D4AF37',
        transformOrigin: 'bottom',
      }}}
    />
  );
}

export function MuteButton() {
  const [muted, setMuted] = useState(isMuted());
  const [visible, setVisible] = useState(isPlaying());

  React.useEffect(() => {
    const id = setInterval(() => {
      if (isPlaying()) {
        setVisible(true);
        clearInterval(id);
      }
    }, 200);
    return () => clearInterval(id);
  }, []);

  const handleClick = () => {
    const nowMuted = toggleMute();
    setMuted(nowMuted);
  };

  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.7, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onClick={handleClick}
      title={muted ? 'Unmute music' : 'Mute music'}
      className="fixed bottom-6 right-5 z-[100] flex items-center justify-center rounded-full"
      style={{
        width: 46,
        height: 46,
        background: muted
          ? 'rgba(30,28,35,0.85)'
          : 'rgba(18,16,22,0.88)',
        border: muted
          ? '1px solid rgba(255,255,255,0.1)'
          : '1px solid rgba(212,175,55,0.4)',
        boxShadow: muted
          ? 'none'
          : '0 0 0 4px rgba(212,175,55,0.07), 0 0 20px rgba(212,175,55,0.18)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        cursor: 'pointer',
      }}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
    >
      {/* Outer glow ring — only when playing */}
      <AnimatePresence>
        {!muted && (
          <motion.span
            key="glow-ring"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.5, 0.15, 0.5], scale: [1, 1.35, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              border: '1px solid rgba(212,175,55,0.35)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Icon area */}
      <AnimatePresence mode="wait">
        {muted ? (
          /* Muted — static X icon */
          <motion.span
            key="muted"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <VolumeX size={18} style={{ color: 'rgba(255,255,255,0.3)' }} />
          </motion.span>
        ) : (
          /* Playing — animated equalizer bars */
          <motion.span
            key="playing"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 3,
              height: 18,
            }}
          >
            <EqBar delay={0}    minH={5}  maxH={18} />
            <EqBar delay={0.18} minH={10} maxH={18} />
            <EqBar delay={0.09} minH={7}  maxH={18} />
            <EqBar delay={0.27} minH={4}  maxH={14} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
