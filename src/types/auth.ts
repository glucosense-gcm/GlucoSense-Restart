export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'apple';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  isOtpSending: boolean;
  otpSent: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  otp: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface AppleLoginRequest {
  identityToken: string;
  fullName?: { givenName?: string | null; familyName?: string | null } | null;
  email?: string | null;
}
