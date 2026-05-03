import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { toggleMute, isMuted, isPlaying } from '@/utils/audio';

export function MuteButton() {
  const [muted, setMuted] = useState(isMuted());
  const [visible, setVisible] = useState(isPlaying());

  // Poll for when audio starts so button appears
  React.useEffect(() => {
    const id = setInterval(() => {
      if (isPlaying()) {
        setVisible(true);
        clearInterval(id);
      }
    }, 200);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  const handleClick = () => {
    const nowMuted = toggleMute();
    setMuted(nowMuted);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={handleClick}
      title={muted ? 'Unmute music' : 'Mute music'}
      className="fixed bottom-6 right-5 z-[100] flex items-center justify-center rounded-full transition-all duration-200"
      style={{
        width: 42,
        height: 42,
        background: muted
          ? 'rgba(255,255,255,0.07)'
          : 'rgba(212,175,55,0.12)',
        border: muted
          ? '1px solid rgba(255,255,255,0.12)'
          : '1px solid rgba(212,175,55,0.35)',
        boxShadow: muted
          ? 'none'
          : '0 0 16px rgba(212,175,55,0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      whileTap={{ scale: 0.9 }}
    >
      {muted
        ? <VolumeX size={17} style={{ color: 'rgba(255,255,255,0.35)' }} />
        : <Volume2 size={17} style={{ color: '#D4AF37' }} />
      }
    </motion.button>
  );
}
