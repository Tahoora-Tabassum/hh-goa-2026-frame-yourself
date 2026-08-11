import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { FormatType, StyleVibe, CropConfig, BuilderDetails } from '../types';
import { drawGraphicToCanvas, preloadFrameImages } from '../utils/canvasRenderer';
import { Starburst, CornerBracket } from './GoaGraphics';

interface LivePreviewProps {
  format: FormatType;
  style: StyleVibe;
  photoUrl: string | null;
  crop: CropConfig;
  builder: BuilderDetails;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  format,
  style,
  photoUrl,
  crop,
  builder,
  canvasRef,
}) => {
  const loadedImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    preloadFrameImages();
  }, []);

  const redraw = useCallback(() => {
    if (!canvasRef.current) return;
    drawGraphicToCanvas({
      canvas: canvasRef.current,
      format,
      style,
      image: loadedImgRef.current,
      crop,
      builder,
      onFrameLoaded: () => {
        if (canvasRef.current) {
          drawGraphicToCanvas({
            canvas: canvasRef.current,
            format,
            style,
            image: loadedImgRef.current,
            crop,
            builder,
          });
        }
      },
    });
  }, [canvasRef, format, style, crop, builder]);

  // Redraw canvas whenever any prop changes
  useEffect(() => {
    if (photoUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = photoUrl;
      img.onload = () => {
        loadedImgRef.current = img;
        redraw();
      };
    } else {
      loadedImgRef.current = null;
      redraw();
    }
  }, [photoUrl, redraw]);

  useEffect(() => {
    redraw();
  }, [format, style, crop, builder, redraw]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      
      {/* Badge Header */}
      <div className="inline-flex items-center gap-2 bg-[#0B3B2B] px-3.5 py-1.5 rounded-md border border-[#FFDF00]/40">
        <Starburst className="w-4 h-4 text-[#FF2E93] animate-pulse" />
        <span className="font-space font-extrabold text-xs text-[#FFDF00] uppercase tracking-wider">
          LIVE GRAPHIC PREVIEW • {format === 'pfp' ? '1:1 SQUARE' : '4:5 CARD'}
        </span>
      </div>

      {/* Canvas Display Frame Container */}
      <div className="relative p-3 sm:p-5 bg-[#0B3B2B] rounded-2xl border-4 border-[#FFDF00] shadow-[12px_12px_0px_#FF2E93] max-w-md w-full">
        <CornerBracket className="absolute top-2 left-2 w-6 h-6 text-[#FFDF00]" />
        <CornerBracket className="absolute top-2 right-2 w-6 h-6 text-[#FFDF00] rotate-90" />
        <CornerBracket className="absolute bottom-2 left-2 w-6 h-6 text-[#FFDF00] -rotate-90" />
        <CornerBracket className="absolute bottom-2 right-2 w-6 h-6 text-[#FFDF00] rotate-180" />

        <div className="relative rounded-xl overflow-hidden bg-[#072a1e] flex justify-center items-center shadow-inner">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
          />
        </div>
      </div>

    </div>
  );
};
