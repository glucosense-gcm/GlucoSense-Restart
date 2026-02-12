import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { RootState } from '../index';
import { logoutUser } from '../slices/authSlice';

// Define your API base URL here
// IMPORTANT: For React Native mobile apps, use your network IP address instead of localhost
// Run 'ifconfig' (macOS/Linux) or 'ipconfig' (Windows) to find your local IP
// Example: const BASE_URL = 'http://192.168.1.100:5000';
const BASE_URL = 'https://glucosense-server.onrender.com/'; // Change this for mobile testing

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Implement refresh token logic here if backend supports it.
        // For now, we logout on 401.
        api.dispatch(logoutUser());
    }

    return result;
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
});
