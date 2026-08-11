import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { Starburst } from './GoaGraphics';

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  onReset: () => void;
  onStepClick: (step: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  totalSteps,
  onReset,
  onStepClick,
}) => {
  const stepLabels = [
    'HERO',
    'FORMAT',
    'VIBE',
    'PHOTO',
    'DETAILS',
    'PREVIEW',
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#072a1e]/90 backdrop-blur-md border-b-2 border-[#FFDF00]/30 px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand logo badge */}
        <div 
          onClick={onReset}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-[#FFDF00] text-[#072a1e] font-syne font-extrabold px-3 py-1 rounded-md text-sm sm:text-base tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#FF2E93] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <span>HH GOA 2026</span>
            <Starburst className="w-4 h-4 text-[#FF2E93] animate-spin" />
          </div>
          <span className="font-syne font-bold text-xs sm:text-sm tracking-widest text-[#FFF9E6] hidden sm:inline-block">
            FRAME YOURSELF
          </span>
        </div>

        {/* Step Progress Pills */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#0B3B2B] p-1.5 rounded-full border border-[#FFDF00]/20">
          {stepLabels.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <button
                key={label}
                onClick={() => isCompleted && onStepClick(stepNum)}
                disabled={!isCompleted && !isActive}
                className={`px-3 py-1 rounded-full text-xs font-space font-bold transition-all ${
                  isActive
                    ? 'bg-[#FFDF00] text-[#072a1e] shadow-sm'
                    : isCompleted
                    ? 'text-[#FFDF00] hover:bg-[#FFDF00]/10 cursor-pointer'
                    : 'text-[#FFF9E6]/40 cursor-not-allowed'
                }`}
              >
                0{stepNum}. {label}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 bg-[#0B3B2B] hover:bg-[#FF2E93] text-[#FFF9E6] hover:text-[#072a1e] font-space font-bold text-xs px-3 py-1.5 rounded-md border border-[#FFDF00]/40 transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RESET</span>
            </button>
          )}

          <div className="bg-[#FF2E93] text-[#FFF9E6] font-space text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-[#FFDF00]/50">
            <Sparkles className="w-3 h-3 text-[#FFDF00]" />
            <span>LIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
};
