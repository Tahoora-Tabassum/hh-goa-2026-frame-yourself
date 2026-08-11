import React from 'react';
import { motion } from 'motion/react';
import {
  PalmSilhouette,
  SunShape,
  WaveLine,
  HandDrawnArrow,
  CornerBracket,
  Starburst,
} from './GoaGraphics';
import sampleBuilder1 from '../assets/images/sample_builder_1_1786264670571.jpg';

interface HeroSectionProps {
  onStart: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
  return (
    <section className="relative min-h-[calc(100vh-70px)] flex flex-col justify-center items-center px-4 py-12 overflow-hidden bg-poster-grain">
      {/* Background Graphic Accents */}
      <div className="absolute top-10 left-6 sm:left-16 text-[#FFDF00]/20 pointer-events-none select-none">
        <SunShape className="w-24 h-24 sm:w-36 sm:h-36 animate-spin-slow" />
      </div>

      <div className="absolute bottom-12 right-6 sm:right-20 text-[#FF2E93]/30 pointer-events-none select-none">
        <PalmSilhouette className="w-28 h-28 sm:w-44 sm:h-44 rotate-12" />
      </div>

      <div className="absolute top-1/3 right-10 text-[#FFDF00]/25 pointer-events-none hidden lg:block">
        <WaveLine className="w-32 h-16" />
      </div>

      {/* Main Container */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Column: Expressive Typography & CTA */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          
          {/* Festival badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#0B3B2B] border-2 border-[#FFDF00] px-3.5 py-1.5 rounded-md shadow-[4px_4px_0px_#FF2E93]"
          >
            <Starburst className="w-4 h-4 text-[#FF2E93]" />
            <span className="font-space font-extrabold text-xs sm:text-sm text-[#FFDF00] tracking-widest uppercase">
              HH GOA 2026 • OFFICIAL GENERATOR
            </span>
          </motion.div>

          {/* Gigantic Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <CornerBracket className="absolute -top-6 -left-6 w-8 h-8 text-[#FFDF00]/50" />
            
            <h1 className="font-syne font-extrabold text-6xl sm:text-8xl md:text-9xl leading-[0.88] tracking-tight text-[#FFDF00] drop-shadow-[4px_4px_0px_#072a1e]">
              FRAME
              <br />
              <span className="text-[#FFF9E6] underline decoration-[#FF2E93] decoration-8 underline-offset-8">
                YOURSELF.
              </span>
            </h1>

            <HandDrawnArrow className="absolute -bottom-8 right-4 w-12 h-12 text-[#FF2E93] rotate-45 hidden sm:block" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-space text-lg sm:text-2xl text-[#FFF9E6]/90 max-w-xl font-medium leading-relaxed"
          >
            Your photo. Your builder identity. Your Goa.
          </motion.p>

          {/* Primary CTA + Microcopy */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={onStart}
              className="w-full sm:w-auto bg-[#FFDF00] hover:bg-[#FF2E93] text-[#072a1e] hover:text-[#FFF9E6] font-syne font-extrabold text-xl sm:text-2xl px-8 py-4 rounded-xl shadow-[6px_6px_0px_#FF2E93] border-2 border-[#072a1e] hover:translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-3 group"
            >
              <span>START FRAMING</span>
              <span className="group-hover:translate-x-2 transition-transform text-2xl">→</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-space font-bold text-[#FFDF00] bg-[#0B3B2B] px-3.5 py-2 rounded-lg border border-[#FFDF00]/30">
              <span>JPG • PNG • HEIC</span>
              <span className="text-[#FF2E93]">✦ NO SIGNUP</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive Poster Card Teaser */}
        <motion.div
          initial={{ opacity: 0, rotate: 3, scale: 0.9 }}
          animate={{ opacity: 1, rotate: 2, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 relative flex justify-center mt-6 lg:mt-0"
        >
          {/* Card Frame Container */}
          <div className="relative w-full max-w-sm bg-[#0B3B2B] p-4 rounded-2xl border-4 border-[#FFDF00] shadow-[12px_12px_0px_#FF2E93] rotate-2 hover:rotate-0 transition-transform duration-300">
            
            {/* Top Card Badge */}
            <div className="flex items-center justify-between bg-[#072a1e] px-3 py-2 rounded-lg border border-[#FFDF00]/40 mb-3">
              <span className="font-space font-bold text-xs text-[#FFDF00]">HH GOA 2026</span>
              <span className="font-space text-[10px] text-[#FF2E93] bg-[#FF2E93]/10 px-2 py-0.5 rounded font-extrabold uppercase">
                PREVIEW
              </span>
            </div>

            {/* Photo preview container */}
            <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#FFDF00] mb-3 group">
              <img
                src={sampleBuilder1}
                alt="HH Goa Builder Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay sticker */}
              <div className="absolute top-3 right-3 bg-[#FF2E93] text-[#FFF9E6] font-syne font-bold text-xs px-2.5 py-1 rounded shadow-md border border-[#FFDF00]">
                #FrameInGoa
              </div>

              <div className="absolute bottom-3 left-3 bg-[#072a1e]/90 text-[#FFDF00] font-space font-bold text-xs px-2.5 py-1 rounded border border-[#FFDF00]/50 backdrop-blur-sm">
                ✦ THE AI EXPLORER
              </div>
            </div>

            {/* Card Footer Details */}
            <div className="space-y-1 text-left px-1">
              <p className="font-syne font-extrabold text-xl text-[#FFDF00] tracking-wide">
                AARAV SHARMA
              </p>
              <p className="font-space font-bold text-xs text-[#FFF9E6]/80">
                AI • PYTHON • REACT
              </p>
            </div>

            {/* Floating Palm Decorative Leaf */}
            <div className="absolute -top-6 -right-6 text-[#FFDF00] pointer-events-none">
              <PalmSilhouette className="w-14 h-14 rotate-45" />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
