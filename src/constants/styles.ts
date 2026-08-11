import { StyleOption, SamplePhoto } from '../types';
import sampleBuilder1 from '../assets/images/sample_builder_1_1786264670571.jpg';
import sampleBuilder2 from '../assets/images/sample_builder_2_1786264685027.jpg';

import frame01GoldenHour from '../assets/images/frame_01_golden_hour_1786287156607.jpg';
import frame02Greenery from '../assets/images/frame_02_goan_greenery_1786287179795.jpg';
import frame03Coast from '../assets/images/frame_03_goan_coast_1786287193608.jpg';
import frame04OldQuarter from '../assets/images/frame_04_old_quarter_1786287207109.jpg';
import frame05AfterDark from '../assets/images/frame_05_after_dark_1786287220248.jpg';

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'sunset',
    numberStr: '01',
    name: 'GOAN SUNSET',
    tagline: 'Golden hour glow, palm trees & coastal vibes',
    bgHex: '#072a1e',
    accentHex: '#FFDF00',
    secondaryHex: '#FF6B00',
    description: 'Golden hour glow, radiant sunburst geometry, sailboat sea and tropical palm vibes.',
    vibeBadge: 'GOLDEN HOUR',
    frameImageUrl: frame01GoldenHour,
    cutoutShape: 'circle',
  },
  {
    id: 'tropical',
    numberStr: '02',
    name: 'GOAN GREENERY',
    tagline: 'Lush festival carnival, headpiece & drum',
    bgHex: '#0B3B2B',
    accentHex: '#FFDF00',
    secondaryHex: '#FF4500',
    description: 'Lush emerald palm foliage, Goan carnival performer headpiece, drum and festive bunting.',
    vibeBadge: 'FESTIVAL CARNIVAL',
    frameImageUrl: frame02Greenery,
    cutoutShape: 'circle',
  },
  {
    id: 'wave',
    numberStr: '03',
    name: 'GOAN COAST',
    tagline: 'Fluid ocean waves, lighthouse & boat',
    bgHex: '#052319',
    accentHex: '#00F0FF',
    secondaryHex: '#FFDF00',
    description: 'Dynamic Arabian Sea wave vectors, coastal lighthouse, fishing boat and seashells.',
    vibeBadge: 'ARABIAN SEA',
    frameImageUrl: frame03Coast,
    cutoutShape: 'wave',
  },
  {
    id: 'editorial',
    numberStr: '04',
    name: 'OLD QUARTER',
    tagline: 'Portuguese archways, azulejo tiles & bell',
    bgHex: '#082D20',
    accentHex: '#FFF9E6',
    secondaryHex: '#1D4ED8',
    description: 'Classic Portuguese archway, white church facade, azulejo tiles and cascading bougainvillea.',
    vibeBadge: 'HERITAGE ARCHITECTURE',
    frameImageUrl: frame04OldQuarter,
    cutoutShape: 'arch',
  },
  {
    id: 'after_dark',
    numberStr: '05',
    name: 'GOA AFTER DARK',
    tagline: 'Nightlife energy, streetlamp & monstera',
    bgHex: '#031911',
    accentHex: '#FF2E93',
    secondaryHex: '#FFDF00',
    description: 'Nocturnal tropical vibe, glowing streetlamp, monstera leaves, yellow cottage and hot pink highlights.',
    vibeBadge: 'GOA NIGHTLIFE',
    frameImageUrl: frame05AfterDark,
    cutoutShape: 'circle',
  },
];

export const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    id: 'preset-1',
    name: 'Aarav Sharma',
    role: 'AI • Python • GenAI',
    url: sampleBuilder1,
  },
  {
    id: 'preset-2',
    name: 'Ananya Roy',
    role: 'React • Motion • Design',
    url: sampleBuilder2,
  },
  {
    id: 'preset-3',
    name: 'Dev Patel',
    role: 'Fullstack • Rust • Web3',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'preset-4',
    name: 'Zoya Khan',
    role: 'Agentic AI • PyTorch',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  },
];

const TITLE_TEMPLATES: { keywords: string[]; titles: string[] }[] = [
  {
    keywords: ['ai', 'python', 'llm', 'genai', 'agent', 'model', 'rag'],
    titles: [
      'The AI Explorer',
      'The Neural Architect',
      'The Prompt Craftsman',
      'The Agentic Hacker',
      'The Model Whisperer',
    ],
  },
  {
    keywords: ['react', 'frontend', 'ui', 'ux', 'css', 'design', 'tailwind', 'motion', 'vue', 'web'],
    titles: [
      'The Code Crafter',
      'The Pixel Wizard',
      'The Interface Artist',
      'The Frontend Maverick',
      'The Motion Designer',
    ],
  },
  {
    keywords: ['rust', 'go', 'backend', 'node', 'fullstack', 'system', 'api'],
    titles: [
      'The Full-Stack Catalyst',
      'The Systems Engineer',
      'The Backend Warlock',
      'The Cloud Builder',
      'The API Pioneer',
    ],
  },
  {
    keywords: ['data', 'sql', 'analytics', 'ml', 'pandas'],
    titles: [
      'The Data Alchemist',
      'The Vector Voyager',
      'The Insight Sculptor',
      'The Matrix Builder',
    ],
  },
  {
    keywords: ['crypto', 'web3', 'solana', 'eth', 'chain'],
    titles: [
      'The Web3 Nomad',
      'The On-Chain Innovator',
      'The Protocol Builder',
    ],
  },
  {
    keywords: ['product', 'founder', 'growth', 'hacker'],
    titles: [
      'The Product Hacker',
      'The Future Builder',
      'The Zero to One Nomad',
      'The Innovation Catalyst',
    ],
  },
];

const FALLBACK_TITLES = [
  'The Future Builder',
  'The Goa Hacker',
  'The Code Crafter',
  'The Digital Nomad',
  'The Creative Builder',
  'The Tech Catalyst',
];

export function generatePlayfulTitle(roleStack: string): string {
  if (!roleStack || roleStack.trim().length === 0) {
    return 'The Future Builder';
  }
  const normalized = roleStack.toLowerCase();
  for (const group of TITLE_TEMPLATES) {
    for (const kw of group.keywords) {
      if (normalized.includes(kw)) {
        const randomIndex = Math.floor(Math.random() * group.titles.length);
        return group.titles[randomIndex];
      }
    }
  }
  const fallbackIndex = Math.floor(Math.random() * FALLBACK_TITLES.length);
  return FALLBACK_TITLES[fallbackIndex];
}
