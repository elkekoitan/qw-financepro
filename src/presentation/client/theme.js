import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Mavi
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed', // Mor
      light: '#a78bfa',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981', // Yeşil
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444', // Kırmızı
      light: '#f87171',
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b', // Turuncu
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    info: {
      main: '#3b82f6', // Açık Mavi
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 6px rgba(0,0,0,0.05)',
    '0px 6px 8px rgba(0,0,0,0.05)',
    '0px 8px 12px rgba(0,0,0,0.05)',
    '0px 12px 16px rgba(0,0,0,0.05)',
    '0px 14px 20px rgba(0,0,0,0.05)',
    '0px 16px 24px rgba(0,0,0,0.05)',
    '0px 18px 28px rgba(0,0,0,0.05)',
    '0px 20px 32px rgba(0,0,0,0.05)',
    '0px 22px 36px rgba(0,0,0,0.05)',
    '0px 24px 40px rgba(0,0,0,0.05)',
    '0px 26px 44px rgba(0,0,0,0.05)',
    '0px 28px 48px rgba(0,0,0,0.05)',
    '0px 30px 52px rgba(0,0,0,0.05)',
    '0px 32px 56px rgba(0,0,0,0.05)',
    '0px 34px 60px rgba(0,0,0,0.05)',
    '0px 36px 64px rgba(0,0,0,0.05)',
    '0px 38px 68px rgba(0,0,0,0.05)',
    '0px 40px 72px rgba(0,0,0,0.05)',
    '0px 42px 76px rgba(0,0,0,0.05)',
    '0px 44px 80px rgba(0,0,0,0.05)',
    '0px 46px 84px rgba(0,0,0,0.05)',
    '0px 48px 88px rgba(0,0,0,0.05)',
    '0px 50px 92px rgba(0,0,0,0.05)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 6px rgba(0,0,0,0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 6px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme; 