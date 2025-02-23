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
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  LinearProgress,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import type {
  ReportState,
  ReportData,
  ReportFilter,
  ReportGenerationOptions,
  ReportMetrics,
} from '@/types/reports';

const mockData: ReportState = {
  loading: false,
  error: null,
  success: null,
  reports: [
    {
      id: '1',
      title: 'Aylık Performans Raporu',
      type: 'performance',
      description: 'Mart 2024 portföy performans analizi',
      createdAt: '2024-03-15T10:00:00Z',
      updatedAt: '2024-03-15T10:00:00Z',
      status: 'ready',
      downloadUrl: '/reports/performance-202403.pdf',
      fileSize: 2500000,
      format: 'pdf',
    },
    {
      id: '2',
      title: 'Vergi Raporu',
      type: 'tax',
      description: '2024 Q1 vergi raporu',
      createdAt: '2024-03-14T15:30:00Z',
      updatedAt: '2024-03-14T15:30:00Z',
      status: 'generating',
      format: 'excel',
    },
    {
      id: '3',
      title: 'Portföy Dağılımı',
      type: 'portfolio',
      description: 'Güncel portföy dağılım raporu',
      createdAt: '2024-03-13T09:15:00Z',
      updatedAt: '2024-03-13T09:15:00Z',
      status: 'ready',
      downloadUrl: '/reports/portfolio-distribution.xlsx',
      fileSize: 1800000,
      format: 'excel',
    },
  ],
  filters: {
    type: 'all',
    dateRange: {
      start: '2024-01-01',
      end: '2024-12-31',
    },
    status: 'all',
    format: 'all',
  },
  metrics: {
    totalReports: 25,
    generatedToday: 3,
    storageUsed: 52428800, // 50 MB
    storageLimit: 1073741824, // 1 GB
    generationQuota: {
      used: 15,
      limit: 50,
      resetDate: '2024-04-01T00:00:00Z',
    },
  },
  selectedReport: null,
  isGenerating: false,
};

export default function ReportsPage() {
  const theme = useTheme();
  const [state, setState] = useState<ReportState>(mockData);

  const handleFilterChange = (field: keyof ReportFilter, value: any): void => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [field]: value,
      },
    }));
  };

  const handleGenerateReport = async (options: ReportGenerationOptions): Promise<void> => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock API çağrısı

      setState(prev => ({
        ...prev,
        success: 'Rapor oluşturma işlemi başlatıldı',
        reports: [
          {
            id: Math.random().toString(),
            title: `Yeni ${options.type} Raporu`,
            type: options.type,
            description: 'Rapor oluşturuluyor...',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'generating',
            format: options.format,
          },
          ...prev.reports,
        ],
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Rapor oluşturulurken bir hata oluştu',
      }));
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleDownload = async (report: ReportData): Promise<void> => {
    if (!report.downloadUrl) return;

    try {
      // Mock indirme işlemi
      window.open(report.downloadUrl, '_blank');
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Rapor indirilirken bir hata oluştu',
      }));
    }
  };

  const handleDelete = async (report: ReportData): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API çağrısı

      setState(prev => ({
        ...prev,
        success: 'Rapor başarıyla silindi',
        reports: prev.reports.filter(r => r.id !== report.id),
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Rapor silinirken bir hata oluştu',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const renderMetrics = (metrics: ReportMetrics): ReactElement => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Toplam Rapor
            </Typography>
            <Typography variant="h4">
              {metrics.totalReports}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Bugün Oluşturulan
            </Typography>
            <Typography variant="h4">
              {metrics.generatedToday}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Depolama Kullanımı
            </Typography>
            <Typography variant="h4">
              {(metrics.storageUsed / 1024 / 1024).toFixed(1)} MB
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(metrics.storageUsed / metrics.storageLimit) * 100}
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Kalan Kota
            </Typography>
            <Typography variant="h4">
              {metrics.generationQuota.limit - metrics.generationQuota.used}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sıfırlanma: {new Date(metrics.generationQuota.resetDate).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderReportList = (reports: ReportData[]): ReactElement => (
    <Grid container spacing={2}>
      {reports.map(report => (
        <Grid item xs={12} key={report.id}>
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle1">
                        {report.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {report.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box>
                    <Chip
                      label={report.type.toUpperCase()}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={report.status.toUpperCase()}
                      color={
                        report.status === 'ready'
                          ? 'success'
                          : report.status === 'generating'
                          ? 'warning'
                          : 'error'
                      }
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {report.status === 'ready' && report.downloadUrl && (
                      <IconButton
                        color="primary"
                        onClick={() => handleDownload(report)}
                        sx={{ mr: 1 }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(report)}
                      disabled={report.status === 'generating'}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
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
          Raporlar
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rapor oluşturun, indirin ve yönetin
        </Typography>
      </Box>

      {state.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error}
        </Alert>
      )}

      {state.success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {state.success}
        </Alert>
      )}

      {/* Metrikler */}
      <Box sx={{ mb: 4 }}>
        {renderMetrics(state.metrics)}
      </Box>

      {/* Filtreler ve Yeni Rapor */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Rapor Tipi</InputLabel>
                <Select
                  value={state.filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  label="Rapor Tipi"
                >
                  <MenuItem value="all">Tümü</MenuItem>
                  <MenuItem value="performance">Performans</MenuItem>
                  <MenuItem value="tax">Vergi</MenuItem>
                  <MenuItem value="portfolio">Portföy</MenuItem>
                  <MenuItem value="risk">Risk</MenuItem>
                  <MenuItem value="transaction">İşlem</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Durum</InputLabel>
                <Select
                  value={state.filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Durum"
                >
                  <MenuItem value="all">Tümü</MenuItem>
                  <MenuItem value="ready">Hazır</MenuItem>
                  <MenuItem value="generating">Oluşturuluyor</MenuItem>
                  <MenuItem value="failed">Başarısız</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  value={state.filters.format}
                  onChange={(e) => handleFilterChange('format', e.target.value)}
                  label="Format"
                >
                  <MenuItem value="all">Tümü</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleGenerateReport({
                  type: 'performance',
                  dateRange: {
                    start: new Date().toISOString(),
                    end: new Date().toISOString(),
                  },
                  format: 'pdf',
                  includeCharts: true,
                  includeSummary: true,
                  includeTransactions: true,
                })}
                disabled={state.isGenerating}
              >
                {state.isGenerating ? 'Oluşturuluyor...' : 'Yeni Rapor'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Rapor Listesi */}
      {renderReportList(state.reports)}
    </Container>
  );
} 