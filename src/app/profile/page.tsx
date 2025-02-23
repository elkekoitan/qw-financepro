'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  PhotoCamera,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import type { ProfileFormData, SecurityFormData, ProfileState, UserProfile } from '@/types/profile';

const mockProfile: UserProfile = {
  id: '1',
  fullName: 'Ahmet Yılmaz',
  email: 'ahmet@example.com',
  avatarUrl: '/assets/avatar.png',
  phone: '+90 555 123 4567',
  country: 'Türkiye',
  city: 'İstanbul',
  notificationPreferences: {
    email: true,
    push: true,
    sms: false,
  },
  twoFactorEnabled: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-03-15T00:00:00Z',
};

export default function ProfilePage() {
  const theme = useTheme();
  const { user, updateProfile, updatePassword } = useAuth();
  const { supabase } = useSupabase();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    fullName: mockProfile.fullName,
    email: mockProfile.email,
    phone: mockProfile.phone || '',
    country: mockProfile.country || '',
    city: mockProfile.city || '',
    notificationPreferences: mockProfile.notificationPreferences,
  });

  const [securityForm, setSecurityForm] = useState<SecurityFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [state, setState] = useState<ProfileState>({
    loading: false,
    error: null,
    success: null,
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    avatarUploading: false,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const [parent, child] = name.split('.');
      const parentObj = profileForm[parent as keyof ProfileFormData];
      if (parentObj && typeof parentObj === 'object') {
        setProfileForm(prev => ({
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: checked,
          },
        }));
      }
    } else {
      setProfileForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setSecurityForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field: keyof Pick<ProfileState, 'showCurrentPassword' | 'showNewPassword' | 'showConfirmPassword'>): void => {
    setState(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleAvatarClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setState(prev => ({ ...prev, avatarUploading: true, error: null }));

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });
      setState(prev => ({ ...prev, success: 'Profil fotoğrafı güncellendi' }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Profil fotoğrafı yüklenirken bir hata oluştu',
      }));
    } finally {
      setState(prev => ({ ...prev, avatarUploading: false }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));

    try {
      await updateProfile(profileForm);
      setState(prev => ({ ...prev, success: 'Profil bilgileri güncellendi' }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Profil güncellenirken bir hata oluştu',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setState(prev => ({ ...prev, error: 'Parolalar eşleşmiyor' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null, success: null }));

    try {
      await updatePassword(securityForm.newPassword);
      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setState(prev => ({ ...prev, success: 'Parola güncellendi' }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Parola güncellenirken bir hata oluştu',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profil Ayarları
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Hesap bilgilerinizi ve tercihlerinizi yönetin
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
        {/* Profil Bilgileri */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Profil Bilgileri
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kişisel bilgilerinizi güncelleyin
                </Typography>
              </Box>

              <form onSubmit={handleProfileSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        src={mockProfile.avatarUrl}
                        sx={{ width: 100, height: 100, mr: 2 }}
                      />
                      <Box>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleAvatarChange}
                        />
                        <Button
                          variant="outlined"
                          startIcon={<PhotoCamera />}
                          onClick={handleAvatarClick}
                          disabled={state.avatarUploading}
                        >
                          {state.avatarUploading ? 'Yükleniyor...' : 'Fotoğraf Değiştir'}
                        </Button>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ad Soyad"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="E-posta"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ülke"
                      name="country"
                      value={profileForm.country}
                      onChange={handleProfileChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Şehir"
                      name="city"
                      value={profileForm.city}
                      onChange={handleProfileChange}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={state.loading}
                  sx={{ mt: 3 }}
                >
                  {state.loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Güvenlik ve Bildirimler */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Güvenlik */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Güvenlik
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Güvenlik ayarlarınızı yönetin
                    </Typography>
                  </Box>

                  <form onSubmit={handleSecuritySubmit}>
                    <TextField
                      fullWidth
                      label="Mevcut Parola"
                      name="currentPassword"
                      type={state.showCurrentPassword ? 'text' : 'password'}
                      value={securityForm.currentPassword}
                      onChange={handleSecurityChange}
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
                              onClick={() => togglePasswordVisibility('showCurrentPassword')}
                              edge="end"
                            >
                              {state.showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Yeni Parola"
                      name="newPassword"
                      type={state.showNewPassword ? 'text' : 'password'}
                      value={securityForm.newPassword}
                      onChange={handleSecurityChange}
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
                              onClick={() => togglePasswordVisibility('showNewPassword')}
                              edge="end"
                            >
                              {state.showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Yeni Parola Tekrar"
                      name="confirmPassword"
                      type={state.showConfirmPassword ? 'text' : 'password'}
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityChange}
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
                              onClick={() => togglePasswordVisibility('showConfirmPassword')}
                              edge="end"
                            >
                              {state.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={state.loading}
                    >
                      {state.loading ? 'Güncelleniyor...' : 'Parolayı Güncelle'}
                    </Button>
                  </form>

                  <Divider sx={{ my: 3 }} />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={mockProfile.twoFactorEnabled}
                        onChange={() => {}}
                      />
                    }
                    label="İki Faktörlü Doğrulama"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Bildirimler */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Bildirimler
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bildirim tercihlerinizi yönetin
                    </Typography>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={profileForm.notificationPreferences.email}
                        onChange={handleProfileChange}
                        name="notificationPreferences.email"
                      />
                    }
                    label="E-posta Bildirimleri"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={profileForm.notificationPreferences.push}
                        onChange={handleProfileChange}
                        name="notificationPreferences.push"
                      />
                    }
                    label="Push Bildirimleri"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={profileForm.notificationPreferences.sms}
                        onChange={handleProfileChange}
                        name="notificationPreferences.sms"
                      />
                    }
                    label="SMS Bildirimleri"
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
} 