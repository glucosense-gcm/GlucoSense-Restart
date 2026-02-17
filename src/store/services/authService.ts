import { api } from './api';

// Types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // ISO date string
    age?: number; // Virtual field from backend
    profilePhoto?: string;
    language?: string;
    authProvider?: string;
    emailVerified?: boolean;
}

export interface AuthResponse {
    success: boolean;
    data: {
        token: string;
        user: User;
    };
    message: string;
}

export interface ErrorResponse {
    success: false;
    error: string;
    message: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // ISO date string
    language?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SendCodeRequest {
    email: string;
}

export interface SendCodeResponse {
    success: boolean;
    message: string;
    data: {
        email: string;
        expiresIn: number;
    };
}

export interface VerifyCodeRequest {
    email: string;
    code: string;
}

export interface VerifyCodeResponse {
    success: boolean;
    data: {
        token: string;
        user: User;
    };
    message: string;
}

// Auth API Service
export const authService = api.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (credentials) => ({
                url: '/api/auth/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/api/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        sendCode: builder.mutation<SendCodeResponse, SendCodeRequest>({
            query: (data) => ({
                url: '/api/auth/send-code',
                method: 'POST',
                body: data,
            }),
        }),
        verifyCode: builder.mutation<VerifyCodeResponse, VerifyCodeRequest>({
            query: (data) => ({
                url: '/api/auth/verify-code',
                method: 'POST',
                body: data,
            }),
        }),
        firebaseAuth: builder.mutation<AuthResponse, { idToken: string; provider: string }>({
            query: (data) => ({
                url: '/api/auth/firebase',
                method: 'POST',
                body: data,
            }),
        }),
        getMe: builder.query<{ success: boolean; data: { user: User } }, void>({
            query: () => '/api/auth/me',
        }),
        updateProfile: builder.mutation<
            { success: boolean; data: { user: User }; message: string },
            { dateOfBirth?: string; firstName?: string; lastName?: string; language?: string }
        >({
            query: (profileData) => ({
                url: '/api/auth/profile',
                method: 'PATCH',
                body: profileData,
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useSendCodeMutation,
    useVerifyCodeMutation,
    useFirebaseAuthMutation,
    useGetMeQuery,
    useUpdateProfileMutation,
} = authService;
