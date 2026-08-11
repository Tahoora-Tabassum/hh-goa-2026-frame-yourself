import { FormatType, StyleVibe, CropConfig, BuilderDetails, StyleOption } from '../types';
import { STYLE_OPTIONS } from '../constants/styles';
import {
  FRAME_PLACEMENTS,
  calculateAutoSubjectTransform,
  FrameTargetArea,
} from './subjectPositioner';

interface DrawParams {
  canvas: HTMLCanvasElement;
  format: FormatType;
  style: StyleVibe;
  image: HTMLImageElement | null;
  crop: CropConfig;
  builder: BuilderDetails;
  onFrameLoaded?: () => void;
}

// Image cache for frame overlay assets
const frameImageCache: Record<string, HTMLImageElement> = {};

export function preloadFrameImages(): void {
  STYLE_OPTIONS.forEach((s) => {
    if (s.frameImageUrl && !frameImageCache[s.frameImageUrl]) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = s.frameImageUrl;
      img.onload = () => {
        frameImageCache[s.frameImageUrl] = img;
      };
    }
  });
}

function getFrameImage(url: string, onLoaded?: () => void): HTMLImageElement | null {
  if (!url) return null;
  if (frameImageCache[url] && frameImageCache[url].complete) {
    return frameImageCache[url];
  }
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = url;
  img.onload = () => {
    frameImageCache[url] = img;
    if (onLoaded) onLoaded();
  };
  return null;
}

export function drawGraphicToCanvas({
  canvas,
  format,
  style,
  image,
  crop,
  builder,
  onFrameLoaded,
}: DrawParams): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Crisp high-res canvas dimensions
  if (format === 'pfp') {
    canvas.width = 1080;
    canvas.height = 1080;
  } else {
    canvas.width = 1080;
    canvas.height = 1350;
  }

  const W = canvas.width;
  const H = canvas.height;

  const styleConfig = STYLE_OPTIONS.find((s) => s.id === style) || STYLE_OPTIONS[0];
  const frameImg = getFrameImage(styleConfig.frameImageUrl, onFrameLoaded);

  // 1. CLEAR CANVAS
  ctx.save();
  ctx.fillStyle = styleConfig.bgHex;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  if (format === 'pfp') {
    drawPfpComposition(ctx, W, H, styleConfig, frameImg, image, crop);
  } else {
    drawBuilderIdComposition(ctx, W, H, styleConfig, frameImg, image, crop, builder);
  }
}

/**
 * Composites 1:1 PFP Graphic
 */
