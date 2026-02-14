import uz from './uz';
import ru from './ru';
import en from './en';

export const translations = {
  uz,
  ru,
  en,
};

export type Language = 'uz' | 'ru' | 'en';
export type TranslationKeys = typeof uz;
