import { removeBackground, Config } from '@imgly/background-removal';

// In-memory cache for extracted transparent image URLs
const bgRemovalCache = new Map<string, string>();

interface RemoveBgOptions {
  onProgress?: (progress: number, message: string) => void;
}

/**
 * Removes background from an image URL or Blob, returning a transparent PNG Blob URL.
 */
export async function extractPersonCutout(
  imageSource: string | Blob | File,
  options?: RemoveBgOptions
): Promise<string> {
  const cacheKey = typeof imageSource === 'string' ? imageSource : null;

  if (cacheKey && bgRemovalCache.has(cacheKey)) {
    return bgRemovalCache.get(cacheKey)!;
  }

  try {
    if (options?.onProgress) {
      options.onProgress(10, 'Initializing AI background remover...');
    }

    const config: Config = {
      progress: (key: string, current: number, total: number) => {
        if (options?.onProgress && total > 0) {
          const pct = Math.min(95, Math.round(15 + (current / total) * 80));
          const msg = key.includes('fetch')
            ? 'Downloading AI segmentation model...'
            : 'Removing photo background & extracting subject...';
          options.onProgress(pct, msg);
        }
      },
      output: {
        format: 'image/png',
        quality: 0.95,
      },
    };

    const blob = await removeBackground(imageSource, config);
    const transparentUrl = URL.createObjectURL(blob);

    if (cacheKey) {
      bgRemovalCache.set(cacheKey, transparentUrl);
    }

    if (options?.onProgress) {
      options.onProgress(100, 'Background removed successfully!');
    }

    return transparentUrl;
  } catch (error) {
    console.warn('Primary @imgly background removal failed or timed out:', error);
    
    // Fallback to client-side smart canvas edge/saliency segmentation if ML model download is blocked/fails
    if (options?.onProgress) {
      options.onProgress(50, 'Applying client-side subject extraction fallback...');
    }
    
    try {
      const fallbackUrl = await fallbackCanvasSegmentation(imageSource);
      if (cacheKey) {
        bgRemovalCache.set(cacheKey, fallbackUrl);
      }
      return fallbackUrl;
    } catch (fallbackError) {
      console.error('Fallback canvas segmentation failed:', fallbackError);
      // Return original source as last resort
      return typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource);
    }
  }
}

/**
 * Client-side fallback: Smart subject extraction using canvas chroma/luminance/edge saliency keying
 * to isolate person subjects from background when offline or model load fails.
 */
async function fallbackCanvasSegmentation(imageSource: string | Blob | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const srcUrl = typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource);
    img.src = srcUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth || img.width || 800;
      const h = img.naturalHeight || img.height || 800;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(srcUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // Sample border pixels (top edge, top corners, outer 12% margins) to sample background color palette
      const bgSamples: Array<[number, number, number]> = [];
      const sampleStep = Math.max(1, Math.floor(w / 30));

      // Top edge samples
      for (let x = 0; x < w; x += sampleStep) {
        for (let y = 0; y < Math.floor(h * 0.12); y += sampleStep) {
          const idx = (y * w + x) * 4;
          bgSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
        }
      }

      // Left & right border samples
      for (let y = 0; y < h; y += sampleStep) {
        for (let x of [0, Math.floor(w * 0.05), Math.floor(w * 0.95), w - 1]) {
          const idx = (y * w + x) * 4;
          bgSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
        }
      }

      // Center subject ellipse bounds (head & torso typically occupy center 65% width, top 10%-90% height)
      const centerX = w / 2;
      const centerY = h * 0.48;
      const rx = w * 0.36;
      const ry = h * 0.44;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Minimum color distance to any sampled background pixel
          let minDistBg = Infinity;
          for (let i = 0; i < bgSamples.length; i += 3) { // Sample every 3rd for speed
            const [sR, sG, sB] = bgSamples[i];
            const d = Math.sqrt((r - sR) ** 2 + (g - sG) ** 2 + (b - sB) ** 2);
            if (d < minDistBg) minDistBg = d;
          }

          // Distance to subject central ellipse
          const dx = (x - centerX) / rx;
          const dy = (y - centerY) / ry;
          const distCenterSq = dx * dx + dy * dy;

          // If pixel is outside central body area OR closely matches background palette, remove it
          if (distCenterSq > 1.0) {
            if (distCenterSq > 1.3 || minDistBg < 75) {
              data[idx + 3] = 0; // Fully transparent
            } else {
              const alphaRatio = Math.max(0, Math.min(1, (1.3 - distCenterSq) / 0.3));
              data[idx + 3] = Math.floor(255 * alphaRatio);
            }
          } else if (distCenterSq > 0.65 && minDistBg < 45) {
            // Near outer edge of body and matching background color
            data[idx + 3] = 0;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          resolve(srcUrl);
        }
      }, 'image/png');
    };

    img.onerror = (err) => reject(err);
  });
}
