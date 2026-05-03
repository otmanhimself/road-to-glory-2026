let _audio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!_audio) {
    // Lazy — created on first user gesture so browsers allow playback.
    // import.meta.env.BASE_URL gives the correct public path in all environments.
    _audio = new Audio(import.meta.env.BASE_URL + 'worldcup-theme.mp3');
    _audio.loop = true;
    _audio.preload = 'auto';
  }
  return _audio;
}

export function playTheme(): void {
  try {
    const a = getAudio();
    if (!a.paused) return;
    a.volume = 0.5;
    a.play().catch(() => {/* browser blocked — user hasn't interacted yet */});
  } catch {/* ignore */}
}

export function toggleMute(): boolean {
  try {
    const a = getAudio();
    if (a.volume > 0) {
      a.volume = 0;
      return true;
    }
    a.volume = 0.5;
    return false;
  } catch {
    return false;
  }
}

export function isMuted(): boolean {
  try { return getAudio().volume === 0; } catch { return false; }
}

export function isPlaying(): boolean {
  try { return !getAudio().paused; } catch { return false; }
}
