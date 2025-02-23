import { ThemeOptions } from '@mui/material';

// Renk paleti
const colors = {
  primary: {
    50: '#E6FFFA',
    100: '#B2F5EA',
    200: '#81E6D9',
    300: '#4FD1C5', // Ana turkuaz rengi
    400: '#38B2AC',
    500: '#319795', // Koyu turkuaz
    600: '#2C7A7B',
    700: '#285E61',
    800: '#234E52',
    900: '#1D4044',
  },
  secondary: {
    50: '#F0FFF4',
    100: '#C6F6D5',
    200: '#9AE6B4',
    300: '#68D391',
    400: '#48BB78',
    500: '#38A169',
    600: '#2F855A',
    700: '#276749',
    800: '#22543D',
    900: '#1C4532',
  },
  accent: {
    50: '#EDFDFD',
    100: '#C4F1F9',
    200: '#9DECF9',
    300: '#76E4F7', // Parlak turkuaz
    400: '#0BC5EA',
    500: '#00B5D8',
    600: '#00A3C4',
    700: '#0987A0',
    800: '#086F83',
    900: '#065666',
  },
  success: {
    50: '#E6FFFA',
    100: '#B2F5EA',
    200: '#81E6D9',
    300: '#4FD1C5',
    400: '#38B2AC',
    500: '#319795',
    600: '#2C7A7B',
    700: '#285E61',
    800: '#234E52',
    900: '#1D4044',
  },
  error: {
    50: '#FFF5F5',
    100: '#FED7D7',
    200: '#FEB2B2',
    300: '#FC8181',
    400: '#F56565',
    500: '#E53E3E',
    600: '#C53030',
    700: '#9B2C2C',
    800: '#822727',
    900: '#63171B',
  },
  gray: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  },
  dark: {
    background: '#0A1A1A', // Koyu turkuaz-siyah arka plan
    paper: '#112121',      // Kart arka planı
    surface: '#1A2C2C',    // Yüzey rengi
  },
  text: {
    primary: '#FFFFFF',    // Beyaz metin
    secondary: '#9AACAC',  // Gri-turkuaz metin
    accent: '#4FD1C5',     // Turkuaz vurgu metni
  },
  gradients: {
    primary: 'linear-gradient(135deg, #4FD1C5 0%, #319795 100%)',
    secondary: 'linear-gradient(135deg, #76E4F7 0%, #4FD1C5 100%)',
    dark: 'linear-gradient(180deg, #0A1A1A 0%, #1A2C2C 100%)',
    glass: 'linear-gradient(135deg, rgba(26,44,44,0.9) 0%, rgba(17,33,33,0.8) 100%)',
    card: 'linear-gradient(135deg, rgba(26,44,44,0.9) 0%, rgba(17,33,33,0.8) 100%)',
  },
};

// Input stilleri
const inputStyles = {
  default: {
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: 'transparent',
  },
  light: {
    border: `1px solid ${colors.gray[200]}`,
    color: colors.gray[900],
    '&:hover': {
      borderColor: colors.gray[300],
    },
    '&:focus': {
      borderColor: colors.primary[500],
      boxShadow: `0 0 0 2px ${colors.primary[100]}`,
    },
  },
  dark: {
    border: `1px solid ${colors.gray[700]}`,
    color: colors.gray[100],
    '&:hover': {
      borderColor: colors.gray[600],
    },
    '&:focus': {
      borderColor: colors.primary[500],
      boxShadow: `0 0 0 2px ${colors.primary[900]}`,
    },
  },
};

// Kart stilleri
const cardStyles = {
  default: {
    borderRadius: '1rem',
    transition: 'all 0.3s ease-in-out',
  },
  light: {
    backgroundColor: '#ffffff',
    border: `1px solid ${colors.gray[200]}`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 6px -1px ${colors.gray[100]}, 0 2px 4px -1px ${colors.gray[100]}`,
    },
  },
  dark: {
    backgroundColor: colors.gray[800],
    border: `1px solid ${colors.gray[700]}`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)`,
    },
  },
};

