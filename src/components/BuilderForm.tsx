import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { BuilderDetails } from '../types';
import { generatePlayfulTitle } from '../constants/styles';
import { Starburst, CornerBracket } from './GoaGraphics';

interface BuilderFormProps {
  builder: BuilderDetails;
  onChange: (updated: BuilderDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

export const BuilderForm: React.FC<BuilderFormProps> = ({
  builder,
  onChange,
  onNext,
  onBack,
}) => {
  const handleRoleChange = (roleValue: string) => {
    const autoTitle = generatePlayfulTitle(roleValue);
    onChange({
      ...builder,
      roleStack: roleValue,
      title: autoTitle,
    });
  };

  const handleRerollTitle = () => {
    const newTitle = generatePlayfulTitle(builder.roleStack);
    onChange({
      ...builder,
      title: newTitle,
    });
  };

  const quickRoles = [
    'AI • Python • React',
    'React • Motion • Design',
    'Fullstack • Rust • Web3',
    'Agentic AI • PyTorch',
    'Product • Growth • Zero1',
  ];

  return (
    <section className="max-w-2xl mx-auto px-4 py-10 text-center">
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 space-y-2"
      >
        <span className="font-space font-extrabold text-xs text-[#FFDF00] tracking-widest uppercase bg-[#0B3B2B] px-3 py-1 rounded-md border border-[#FFDF00]/30">
          STEP 04 • BUILDER IDENTITY
        </span>
        <h2 className="font-syne font-extrabold text-4xl sm:text-6xl text-[#FFDF00]">
          MAKE IT YOURS
        </h2>
        <p className="font-space text-sm sm:text-base text-[#FFF9E6]/80">
          Enter your builder credentials for the HH Goa 2026 card.
        </p>
      </motion.div>

      {/* Form Container */}
      <div className="relative bg-[#0B3B2B] p-6 sm:p-8 rounded-2xl border-4 border-[#FFDF00] shadow-[10px_10px_0px_#FF2E93] text-left space-y-6 mb-8">
        
        <CornerBracket className="absolute top-4 left-4 w-6 h-6 text-[#FFDF00]" />
        <CornerBracket className="absolute top-4 right-4 w-6 h-6 text-[#FFDF00] rotate-90" />

        {/* 1. NAME */}
        <div className="space-y-2">
          <label className="font-syne font-extrabold text-lg text-[#FFDF00] block tracking-wide">
            NAME
          </label>
          <input
            type="text"
            value={builder.name}
            onChange={(e) => onChange({ ...builder, name: e.target.value })}
            placeholder="e.g. Aarav Sharma"
            maxLength={30}
            className="w-full bg-[#072a1e] text-[#FFF9E6] font-space font-bold text-lg px-4 py-3 rounded-xl border-2 border-[#FFDF00]/50 focus:border-[#FFDF00] focus:outline-none placeholder-[#FFF9E6]/40"
          />
        </div>

        {/* 2. ROLE / STACK */}
        <div className="space-y-2">
          <label className="font-syne font-extrabold text-lg text-[#FFDF00] block tracking-wide">
            ROLE / STACK
          </label>
          <input
            type="text"
            value={builder.roleStack}
            onChange={(e) => handleRoleChange(e.target.value)}
            placeholder="e.g. AI • Python • React"
            maxLength={40}
            className="w-full bg-[#072a1e] text-[#FFF9E6] font-space font-bold text-lg px-4 py-3 rounded-xl border-2 border-[#FFDF00]/50 focus:border-[#FFDF00] focus:outline-none placeholder-[#FFF9E6]/40"
          />

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {quickRoles.map((qr) => (
              <button
                key={qr}
                type="button"
                onClick={() => handleRoleChange(qr)}
                className="font-space text-[11px] font-bold bg-[#072a1e] text-[#FFDF00] hover:bg-[#FFDF00] hover:text-[#072a1e] px-2.5 py-1 rounded-md border border-[#FFDF00]/30 transition-colors cursor-pointer"
              >
                + {qr}
              </button>
            ))}
          </div>
        </div>

        {/* 3. GENERATED BUILDER TITLE */}
        <div className="space-y-2 bg-[#072a1e] p-4 rounded-xl border-2 border-[#FF2E93]/60">
          <div className="flex items-center justify-between">
            <span className="font-syne font-extrabold text-sm text-[#FF2E93] flex items-center gap-1.5">
              <Starburst className="w-4 h-4 text-[#FFDF00]" />
              AUTO-GENERATED TITLE
            </span>
            <button
              type="button"
              onClick={handleRerollTitle}
              className="flex items-center gap-1 font-space text-xs font-bold text-[#FFDF00] hover:text-[#FFF9E6] cursor-pointer bg-[#0B3B2B] px-2.5 py-1 rounded border border-[#FFDF00]/30"
            >
              <RefreshCw className="w-3 h-3 animate-spin-slow" /> RE-ROLL 🎲
            </button>
          </div>

          <input
            type="text"
            value={builder.title}
            onChange={(e) => onChange({ ...builder, title: e.target.value })}
            placeholder="The AI Explorer"
            maxLength={35}
            className="w-full bg-transparent text-[#FFDF00] font-syne font-extrabold text-xl focus:outline-none border-b border-[#FF2E93]/40 pb-1"
          />
        </div>

        {/* 4. OPTIONAL GOA GOAL / TAGLINE */}
        <div className="space-y-2">
          <label className="font-syne font-bold text-sm text-[#FFF9E6]/80 block">
            GOA GOAL / SHORT BIO <span className="text-xs text-[#FFDF00]">(OPTIONAL)</span>
          </label>
          <input
            type="text"
            value={builder.customGoal}
            onChange={(e) => onChange({ ...builder, customGoal: e.target.value })}
            placeholder="e.g. Hacking multi-modal agents @ HH Goa 🌴"
            maxLength={50}
            className="w-full bg-[#072a1e] text-[#FFF9E6] font-space text-sm px-4 py-2.5 rounded-xl border border-[#FFDF00]/40 focus:border-[#FFDF00] focus:outline-none placeholder-[#FFF9E6]/40"
          />
        </div>

      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <button
          onClick={onBack}
          className="bg-[#0B3B2B] hover:bg-[#FFDF00] text-[#FFF9E6] hover:text-[#072a1e] font-space font-bold text-sm px-5 py-3 rounded-xl border border-[#FFDF00]/40 transition-all cursor-pointer"
        >
          ← BACK TO PHOTO
        </button>

        <button
          onClick={onNext}
          className="bg-[#FFDF00] hover:bg-[#FF2E93] text-[#072a1e] hover:text-[#FFF9E6] font-syne font-extrabold text-lg px-8 py-3.5 rounded-xl shadow-[4px_4px_0px_#FF2E93] border-2 border-[#072a1e] transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <span>VIEW PREVIEW</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
