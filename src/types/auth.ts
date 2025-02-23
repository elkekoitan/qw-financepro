export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  fullName: string;
  confirmPassword: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthState {
  loading: boolean;
  error: AuthError | null;
  showPassword: boolean;
}

export interface AuthFormProps {
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
  redirectPath?: string;
} 