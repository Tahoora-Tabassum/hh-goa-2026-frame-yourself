import React from 'react';

export const PalmSilhouette: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 90 Q48 50 20 20 Q50 35 50 90 Z" />
    <path d="M50 90 Q50 40 80 15 Q55 35 50 90 Z" />
    <path d="M50 90 Q40 45 10 40 Q40 50 50 90 Z" />
    <path d="M50 90 Q60 45 90 35 Q60 55 50 90 Z" />
    <path d="M50 90 Q35 60 5 65 Q35 70 50 90 Z" />
    <path d="M50 90 Q65 60 95 60 Q65 70 50 90 Z" />
  </svg>
);

export const SunShape: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="24" fill="currentColor" />
    <line x1="50" y1="10" x2="50" y2="2" strokeLinecap="round" />
    <line x1="50" y1="98" x2="50" y2="90" strokeLinecap="round" />
    <line x1="10" y1="50" x2="2" y2="50" strokeLinecap="round" />
    <line x1="98" y1="50" x2="90" y2="50" strokeLinecap="round" />
    <line x1="22" y1="22" x2="16" y2="16" strokeLinecap="round" />
    <line x1="84" y1="84" x2="78" y2="78" strokeLinecap="round" />
    <line x1="22" y1="78" x2="16" y2="84" strokeLinecap="round" />
    <line x1="84" y1="16" x2="78" y2="22" strokeLinecap="round" />
  </svg>
);

export const WaveLine: React.FC<{ className?: string }> = ({ className = 'w-12 h-6' }) => (
  <svg className={className} viewBox="0 0 120 40" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 20 Q15 5 30 20 T60 20 T90 20 T120 20" />
  </svg>
);

export const HandDrawnArrow: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 80 Q 40 20, 80 30" />
    <path d="M60 15 L 85 30 L 70 55" />
  </svg>
);

export const CornerBracket: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="6" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 25 V 5 H 25" />
  </svg>
);

export const Starburst: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 0 L61 38 L100 50 L61 62 L50 100 L39 62 L0 50 L39 38 Z" />
  </svg>
);