// Buton stilleri
const buttonStyles = {
  default: {
    borderRadius: '0.5rem',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
    textTransform: 'none',
  },
  variants: {
    primary: {
      light: {
        backgroundColor: colors.primary[600],
        color: '#ffffff',
        '&:hover': {
          backgroundColor: colors.primary[700],
        },
      },
      dark: {
        backgroundColor: colors.primary[500],
        color: '#ffffff',
        '&:hover': {
          backgroundColor: colors.primary[600],
        },
      },
    },
    secondary: {
      light: {
        backgroundColor: colors.secondary[600],
        color: '#ffffff',
        '&:hover': {
          backgroundColor: colors.secondary[700],
        },
      },
      dark: {
        backgroundColor: colors.secondary[500],
        color: '#ffffff',
        '&:hover': {
          backgroundColor: colors.secondary[600],
        },
      },
    },
    outlined: {
      light: {
        border: `1px solid ${colors.gray[300]}`,
        color: colors.gray[700],
        '&:hover': {
          backgroundColor: colors.gray[50],
        },
      },
      dark: {
        border: `1px solid ${colors.gray[600]}`,
        color: colors.gray[300],
        '&:hover': {
          backgroundColor: colors.gray[700],
        },
      },
    },
  },
};

// Gölge efektleri
const shadows = {
  card: '0px 8px 24px rgba(0, 0, 0, 0.08)',
  button: '0px 4px 12px rgba(79, 209, 197, 0.2)',
  dropdown: '0px 8px 16px rgba(0, 0, 0, 0.12)',
  modal: '0px 16px 32px rgba(0, 0, 0, 0.16)',
};

// Animasyon geçişleri
const transitions = {
  default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
};

// Cam efekti stilleri
const glassStyles = {
  light: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  dark: {
    background: 'rgba(17, 33, 33, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(79, 209, 197, 0.1)',
  },
};

// Bileşen stilleri
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '2px',
        textTransform: 'none',
        padding: '12px 32px',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        transition: 'all 0.3s ease-in-out',
        '&.MuiButton-contained': {
          background: colors.gradients.primary,
          color: colors.text.primary,
          boxShadow: 'none',
          '&:hover': {
            background: colors.gradients.secondary,
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(79, 209, 197, 0.2)',
          },
        },
        '&.MuiButton-outlined': {
          borderColor: colors.primary[300],
          color: colors.primary[300],
          '&:hover': {
            borderColor: colors.primary[400],
            background: 'rgba(79, 209, 197, 0.05)',
          },
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        background: colors.gradients.card,
        backdropFilter: 'blur(10px)',
        border: `1px solid rgba(79, 209, 197, 0.1)`,
        borderRadius: '8px',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          borderColor: 'rgba(79, 209, 197, 0.3)',
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px',
          background: 'rgba(26,44,44,0.6)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease-in-out',
          '& fieldset': {
            borderColor: 'rgba(79, 209, 197, 0.2)',
            transition: 'all 0.3s ease-in-out',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(79, 209, 197, 0.4)',
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.primary[300],
            borderWidth: '1px',
          },
          '& input': {
            color: colors.text.primary,
            '&::placeholder': {
              color: colors.text.secondary,
              opacity: 0.8,
            },
          },
        },
        '& .MuiInputLabel-root': {
          color: colors.text.secondary,
          '&.Mui-focused': {
            color: colors.primary[300],
          },
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        background: 'rgba(10, 26, 26, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(79, 209, 197, 0.1)',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        background: colors.dark.background,
        borderRight: '1px solid rgba(79, 209, 197, 0.1)',
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: 'rgba(79, 209, 197, 0.1)',
      },
    },
  },
};

// Tipografi sistemi
const typography = {
  fontFamily: '"Playfair Display", "Plus Jakarta Sans", sans-serif',
  h1: {
    fontSize: '4.5rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '3rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '2.5rem',
    fontWeight: 300,
    letterSpacing: '0.02em',
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '2rem',
    fontWeight: 400,
    letterSpacing: '0.01em',
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.5rem',
    fontWeight: 400,
    letterSpacing: '0.01em',
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1.25rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
    lineHeight: 1.4,
  },
  subtitle1: {
    fontSize: '1.125rem',
    fontWeight: 300,
    letterSpacing: '0.05em',
    lineHeight: 1.6,
  },
  subtitle2: {
    fontSize: '1rem',
    fontWeight: 400,
    letterSpacing: '0.04em',
    lineHeight: 1.6,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
    letterSpacing: '0.02em',
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
    letterSpacing: '0.02em',
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'none',
  },
};

// Tema yapılandırması
export const getThemeOptions = (mode: 'light' | 'dark') => ({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary[300],
      light: colors.primary[200],
      dark: colors.primary[400],
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
    },
    background: {
      default: colors.dark.background,
      paper: colors.dark.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    error: {
      main: colors.error[500],
    },
    success: {
      main: colors.success[500],
    },
  },
  typography,
  shape: {
    borderRadius: 4,
  },
  shadows: [
    'none',
    shadows.card,
    shadows.button,
    shadows.dropdown,
    shadows.modal,
    ...Array(20).fill('none'),
  ],
  components,
}); 