import type {Prahar, PraharAtmosphere} from '../types/prahar';

const ATMOSPHERE_BY_PRAHAR_ID: Record<number, PraharAtmosphere> = {
  1: {
    periodLabel: 'Dawn · Sandhi Prakash',
    spotlightClass:
      'bg-[radial-gradient(ellipse_80%_55%_at_50%_8%,rgba(225,148,128,0.22),transparent_68%),radial-gradient(circle_at_82%_28%,rgba(217,138,60,0.12),transparent_55%)]',
    accentTextClass: 'text-[#E5A48B]',
    accentHex: '#E5A48B',
    ringAccent: '#E19480',
    glowDescription: 'Soft rose-gold dawn light',
  },
  2: {
    periodLabel: 'Morning Light',
    spotlightClass:
      'bg-[radial-gradient(ellipse_80%_55%_at_50%_8%,rgba(242,184,102,0.22),transparent_68%),radial-gradient(circle_at_82%_28%,rgba(217,138,60,0.11),transparent_55%)]',
    accentTextClass: 'text-[#F2B866]',
    accentHex: '#F2B866',
    ringAccent: '#E7B062',
    glowDescription: 'Warm morning saffron-gold',
  },
  3: {
    periodLabel: 'Midday Zenith',
    spotlightClass:
      'bg-[radial-gradient(ellipse_80%_55%_at_50%_8%,rgba(245,204,114,0.24),transparent_68%),radial-gradient(circle_at_82%_28%,rgba(217,154,64,0.12),transparent_55%)]',
    accentTextClass: 'text-[#F5CC72]',
    accentHex: '#F5CC72',
    ringAccent: '#E8BC5C',
    glowDescription: 'Bright warm brass spotlight',
  },
  4: {
    periodLabel: 'Afternoon Stillness',
    spotlightClass:
      'bg-[radial-gradient(ellipse_80%_55%_at_50%_8%,rgba(217,138,60,0.22),transparent_68%),radial-gradient(circle_at_82%_28%,rgba(184,110,44,0.12),transparent_55%)]',
    accentTextClass: 'text-[#E29E54]',
    accentHex: '#E29E54',
    ringAccent: '#D98A3C',
    glowDescription: 'Sun-warmed honeyed ochre',
  },
  5: {
    periodLabel: 'Evening Twilight',
    spotlightClass:
      'bg-[radial-gradient(ellipse_80%_55%_at_50%_8%,rgba(217,114,54,0.25),transparent_68%),radial-gradient(circle_at_82%_28%,rgba(186,82,46,0.13),transparent_55%)]',
    accentTextClass: 'text-[#EA8D52]',
    accentHex: '#EA8D52',
    ringAccent: '#D97236',
    glowDescription: 'Deep amber dusk glow',
  },
  6: {
    periodLabel: 'Early Night Recital',
    spotlightClass:
      'bg-[radial-gradient(ellipse_80%_55%_at_50%_8%,rgba(196,142,74,0.19),transparent_68%),radial-gradient(circle_at_82%_28%,rgba(108,112,168,0.12),transparent_55%)]',
    accentTextClass: 'text-[#D8A660]',
    accentHex: '#D8A660',
    ringAccent: '#C48E4A',
    glowDescription: 'Lamp-lit gold in early night',
  },
  7: {
    periodLabel: 'Midnight Baithak',
    spotlightClass:
      'bg-[radial-gradient(ellipse_80%_55%_at_50%_8%,rgba(116,136,198,0.20),transparent_68%),radial-gradient(circle_at_82%_28%,rgba(200,155,84,0.11),transparent_55%)]',
    accentTextClass: 'text-[#C8A76E]',
    accentHex: '#C8A76E',
    ringAccent: '#8DA2DB',
    glowDescription: 'Cool indigo-gold midnight aura',
  },
  8: {
    periodLabel: 'Pre-Dawn Vigil',
    spotlightClass:
      'bg-[radial-gradient(ellipse_80%_55%_at_50%_8%,rgba(104,122,180,0.19),transparent_68%),radial-gradient(circle_at_82%_28%,rgba(200,155,84,0.10),transparent_55%)]',
    accentTextClass: 'text-[#C89B54]',
    accentHex: '#C89B54',
    ringAccent: '#8296CE',
    glowDescription: 'Nocturnal indigo-gold horizon',
  },
};

const DEFAULT_ATMOSPHERE: PraharAtmosphere = {
  periodLabel: 'Classical Recital',
  spotlightClass:
    'bg-[radial-gradient(ellipse_80%_55%_at_50%_8%,rgba(217,138,60,0.20),transparent_68%),radial-gradient(circle_at_82%_28%,rgba(242,184,102,0.10),transparent_55%)]',
  accentTextClass: 'text-[#F2B866]',
  accentHex: '#F2B866',
  ringAccent: '#C89B54',
  glowDescription: 'Warm amber baithak spotlight',
};

export function getPraharAtmosphere(
  prahar: Prahar | null | undefined
): PraharAtmosphere {
  if (!prahar) {
    return DEFAULT_ATMOSPHERE;
  }

  return ATMOSPHERE_BY_PRAHAR_ID[prahar.id] ?? DEFAULT_ATMOSPHERE;
}

export const CLASSICAL_TIMING_GUIDELINE =
  'In Hindustani classical music, prahar assignments reflect traditional aesthetic, acoustic, and emotional resonance for each period of the day—serving as an artistic guideline rather than a rigid rule in modern concert recitals.';
