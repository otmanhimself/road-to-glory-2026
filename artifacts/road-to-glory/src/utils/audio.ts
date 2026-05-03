// Import directly — Vite resolves this to the correct hashed URL in all envs.
import audioSrc from "@assets/The_Official_FIFA_World_Cup_26TM_Theme(MP3_160K)_(1)_1777780785733.mp3";

// _audio is created lazily inside playTheme() (inside a user gesture).
// Never create it at module load or render time — browsers block play() on
// Audio elements that were not created in response to a user interaction.
let _audio: HTMLAudioElement | null = null;

export function playTheme(): void {
  try {
    if (!_audio) {
      _audio = new Audio(audioSrc);
      _audio.loop = true;
      _audio.preload = "auto";
    }
    if (!_audio.paused) return;
    _audio.volume = 0.5;
    _audio.play().catch((err) => {
      console.warn("[audio] play() blocked:", err);
    });
  } catch (err) {
    console.warn("[audio] playTheme error:", err);
  }
}

export function toggleMute(): boolean {
  if (!_audio) return false;
  if (_audio.volume > 0) {
    _audio.volume = 0;
    return true;
  }
  _audio.volume = 0.5;
  return false;
}

// These never call getAudio() — safe to call at render time.
export function isMuted(): boolean {
  return _audio ? _audio.volume === 0 : false;
}

export function isPlaying(): boolean {
  return _audio ? !_audio.paused : false;
}
