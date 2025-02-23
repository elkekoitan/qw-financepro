import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
  Stack,
} from '@mui/material';
import {
  Security,
  ShowChart,
  Speed,
  DeviceHub,
  Psychology,
  Devices,
} from '@mui/icons-material';

function Landing() {
  const theme = useTheme();

  const features = [
    {
      icon: <Security fontSize="large" color="primary" />,
      title: 'Güvenli Kimlik Doğrulama',
      description: 'JWT ve Google OAuth ile güvenli giriş sistemi',
    },
    {
      icon: <ShowChart fontSize="large" color="primary" />,
      title: 'Gerçek Zamanlı Veriler',
      description: 'Anlık piyasa verileri ve portföy güncellemeleri',
    },
    {
      icon: <Psychology fontSize="large" color="primary" />,
      title: 'Yapay Zeka Desteği',
      description: 'AI destekli finansal tahminler ve öneriler',
    },
    {
      icon: <Speed fontSize="large" color="primary" />,
      title: 'Yüksek Performans',
      description: 'Optimize edilmiş ve hızlı kullanıcı deneyimi',
    },
    {
      icon: <DeviceHub fontSize="large" color="primary" />,
      title: 'Gelişmiş Entegrasyonlar',
      description: 'Çeşitli finans platformları ile entegrasyon',
    },
    {
      icon: <Devices fontSize="large" color="primary" />,
      title: 'Mobil Uyumlu',
      description: 'Tüm cihazlarda kusursuz deneyim',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          py: { xs: 8, md: 15 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Finansal Geleceğinizi
                <br />
                Yönetin
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Modern ve güvenli finans yönetim platformu ile yatırımlarınızı kontrol edin.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  Ücretsiz Başla
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'grey.100',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Giriş Yap
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/assets/hero-image.png"
                alt="FinancialPro Dashboard"
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  height: 'auto',
                  filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.2))',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h2"
          align="center"
          sx={{ mb: 8, fontWeight: 600 }}
        >
          Özellikler
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'grey.100',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Hemen Başlayın
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Finansal hedeflerinize ulaşmak için ilk adımı atın
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
            >
              Ücretsiz Hesap Oluştur
            </Button>
            <Button
              component={RouterLink}
              to="/about"
              variant="outlined"
              size="large"
            >
              Daha Fazla Bilgi
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          bgcolor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 FinancialPro. Tüm hakları saklıdır.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing; 