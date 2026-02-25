/**
 * Selectable HTML themes for Rigr output
 *
 * Each theme defines colour values for CSS custom properties (--rigr-*).
 * The base layout CSS stays the same — only colours, typography, and
 * minor accents change per theme.
 */

export interface ThemeColors {
  /* Sidebar (static build) */
  sidebarBg: string;
  sidebarText: string;
  sidebarActiveBg: string;
  sidebarActiveText: string;
  sidebarBorder: string;

  /* Page */
  pageBg: string;
  textPrimary: string;
  textSecondary: string;

  /* Components */
  borderColor: string;
  bgLight: string;
  bgHeader: string;
  bgContent: string;

  /* Links */
  linkColor: string;
  linkHover: string;

  /* Rigr ID pill */
  idColor: string;
  idBg: string;

  /* Code blocks */
  codeBlockBg: string;
}

export interface ThemeDefinition {
  name: string;
  label: string;
  light: ThemeColors;
  dark: ThemeColors;
}

/* ---------------------------------------------------------------------------
   Theme palettes
   --------------------------------------------------------------------------- */

const defaultTheme: ThemeDefinition = {
  name: 'default',
  label: 'Default',
  light: {
    sidebarBg: '#f5f5f5',
    sidebarText: '#333',
    sidebarActiveBg: 'rgba(21, 101, 192, 0.1)',
    sidebarActiveText: '#1565c0',
    sidebarBorder: '#ddd',
    pageBg: '#fff',
    textPrimary: '#333',
    textSecondary: '#666',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    bgLight: 'rgba(0, 0, 0, 0.02)',
    bgHeader: 'rgba(0, 0, 0, 0.04)',
    bgContent: 'transparent',
    linkColor: '#1565c0',
    linkHover: '#1565c0',
    idColor: '#1565c0',
    idBg: 'rgba(21, 101, 192, 0.1)',
    codeBlockBg: 'rgba(0, 0, 0, 0.04)',
  },
  dark: {
    sidebarBg: '#1e1e1e',
    sidebarText: '#ccc',
    sidebarActiveBg: 'rgba(144, 202, 249, 0.15)',
    sidebarActiveText: '#90caf9',
    sidebarBorder: '#333',
    pageBg: '#1e1e1e',
    textPrimary: '#d4d4d4',
    textSecondary: '#999',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    bgLight: 'rgba(255, 255, 255, 0.03)',
    bgHeader: 'rgba(255, 255, 255, 0.05)',
    bgContent: 'transparent',
    linkColor: '#90caf9',
    linkHover: '#90caf9',
    idColor: '#90caf9',
    idBg: 'rgba(144, 202, 249, 0.15)',
    codeBlockBg: 'rgba(255, 255, 255, 0.05)',
  },
};

const readthedocsTheme: ThemeDefinition = {
  name: 'readthedocs',
  label: 'Read the Docs',
  light: {
    sidebarBg: '#343131',
    sidebarText: '#d9d9d9',
    sidebarActiveBg: '#4e4a4a',
    sidebarActiveText: '#55a5d9',
    sidebarBorder: '#2b2828',
    pageBg: '#fcfcfc',
    textPrimary: '#404040',
    textSecondary: '#707070',
    borderColor: '#e1e4e5',
    bgLight: '#f3f6f6',
    bgHeader: '#e3e6e6',
    bgContent: 'transparent',
    linkColor: '#2980b9',
    linkHover: '#3091d1',
    idColor: '#2980b9',
    idBg: 'rgba(41, 128, 185, 0.1)',
    codeBlockBg: '#f8f8f8',
  },
  dark: {
    sidebarBg: '#1a1a1a',
    sidebarText: '#d9d9d9',
    sidebarActiveBg: '#2d2d2d',
    sidebarActiveText: '#55a5d9',
    sidebarBorder: '#111',
    pageBg: '#222',
    textPrimary: '#d4d4d4',
    textSecondary: '#999',
    borderColor: '#444',
    bgLight: 'rgba(255, 255, 255, 0.04)',
    bgHeader: 'rgba(255, 255, 255, 0.06)',
    bgContent: 'transparent',
    linkColor: '#55a5d9',
    linkHover: '#6bb5e9',
    idColor: '#55a5d9',
    idBg: 'rgba(85, 165, 217, 0.15)',
    codeBlockBg: '#2a2a2a',
  },
};

const alabasterTheme: ThemeDefinition = {
  name: 'alabaster',
  label: 'Alabaster',
  light: {
    sidebarBg: '#f0ece3',
    sidebarText: '#999',
    sidebarActiveBg: '#e4dfd6',
    sidebarActiveText: '#333',
    sidebarBorder: '#ddd5c8',
    pageBg: '#fff',
    textPrimary: '#000',
    textSecondary: '#888',
    borderColor: '#ddd',
    bgLight: '#faf8f5',
    bgHeader: '#f0ece3',
    bgContent: 'transparent',
    linkColor: '#004b6b',
    linkHover: '#006b9b',
    idColor: '#004b6b',
    idBg: 'rgba(0, 75, 107, 0.08)',
    codeBlockBg: '#f5f2ed',
  },
  dark: {
    sidebarBg: '#2a2520',
    sidebarText: '#b0a898',
    sidebarActiveBg: '#3a3530',
    sidebarActiveText: '#e0d8cc',
    sidebarBorder: '#3a3530',
    pageBg: '#1c1816',
    textPrimary: '#d4d0c8',
    textSecondary: '#999',
    borderColor: '#444',
    bgLight: 'rgba(255, 255, 255, 0.04)',
    bgHeader: 'rgba(255, 255, 255, 0.06)',
    bgContent: 'transparent',
    linkColor: '#6db3d8',
    linkHover: '#8dc3e0',
    idColor: '#6db3d8',
    idBg: 'rgba(109, 179, 216, 0.15)',
    codeBlockBg: '#2a2520',
  },
};

