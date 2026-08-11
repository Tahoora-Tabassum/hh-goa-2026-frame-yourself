export type FormatType = 'pfp' | 'builder_id';

export type StyleVibe = 'sunset' | 'tropical' | 'wave' | 'after_dark' | 'editorial';

export interface CropConfig {
  zoom: number; // 0.8 to 2.5
  xOffset: number; // -100 to 100
  yOffset: number; // -100 to 100
  rotation: number; // 0, 90, 180, 270
}

export interface BuilderDetails {
  name: string;
  roleStack: string;
  title: string;
  customGoal: string;
}

export interface StyleOption {
  id: StyleVibe;
  numberStr: string;
  name: string;
  tagline: string;
  bgHex: string;
  accentHex: string;
  secondaryHex: string;
  description: string;
  vibeBadge: string;
  frameImageUrl: string;
  cutoutShape: 'circle' | 'arch' | 'wave';
}

export interface SamplePhoto {
  id: string;
  name: string;
  role: string;
  url: string;
}
