import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  MoreVert as MoreVertIcon,
  AccountBalance as AccountBalanceIcon,
  ShowChart as ShowChartIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Örnek veri
const portfolioData = [
  { name: 'Oca', value: 4000 },
  { name: 'Şub', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Nis', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Haz', value: 5500 },
];

const recentTransactions = [
  { id: 1, type: 'buy', symbol: 'THYAO', amount: 1000, price: 245.50 },
  { id: 2, type: 'sell', symbol: 'GARAN', amount: 500, price: 32.80 },
  { id: 3, type: 'buy', symbol: 'EREGL', amount: 750, price: 56.20 },
];

function Dashboard() {
  const theme = useTheme();

  return (
    <Container maxWidth="lg">
      {/* Başlık */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hoş Geldiniz, Ahmet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Portföyünüzün güncel durumu ve finansal analizler
        </Typography>
      </Box>

      {/* Özet Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Toplam Varlık */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Toplam Varlık
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                ₺125.750
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  +5.25%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Günlük Kazanç */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShowChartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Günlük Kazanç
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                ₺2.450
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  +1.8%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Aktif Yatırımlar */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Aktif Yatırımlar
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                12
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  5 Hisse, 4 Kripto, 3 Fon
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Skoru */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Risk Skoru
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                65/100
              </Typography>
              <LinearProgress
                variant="determinate"
                value={65}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.palette.warning.light,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: theme.palette.warning.main,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Portföy Grafiği ve İşlemler */}
      <Grid container spacing={3}>
        {/* Portföy Grafiği */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Portföy Performansı</Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Son İşlemler */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Son İşlemler</Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Box>
                {recentTransactions.map((transaction) => (
                  <Box
                    key={transaction.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 1.5,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {transaction.type === 'buy' ? (
                        <TrendingUp color="success" sx={{ mr: 1 }} />
                      ) : (
                        <TrendingDown color="error" sx={{ mr: 1 }} />
                      )}
                      <Box>
                        <Typography variant="subtitle2">
                          {transaction.symbol}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {transaction.amount} adet
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2">
                        ₺{transaction.price}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={transaction.type === 'buy' ? 'success.main' : 'error.main'}
                      >
                        {transaction.type === 'buy' ? 'Alış' : 'Satış'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 