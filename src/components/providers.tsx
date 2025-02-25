'use client';

import { AuthProvider } from '@/contexts/AuthProvider';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PortfolioProvider } from '@/contexts/PortfolioContext';
import { InvestmentProvider } from '@/contexts/InvestmentContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4FD1C5',
      dark: '#319795',
    },
    secondary: {
      main: '#38A169',
      dark: '#2F855A',
    },
    background: {
      default: '#0A1A1A',
      paper: '#112121',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeProvider>
        <AuthProvider>
          <PortfolioProvider>
            <InvestmentProvider>
              {children}
            </InvestmentProvider>
          </PortfolioProvider>
        </AuthProvider>
      </ThemeProvider>
    </MUIThemeProvider>
  );
} 