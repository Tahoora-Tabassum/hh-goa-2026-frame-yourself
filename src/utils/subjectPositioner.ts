import { FormatType, StyleVibe, CropConfig } from '../types';

export interface SubjectBoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface FrameTargetArea {
  x: number; // Top-left X in canvas pixels
  y: number; // Top-left Y in canvas pixels
  w: number; // Target width in canvas pixels
  h: number; // Target height in canvas pixels
  shape: 'circle' | 'arch' | 'wave' | 'rect';
  clipShape?: 'circle' | 'arch' | 'wave' | 'rect';
  anchorYRatio?: number; // Normalized top padding inside photo slot window
}

// Frame-specific placement configurations for 1:1 PFP (1080x1080) and 4:5 Builder ID (1080x1350)
export const FRAME_PLACEMENTS: Record<
  StyleVibe,
  {
    pfp: FrameTargetArea;
    builderIdPhotoCard: FrameTargetArea;
  }
> = {
  sunset: {
    // Frame 01: Goan Sunset (Golden Hour) - Single Circle cutout window
    pfp: {
      x: 255,
      y: 225,
      w: 570,
      h: 570,
      shape: 'circle',
      clipShape: 'circle',
      anchorYRatio: 0.08,
    },
    builderIdPhotoCard: {
      x: 340,
      y: 235,
      w: 400,
      h: 400,
      shape: 'circle',
      clipShape: 'circle',
      anchorYRatio: 0.08,
    },
  },
  tropical: {
    // Frame 02: Goan Greenery (Festival Carnival) - Single Circle cutout window
    pfp: {
      x: 255,
      y: 225,
      w: 570,
      h: 570,
      shape: 'circle',
      clipShape: 'circle',
      anchorYRatio: 0.08,
    },
    builderIdPhotoCard: {
      x: 350,
      y: 235,
      w: 380,
      h: 380,
      shape: 'circle',
      clipShape: 'circle',
      anchorYRatio: 0.08,
    },
  },
  wave: {
    // Frame 03: Goan Coast (Arabian Sea Waves) - Organic wave window
    pfp: {
      x: 240,
      y: 250,
      w: 600,
      h: 500,
      shape: 'wave',
      clipShape: 'wave',
      anchorYRatio: 0.06,
    },
    builderIdPhotoCard: {
      x: 330,
      y: 230,
      w: 420,
      h: 370,
      shape: 'wave',
      clipShape: 'wave',
      anchorYRatio: 0.06,
    },
  },
  editorial: {
    // Frame 04: Old Quarter (Portuguese Archway) - Arch cutout window
    pfp: {
      x: 310,
      y: 240,
      w: 460,
      h: 520,
      shape: 'arch',
      clipShape: 'arch',
      anchorYRatio: 0.07,
    },
    builderIdPhotoCard: {
      x: 370,
      y: 220,
      w: 340,
      h: 390,
      shape: 'arch',
      clipShape: 'arch',
      anchorYRatio: 0.07,
    },
  },
  after_dark: {
    // Frame 05: Goa After Dark (Tropical Nightlife) - Circle cutout window
    pfp: {
      x: 270,
      y: 240,
      w: 540,
      h: 540,
      shape: 'circle',
      clipShape: 'circle',
      anchorYRatio: 0.08,
    },
    builderIdPhotoCard: {
      x: 340,
      y: 230,
      w: 400,
      h: 400,
      shape: 'circle',
      clipShape: 'circle',
      anchorYRatio: 0.08,
    },
  },
};

// Cache subject bounding boxes by image source URL
const boundingBoxCache = new Map<string, SubjectBoundingBox>();

/**
 * Scans alpha channel of extracted transparent PNG to detect subject bounding box.
 */
