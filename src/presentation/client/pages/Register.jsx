import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Parolalar eşleşmiyor');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Parola en az 6 karakter olmalıdır');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.fullName);
      navigate('/');
    } catch (err) {
      setError('Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Google ile kayıt olurken bir hata oluştu');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: theme.shadows[8],
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Logo ve Başlık */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <img
                src="/assets/logo.png"
                alt="FinancialPro Logo"
                style={{ width: 60, height: 60, marginBottom: 16 }}
              />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Hesap Oluştur
              </Typography>
              <Typography variant="body2" color="text.secondary">
                FinancialPro'ya hoş geldiniz
              </Typography>
            </Box>

            {/* Hata Mesajı */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Kayıt Formu */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Ad Soyad"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="E-posta"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Parola"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Parola Tekrar"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
              </Button>
            </form>

            {/* Google ile Kayıt */}
            <Box sx={{ my: 3 }}>
              <Divider>
                <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                  VEYA
                </Typography>
              </Divider>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleGoogleRegister}
              startIcon={<GoogleIcon />}
              sx={{ mb: 3 }}
            >
              Google ile Kayıt Ol
            </Button>

            {/* Giriş Yap Linki */}
            <Typography variant="body2" align="center">
              Zaten hesabınız var mı?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                }}
              >
                Giriş Yapın
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Register; 