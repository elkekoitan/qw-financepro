'use client';

import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Article as ArticleIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type {
  AnalysisState,
  MarketData,
  TechnicalIndicator,
  ChartData,
  NewsItem,
  AnalysisFilter,
} from '@/types/analysis';

const mockData: AnalysisState = {
  loading: false,
  error: null,
  marketData: {
    symbol: 'THYAO',
    price: 245.50,
    change: 5.20,
    changePercent: 2.16,
    volume: 12500000,
    marketCap: 33750000000,
    lastUpdated: '2024-03-15T10:30:00Z',
  },
  technicalIndicators: [
    {
      name: 'RSI',
      value: 65.5,
      signal: 'neutral',
      description: 'Göreceli Güç Endeksi',
    },
    {
      name: 'MACD',
      value: 0.85,
      signal: 'buy',
      description: 'Hareketli Ortalama Yakınsama/Iraksama',
    },
    {
      name: 'Bollinger',
      value: 1.2,
      signal: 'sell',
      description: 'Bollinger Bantları',
    },
  ],
  chartData: Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
    open: 240 + Math.random() * 10,
    high: 245 + Math.random() * 10,
    low: 235 + Math.random() * 10,
    close: 242 + Math.random() * 10,
    volume: 1000000 + Math.random() * 500000,
  })),
  news: [
    {
      id: '1',
      title: 'Türk Hava Yolları yeni uçak siparişi verdi',
      content: 'THY, filosuna 10 yeni uçak daha eklemeyi planlıyor...',
      source: 'Bloomberg',
      url: 'https://example.com/news/1',
      sentiment: 'positive',
      publishedAt: '2024-03-15T09:00:00Z',
    },
    {
      id: '2',
      title: 'Havacılık sektöründe yeni düzenlemeler',
      content: 'Sivil Havacılık Genel Müdürlüğü yeni düzenlemeler açıkladı...',
      source: 'Reuters',
      url: 'https://example.com/news/2',
      sentiment: 'neutral',
      publishedAt: '2024-03-15T08:30:00Z',
    },
  ],
  filters: {
    timeframe: '1M',
    indicators: ['RSI', 'MACD', 'Bollinger'],
    newsSource: ['Bloomberg', 'Reuters'],
  },
};

export default function AnalysisPage() {
  const theme = useTheme();
  const [state, setState] = useState<AnalysisState>(mockData);
  const [symbol, setSymbol] = useState<string>('THYAO');

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSymbol(e.target.value.toUpperCase());
  };

  const handleSearch = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API çağrısı
      
      // Mock veri güncelleme
      setState(prev => ({
        ...prev,
        marketData: {
          ...prev.marketData!,
          symbol,
        },
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Veri alınırken bir hata oluştu',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleTimeframeChange = (timeframe: AnalysisFilter['timeframe']): void => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        timeframe,
      },
    }));
  };

  const handleIndicatorToggle = (indicator: string): void => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        indicators: prev.filters.indicators.includes(indicator)
          ? prev.filters.indicators.filter(i => i !== indicator)
          : [...prev.filters.indicators, indicator],
      },
    }));
  };

  const renderMarketData = (data: MarketData): ReactElement => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Fiyat
          </Typography>
          <Typography variant="h5">
            ₺{data.price.toFixed(2)}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Değişim
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {data.change >= 0 ? (
              <TrendingUp color="success" sx={{ mr: 1 }} />
            ) : (
              <TrendingDown color="error" sx={{ mr: 1 }} />
            )}
            <Typography
              variant="h5"
              color={data.change >= 0 ? 'success.main' : 'error.main'}
            >
              {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Hacim
          </Typography>
          <Typography variant="h5">
            {data.volume.toLocaleString()}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Piyasa Değeri
          </Typography>
          <Typography variant="h5">
            ₺{(data.marketCap / 1000000000).toFixed(2)}B
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );

  const renderTechnicalIndicators = (indicators: TechnicalIndicator[]): ReactElement => (
    <Grid container spacing={2}>
      {indicators.map(indicator => (
        <Grid item xs={12} sm={6} md={4} key={indicator.name}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {indicator.name}
              </Typography>
              <Typography variant="h5" gutterBottom>
                {indicator.value.toFixed(2)}
              </Typography>
              <Chip
                label={indicator.signal.toUpperCase()}
                color={
                  indicator.signal === 'buy'
                    ? 'success'
                    : indicator.signal === 'sell'
                    ? 'error'
                    : 'default'
                }
                size="small"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {indicator.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderChart = (data: ChartData[]): ReactElement => (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={theme.palette.primary.main}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={theme.palette.primary.main}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        <YAxis domain={['auto', 'auto']} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          labelFormatter={(value) => new Date(value).toLocaleString()}
          formatter={(value: number) => [`₺${value.toFixed(2)}`, 'Fiyat']}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="close"
          stroke={theme.palette.primary.main}
          fillOpacity={1}
          fill="url(#colorPrice)"
          name="Fiyat"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderNews = (news: NewsItem[]): ReactElement => (
    <Grid container spacing={2}>
      {news.map(item => (
        <Grid item xs={12} key={item.id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <ArticleIcon sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.content}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Box>
                  <Chip
                    label={item.source}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={item.sentiment.toUpperCase()}
                    color={
                      item.sentiment === 'positive'
                        ? 'success'
                        : item.sentiment === 'negative'
                        ? 'error'
                        : 'default'
                    }
                    size="small"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(item.publishedAt).toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Teknik Analiz
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Hisse senedi analizi ve piyasa verileri
        </Typography>
      </Box>

      {state.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error}
        </Alert>
      )}

      {/* Sembol Arama */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Hisse Senedi Sembolü"
                value={symbol}
                onChange={handleSymbolChange}
                placeholder="Örn: THYAO"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                disabled={state.loading}
              >
                {state.loading ? 'Aranıyor...' : 'Ara'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Piyasa Verileri */}
      {state.marketData && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">
                {state.marketData.symbol} Piyasa Verileri
              </Typography>
              <Button
                startIcon={<RefreshIcon />}
                onClick={handleSearch}
                disabled={state.loading}
              >
                Yenile
              </Button>
            </Box>
            {renderMarketData(state.marketData)}
          </CardContent>
        </Card>
      )}

      {/* Grafik ve Filtreler */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Fiyat Grafiği
            </Typography>
            <Box>
              {['1D', '1W', '1M', '3M', '6M', '1Y', 'YTD'].map((timeframe) => (
                <Button
                  key={timeframe}
                  size="small"
                  variant={state.filters.timeframe === timeframe ? 'contained' : 'text'}
                  onClick={() => handleTimeframeChange(timeframe as AnalysisFilter['timeframe'])}
                  sx={{ ml: 1 }}
                >
                  {timeframe}
                </Button>
              ))}
            </Box>
          </Box>
          {renderChart(state.chartData)}
        </CardContent>
      </Card>

      {/* Teknik Göstergeler */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Teknik Göstergeler
          </Typography>
          {renderTechnicalIndicators(state.technicalIndicators)}
        </CardContent>
      </Card>

      {/* Haberler */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            İlgili Haberler
          </Typography>
          {renderNews(state.news)}
        </CardContent>
      </Card>
    </Container>
  );
} 