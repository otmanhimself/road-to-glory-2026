const audio = new Audio('/worldcup-theme.mp3');
audio.loop = true;
audio.volume = 0.5;
audio.preload = 'auto';

let _playing = false;
let _muted = false;

export function playTheme(): void {
  if (_playing) return;
  _playing = true;
  audio.volume = _muted ? 0 : 0.5;
  audio.play().catch(() => {
    _playing = false;
  });
}

export function toggleMute(): boolean {
  _muted = !_muted;
  audio.volume = _muted ? 0 : 0.5;
  return _muted;
}

export function isMuted(): boolean {
  return _muted;
}

export function isPlaying(): boolean {
  return _playing;
}
