import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// Complete WebBrowser session on component unmount
WebBrowser.maybeCompleteAuthSession();

/**
 * Google OAuth Configuration
 * 
 * IMPORTANT: Replace these values with your actual credentials from Firebase Console
 * 
 * Get them from: https://console.firebase.google.com/project/glucosense-e65b1/authentication/providers
 * Or: https://console.cloud.google.com/apis/credentials?project=glucosense-e65b1
 */
export const GOOGLE_OAUTH_CONFIG = {
    // Web Client ID
    webClientId: '753340872781-u3hmdvci0op6us0bdv155j1n4p2ljdiu.apps.googleusercontent.com',

    // iOS Client ID - supports custom scheme redirects
    iosClientId: '753340872781-2crdo0ui1162desgr5b4cuh0tvgq4bkh.apps.googleusercontent.com',

    androidClientId: undefined,
};

/**
 * Hook for Google OAuth authentication
 * Returns [request, response, promptAsync] from expo-auth-session
 */
export function useGoogleAuth() {
    const redirectUri = makeRedirectUri({
        scheme: 'com.bekzodmirzaaliyev.glucosense',
    });

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: GOOGLE_OAUTH_CONFIG.webClientId,
        iosClientId: GOOGLE_OAUTH_CONFIG.iosClientId,
        androidClientId: GOOGLE_OAUTH_CONFIG.androidClientId,
        redirectUri,
        scopes: ['profile', 'email'],
    });

    return { request, response, promptAsync };
}

/**
 * Exchange Google auth code for user info
 * @param accessToken - Access token from Google OAuth response
 */
export async function getGoogleUserInfo(accessToken: string) {
    try {
        const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const userInfo = await response.json();
        return userInfo;
    } catch (error) {
        console.error('Error fetching Google user info:', error);
        throw error;
    }
}
