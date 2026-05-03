import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Share2, Loader2 } from 'lucide-react';

interface ShareButtonsProps {
  bracketRef: React.RefObject<HTMLDivElement | null>;
  username: string;
}

export function ShareButtons({ bracketRef, username }: ShareButtonsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const captureImage = async (): Promise<HTMLCanvasElement | null> => {
    const wrapper = bracketRef.current;
    if (!wrapper) return null;

    // Find the scroll container and the bracket content inside it
    const scrollEl = wrapper.querySelector('[data-bracket-scroll="true"]') as HTMLElement | null;
    const contentEl = wrapper.querySelector('[data-bracket-content="true"]') as HTMLElement | null;

    // Save original styles so we can restore them
    const savedStyles: Array<{ el: HTMLElement; overflow: string; width: string; maxWidth: string }> = [];

    const expand = (el: HTMLElement) => {
      savedStyles.push({
        el,
        overflow: el.style.overflow,
        width: el.style.width,
        maxWidth: el.style.maxWidth,
      });
      el.style.overflow = 'visible';
      el.style.width = `${el.scrollWidth}px`;
      el.style.maxWidth = 'none';
    };

    const restore = () => {
      for (const s of savedStyles) {
        s.el.style.overflow = s.overflow;
        s.el.style.width = s.width;
        s.el.style.maxWidth = s.maxWidth;
      }
    };

    // Also make the print header visible
    const printHeader = wrapper.querySelector('[data-print-header="true"]') as HTMLElement | null;
    if (printHeader) printHeader.style.display = 'block';

    if (scrollEl) expand(scrollEl);
    if (contentEl) expand(contentEl);

    // Wait two frames for layout to settle
    await new Promise<void>(r => { requestAnimationFrame(() => { requestAnimationFrame(() => r()); }); });

    const fullWidth = wrapper.scrollWidth;
    const fullHeight = wrapper.scrollHeight;

    try {
      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#0b0b0f',
        logging: false,
        width: fullWidth,
        height: fullHeight,
        windowWidth: fullWidth + 40,
        windowHeight: fullHeight + 40,
        x: 0,
        y: 0,
      });
      return canvas;
    } finally {
      restore();
      if (printHeader) printHeader.style.display = 'none';
    }
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const canvas = await captureImage();
      if (!canvas) return;

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `road-to-glory-${username || 'bracket'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareX = () => {
    const text = encodeURIComponent(`Here is my Road to Glory 2026 World Cup prediction 🏆 #WorldCup2026`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 mb-6 px-4">
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 disabled:opacity-50 min-h-[48px]"
        style={{
          background: 'rgba(212,175,55,0.1)',
          border: '1px solid rgba(212,175,55,0.3)',
          color: '#D4AF37',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
        data-testid="button-download"
      >
        {isGenerating
          ? <Loader2 size={16} className="animate-spin" />
          : <Download size={16} />
        }
        {isGenerating ? 'Capturing bracket…' : 'Save Bracket Image'}
      </button>

      <button
        onClick={handleShareX}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 min-h-[48px]"
        style={{
          background: '#000000',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
        data-testid="button-share-x"
      >
        <Share2 size={16} />
        Post on X
      </button>
    </div>
  );
}
