import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  bracketRef: React.RefObject<HTMLDivElement | null>;
  username: string;
}

export function ShareButtons({ bracketRef, username }: ShareButtonsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!bracketRef.current) return;
    try {
      setIsGenerating(true);
      const canvas = await html2canvas(bracketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0b0b0f',
        logging: false,
        allowTaint: true,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `road-to-glory-${username || 'bracket'}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareX = () => {
    const text = encodeURIComponent('Here is my Road to Glory 2026 World Cup prediction 👇');
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
        <Download size={16} />
        {isGenerating ? 'Generating...' : 'Save Bracket Image'}
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
