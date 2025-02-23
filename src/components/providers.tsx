'use client';

import { AuthProvider } from '@/contexts/AuthProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PortfolioProvider } from '@/contexts/PortfolioContext';
import { InvestmentProvider } from '@/contexts/InvestmentContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
          <InvestmentProvider>
            {children}
          </InvestmentProvider>
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 