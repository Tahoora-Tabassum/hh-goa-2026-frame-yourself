import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, ZoomIn, ZoomOut, RotateCw, RefreshCw, Sparkles, Check, Scissors, Eye, Image as ImageIcon } from 'lucide-react';
import heic2any from 'heic2any';
import { CropConfig, SamplePhoto } from '../types';
import { SAMPLE_PHOTOS } from '../constants/styles';
import { CornerBracket } from './GoaGraphics';

interface PhotoUploaderProps {
  rawPhotoUrl: string | null;
  cutoutPhotoUrl: string | null;
  isExtractingBg: boolean;
  bgProgress: { percentage: number; message: string };
  crop: CropConfig;
  onPhotoSelected: (url: string) => void;
  onCropChange: (newCrop: CropConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  rawPhotoUrl,
  cutoutPhotoUrl,
  isExtractingBg,
  bgProgress,
  crop,
  onPhotoSelected,
  onCropChange,
  onNext,
  onBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConvertingFile, setIsConvertingFile] = useState(false);
  const [useOriginalPhoto, setUseOriginalPhoto] = useState(false);

  const displayPhotoUrl = useOriginalPhoto ? rawPhotoUrl : (cutoutPhotoUrl || rawPhotoUrl);

  const processFile = async (file: File) => {
    if (!file) return;

    setIsConvertingFile(true);

    try {
      let finalBlob: Blob = file;

      // Handle HEIC/HEIF images from iPhone/iOS
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.heic') || fileName.endsWith('.heif') || file.type.includes('heic')) {
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9,
        });

