import { User } from '../store/services/authService';

const PLACEHOLDER_DATE = '2000-01-01';

/**
 * Check if user profile is incomplete (e.g., has placeholder dateOfBirth)
 */
export function isProfileIncomplete(user: User | null): boolean {
    if (!user || !user.dateOfBirth) return true;

    const birthDate = new Date(user.dateOfBirth).toISOString().split('T')[0];
    return birthDate === PLACEHOLDER_DATE;
}

/**
 * Get completion message for incomplete profile
 */
export function getCompletionMessage(user: User | null): string {
    return 'Для полного использования приложения, пожалуйста, укажите вашу дату рождения';
}

/**
 * Check if user signed in via social auth (Google, Apple, etc.)
 */
export function isSocialAuthUser(user: User | null): boolean {
    if (!user || !user.authProvider) return false;
    return ['google', 'apple', 'facebook'].includes(user.authProvider);
}
