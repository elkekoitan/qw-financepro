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
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import type {
  InvestmentProfileData,
  InvestmentProfileState,
  InvestmentProfileFormData,
  AssetAllocation,
  InvestmentGoal,
} from '@/types/investment';

const mockData: InvestmentProfileData = {
  id: '1',
  userId: '1',
  riskProfile: {
    id: '1',
    level: 7,
    description: 'Agresif büyüme odaklı yatırım profili',
    recommendedAllocation: {
      stocks: 60,
      bonds: 20,
      crypto: 10,
      commodities: 5,
      cash: 5,
    },
  },
  goals: [
    {
      id: '1',
      type: 'retirement',
      targetAmount: 2000000,
      targetDate: '2045-01-01',
      currentAmount: 100000,
      monthlyContribution: 2000,
      expectedReturn: 8,
    },
    {
      id: '2',
      type: 'savings',
      targetAmount: 100000,
      targetDate: '2025-01-01',
      currentAmount: 20000,
      monthlyContribution: 1000,
      expectedReturn: 5,
    },
  ],
  currentAllocation: [
    { type: 'Hisse Senetleri', percentage: 55, amount: 55000, color: '#2563eb' },
    { type: 'Tahviller', percentage: 25, amount: 25000, color: '#16a34a' },
    { type: 'Kripto', percentage: 10, amount: 10000, color: '#eab308' },
    { type: 'Emtialar', percentage: 5, amount: 5000, color: '#dc2626' },
    { type: 'Nakit', percentage: 5, amount: 5000, color: '#6b7280' },
  ],
  recommendedAllocation: [
    { type: 'Hisse Senetleri', percentage: 60, amount: 60000, color: '#2563eb' },
    { type: 'Tahviller', percentage: 20, amount: 20000, color: '#16a34a' },
    { type: 'Kripto', percentage: 10, amount: 10000, color: '#eab308' },
    { type: 'Emtialar', percentage: 5, amount: 5000, color: '#dc2626' },
    { type: 'Nakit', percentage: 5, amount: 5000, color: '#6b7280' },
  ],
  monthlyIncome: 15000,
  monthlyExpenses: 8000,
  totalAssets: 100000,
  totalLiabilities: 20000,
  lastUpdated: '2024-03-15T00:00:00Z',
};