const furoTheme: ThemeDefinition = {
  name: 'furo',
  label: 'Furo',
  light: {
    sidebarBg: '#f8f9fb',
    sidebarText: '#5a5c63',
    sidebarActiveBg: '#edf0f7',
    sidebarActiveText: '#0b51c1',
    sidebarBorder: '#e8e8e8',
    pageBg: '#fff',
    textPrimary: '#2c2c2c',
    textSecondary: '#6e6e6e',
    borderColor: '#e8e8e8',
    bgLight: '#f8f9fb',
    bgHeader: '#f0f2f6',
    bgContent: 'transparent',
    linkColor: '#0b51c1',
    linkHover: '#0d63e8',
    idColor: '#0b51c1',
    idBg: 'rgba(11, 81, 193, 0.08)',
    codeBlockBg: '#f8f9fb',
  },
  dark: {
    sidebarBg: '#1a1c24',
    sidebarText: '#b0b0b0',
    sidebarActiveBg: '#252830',
    sidebarActiveText: '#8ab4f8',
    sidebarBorder: '#303340',
    pageBg: '#12141c',
    textPrimary: '#d4d4d4',
    textSecondary: '#999',
    borderColor: '#303340',
    bgLight: 'rgba(255, 255, 255, 0.04)',
    bgHeader: 'rgba(255, 255, 255, 0.06)',
    bgContent: 'transparent',
    linkColor: '#8ab4f8',
    linkHover: '#a0c4ff',
    idColor: '#8ab4f8',
    idBg: 'rgba(138, 180, 248, 0.15)',
    codeBlockBg: '#1a1c24',
  },
};

const pydataTheme: ThemeDefinition = {
  name: 'pydata',
  label: 'PyData',
  light: {
    sidebarBg: '#f1f1f1',
    sidebarText: '#222',
    sidebarActiveBg: '#e3e3e3',
    sidebarActiveText: '#0d6efd',
    sidebarBorder: '#ddd',
    pageBg: '#fff',
    textPrimary: '#212529',
    textSecondary: '#6c757d',
    borderColor: '#dee2e6',
    bgLight: '#f8f9fa',
    bgHeader: '#e9ecef',
    bgContent: 'transparent',
    linkColor: '#0d6efd',
    linkHover: '#0a58ca',
    idColor: '#0d6efd',
    idBg: 'rgba(13, 110, 253, 0.08)',
    codeBlockBg: '#f8f9fa',
  },
  dark: {
    sidebarBg: '#181b1e',
    sidebarText: '#ccc',
    sidebarActiveBg: '#282c30',
    sidebarActiveText: '#6ea8fe',
    sidebarBorder: '#333',
    pageBg: '#1a1d21',
    textPrimary: '#d4d4d4',
    textSecondary: '#999',
    borderColor: '#444',
    bgLight: 'rgba(255, 255, 255, 0.04)',
    bgHeader: 'rgba(255, 255, 255, 0.06)',
    bgContent: 'transparent',
    linkColor: '#6ea8fe',
    linkHover: '#8bb9ff',
    idColor: '#6ea8fe',
    idBg: 'rgba(110, 168, 254, 0.15)',
    codeBlockBg: '#1e2126',
  },
};

/* ---------------------------------------------------------------------------
   Public API
   --------------------------------------------------------------------------- */

const THEMES: Record<string, ThemeDefinition> = {
  default: defaultTheme,
  readthedocs: readthedocsTheme,
  alabaster: alabasterTheme,
  furo: furoTheme,
  pydata: pydataTheme,
};

export const THEME_NAMES = Object.keys(THEMES);

/**
 * Get a theme by name. Falls back to 'default' if not found.
 */
export function getTheme(name: string): ThemeDefinition {
  return THEMES[name] || THEMES['default'];
}

/**
 * Generate a CSS `:root { --rigr-*: ...; }` block for a given mode.
 */
export function generateThemeVars(theme: ThemeDefinition, mode: 'light' | 'dark'): string {
  const c = theme[mode];
  return `:root {
  --rigr-sidebar-bg: ${c.sidebarBg};
  --rigr-sidebar-text: ${c.sidebarText};
  --rigr-sidebar-active-bg: ${c.sidebarActiveBg};
  --rigr-sidebar-active-text: ${c.sidebarActiveText};
  --rigr-sidebar-border: ${c.sidebarBorder};
  --rigr-page-bg: ${c.pageBg};
  --rigr-text-primary: ${c.textPrimary};
  --rigr-text-secondary: ${c.textSecondary};
  --rigr-border-color: ${c.borderColor};
  --rigr-bg-light: ${c.bgLight};
  --rigr-bg-header: ${c.bgHeader};
  --rigr-bg-content: ${c.bgContent};
  --rigr-link-color: ${c.linkColor};
  --rigr-link-hover: ${c.linkHover};
  --rigr-id-color: ${c.idColor};
  --rigr-id-bg: ${c.idBg};
  --rigr-code-block-bg: ${c.codeBlockBg};
}`;
}

/**
 * Generate complete theme CSS for static HTML builds.
 * Includes light vars by default + dark vars in a prefers-color-scheme media query.
 */
export function generateStaticThemeCss(themeName: string): string {
  const theme = getTheme(themeName);
  const lightVars = generateThemeVars(theme, 'light');
  const darkVars = generateThemeVars(theme, 'dark');

  return `/* Theme: ${theme.label} */
${lightVars}

@media (prefers-color-scheme: dark) {
${darkVars.replace(':root', '  :root')}
}`;
}
