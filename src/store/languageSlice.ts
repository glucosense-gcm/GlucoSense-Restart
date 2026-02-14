import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../i18n/locales';

interface LanguageState {
  currentLanguage: Language;
  isLoading: boolean;
}

const initialState: LanguageState = {
  currentLanguage: 'uz', 
  isLoading: true,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLanguage, setLoading } = languageSlice.actions;

// Thunk to load language from AsyncStorage
export const loadLanguage = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const savedLanguage = await AsyncStorage.getItem('@app_language');
    if (savedLanguage && ['uz', 'ru', 'en'].includes(savedLanguage)) {
      dispatch(setLanguage(savedLanguage as Language));
    } else {
      dispatch(setLanguage('uz'));
    }
  } catch (error) {
    console.error('Error loading language:', error);
    dispatch(setLanguage('uz'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk to save and set language
export const changeLanguage = (language: Language) => async (dispatch: any) => {
  try {
    await AsyncStorage.setItem('@app_language', language);
    dispatch(setLanguage(language));
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

export default languageSlice.reducer;
