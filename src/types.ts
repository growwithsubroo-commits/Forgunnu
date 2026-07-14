export type TimeOfDay = 'morning' | 'afternoon' | 'sunset' | 'night';

export interface TimeConfig {
  id: TimeOfDay;
  label: string;
  icon: string;
  skyGradient: string;
  oceanGradient: string;
  sandGradient: string;
  accentColor: string;
  celestialClass: string;
  ambientType: 'waves_morning' | 'waves_afternoon' | 'waves_sunset' | 'waves_night';
}

export interface ShellMessage {
  id: string;
  icon: string;
  title: string;
  message: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  color: string;
}

export interface PolaroidMemory {
  id: string;
  imageKey: 'beach_sunset' | 'beach_campfire' | 'beach_hammock';
  title: string;
  date: string;
  caption: string;
}

export const TIME_CONFIGS: Record<TimeOfDay, TimeConfig> = {
  morning: {
    id: 'morning',
    label: 'Morning Breeze',
    icon: '🌅',
    skyGradient: 'from-orange-200 via-rose-100 to-sky-200',
    oceanGradient: 'from-sky-300/80 via-teal-400/80 to-teal-500/80',
    sandGradient: 'from-amber-50 to-orange-50/90',
    accentColor: 'text-teal-700 border-teal-200 bg-teal-50/50',
    celestialClass: 'bg-amber-300 shadow-[0_0_50px_20px_rgba(253,186,116,0.6)] top-16 left-1/4 w-20 h-20',
    ambientType: 'waves_morning',
  },
  afternoon: {
    id: 'afternoon',
    label: 'Sunny Paradise',
    icon: '☀️',
    skyGradient: 'from-sky-400 via-sky-200 to-teal-50',
    oceanGradient: 'from-teal-400/90 via-cyan-400/90 to-blue-500/90',
    sandGradient: 'from-amber-100 to-yellow-50',
    accentColor: 'text-cyan-700 border-cyan-200 bg-cyan-50/50',
    celestialClass: 'bg-yellow-400 shadow-[0_0_60px_30px_rgba(253,224,71,0.7)] top-10 left-1/3 w-24 h-24',
    ambientType: 'waves_afternoon',
  },
  sunset: {
    id: 'sunset',
    label: 'Golden Hour',
    icon: '🌇',
    skyGradient: 'from-rose-400 via-purple-400 to-orange-300',
    oceanGradient: 'from-purple-500/85 via-pink-500/85 to-orange-400/85',
    sandGradient: 'from-rose-100/90 to-amber-100/90',
    accentColor: 'text-rose-700 border-rose-200 bg-rose-50/50',
    celestialClass: 'bg-orange-500 shadow-[0_0_80px_35px_rgba(249,115,22,0.6)] top-20 left-1/2 -translate-x-1/2 w-28 h-28',
    ambientType: 'waves_sunset',
  },
  night: {
    id: 'night',
    label: 'Starry Night',
    icon: '🌙',
    skyGradient: 'from-slate-950 via-slate-900 to-indigo-950',
    oceanGradient: 'from-indigo-950/90 via-slate-900/90 to-teal-950/90',
    sandGradient: 'from-amber-950/30 via-slate-900 to-zinc-950',
    accentColor: 'text-indigo-300 border-indigo-950 bg-indigo-950/40',
    celestialClass: 'bg-slate-100 shadow-[0_0_40px_15px_rgba(255,255,255,0.4)] top-12 left-2/3 w-16 h-16',
    ambientType: 'waves_night',
  },
};

export const SHELL_MESSAGES: ShellMessage[] = [
  {
    id: 'shell-1',
    icon: '🐚',
    title: 'Pink Conch Shell',
    message: 'Nanu bhaya says: Gunnu, you bring so much joy into our lives! May your days be filled with endless laughter, beauty, and warm sunshine. Happy Birthday!',
    rarity: 'Common',
    color: 'from-pink-100 to-rose-200 text-rose-800 border-rose-200',
  },
  {
    id: 'shell-2',
    icon: '⭐',
    title: 'Sandy Starfish',
    message: 'A Secret Birthday Wish: May your journey ahead be as deep, beautiful, and full of wonders as the infinite ocean! Keep shining bright, Gunnu!',
    rarity: 'Uncommon',
    color: 'from-orange-100 to-amber-200 text-amber-800 border-amber-200',
  },
  {
    id: 'shell-3',
    icon: '🌀',
    title: 'Golden Spiral Shell',
    message: 'You found the Rare Golden Conch! Make a silent wish right now. It will float with the tide and come true, backed by Nanu bhaya\'s infinite blessings!',
    rarity: 'Rare',
    color: 'from-yellow-100 to-amber-300 text-amber-900 border-amber-300',
  },
  {
    id: 'shell-4',
    icon: '🦪',
    title: 'Pearl Oyster',
    message: 'Nanu bhaya\'s Promise: No matter how far the tide goes or how high the waves roll, your Nanu bhaya will always be here to support, guide, and cheer you on!',
    rarity: 'Legendary',
    color: 'from-purple-100 to-indigo-200 text-indigo-800 border-indigo-200',
  },
];

export const POLAROID_MEMORIES: PolaroidMemory[] = [
  {
    id: 'mem-1',
    imageKey: 'beach_sunset',
    title: 'Chasing Sunset Dreams',
    date: 'July 15',
    caption: '“To my wonderful Gunnu, may your life be painted in the warm, glorious colors of a beach sunset. Happy Birthday!” — Nanu bhaya',
  },
  {
    id: 'mem-2',
    imageKey: 'beach_hammock',
    title: 'Calm & Cozy Breezes',
    date: 'July 15',
    caption: '“Wishing you a year of peace, comfort, and delightful little surprises. Just like resting in a hammock by the sea.” — Nanu bhaya',
  },
  {
    id: 'mem-3',
    imageKey: 'beach_campfire',
    title: 'Under the Starry Canopy',
    date: 'Midnight Magic',
    caption: '“Gathered around the virtual campfire of love and celebration, sending you warmth and starry sparks on your birthday!” — Nanu bhaya',
  },
];
