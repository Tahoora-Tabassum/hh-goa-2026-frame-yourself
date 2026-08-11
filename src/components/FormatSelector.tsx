import React from 'react';
import { motion } from 'motion/react';
import { FormatType } from '../types';
import { HandDrawnArrow, Starburst, CornerBracket } from './GoaGraphics';

interface FormatSelectorProps {
  selectedFormat: FormatType;
  onSelectFormat: (format: FormatType) => void;
  onNext: () => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  selectedFormat,
  onSelectFormat,
  onNext,
}) => {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 text-center">
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 space-y-3"
      >
        <span className="font-space font-extrabold text-xs text-[#FF2E93] tracking-widest uppercase bg-[#FF2E93]/10 px-3 py-1 rounded-md border border-[#FF2E93]/30">
          STEP 01 • FORMAT SELECTION
        </span>
        <h2 className="font-syne font-extrabold text-4xl sm:text-6xl text-[#FFDF00]">
          WHAT ARE YOU MAKING?
        </h2>
        <p className="font-space text-sm sm:text-base text-[#FFF9E6]/80 max-w-lg mx-auto">
          Choose your composition format for HH Goa 2026.
        </p>
      </motion.div>

      {/* Two Poster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-left">
        
        {/* Card A: PFP FRAME */}
        <motion.div
          whileHover={{ rotate: -1, y: -4 }}
          onClick={() => onSelectFormat('pfp')}
          className={`relative cursor-pointer p-6 sm:p-8 rounded-2xl border-4 transition-all duration-300 flex flex-col justify-between min-h-[320px] ${
            selectedFormat === 'pfp'
              ? 'bg-[#0B3B2B] border-[#FFDF00] shadow-[10px_10px_0px_#FF2E93]'
              : 'bg-[#072a1e] border-[#FFDF00]/40 hover:border-[#FFDF00] hover:bg-[#0B3B2B]/70 shadow-[6px_6px_0px_#052319]'
          }`}
        >
          <CornerBracket className="absolute top-4 left-4 w-6 h-6 text-[#FFDF00]/50" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-space font-bold text-xs bg-[#FFDF00] text-[#072a1e] px-2.5 py-1 rounded">
                SQUARE 1:1
              </span>
              {selectedFormat === 'pfp' && (
                <Starburst className="w-6 h-6 text-[#FF2E93] animate-pulse" />
              )}
            </div>

            <h3 className="font-syne font-extrabold text-3xl sm:text-4xl text-[#FFDF00] mb-3 group-hover:text-[#FFF9E6]">
              PFP FRAME
            </h3>

            <p className="font-space text-base text-[#FFF9E6]/90 leading-relaxed mb-6">
              Turn your photo into your HH Goa profile picture with a high-impact festival border frame.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#FFDF00]/20">
            <span className={`font-space font-extrabold text-sm ${selectedFormat === 'pfp' ? 'text-[#FF2E93] underline underline-offset-4' : 'text-[#FFF9E6]/60'}`}>
              SELECT SQUARE FRAME
            </span>
            <HandDrawnArrow className={`w-8 h-8 ${selectedFormat === 'pfp' ? 'text-[#FF2E93]' : 'text-[#FFDF00]/40'}`} />
          </div>
        </motion.div>

        {/* Card B: BUILDER ID */}
        <motion.div
          whileHover={{ rotate: 1, y: -4 }}
          onClick={() => onSelectFormat('builder_id')}
          className={`relative cursor-pointer p-6 sm:p-8 rounded-2xl border-4 transition-all duration-300 flex flex-col justify-between min-h-[320px] ${
            selectedFormat === 'builder_id'
              ? 'bg-[#0B3B2B] border-[#FFDF00] shadow-[10px_10px_0px_#FF2E93]'
              : 'bg-[#072a1e] border-[#FFDF00]/40 hover:border-[#FFDF00] hover:bg-[#0B3B2B]/70 shadow-[6px_6px_0px_#052319]'
          }`}
        >
          <CornerBracket className="absolute top-4 left-4 w-6 h-6 text-[#FFDF00]/50" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-space font-bold text-xs bg-[#FF2E93] text-[#FFF9E6] px-2.5 py-1 rounded">
                VERTICAL CARD 4:5
              </span>
              {selectedFormat === 'builder_id' && (
                <Starburst className="w-6 h-6 text-[#FFDF00] animate-pulse" />
              )}
            </div>

            <h3 className="font-syne font-extrabold text-3xl sm:text-4xl text-[#FFDF00] mb-3">
              BUILDER ID
            </h3>

            <p className="font-space text-base text-[#FFF9E6]/90 leading-relaxed mb-6">
              Show your face, role, stack and builder identity on a custom social media badge card.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#FFDF00]/20">
            <span className={`font-space font-extrabold text-sm ${selectedFormat === 'builder_id' ? 'text-[#FF2E93] underline underline-offset-4' : 'text-[#FFF9E6]/60'}`}>
              SELECT BUILDER CARD
            </span>
            <HandDrawnArrow className={`w-8 h-8 ${selectedFormat === 'builder_id' ? 'text-[#FF2E93]' : 'text-[#FFDF00]/40'}`} />
          </div>
        </motion.div>

      </div>

      {/* Next Step CTA */}
      <button
        onClick={onNext}
        className="bg-[#FFDF00] hover:bg-[#FF2E93] text-[#072a1e] hover:text-[#FFF9E6] font-syne font-extrabold text-lg sm:text-xl px-8 py-3.5 rounded-xl shadow-[4px_4px_0px_#FF2E93] border-2 border-[#072a1e] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer inline-flex items-center gap-2"
      >
        <span>CONTINUE TO STYLE VIBE</span>
        <span>→</span>
      </button>

    </section>
  );
};