export default function InvestmentProfilePage() {
  const theme = useTheme();
  const { user } = useAuth();
  const { supabase } = useSupabase();

  const [state, setState] = useState<InvestmentProfileState>({
    loading: false,
    error: null,
    success: null,
    data: mockData,
    isEditMode: false,
  });

  const [formData, setFormData] = useState<InvestmentProfileFormData>({
    monthlyIncome: mockData.monthlyIncome,
    monthlyExpenses: mockData.monthlyExpenses,
    riskLevel: mockData.riskProfile.level,
    goals: mockData.goals.map(({ id, ...rest }) => rest),
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || value,
    }));
  };

  const handleRiskLevelChange = (_: Event, value: number | number[]): void => {
    setFormData(prev => ({
      ...prev,
      riskLevel: value as number,
    }));
  };

  const handleGoalChange = (index: number, field: keyof Omit<InvestmentGoal, 'id'>, value: string | number): void => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) =>
        i === index ? { ...goal, [field]: typeof value === 'string' ? value : parseFloat(value.toString()) } : goal
      ),
    }));
  };

  const toggleEditMode = (): void => {
    setState(prev => ({
      ...prev,
      isEditMode: !prev.isEditMode,
      error: null,
      success: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));

    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API çağrısı

      setState(prev => ({
        ...prev,
        success: 'Yatırım profili başarıyla güncellendi',
        isEditMode: false,
        data: {
          ...prev.data!,
          monthlyIncome: formData.monthlyIncome,
          monthlyExpenses: formData.monthlyExpenses,
          riskProfile: {
            ...prev.data!.riskProfile,
            level: formData.riskLevel,
          },
          goals: formData.goals.map((goal, index) => ({
            ...goal,
            id: prev.data!.goals[index]?.id || Math.random().toString(),
          })),
        },
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Yatırım profili güncellenirken bir hata oluştu',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const renderPieChart = (data: AssetAllocation[]): ReactElement => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="percentage"
          nameKey="type"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Yatırım Profili
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Yatırım hedeflerinizi ve risk toleransınızı yönetin
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

      <Grid container spacing={3}>
        {/* Risk Profili ve Finansal Durum */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Risk Profili ve Finansal Durum</Typography>
                <Button
                  variant="outlined"
                  startIcon={state.isEditMode ? <SaveIcon /> : <EditIcon />}
                  onClick={state.isEditMode ? handleSubmit : toggleEditMode}
                  disabled={state.loading}
                >
                  {state.isEditMode
                    ? state.loading
                      ? 'Kaydediliyor...'
                      : 'Kaydet'
                    : 'Düzenle'}
                </Button>
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Risk Tolerans Seviyesi</Typography>
                    <Slider
                      value={formData.riskLevel}
                      onChange={handleRiskLevelChange}
                      disabled={!state.isEditMode}
                      min={1}
                      max={10}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Aylık Gelir"
                      name="monthlyIncome"
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={handleFormChange}
                      disabled={!state.isEditMode}
                      InputProps={{
                        startAdornment: '₺',
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Aylık Gider"
                      name="monthlyExpenses"
                      type="number"
                      value={formData.monthlyExpenses}
                      onChange={handleFormChange}
                      disabled={!state.isEditMode}
                      InputProps={{
                        startAdornment: '₺',
                      }}
                    />
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Özet İstatistikler */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Özet
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Toplam Varlıklar
                </Typography>
                <Typography variant="h5">
                  ₺{state.data?.totalAssets.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Toplam Yükümlülükler
                </Typography>
                <Typography variant="h5">
                  ₺{state.data?.totalLiabilities.toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Net Değer
                </Typography>
                <Typography variant="h5">
                  ₺{((state.data?.totalAssets ?? 0) - (state.data?.totalLiabilities ?? 0)).toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Varlık Dağılımı */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Varlık Dağılımı
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom align="center">
                    Mevcut Dağılım
                  </Typography>
                  {renderPieChart(state.data?.currentAllocation || [])}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom align="center">
                    Önerilen Dağılım
                  </Typography>
                  {renderPieChart(state.data?.recommendedAllocation || [])}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Yatırım Hedefleri */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Yatırım Hedefleri
              </Typography>

              {formData.goals.map((goal, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth disabled={!state.isEditMode}>
                        <InputLabel>Hedef Tipi</InputLabel>
                        <Select
                          value={goal.type}
                          onChange={(e) => handleGoalChange(index, 'type', e.target.value)}
                          label="Hedef Tipi"
                        >
                          <MenuItem value="retirement">Emeklilik</MenuItem>
                          <MenuItem value="savings">Birikim</MenuItem>
                          <MenuItem value="growth">Büyüme</MenuItem>
                          <MenuItem value="income">Gelir</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Hedef Tutar"
                        type="number"
                        value={goal.targetAmount}
                        onChange={(e) => handleGoalChange(index, 'targetAmount', e.target.value)}
                        disabled={!state.isEditMode}
                        InputProps={{
                          startAdornment: '₺',
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Hedef Tarih"
                        type="date"
                        value={goal.targetDate}
                        onChange={(e) => handleGoalChange(index, 'targetDate', e.target.value)}
                        disabled={!state.isEditMode}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Aylık Katkı"
                        type="number"
                        value={goal.monthlyContribution}
                        onChange={(e) => handleGoalChange(index, 'monthlyContribution', e.target.value)}
                        disabled={!state.isEditMode}
                        InputProps={{
                          startAdornment: '₺',
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 