export interface BoardTheme {
  id: string
  name: string
  lightSquare: string
  darkSquare: string
  attackedLight: string
  attackedDark: string
  queenLight: string
  queenDark: string
  lastMoveLight: string
  lastMoveDark: string
  queenColor: string
  boardBorder: string
}

export interface PageTheme {
  id: string
  name: string
  isDark: boolean
  bgApp: string
  bgPanel: string
  bgInput: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  borderSubtle: string
  borderStrong: string
  accentPrimary: string
  accentHover: string
  chipGreenBg: string
  chipGreenText: string
  chipRedBg: string
  chipRedText: string
  chipNeutralBg: string
  chipNeutralText: string
  btnSecondaryBg: string
  btnSecondaryHover: string
  btnSecondaryText: string
  shadow: string
}

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: 'classic',
    name: 'Classic Wood',
    lightSquare: '#f0ede8',
    darkSquare: '#b8a99a',
    attackedLight: '#fca5a5',
    attackedDark: '#ef4444',
    queenLight: '#bfdbfe',
    queenDark: '#3b82f6',
    lastMoveLight: '#93c5fd',
    lastMoveDark: '#1d4ed8',
    queenColor: '#1e3a8a',
    boardBorder: '#9ca3af',
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    lightSquare: '#f3f6ea',
    darkSquare: '#759556',
    attackedLight: '#fecaca',
    attackedDark: '#dc2626',
    queenLight: '#bbf7d0',
    queenDark: '#22c55e',
    lastMoveLight: '#86efac',
    lastMoveDark: '#15803d',
    queenColor: '#14532d',
    boardBorder: '#4d6935',
  },
  {
    id: 'walnut',
    name: 'Warm Walnut',
    lightSquare: '#f4e4c1',
    darkSquare: '#b88b4a',
    attackedLight: '#fed7aa',
    attackedDark: '#ea580c',
    queenLight: '#fde68a',
    queenDark: '#f59e0b',
    lastMoveLight: '#fcd34d',
    lastMoveDark: '#d97706',
    queenColor: '#451a03',
    boardBorder: '#92400e',
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    lightSquare: '#e0f2fe',
    darkSquare: '#0284c7',
    attackedLight: '#fecdd3',
    attackedDark: '#e11d48',
    queenLight: '#bae6fd',
    queenDark: '#0369a1',
    lastMoveLight: '#7dd3fc',
    lastMoveDark: '#075985',
    queenColor: '#0c4a6e',
    boardBorder: '#0369a1',
  },
  {
    id: 'amethyst',
    name: 'Amethyst Purple',
    lightSquare: '#faf5ff',
    darkSquare: '#8b5cf6',
    attackedLight: '#fbcfe8',
    attackedDark: '#db2777',
    queenLight: '#e9d5ff',
    queenDark: '#7c3aed',
    lastMoveLight: '#d8b4fe',
    lastMoveDark: '#6d28d9',
    queenColor: '#3b0764',
    boardBorder: '#6d28d9',
  },
  {
    id: 'graphite',
    name: 'Graphite Monochrome',
    lightSquare: '#e2e8f0',
    darkSquare: '#475569',
    attackedLight: '#fca5a5',
    attackedDark: '#dc2626',
    queenLight: '#cbd5e1',
    queenDark: '#334155',
    lastMoveLight: '#94a3b8',
    lastMoveDark: '#1e293b',
    queenColor: '#0f172a',
    boardBorder: '#334155',
  },
]

export const PAGE_THEMES: PageTheme[] = [
  {
    id: 'light-clean',
    name: 'Clean Light',
    isDark: false,
    bgApp: '#f5f6fa',
    bgPanel: '#ffffff',
    bgInput: '#f9fafb',
    textPrimary: '#1a1a2e',
    textSecondary: '#4b5563',
    textMuted: '#6b7280',
    borderSubtle: '#e0e3ed',
    borderStrong: '#c7cbd9',
    accentPrimary: '#4f6ef7',
    accentHover: '#3b5bdb',
    chipGreenBg: '#d1fae5',
    chipGreenText: '#065f46',
    chipRedBg: '#fee2e2',
    chipRedText: '#991b1b',
    chipNeutralBg: '#f1f3f9',
    chipNeutralText: '#374151',
    btnSecondaryBg: '#f1f3f9',
    btnSecondaryHover: '#e5e7f0',
    btnSecondaryText: '#374151',
    shadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
  {
    id: 'dark-slate',
    name: 'Midnight Slate',
    isDark: true,
    bgApp: '#0f172a',
    bgPanel: '#1e293b',
    bgInput: '#0f172a',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    borderSubtle: '#334155',
    borderStrong: '#475569',
    accentPrimary: '#6366f1',
    accentHover: '#4f46e5',
    chipGreenBg: '#064e3b',
    chipGreenText: '#6ee7b7',
    chipRedBg: '#7f1d1d',
    chipRedText: '#fca5a5',
    chipNeutralBg: '#334155',
    chipNeutralText: '#e2e8f0',
    btnSecondaryBg: '#334155',
    btnSecondaryHover: '#475569',
    btnSecondaryText: '#f1f5f9',
    shadow: '0 4px 18px rgba(0, 0, 0, 0.45)',
  },
  {
    id: 'warm-amber',
    name: 'Warm Parchment',
    isDark: false,
    bgApp: '#fdfbf7',
    bgPanel: '#fffef9',
    bgInput: '#f8f5eb',
    textPrimary: '#292524',
    textSecondary: '#57534e',
    textMuted: '#78716c',
    borderSubtle: '#e7e5e4',
    borderStrong: '#d6d3d1',
    accentPrimary: '#d97706',
    accentHover: '#b45309',
    chipGreenBg: '#ecfdf5',
    chipGreenText: '#047857',
    chipRedBg: '#fef2f2',
    chipRedText: '#b91c1c',
    chipNeutralBg: '#f5f5f4',
    chipNeutralText: '#44403c',
    btnSecondaryBg: '#f5f5f4',
    btnSecondaryHover: '#e7e5e4',
    btnSecondaryText: '#292524',
    shadow: '0 2px 10px rgba(68, 64, 60, 0.08)',
  },
  {
    id: 'nordic-frost',
    name: 'Nordic Frost',
    isDark: true,
    bgApp: '#2e3440',
    bgPanel: '#3b4252',
    bgInput: '#2e3440',
    textPrimary: '#eceff4',
    textSecondary: '#d8dee9',
    textMuted: '#e5e9f0',
    borderSubtle: '#434c5e',
    borderStrong: '#4c566a',
    accentPrimary: '#88c0d0',
    accentHover: '#81a1c1',
    chipGreenBg: '#2d4f48',
    chipGreenText: '#a3be8c',
    chipRedBg: '#542d38',
    chipRedText: '#bf616a',
    chipNeutralBg: '#434c5e',
    chipNeutralText: '#eceff4',
    btnSecondaryBg: '#434c5e',
    btnSecondaryHover: '#4c566a',
    btnSecondaryText: '#eceff4',
    shadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
  },
]
