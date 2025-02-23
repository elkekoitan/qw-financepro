'use client';

import { AppBar, Box, Container, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { mode } = useContext(ThemeContext);

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        background: mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant="h6"
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              sx={{
                fontWeight: 700,
                background: mode === 'light'
                  ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FinancePro
            </Typography>
          </Link>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeToggle />
            <Button
              component={Link}
              href="/login"
              variant="text"
              sx={{
                color: mode === 'light' ? 'primary.main' : 'white',
                '&:hover': {
                  background: mode === 'light' 
                    ? 'rgba(37, 99, 235, 0.04)'
                    : 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              Giriş Yap
            </Button>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              sx={{
                background: mode === 'light'
                  ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                '&:hover': {
                  background: mode === 'light'
                    ? 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)'
                    : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                },
              }}
            >
              Kayıt Ol
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 