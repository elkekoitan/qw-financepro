export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  country?: string;
  city?: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface SecurityFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileState {
  loading: boolean;
  error: string | null;
  success: string | null;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  avatarUploading: boolean;
}

export interface ProfileProps {
  initialData?: UserProfile;
} 