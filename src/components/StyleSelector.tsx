import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { StyleVibe, FormatType, CropConfig } from '../types';
import { STYLE_OPTIONS } from '../constants/styles';
import { drawGraphicToCanvas } from '../utils/canvasRenderer';
import { Starburst } from './GoaGraphics';

interface StyleSelectorProps {
  selectedStyle: StyleVibe;
  onSelectStyle: (style: StyleVibe) => void;
  format: FormatType;
  samplePhotoUrl: string;
  onNext: () => void;
  onBack: () => void;
}

const defaultCrop: CropConfig = { zoom: 1.0, xOffset: 0, yOffset: 0, rotation: 0 };
const defaultBuilder = {
  name: 'BUILDER NAME',
  roleStack: 'AI • PYTHON',
  title: 'THE FUTURE BUILDER',
  customGoal: 'Hacking in Goa',
};

const StyleThumbnailCanvas: React.FC<{
  style: StyleVibe;
  format: FormatType;
  samplePhotoUrl: string;
}> = ({ style, format, samplePhotoUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = samplePhotoUrl;
    img.onload = () => {
      if (canvasRef.current) {
        drawGraphicToCanvas({
          canvas: canvasRef.current,
          format,
          style,
          image: img,
          crop: defaultCrop,
          builder: defaultBuilder,
        });
      }
    };
  }, [style, format, samplePhotoUrl]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-cover rounded-lg"
      width={200}
      height={format === 'pfp' ? 200 : 250}
    />
  );
};

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  format,
  samplePhotoUrl,
  onNext,
  onBack,
}) => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10 text-center">
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 space-y-2"
      >
        <span className="font-space font-extrabold text-xs text-[#FFDF00] tracking-widest uppercase bg-[#0B3B2B] px-3 py-1 rounded-md border border-[#FFDF00]/30">
          STEP 02 • VISUAL IDENTITY
        </span>
        <h2 className="font-syne font-extrabold text-4xl sm:text-6xl text-[#FFDF00]">
          CHOOSE YOUR VIBE
        </h2>
        <p className="font-space text-sm sm:text-base text-[#FFF9E6]/80 max-w-xl mx-auto">
          Five distinct personalities for HH Goa 2026. Select the visual atmosphere that matches your builder spirit.
        </p>
      </motion.div>

      {/* 5 Style Thumbnails Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10 text-left">
        {STYLE_OPTIONS.map((style) => {
          const isSelected = selectedStyle === style.id;

          return (
            <motion.div
              key={style.id}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => onSelectStyle(style.id)}
              className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#0B3B2B] border-[#FFDF00] shadow-[6px_6px_0px_#FF2E93] ring-2 ring-[#FFDF00]'
                  : 'bg-[#072a1e] border-[#FFDF00]/30 hover:border-[#FFDF00] hover:bg-[#0B3B2B]/60 shadow-sm'
              }`}
            >
              {/* Badge Number */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-space font-extrabold text-xs text-[#FFDF00]">
                  STYLE {style.numberStr}
                </span>
                <span
                  className="font-space text-[10px] font-bold px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: style.accentHex + '20',
                    color: style.accentHex,
                    borderColor: style.accentHex + '60',
                  }}
                >
                  {style.vibeBadge}
                </span>
              </div>

              {/* Visual Thumbnail Preview Container */}
              <div
                className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#FFDF00]/40 my-2 flex items-center justify-center bg-[#072a1e]"
                style={{ backgroundColor: style.bgHex }}
              >
                <StyleThumbnailCanvas
                  style={style.id}
                  format={format}
                  samplePhotoUrl={samplePhotoUrl}
                />
              </div>

              {/* Style Details */}
              <div className="mt-2 space-y-1">
                <h4 className="font-syne font-extrabold text-lg text-[#FFDF00] flex items-center justify-between">
                  <span>{style.name}</span>
                  {isSelected && <Starburst className="w-4 h-4 text-[#FF2E93]" />}
                </h4>
                <p className="font-space text-xs text-[#FFF9E6]/80 line-clamp-2 leading-snug">
                  {style.tagline}
                </p>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between max-w-lg mx-auto pt-2">
        <button
          onClick={onBack}
          className="bg-[#0B3B2B] hover:bg-[#FFDF00] text-[#FFF9E6] hover:text-[#072a1e] font-space font-bold text-sm px-5 py-3 rounded-xl border border-[#FFDF00]/40 transition-all cursor-pointer"
        >
          ← BACK TO FORMAT
        </button>

        <button
          onClick={onNext}
          className="bg-[#FFDF00] hover:bg-[#FF2E93] text-[#072a1e] hover:text-[#FFF9E6] font-syne font-extrabold text-lg px-7 py-3 rounded-xl shadow-[4px_4px_0px_#FF2E93] border-2 border-[#072a1e] transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <span>UPLOAD PHOTO</span>
          <span>→</span>
        </button>
      </div>

    </section>
  );
};