function drawPfpComposition(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  styleConfig: StyleOption,
  frameImg: HTMLImageElement | null,
  personImg: HTMLImageElement | null,
  crop: CropConfig
) {
  const placement = FRAME_PLACEMENTS[styleConfig.id]?.pfp || FRAME_PLACEMENTS.sunset.pfp;

  // LAYER 1: FRAME ARTWORK AS BACKGROUND ENVIRONMENT
  if (frameImg) {
    ctx.save();
    ctx.drawImage(frameImg, 0, 0, W, H);
    ctx.restore();

    // COVER ANY WHITE SPACE / HOLE IN THE TEMPLATE IMAGE BEHIND PHOTO SLOT FOR FRAME 1 & FRAME 2
    if (styleConfig.id === 'sunset' || styleConfig.id === 'tropical') {
      const cx = placement.x + placement.w / 2;
      const cy = placement.y + placement.h / 2;
      const holeRadius = placement.w / 2 + 60; // Completely covers white aperture region in artwork

      ctx.save();
      ctx.fillStyle = styleConfig.bgHex;
      ctx.beginPath();
      ctx.arc(cx, cy, holeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else {
    drawFallbackTexture(ctx, W, H, styleConfig);
  }

  // LAYER 2: TRANSPARENT PERSON CUT-OUT (AUTOMATICALLY FIT TO FRAME'S TARGET AREA)
  ctx.save();

  // Clip canvas to the frame's specific cutout window shape
  clipToAreaShape(ctx, placement);

  // Render art-directed frame-specific background inside photo slot
  drawFrameSlotBackground(ctx, placement, styleConfig);

  // Render transparent person cutout on top of slot background with lighting integration
  if (personImg) {
    drawSubjectWithIntegration(ctx, personImg, placement, crop, styleConfig);
  }

  ctx.restore();

  // LAYER 3: FOREGROUND INTEGRATION FRAME & BORDER RINGS
  ctx.save();
  drawForegroundBorderRing(ctx, placement, styleConfig);
  ctx.restore();

  // LAYER 4: BRANDING TYPOGRAPHY & BADGES
  // Only render fallback badges if frameImg is NOT present.
  // When frameImg is present, the original frame artwork is the master design and remains 100% visible.
  if (!frameImg) {
    ctx.save();
    drawPfpBadges(ctx, W, H, styleConfig);
    ctx.restore();
  }
}

/**
 * Composites 4:5 Builder ID Graphic
 */
function drawBuilderIdComposition(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  styleConfig: StyleOption,
  frameImg: HTMLImageElement | null,
  personImg: HTMLImageElement | null,
  crop: CropConfig,
  builder: BuilderDetails
) {
  const pfpPlacement =
    FRAME_PLACEMENTS[styleConfig.id]?.pfp || FRAME_PLACEMENTS.sunset.pfp;

  // 0. Base card dark green background
  ctx.save();
  ctx.fillStyle = '#072a1e';
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // 1. TOP HEADER BANNER
  ctx.save();
  ctx.fillStyle = '#072a1e';
  ctx.fillRect(0, 0, W, 140);

  ctx.fillStyle = styleConfig.accentHex;
  ctx.fillRect(0, 136, W, 4);

  ctx.fillStyle = styleConfig.accentHex;
  ctx.font = '800 44px "Syne", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('HH GOA 2026', 60, 70);

  ctx.font = '700 22px "Space Grotesk", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('BUILDER ID • #FrameInGoa', W - 60, 70);
  ctx.restore();

  // 2. MINIMIZED & FITTED 1:1 PFP FRAME DESIGN INSIDE BUILDER ID PHOTO AREA
  const frameSize = 630;
  const frameX = (W - frameSize) / 2; // 225px
  const frameY = 150;
  const s = frameSize / 1080;

  ctx.save();
  ctx.translate(frameX, frameY);
  ctx.scale(s, s);

  // Draw Frame Artwork Background (1080x1080 design scaled down)
  if (frameImg) {
    ctx.save();
    ctx.drawImage(frameImg, 0, 0, 1080, 1080);
    ctx.restore();

    // COVER ANY WHITE SPACE / HOLE IN TEMPLATE IMAGE BEHIND PHOTO SLOT FOR FRAME 1 & 2
    if (styleConfig.id === 'sunset' || styleConfig.id === 'tropical') {
      const cx = pfpPlacement.x + pfpPlacement.w / 2;
      const cy = pfpPlacement.y + pfpPlacement.h / 2;
      const holeRadius = pfpPlacement.w / 2 + 60;

      ctx.save();
      ctx.fillStyle = styleConfig.bgHex;
      ctx.beginPath();
      ctx.arc(cx, cy, holeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else {
    drawFallbackTexture(ctx, 1080, 1080, styleConfig);
  }

  // PHOTO SLOT: Theme Background & Person Cut-Out
  ctx.save();
  clipToAreaShape(ctx, pfpPlacement);

  // Render art-directed frame-specific background inside photo slot
  drawFrameSlotBackground(ctx, pfpPlacement, styleConfig);

  // Render person cutout inside photo slot
  if (personImg) {
    drawSubjectWithIntegration(ctx, personImg, pfpPlacement, crop, styleConfig);
  }
  ctx.restore(); // Ends photo slot clipping context cleanly

  // FOREGROUND INTEGRATION FRAME & BORDER RINGS
  ctx.save();
  drawForegroundBorderRing(ctx, pfpPlacement, styleConfig);
  ctx.restore();

  ctx.restore(); // Ends scaled frame context cleanly

  // Photo Badge Overlay
  ctx.save();
  ctx.fillStyle = '#072a1e';
  ctx.beginPath();
  ctx.roundRect(W - 270, 160, 210, 42, 12);
  ctx.fill();
  ctx.strokeStyle = styleConfig.accentHex;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = styleConfig.accentHex;
  ctx.font = '800 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦ GOA BUILDER', W - 165, 181);
  ctx.restore();

  // 5. BUILDER DETAILS SECTION BELOW THE FRAME (Kept exactly as it is)
  const detailsY = 790;

  ctx.save();
  // Solid details background to ensure text contrast and clear hierarchy
  ctx.fillStyle = '#072a1e';
  ctx.fillRect(0, detailsY - 10, W, H - (detailsY - 10));

  // Top accent border for details section
  ctx.strokeStyle = styleConfig.accentHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(60, detailsY - 10);
  ctx.lineTo(W - 60, detailsY - 10);
  ctx.stroke();

  // Name
  const nameText = (builder.name || 'YOUR NAME').toUpperCase();
  ctx.fillStyle = styleConfig.accentHex;
  ctx.font = '800 48px "Syne", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  let displayName = nameText;
  if (displayName.length > 22) {
    displayName = displayName.substring(0, 20) + '...';
  }
  ctx.fillText(displayName, 60, detailsY + 15);

  // Playful Title Badge
  const titleText = builder.title || 'THE FUTURE BUILDER';
  ctx.font = '800 22px "Space Grotesk", sans-serif';
  const titleWidth = ctx.measureText(titleText).width + 44;

  ctx.fillStyle = styleConfig.secondaryHex;
  ctx.beginPath();
  ctx.roundRect(60, detailsY + 75, titleWidth, 44, 12);
  ctx.fill();

  ctx.fillStyle = '#072a1e';
  ctx.fillText(titleText, 82, detailsY + 86);

  // Role & Stack Pills
  const roleText = builder.roleStack || 'AI • PYTHON • REACT';
  const roleItems = roleText.split(/[•,/|]+/).map((s) => s.trim()).filter(Boolean);

  let currentPillX = 60;
  const pillY = detailsY + 135;

  ctx.font = '700 18px "Space Grotesk", sans-serif';
  roleItems.forEach((roleItem) => {
    const textWidth = ctx.measureText(roleItem).width;
    const pillW = textWidth + 32;

    if (currentPillX + pillW < W - 60) {
      ctx.fillStyle = '#0B3B2B';
      ctx.beginPath();
      ctx.roundRect(currentPillX, pillY, pillW, 38, 19);
      ctx.fill();

      ctx.strokeStyle = styleConfig.accentHex;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#FFF9E6';
      ctx.fillText(roleItem, currentPillX + 16, pillY + 9);

      currentPillX += pillW + 12;
    }
  });

  // Goal / Tagline
  if (builder.customGoal && builder.customGoal.trim().length > 0) {
    ctx.fillStyle = '#FFF9E6EE';
    ctx.font = 'italic 600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`"${builder.customGoal}"`, 60, detailsY + 192);
  }
  ctx.restore();

  // 6. FOOTER DETAILS
  const footerY = H - 65;

  ctx.save();
  ctx.strokeStyle = styleConfig.accentHex + '40';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, footerY - 20);
  ctx.lineTo(W - 60, footerY - 20);
  ctx.stroke();

  ctx.fillStyle = styleConfig.accentHex;
  ctx.font = '800 18px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('MARCH 14-16, 2026 • GOA, INDIA', 60, footerY + 10);

  ctx.fillStyle = '#FFF9E6AA';
  ctx.font = '700 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('PASSPORT TO HH GOA 2026', W - 60, footerY + 10);
  ctx.restore();
}

/**
 * Clips canvas to target area's shape (circle, wave, arch, rect)
 */
function clipToAreaShape(ctx: CanvasRenderingContext2D, target: FrameTargetArea) {
  ctx.beginPath();
  if (target.shape === 'arch') {
    const cx = target.x + target.w / 2;
    const topY = target.y;
    const bottomY = target.y + target.h;
    const r = target.w / 2;

    ctx.moveTo(cx - r, bottomY);
    ctx.lineTo(cx - r, topY + r);
    ctx.arc(cx, topY + r, r, Math.PI, 0);
    ctx.lineTo(cx + r, bottomY);
    ctx.closePath();
  } else if (target.shape === 'wave') {
    const cx = target.x + target.w / 2;
    const cy = target.y + target.h / 2;
    const rx = target.w / 2;
    const ry = target.h / 2;

    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  } else if (target.shape === 'rect') {
    ctx.roundRect(target.x, target.y, target.w, target.h, 20);
  } else {
    // Circle
    const cx = target.x + target.w / 2;
    const cy = target.y + target.h / 2;
    // Radius slightly padded (+2px) so slot background & photo touch and extend under the border ring
    const radius = target.w / 2 + 2;

    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  }
  ctx.clip();
}

/**
 * Draws frame window border outline / integration ring
 */
function drawForegroundBorderRing(
  ctx: CanvasRenderingContext2D,
  target: FrameTargetArea,
  styleConfig: StyleOption
) {
  ctx.save();

  if (target.shape === 'arch') {
    const cx = target.x + target.w / 2;
    const topY = target.y;
    const bottomY = target.y + target.h;
    const r = target.w / 2;

    // Outer arch stroke
    ctx.strokeStyle = styleConfig.accentHex;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - r, bottomY);
    ctx.lineTo(cx - r, topY + r);
    ctx.arc(cx, topY + r, r, Math.PI, 0);
    ctx.lineTo(cx + r, bottomY);
    ctx.stroke();

    // Inner arch stroke
    ctx.strokeStyle = styleConfig.secondaryHex;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - r + 8, bottomY);
    ctx.lineTo(cx - r + 8, topY + r);
    ctx.arc(cx, topY + r, r - 8, Math.PI, 0);
    ctx.lineTo(cx + r - 8, bottomY);
    ctx.stroke();

    // Arch base sill
    ctx.strokeStyle = styleConfig.accentHex;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - r - 16, bottomY);
    ctx.lineTo(cx + r + 16, bottomY);
    ctx.stroke();
  } else if (target.shape === 'wave') {
    const cx = target.x + target.w / 2;
    const cy = target.y + target.h / 2;
    const rx = target.w / 2;
    const ry = target.h / 2;

    ctx.strokeStyle = styleConfig.accentHex;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = styleConfig.secondaryHex;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx + 10, ry + 10, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // Single crisp circular frame border ring touching slot edge with zero gap
    const cx = target.x + target.w / 2;
    const cy = target.y + target.h / 2;
    const r = target.w / 2;

    const ringColor =
      styleConfig.id === 'sunset'
        ? '#FFBF00'
        : styleConfig.id === 'tropical'
        ? '#10B981'
        : styleConfig.accentHex;

    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draws top header and bottom footer badges for 1:1 PFP mode
 */
function drawPfpBadges(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  styleConfig: StyleOption
) {
  // Top Header Badge
  ctx.fillStyle = styleConfig.accentHex;
  ctx.beginPath();
  ctx.roundRect(W / 2 - 210, 36, 420, 52, 26);
  ctx.fill();

  ctx.fillStyle = '#072a1e';
  ctx.font = '800 22px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HH GOA 2026 • OFFICIAL', W / 2, 62);

  // Bottom Footer Banner Badge
  ctx.fillStyle = '#072a1eEE';
  ctx.beginPath();
  ctx.roundRect(80, H - 110, W - 160, 72, 18);
  ctx.fill();

  ctx.strokeStyle = styleConfig.accentHex;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = styleConfig.accentHex;
  ctx.font = '800 28px "Syne", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('FRAME YOURSELF', 110, H - 74);

  ctx.fillStyle = '#FFF9E6';
  ctx.font = '700 20px "Space Grotesk", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('#FrameInGoa 🌴', W - 110, H - 74);
}

function drawFallbackTexture(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  styleConfig: StyleOption
) {
  ctx.fillStyle = styleConfig.bgHex;
  ctx.fillRect(0, 0, W, H);
}

/**
 * Renders the transparent person cutout inside the slot with subtle drop shadow
 * and theme-matching ambient light integration (source-atop tint).
 */
function drawSubjectWithIntegration(
  ctx: CanvasRenderingContext2D,
  personImg: HTMLImageElement,
  placement: FrameTargetArea,
  crop: CropConfig,
  styleConfig: StyleOption
) {
  const { drawX, drawY, drawW, drawH } = calculateAutoSubjectTransform(
    personImg,
    placement,
    crop
  );

  // 1. Render subject with soft depth shadow against slot background
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;

  if (crop.rotation) {
    const centerX = drawX + drawW / 2;
    const centerY = drawY + drawH / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((crop.rotation * Math.PI) / 180);
    ctx.drawImage(personImg, -drawW / 2, -drawH / 2, drawW, drawH);
  } else {
    ctx.drawImage(personImg, drawX, drawY, drawW, drawH);
  }
  ctx.restore();

  // 2. Subtle ambient light integration layer over subject (source-atop)
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';

  const cx = placement.x + placement.w / 2;
  const cy = placement.y + placement.h / 2;
  const w = placement.w;
  const h = placement.h;

  if (styleConfig.id === 'sunset') {
    // Golden hour warm sheen
    const ambientGrad = ctx.createRadialGradient(cx, cy - h * 0.2, 10, cx, cy, Math.max(w, h));
    ambientGrad.addColorStop(0, 'rgba(255, 240, 160, 0.12)');
    ambientGrad.addColorStop(0.5, 'rgba(255, 122, 0, 0.07)');
    ambientGrad.addColorStop(1, 'rgba(255, 46, 147, 0.04)');
    ctx.fillStyle = ambientGrad;
    ctx.fillRect(placement.x - 20, placement.y - 20, w + 40, h + 40);
  } else if (styleConfig.id === 'tropical') {
    // Tropical warm emerald tint
    const ambientGrad = ctx.createLinearGradient(placement.x, placement.y, placement.x, placement.y + h);
    ambientGrad.addColorStop(0, 'rgba(163, 230, 53, 0.08)');
    ambientGrad.addColorStop(1, 'rgba(11, 59, 43, 0.05)');
    ctx.fillStyle = ambientGrad;
    ctx.fillRect(placement.x - 20, placement.y - 20, w + 40, h + 40);
  } else if (styleConfig.id === 'wave') {
    // Coastal ocean turquoise tint
    const ambientGrad = ctx.createLinearGradient(placement.x, placement.y, placement.x + w, placement.y + h);
    ambientGrad.addColorStop(0, 'rgba(2, 195, 154, 0.08)');
    ambientGrad.addColorStop(1, 'rgba(2, 128, 144, 0.05)');
    ctx.fillStyle = ambientGrad;
    ctx.fillRect(placement.x - 20, placement.y - 20, w + 40, h + 40);
  } else if (styleConfig.id === 'editorial') {
    // Old Quarter heritage warm cream / terracotta tint
    const ambientGrad = ctx.createLinearGradient(placement.x, placement.y, placement.x, placement.y + h);
    ambientGrad.addColorStop(0, 'rgba(255, 249, 230, 0.08)');
    ambientGrad.addColorStop(1, 'rgba(200, 90, 50, 0.05)');
    ctx.fillStyle = ambientGrad;
    ctx.fillRect(placement.x - 20, placement.y - 20, w + 40, h + 40);
  } else {
    // Goa Nightlife magenta / yellow ambient glow
    const ambientGrad = ctx.createRadialGradient(cx, cy - h * 0.15, 10, cx, cy, Math.max(w, h));
    ambientGrad.addColorStop(0, 'rgba(255, 46, 147, 0.10)');
    ambientGrad.addColorStop(0.6, 'rgba(255, 223, 0, 0.05)');
    ambientGrad.addColorStop(1, 'rgba(2, 27, 19, 0.03)');
    ctx.fillStyle = ambientGrad;
    ctx.fillRect(placement.x - 20, placement.y - 20, w + 40, h + 40);
  }

  ctx.restore();
}

/**
  * Renders an art-directed frame-specific background inside the photo slot window
  * before the person cutout is drawn over it.
  */
function drawFrameSlotBackground(
  ctx: CanvasRenderingContext2D,
  target: FrameTargetArea,
  styleConfig: StyleOption
) {
  const x = target.x;
  const y = target.y;
  const w = target.w;
  const h = target.h;
  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.save();

  if (styleConfig.id === 'sunset') {
    // FRAME 01: GOAN SUNSET / GOLDEN HOUR
    // Warm radial sunset gradient with soft sun disc & golden sky glow
    const bgGrad = ctx.createRadialGradient(cx, cy - h * 0.15, 10, cx, cy, Math.max(w, h) * 0.75);
    bgGrad.addColorStop(0, '#FFF3A8');
    bgGrad.addColorStop(0.25, '#FFDF00');
    bgGrad.addColorStop(0.55, '#FF7A00');
    bgGrad.addColorStop(0.85, '#FF2E93');
    bgGrad.addColorStop(1, '#6B113B');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(x - 30, y - 30, w + 60, h + 60);

    // Soft glowing sun disc
    const sunGrad = ctx.createRadialGradient(cx, cy - h * 0.1, 0, cx, cy - h * 0.1, w * 0.35);
    sunGrad.addColorStop(0, 'rgba(255, 255, 240, 0.9)');
    sunGrad.addColorStop(0.5, 'rgba(255, 223, 0, 0.4)');
    sunGrad.addColorStop(1, 'rgba(255, 122, 0, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(cx, cy - h * 0.1, w * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Subtle warm sunset horizon line curve
    ctx.fillStyle = 'rgba(255, 46, 147, 0.18)';
    ctx.beginPath();
    ctx.ellipse(cx, y + h * 0.85, w * 0.6, h * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

  } else if (styleConfig.id === 'tropical') {
    // FRAME 02: GOAN GREENERY / FESTIVAL CARNIVAL
    // Deep emerald to tropical botanical green gradient with leaf/canopy shadows
    const bgGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    bgGrad.addColorStop(0, '#041D15');
    bgGrad.addColorStop(0.35, '#0B3B2B');
    bgGrad.addColorStop(0.7, '#10B981');
    bgGrad.addColorStop(1, '#A3E635');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(x - 30, y - 30, w + 60, h + 60);

    // Soft botanical leaf silhouette shadows
    ctx.fillStyle = 'rgba(4, 29, 21, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.2, y + h * 0.2, w * 0.4, h * 0.25, Math.PI / 4, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.8, y + h * 0.3, w * 0.35, h * 0.22, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Golden carnival sunlight ray
    const rayGrad = ctx.createRadialGradient(cx, y + h * 0.1, 0, cx, y + h * 0.1, w * 0.5);
    rayGrad.addColorStop(0, 'rgba(255, 223, 0, 0.25)');
    rayGrad.addColorStop(1, 'rgba(11, 59, 43, 0)');
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.arc(cx, y + h * 0.1, w * 0.5, 0, Math.PI * 2);
    ctx.fill();

  } else if (styleConfig.id === 'wave') {
    // FRAME 03: GOAN COAST / ARABIAN SEA WAVES
    // Goa ocean turquoise to deep sea teal gradient with soft wave curves
    const bgGrad = ctx.createLinearGradient(x, y, x, y + h);
    bgGrad.addColorStop(0, '#E0F7FA');
    bgGrad.addColorStop(0.2, '#02C39A');
    bgGrad.addColorStop(0.6, '#00A896');
    bgGrad.addColorStop(1, '#028090');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(x - 30, y - 30, w + 60, h + 60);

    // Flowing wave lines in background
    ctx.strokeStyle = 'rgba(255, 223, 0, 0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.3);
    ctx.bezierCurveTo(x + w * 0.3, y + h * 0.2, x + w * 0.7, y + h * 0.4, x + w, y + h * 0.3);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.65);
    ctx.bezierCurveTo(x + w * 0.3, y + h * 0.55, x + w * 0.7, y + h * 0.75, x + w, y + h * 0.65);
    ctx.stroke();

  } else if (styleConfig.id === 'editorial') {
    // FRAME 04: GOAN OLD QUARTER / HERITAGE ARCHWAY
    // Warm Portuguese tile cream & terracotta heritage background with subtle pattern
    const bgGrad = ctx.createLinearGradient(x, y, x, y + h);
    bgGrad.addColorStop(0, '#FFF9E6');
    bgGrad.addColorStop(0.5, '#F5E6C8');
    bgGrad.addColorStop(1, '#E8CFA6');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(x - 30, y - 30, w + 60, h + 60);

    // Subtle Portuguese Azulejo tile geometric grid motif
    ctx.strokeStyle = 'rgba(30, 64, 175, 0.08)';
    ctx.lineWidth = 2;
    const step = 40;
    for (let gx = x; gx < x + w; gx += step) {
      ctx.beginPath();
      ctx.moveTo(gx, y);
      ctx.lineTo(gx, y + h);
      ctx.stroke();
    }
    for (let gy = y; gy < y + h; gy += step) {
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x + w, gy);
      ctx.stroke();
    }

    // Soft warm terracotta arch glow
    const archGlow = ctx.createRadialGradient(cx, y + h * 0.3, 0, cx, y + h * 0.3, w * 0.45);
    archGlow.addColorStop(0, 'rgba(200, 90, 50, 0.15)');
    archGlow.addColorStop(1, 'rgba(255, 249, 230, 0)');
    ctx.fillStyle = archGlow;
    ctx.beginPath();
    ctx.arc(cx, y + h * 0.3, w * 0.45, 0, Math.PI * 2);
    ctx.fill();

  } else {
    // FRAME 05: GOA AFTER DARK / NIGHTLIFE
    // Deep emerald night canvas with glowing magenta/yellow radial night aura
    const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * 0.7);
    bgGrad.addColorStop(0, '#1F002B');
    bgGrad.addColorStop(0.4, '#072a1e');
    bgGrad.addColorStop(0.85, '#021B13');
    bgGrad.addColorStop(1, '#000D08');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(x - 30, y - 30, w + 60, h + 60);

    // Neon magenta & yellow radial aura glow behind subject head
    const auraGrad = ctx.createRadialGradient(cx, cy - h * 0.1, 0, cx, cy - h * 0.1, w * 0.4);
    auraGrad.addColorStop(0, 'rgba(255, 46, 147, 0.35)');
    auraGrad.addColorStop(0.6, 'rgba(255, 223, 0, 0.2)');
    auraGrad.addColorStop(1, 'rgba(7, 42, 30, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(cx, cy - h * 0.1, w * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Subtle nightlife sparkle stars
    ctx.fillStyle = 'rgba(255, 223, 0, 0.6)';
    const sparkles = [
      { sx: cx - w * 0.3, sy: cy - h * 0.3, r: 3 },
      { sx: cx + w * 0.32, sy: cy - h * 0.25, r: 2.5 },
      { sx: cx - w * 0.25, sy: cy + h * 0.25, r: 2 },
      { sx: cx + w * 0.28, sy: cy + h * 0.3, r: 3.5 },
    ];
    sparkles.forEach((sp) => {
      ctx.beginPath();
      ctx.arc(sp.sx, sp.sy, sp.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  ctx.restore();
}
