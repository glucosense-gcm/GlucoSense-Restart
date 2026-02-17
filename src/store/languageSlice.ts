import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../i18n/locales';

interface LanguageState {
  currentLanguage: Language;
  isLanguageSelected: boolean;
  isLoading: boolean;
}

const initialState: LanguageState = {
  currentLanguage: 'uz',
  isLanguageSelected: false,
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
    setLanguageSelected: (state, action: PayloadAction<boolean>) => {
      state.isLanguageSelected = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLanguage, setLanguageSelected, setLoading } = languageSlice.actions;

// Thunk to load language from AsyncStorage
export const loadLanguage = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const savedLanguage = await AsyncStorage.getItem('@app_language');
    if (savedLanguage && ['uz', 'ru', 'en'].includes(savedLanguage)) {
      dispatch(setLanguage(savedLanguage as Language));
      dispatch(setLanguageSelected(true));
    } else {
      dispatch(setLanguage('uz'));
      dispatch(setLanguageSelected(false));
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
    dispatch(setLanguageSelected(true));
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

export default languageSlice.reducer;
