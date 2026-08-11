/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FormatType, StyleVibe, CropConfig, BuilderDetails } from './types';
import { SAMPLE_PHOTOS } from './constants/styles';
import { extractPersonCutout } from './utils/backgroundRemoval';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FormatSelector } from './components/FormatSelector';
import { StyleSelector } from './components/StyleSelector';
import { PhotoUploader } from './components/PhotoUploader';
import { BuilderForm } from './components/BuilderForm';
import { LivePreview } from './components/LivePreview';
import { ActionControls } from './components/ActionControls';

export default function App() {
  // Step State: 1=Hero, 2=Format, 3=Style, 4=Photo, 5=Details, 6=Preview
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Application Graphic Config State
  const [format, setFormat] = useState<FormatType>('pfp');
  const [style, setStyle] = useState<StyleVibe>('sunset');
  
  // Photo State
  const [rawPhotoUrl, setRawPhotoUrl] = useState<string>(SAMPLE_PHOTOS[0].url);
  const [cutoutPhotoUrl, setCutoutPhotoUrl] = useState<string | null>(null);
  const [isExtractingBg, setIsExtractingBg] = useState<boolean>(false);
  const [bgProgress, setBgProgress] = useState<{ percentage: number; message: string }>({
    percentage: 0,
    message: '',
  });

  const [crop, setCrop] = useState<CropConfig>({
    zoom: 1.0,
    xOffset: 0,
    yOffset: 0,
    rotation: 0,
  });

  const [builder, setBuilder] = useState<BuilderDetails>({
    name: 'AARAV SHARMA',
    roleStack: 'AI • PYTHON • REACT',
    title: 'THE AI EXPLORER',
    customGoal: 'Hacking multi-modal agents @ HH Goa 🌴',
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger Automatic AI Background Removal whenever rawPhotoUrl changes
  useEffect(() => {
    if (!rawPhotoUrl) return;

    let isCancelled = false;
    setIsExtractingBg(true);
    setBgProgress({ percentage: 15, message: 'Initializing background removal...' });

    extractPersonCutout(rawPhotoUrl, {
      onProgress: (pct, msg) => {
        if (!isCancelled) {
          setBgProgress({ percentage: pct, message: msg });
        }
      },
    })
      .then((transparentUrl) => {
        if (!isCancelled) {
          setCutoutPhotoUrl(transparentUrl);
          setIsExtractingBg(false);
        }
      })
      .catch((err) => {
        console.error('Background removal failed, falling back to raw photo:', err);
        if (!isCancelled) {
          setCutoutPhotoUrl(rawPhotoUrl);
          setIsExtractingBg(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [rawPhotoUrl]);

  // Active photo passed to canvas composition (prefer cutout, fallback to raw)
  const activePhotoForCanvas = cutoutPhotoUrl || rawPhotoUrl;

  // Navigation handlers
  const handleStart = () => setCurrentStep(2);

  const handleSelectFormat = (fmt: FormatType) => {
    setFormat(fmt);
  };

  const handleNextFromFormat = () => {
    setCurrentStep(3);
  };

  const handleNextFromStyle = () => {
    setCurrentStep(4);
  };

  const handleNextFromPhoto = () => {
    if (format === 'builder_id') {
      setCurrentStep(5);
    } else {
      setCurrentStep(6);
    }
  };

  const handleNextFromDetails = () => {
    setCurrentStep(6);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormat('pfp');
    setStyle('sunset');
    setRawPhotoUrl(SAMPLE_PHOTOS[0].url);
    setCutoutPhotoUrl(null);
    setCrop({ zoom: 1.0, xOffset: 0, yOffset: 0, rotation: 0 });
    setBuilder({
      name: 'AARAV SHARMA',
      roleStack: 'AI • PYTHON • REACT',
      title: 'THE AI EXPLORER',
      customGoal: 'Hacking multi-modal agents @ HH Goa 🌴',
    });
  };

  return (
    <div className="min-h-screen bg-[#072a1e] text-[#FFF9E6] font-sans antialiased flex flex-col justify-between selection:bg-[#FFDF00] selection:text-[#072a1e]">
      
      {/* Top Header Navigation */}
      <Header
        currentStep={currentStep}
        totalSteps={6}
        onReset={handleReset}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Main Flow Container */}
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: HERO */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection onStart={handleStart} />
            </motion.div>
          )}

          {/* STEP 2: FORMAT SELECTION */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormatSelector
                selectedFormat={format}
                onSelectFormat={handleSelectFormat}
                onNext={handleNextFromFormat}
              />
            </motion.div>
          )}

          {/* STEP 3: STYLE SELECTION */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StyleSelector
                selectedStyle={style}
                onSelectStyle={(st) => setStyle(st)}
                format={format}
                samplePhotoUrl={activePhotoForCanvas}
                onNext={handleNextFromStyle}
                onBack={() => setCurrentStep(2)}
              />
            </motion.div>
          )}

          {/* STEP 4: PHOTO UPLOAD */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PhotoUploader
                rawPhotoUrl={rawPhotoUrl}
                cutoutPhotoUrl={cutoutPhotoUrl}
                isExtractingBg={isExtractingBg}
                bgProgress={bgProgress}
                crop={crop}
                onPhotoSelected={(url) => {
                  setRawPhotoUrl(url);
                  setCutoutPhotoUrl(null);
                }}
                onCropChange={(c) => setCrop(c)}
                onNext={handleNextFromPhoto}
                onBack={() => setCurrentStep(3)}
              />
            </motion.div>
          )}

          {/* STEP 5: BUILDER DETAILS (Builder ID format) */}
          {currentStep === 5 && format === 'builder_id' && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BuilderForm
                builder={builder}
                onChange={(b) => setBuilder(b)}
                onNext={handleNextFromDetails}
                onBack={() => setCurrentStep(4)}
              />
            </motion.div>
          )}

          {/* STEP 6: LIVE PREVIEW & FINAL DOWNLOAD */}
          {currentStep === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto px-4 py-8 text-center space-y-6"
            >
              <LivePreview
                format={format}
                style={style}
                photoUrl={activePhotoForCanvas}
                crop={crop}
                builder={builder}
                canvasRef={canvasRef}
              />

              <ActionControls
                canvasRef={canvasRef}
                onEdit={() => setCurrentStep(format === 'builder_id' ? 5 : 4)}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-[#FFDF00]/20 py-6 px-4 bg-[#052319] text-center text-xs font-space text-[#FFF9E6]/60">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-syne font-bold text-[#FFDF00]">HH GOA 2026</span>
            <span>• FRAME YOURSELF</span>
          </div>
          <p>
            Designed for HH Goa 2026 Builders • #FrameInGoa 🌴
          </p>
        </div>
      </footer>

    </div>
  );
}
