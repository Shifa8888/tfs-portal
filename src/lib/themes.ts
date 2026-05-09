export type ThemeName = 'neon' | 'matrix' | 'synthwave' | 'ice' | 'crimson';

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  className: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    bg: string;
    card: string;
  };
  icon: string;
}

export const themes: ThemeConfig[] = [
  {
    id: 'neon',
    name: 'Neon Cyber',
    className: 'theme-neon',
    colors: { primary: '#00ffff', secondary: '#ff00ff', tertiary: '#ffff00', bg: '#0a0a1a', card: '#0f0f2d' },
    icon: '⚡',
  },
  {
    id: 'matrix',
    name: 'Matrix Green',
    className: 'theme-matrix',
    colors: { primary: '#00ff41', secondary: '#00cc33', tertiary: '#33ff77', bg: '#0a0a0a', card: '#0a1e0a' },
    icon: '💚',
  },
  {
    id: 'synthwave',
    name: 'Synthwave Purple',
    className: 'theme-synthwave',
    colors: { primary: '#ff00ff', secondary: '#ff6600', tertiary: '#00ffff', bg: '#1a0a2e', card: '#1a0a32' },
    icon: '🌆',
  },
  {
    id: 'ice',
    name: 'Ice Cyber',
    className: 'theme-ice',
    colors: { primary: '#00d4ff', secondary: '#0088cc', tertiary: '#ffffff', bg: '#0a1a2e', card: '#0a1e37' },
    icon: '❄️',
  },
  {
    id: 'crimson',
    name: 'Crimson Hack',
    className: 'theme-crimson',
    colors: { primary: '#ff0040', secondary: '#ff3366', tertiary: '#ffcc00', bg: '#1a0a0a', card: '#2d0a0a' },
    icon: '🔥',
  },
];

export function getThemeClass(themeId: ThemeName): string {
  return `theme-${themeId}`;
}
