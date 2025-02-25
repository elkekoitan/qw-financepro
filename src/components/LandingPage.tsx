'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import { Button, Container, Typography, Box, useTheme, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface User {
  email: string;
  name?: string;
}

interface LandingPageProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

export default function LandingPage() {
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleNavigation = async (path: string) => {
    setLoading(true);
    await router.push(path);
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 8,
            pb: 6,
          }}
        >
          <motion.div variants={itemVariants}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="primary"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #4FD1C5 30%, #38A169 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FinancialPro
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
              sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
            >
              Finansal geleceğinizi şekillendirin. Portföyünüzü yönetin, yatırımlarınızı takip edin
              ve finansal hedeflerinize ulaşın.
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => handleNavigation('/auth/login')}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 6px rgba(79, 209, 197, 0.2)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 8px rgba(79, 209, 197, 0.3)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Giriş Yap'}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => handleNavigation('/auth/register')}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    backgroundColor: 'rgba(79, 209, 197, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Kayıt Ol'}
              </Button>
            </Box>
          </motion.div>
        </Box>

        <Box
          component={motion.div}
          variants={containerVariants}
          sx={{
            mt: 8,
            display: 'grid',
            gap: 4,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          }}
        >
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                textAlign: 'center',
                p: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(79, 209, 197, 0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Portföy Yönetimi
              </Typography>
              <Typography color="textSecondary">
                Yatırımlarınızı tek bir yerden takip edin ve analiz edin.
              </Typography>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box
              sx={{
                textAlign: 'center',
                p: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(56, 161, 105, 0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Gerçek Zamanlı Takip
              </Typography>
              <Typography color="textSecondary">
                Piyasa verilerini ve portföyünüzü anlık olarak izleyin.
              </Typography>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box
              sx={{
                textAlign: 'center',
                p: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(79, 209, 197, 0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Detaylı Analizler
              </Typography>
              <Typography color="textSecondary">
                Gelişmiş analiz araçlarıyla daha iyi kararlar alın.
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
} 