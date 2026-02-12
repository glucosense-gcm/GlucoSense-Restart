import { api } from './api';

// Types
export interface User {
    id: string;
    email: string;
    name: string;
    language?: string;
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
    name: string;
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
} = authService;
