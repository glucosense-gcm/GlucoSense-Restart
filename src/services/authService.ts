import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SendOtpRequest,
  GoogleLoginRequest,
  AppleLoginRequest,
} from '../types/auth';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const STORAGE_KEYS = {
  TOKEN: '@auth_token',
  USER: '@user_data',
} as const;

export const authService = {
  async sendOtp(data: SendOtpRequest): Promise<{ success: boolean }> {
    await delay(1000);
    // Mock: always succeed
    return { success: true };
  },

  async verifyOtp(data: LoginRequest): Promise<AuthResponse> {
    await delay(1200);
    if (data.otp !== '123456' && data.otp.length !== 6) {
      throw new Error('Invalid OTP code');
    }
    const response: AuthResponse = {
      token: `token_${Date.now()}`,
      user: {
        id: '1',
        email: data.email,
        name: data.email.split('@')[0],
        provider: 'email',
      },
    };
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    return response;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    await delay(1500);
    const response: AuthResponse = {
      token: `token_${Date.now()}`,
      user: {
        id: String(Date.now()),
        email: data.email,
        name: data.name,
        provider: 'email',
      },
    };
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    return response;
  },

  async googleLogin(data: GoogleLoginRequest): Promise<AuthResponse> {
    await delay(1000);
    const response: AuthResponse = {
      token: `google_token_${Date.now()}`,
      user: {
        id: `g_${Date.now()}`,
        email: 'user@gmail.com',
        name: 'Google User',
        provider: 'google',
      },
    };
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    return response;
  },

  async appleLogin(data: AppleLoginRequest): Promise<AuthResponse> {
    await delay(1000);
    const name =
      data.fullName?.givenName && data.fullName?.familyName
        ? `${data.fullName.givenName} ${data.fullName.familyName}`
        : 'Apple User';
    const response: AuthResponse = {
      token: `apple_token_${Date.now()}`,
      user: {
        id: `a_${Date.now()}`,
        email: data.email || 'apple@privaterelay.com',
        name,
        provider: 'apple',
      },
    };
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    return response;
  },

  async restoreSession(): Promise<AuthResponse | null> {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (token && userData) {
      return { token, user: JSON.parse(userData) };
    }
    return null;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  },
};
