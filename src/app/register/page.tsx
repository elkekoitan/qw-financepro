'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth.context';
import { useThemeContext } from '@/components/providers';
import { useTheme } from '@mui/material/styles';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterState {
  showPassword: boolean;
  showConfirmPassword: boolean;
  loading: boolean;
  error: { message: string } | null;
}

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { mode } = useThemeContext();
  const theme = useTheme();

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [state, setState] = useState<RegisterState>({
    showPassword: false,
    showConfirmPassword: false,
    loading: false,
    error: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setState(prev => ({
        ...prev,
        error: { message: 'Parolalar eşleşmiyor' }
      }));
      return;
    }

    setState(prev => ({ ...prev, error: null, loading: true }));

    try {
      await signUp(formData.email, formData.password, formData.fullName);
      router.push('/auth/verify-email');
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: {
          message: err instanceof Error ? err.message : 'Kayıt işlemi başarısız oldu',
        },
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword'): void => {
    setState(prev => ({
      ...prev,
      [field === 'password' ? 'showPassword' : 'showConfirmPassword']: 
        !prev[field === 'password' ? 'showPassword' : 'showConfirmPassword']
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.background.default,
        pt: 4,
        pb: 4,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card
            sx={{
              background: 'rgba(26,26,26,0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(191, 164, 111, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Box textAlign="center" mb={4}>
                  <Typography
                    variant="h3"
                    sx={{
                      mb: 2,
                      background: 'linear-gradient(135deg, #FFD700 0%, #BFA46F 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Hesap Oluşturun
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Premium finans dünyasına katılın
                  </Typography>
                </Box>

                {state.error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      backgroundColor: theme.palette.error.main,
                      color: theme.palette.error.contrastText,
                    }}
                  >
                    {state.error.message}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Ad Soyad"
                  variant="outlined"
                  value={formData.fullName}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(191, 164, 111, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(191, 164, 111, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="E-posta Adresi"
                  variant="outlined"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(191, 164, 111, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(191, 164, 111, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Şifre"
                  variant="outlined"
                  type={state.showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('password')}
                          edge="end"
                          sx={{ color: 'rgba(191, 164, 111, 0.5)' }}
                        >
                          {state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(191, 164, 111, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(191, 164, 111, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Şifre Tekrar"
                  variant="outlined"
                  type={state.showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirmPassword')}
                          edge="end"
                          sx={{ color: 'rgba(191, 164, 111, 0.5)' }}
                        >
                          {state.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(191, 164, 111, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(191, 164, 111, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    mt: 2,
                    background: 'linear-gradient(135deg, #FFD700 0%, #BFA46F 100%)',
                    color: 'background.default',
                    fontSize: '1.1rem',
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #BFA46F 0%, #8B7355 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(191, 164, 111, 0.2)',
                    },
                  }}
                >
                  Hesap Oluştur
                </Button>

                <Box
                  sx={{
                    mt: 2,
                    textAlign: 'center',
                    '& a': {
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: theme.palette.primary.light,
                      },
                    },
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Zaten hesabınız var mı?{' '}
                    <Link href="/login">
                      Giriş Yapın
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
} 