export function detectSubjectBoundingBox(img: HTMLImageElement): SubjectBoundingBox {
  const src = img.src || img.currentSrc;
  if (src && boundingBoxCache.has(src)) {
    return boundingBoxCache.get(src)!;
  }

  const naturalW = img.naturalWidth || img.width || 800;
  const naturalH = img.naturalHeight || img.height || 800;

  // Use low-res offscreen canvas for fast alpha scan
  const sampleW = Math.min(300, naturalW);
  const sampleH = Math.round((sampleW / naturalW) * naturalH);

  const canvas = document.createElement('canvas');
  canvas.width = sampleW;
  canvas.height = sampleH;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback: SubjectBoundingBox = {
      minX: 0,
      minY: 0,
      maxX: naturalW,
      maxY: naturalH,
      width: naturalW,
      height: naturalH,
      centerX: naturalW / 2,
      centerY: naturalH / 2,
    };
    return fallback;
  }

  ctx.drawImage(img, 0, 0, sampleW, sampleH);
  const imageData = ctx.getImageData(0, 0, sampleW, sampleH);
  const data = imageData.data;

  let minX = sampleW;
  let minY = sampleH;
  let maxX = 0;
  let maxY = 0;
  let foundPixel = false;

  for (let y = 0; y < sampleH; y++) {
    for (let x = 0; x < sampleW; x++) {
      const alpha = data[(y * sampleW + x) * 4 + 3];
      if (alpha > 20) {
        // Non-transparent pixel
        foundPixel = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!foundPixel) {
    minX = 0;
    minY = 0;
    maxX = sampleW;
    maxY = sampleH;
  }

  // Scale back up to full image dimensions
  const scaleX = naturalW / sampleW;
  const scaleY = naturalH / sampleH;

  const result: SubjectBoundingBox = {
    minX: minX * scaleX,
    minY: minY * scaleY,
    maxX: maxX * scaleX,
    maxY: maxY * scaleY,
    width: Math.max(20, (maxX - minX + 1) * scaleX),
    height: Math.max(20, (maxY - minY + 1) * scaleY),
    centerX: ((minX + maxX) / 2) * scaleX,
    centerY: ((minY + maxY) / 2) * scaleY,
  };

  if (src) {
    boundingBoxCache.set(src, result);
  }

  return result;
}

/**
 * Calculates transform (drawX, drawY, drawW, drawH) to position and scale
 * the person cut-out seamlessly into the frame's designated photo area.
 */
export function calculateAutoSubjectTransform(
  img: HTMLImageElement,
  targetArea: FrameTargetArea,
  crop: CropConfig
) {
  const imgW = img.naturalWidth || img.width || 800;
  const imgH = img.naturalHeight || img.height || 800;

  const bbox = detectSubjectBoundingBox(img);

  // Calculate scales so subject bounding box fits cleanly inside targetArea without overflowing targetArea
  let baseScale: number;

  if (targetArea.shape === 'circle') {
    // For circular medallion compositions (Style 01 & Style 02)
    // Scale head & shoulders so upper-body fills ~75-85% of circle height
    const effectiveSubjectH = Math.min(bbox.height, bbox.width * 1.35);
    const scaleToFitW = (targetArea.w * 0.82) / bbox.width;
    const scaleToFitH = (targetArea.h * 0.82) / effectiveSubjectH;
    baseScale = Math.min(scaleToFitW, scaleToFitH);
  } else {
    // For other shapes
    const scaleToFitW = (targetArea.w * 0.92) / bbox.width;
    const scaleToFitH = (targetArea.h * 0.92) / bbox.height;
    baseScale = Math.min(scaleToFitW, scaleToFitH);
  }

  const finalScale = baseScale * crop.zoom;

  const drawW = imgW * finalScale;
  const drawH = imgH * finalScale;

  // Center subject horizontally in targetArea
  const targetCenterX = targetArea.x + targetArea.w / 2;
  const subjectCenterXInImg = bbox.centerX * finalScale;
  const offsetX = (crop.xOffset * targetArea.w) / 100;
  const drawX = targetCenterX - subjectCenterXInImg + offsetX;

  // Align head/upper-body near top of targetArea with slot-specific padding
  const anchorYRatio = targetArea.anchorYRatio ?? 0.08;
  const targetTopY = targetArea.y + targetArea.h * anchorYRatio;
  const subjectTopYInImg = bbox.minY * finalScale;
  const offsetY = (crop.yOffset * targetArea.h) / 100;
  const drawY = targetTopY - subjectTopYInImg + offsetY;

  return { drawX, drawY, drawW, drawH };
}
