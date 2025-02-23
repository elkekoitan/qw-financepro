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
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('E-posta veya parola hatalı');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Google ile giriş yapılırken bir hata oluştu');
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
                Hoş Geldiniz
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hesabınıza giriş yapın
              </Typography>
            </Box>

            {/* Hata Mesajı */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Giriş Formu */}
            <form onSubmit={handleSubmit}>
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
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
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
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>

            {/* Google ile Giriş */}
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
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon />}
              sx={{ mb: 3 }}
            >
              Google ile Giriş Yap
            </Button>

            {/* Kayıt Ol Linki */}
            <Typography variant="body2" align="center">
              Hesabınız yok mu?{' '}
              <Link
                component={RouterLink}
                to="/register"
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                }}
              >
                Hemen Kayıt Olun
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Login; 