        finalBlob = Array.isArray(converted) ? converted[0] : converted;
      }

      const imageUrl = URL.createObjectURL(finalBlob);
      onPhotoSelected(imageUrl);

      // Reset crop to default
      onCropChange({ zoom: 1.0, xOffset: 0, yOffset: 0, rotation: 0 });
    } catch (err) {
      console.error('Failed to process image:', err);
      try {
        const fallbackUrl = URL.createObjectURL(file);
        onPhotoSelected(fallbackUrl);
      } catch (fallbackErr) {
        alert('Could not open file. Please select a JPG or PNG image.');
      }
    } finally {
      setIsConvertingFile(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSelectPreset = (preset: SamplePhoto) => {
    onPhotoSelected(preset.url);
    onCropChange({ zoom: 1.0, xOffset: 0, yOffset: 0, rotation: 0 });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-center">
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 space-y-2"
      >
        <span className="font-space font-extrabold text-xs text-[#FF2E93] tracking-widest uppercase bg-[#FF2E93]/10 px-3 py-1 rounded-md border border-[#FF2E93]/30">
          STEP 03 • PHOTO UPLOAD
        </span>
        <h2 className="font-syne font-extrabold text-4xl sm:text-6xl text-[#FFDF00]">
          DROP YOUR PHOTO
        </h2>
        <p className="font-space text-sm sm:text-base text-[#FFF9E6]/80 max-w-lg mx-auto">
          Upload your portrait. Our AI automatically extracts your cutout and removes the background for your Goan frame artwork!
        </p>
      </motion.div>

      {/* Main Upload Dropzone / Frame Window */}
      <div className="relative mb-8">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !displayPhotoUrl && fileInputRef.current?.click()}
          className={`relative p-8 rounded-2xl border-4 transition-all duration-300 ${
            isDragging
              ? 'bg-[#FFDF00]/20 border-[#FF2E93] scale-[1.01]'
              : 'bg-[#0B3B2B] border-[#FFDF00] shadow-[10px_10px_0px_#FF2E93]'
          }`}
        >
          <CornerBracket className="absolute top-4 left-4 w-8 h-8 text-[#FFDF00]" />
          <CornerBracket className="absolute top-4 right-4 w-8 h-8 text-[#FFDF00] rotate-90" />
          <CornerBracket className="absolute bottom-4 left-4 w-8 h-8 text-[#FFDF00] -rotate-90" />
          <CornerBracket className="absolute bottom-4 right-4 w-8 h-8 text-[#FFDF00] rotate-180" />

          {isConvertingFile || isExtractingBg ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-[#FFDF00] animate-spin" />
                <Scissors className="w-6 h-6 text-[#FF2E93] absolute" />
              </div>
              
              <div className="space-y-2 w-full">
                <p className="font-space font-bold text-lg text-[#FFDF00]">
                  {isConvertingFile ? 'Processing Image File...' : bgProgress.message || 'Extracting Person Cut-out...'}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-[#072a1e] h-3 rounded-full overflow-hidden border border-[#FFDF00]/40">
                  <motion.div
                    className="bg-gradient-to-r from-[#FFDF00] to-[#FF2E93] h-full"
                    initial={{ width: '5%' }}
                    animate={{ width: `${Math.max(10, bgProgress.percentage)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="font-space text-xs text-[#FFF9E6]/70">
                  {bgProgress.percentage > 0 ? `${bgProgress.percentage}% complete` : 'Removing background pixels...'}
                </p>
              </div>
            </div>
          ) : displayPhotoUrl ? (
            /* Uploaded Photo Preview + Cutout Status & Controls */
            <div className="flex flex-col items-center space-y-6">
              
              {/* Photo View Box */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-xl overflow-hidden border-4 border-[#FFDF00] shadow-md bg-[#072a1e] bg-[radial-gradient(#FFDF00_1px,transparent_1px)] [background-size:16px_16px]">
                <img
                  src={displayPhotoUrl}
                  alt="Extracted cutout preview"
                  className="w-full h-full object-cover transition-transform duration-100"
                  style={{
                    transform: `scale(${crop.zoom}) translate(${crop.xOffset}%, ${crop.yOffset}%) rotate(${crop.rotation}deg)`,
                  }}
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-2 right-2 bg-[#FF2E93] text-[#FFF9E6] font-space text-[10px] font-bold px-2 py-1 rounded border border-[#FFDF00] flex items-center gap-1 shadow">
                  <Scissors className="w-3 h-3" />
                  {useOriginalPhoto ? 'RAW PHOTO' : 'BG REMOVED CUTOUT'}
                </div>
              </div>

              {/* Toggle Original vs Cutout option */}
              <div className="flex items-center gap-3 bg-[#072a1e] px-4 py-2 rounded-xl border border-[#FFDF00]/30">
                <button
                  onClick={() => setUseOriginalPhoto(false)}
                  className={`px-3 py-1.5 rounded-lg font-space text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    !useOriginalPhoto
                      ? 'bg-[#FFDF00] text-[#072a1e] shadow'
                      : 'text-[#FFF9E6]/70 hover:text-[#FFF9E6]'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  CUTOUT (BACKGROUND REMOVED)
                </button>

                <button
                  onClick={() => setUseOriginalPhoto(true)}
                  className={`px-3 py-1.5 rounded-lg font-space text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    useOriginalPhoto
                      ? 'bg-[#FF2E93] text-[#FFF9E6] shadow'
                      : 'text-[#FFF9E6]/70 hover:text-[#FFF9E6]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  ORIGINAL PHOTO
                </button>
              </div>

              {/* Crop Controls Panel */}
              <div className="bg-[#072a1e] p-4 rounded-xl border-2 border-[#FFDF00]/40 w-full max-w-md space-y-4 text-left">
                
                {/* Zoom Control */}
                <div className="flex items-center justify-between gap-3">
                  <span className="font-space text-xs font-bold text-[#FFDF00] flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5" /> ZOOM PERSON
                  </span>
                  <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                    <ZoomOut className="w-4 h-4 text-[#FFF9E6]/60" />
                    <input
                      type="range"
                      min="0.8"
                      max="2.5"
                      step="0.05"
                      value={crop.zoom}
                      onChange={(e) =>
                        onCropChange({ ...crop, zoom: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#FFDF00] cursor-pointer"
                    />
                    <ZoomIn className="w-4 h-4 text-[#FFDF00]" />
                  </div>
                </div>

                {/* Pan X / Pan Y Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-space text-[10px] font-bold text-[#FFF9E6]/80 block mb-1">
                      MOVE HORIZONTAL
                    </label>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      value={crop.xOffset}
                      onChange={(e) =>
                        onCropChange({ ...crop, xOffset: parseInt(e.target.value, 10) })
                      }
                      className="w-full accent-[#FFDF00] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="font-space text-[10px] font-bold text-[#FFF9E6]/80 block mb-1">
                      MOVE VERTICAL
                    </label>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      value={crop.yOffset}
                      onChange={(e) =>
                        onCropChange({ ...crop, yOffset: parseInt(e.target.value, 10) })
                      }
                      className="w-full accent-[#FFDF00] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Rotation & Change Photo buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-[#FFDF00]/20">
                  <button
                    onClick={() =>
                      onCropChange({ ...crop, rotation: (crop.rotation + 90) % 360 })
                    }
                    className="flex items-center gap-1 font-space text-xs font-bold text-[#FFDF00] hover:text-[#FF2E93] cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> ROTATE ({crop.rotation}°)
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 font-space text-xs font-bold text-[#FF2E93] hover:text-[#FFDF00] cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> UPLOAD DIFFERENT PHOTO
                  </button>
                </div>

              </div>

            </div>
          ) : (
            /* Empty State Prompt */
            <div className="py-12 flex flex-col items-center justify-center space-y-4 cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-[#FFDF00] text-[#072a1e] flex items-center justify-center border-4 border-[#072a1e] shadow-[4px_4px_0px_#FF2E93]">
                <Upload className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <p className="font-syne font-extrabold text-2xl sm:text-3xl text-[#FFDF00]">
                  DROP YOUR PORTRAIT HERE
                </p>
                <p className="font-space text-sm text-[#FFF9E6]/80">
                  Automatic AI background removal extracts you into the Goan frame
                </p>
              </div>

              <div className="inline-block bg-[#072a1e] px-4 py-1.5 rounded-full border border-[#FFDF00]/40 text-xs font-space font-bold text-[#FFDF00]">
                JPG • PNG • HEIC • WEBP
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Preset Builder Sample Photos Selection */}
      <div className="mb-10 text-left bg-[#072a1e] p-5 rounded-xl border border-[#FFDF00]/30">
        <p className="font-space font-bold text-xs text-[#FFDF00] tracking-wider uppercase mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#FF2E93]" />
          OR TRY WITH A SAMPLE BUILDER PRESET:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_PHOTOS.map((preset) => {
            const isSelected = rawPhotoUrl === preset.url;

            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B3B2B] border-[#FFDF00] ring-1 ring-[#FFDF00]'
                    : 'bg-[#0B3B2B]/40 border-[#FFDF00]/20 hover:border-[#FFDF00] hover:bg-[#0B3B2B]'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-12 h-12 rounded-md object-cover border border-[#FFDF00]"
                  referrerPolicy="no-referrer"
                />
                <div className="overflow-hidden">
                  <p className="font-syne font-bold text-xs text-[#FFDF00] truncate">
                    {preset.name}
                  </p>
                  <p className="font-space text-[10px] text-[#FFF9E6]/70 truncate">
                    {preset.role}
                  </p>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#FF2E93] ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <button
          onClick={onBack}
          className="bg-[#0B3B2B] hover:bg-[#FFDF00] text-[#FFF9E6] hover:text-[#072a1e] font-space font-bold text-sm px-5 py-3 rounded-xl border border-[#FFDF00]/40 transition-all cursor-pointer"
        >
          ← BACK TO VIBE
        </button>

        <button
          onClick={onNext}
          disabled={!displayPhotoUrl || isExtractingBg}
          className={`font-syne font-extrabold text-lg px-7 py-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2 ${
            displayPhotoUrl && !isExtractingBg
              ? 'bg-[#FFDF00] hover:bg-[#FF2E93] text-[#072a1e] hover:text-[#FFF9E6] border-[#072a1e] shadow-[4px_4px_0px_#FF2E93]'
              : 'bg-[#0B3B2B] text-[#FFF9E6]/40 border-[#FFDF00]/20 cursor-not-allowed'
          }`}
        >
          <span>NEXT</span>
          <span>→</span>
        </button>
      </div>

    </section>
  );
};
