import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download, Twitter } from 'lucide-react';
import { BracketState } from '@/utils/bracket';

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
        backgroundColor: '#0a0e1a', // Ensure dark background
        logging: false,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `road-to-glory-${username}.png`;
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
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 mb-8">
      <Button
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full sm:w-auto h-12 px-6 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold rounded-xl gap-2"
        data-testid="button-download"
      >
        <Download size={18} />
        {isGenerating ? 'Generating...' : 'Save Bracket'}
      </Button>
      
      <Button
        onClick={handleShareX}
        className="w-full sm:w-auto h-12 px-6 bg-[#000000] text-white hover:bg-zinc-800 border border-white/20 font-bold rounded-xl gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        data-testid="button-share-x"
      >
        <Twitter size={18} />
        Post on X
      </Button>
    </div>
  );
}
