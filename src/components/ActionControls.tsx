import React, { useState } from 'react';
import { Download, Share2, Edit3, Copy, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActionControlsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onEdit: () => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({ canvasRef, onEdit }) => {
  const [copied, setCopied] = useState(false);

  const shareCaption = `Just framed up for HH Goa 2026 🌴\n#FrameInGoa`;

  const handleDownload = () => {
    if (!canvasRef.current) return;

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFDF00', '#FF2E93', '#00E599', '#FFF9E6'],
    });

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `hh-goa-2026-frameyourself-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleShareX = () => {
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareCaption)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(shareCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto w-full space-y-4 pt-4">
      
      {/* Primary Download Button */}
      <button
        onClick={handleDownload}
        className="w-full bg-[#FFDF00] hover:bg-[#FF2E93] text-[#072a1e] hover:text-[#FFF9E6] font-syne font-extrabold text-xl sm:text-2xl py-4 px-6 rounded-xl shadow-[6px_6px_0px_#FF2E93] border-2 border-[#072a1e] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-3"
      >
        <Download className="w-6 h-6" />
        <span>DOWNLOAD IMAGE ↓</span>
      </button>

      {/* Share to X and Edit Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleShareX}
          className="bg-[#0B3B2B] hover:bg-[#000000] text-[#FFF9E6] font-space font-bold text-sm sm:text-base py-3 px-4 rounded-xl border-2 border-[#FFDF00]/50 hover:border-[#FFDF00] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          <Share2 className="w-4 h-4 text-[#FFDF00]" />
          <span>SHARE TO X 𝕏</span>
        </button>

        <button
          onClick={onEdit}
          className="bg-[#0B3B2B] hover:bg-[#FFDF00] text-[#FFF9E6] hover:text-[#072a1e] font-space font-bold text-sm sm:text-base py-3 px-4 rounded-xl border-2 border-[#FFDF00]/50 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          <Edit3 className="w-4 h-4" />
          <span>← EDIT</span>
        </button>
      </div>

      {/* Copy Caption Box */}
      <div className="bg-[#072a1e] p-3 rounded-xl border border-[#FFDF00]/30 flex items-center justify-between text-left">
        <div className="overflow-hidden">
          <p className="font-space text-[10px] text-[#FFDF00] font-bold uppercase">
            SHARE CAPTION
          </p>
          <p className="font-space text-xs text-[#FFF9E6]/80 truncate">
            {shareCaption}
          </p>
        </div>

        <button
          onClick={handleCopyCaption}
          className="bg-[#0B3B2B] hover:bg-[#FFDF00] text-[#FFF9E6] hover:text-[#072a1e] px-3 py-1.5 rounded-lg text-xs font-space font-bold border border-[#FFDF00]/30 transition-colors cursor-pointer flex items-center gap-1 shrink-0 ml-2"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#00E599]" />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
