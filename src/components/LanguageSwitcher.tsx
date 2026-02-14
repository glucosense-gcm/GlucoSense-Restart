import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '../store/hooks';
import { changeLanguage } from '../store/languageSlice';
import { Language } from '../i18n/locales';
import { useTranslation } from '../i18n/useTranslation';

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export default function LanguageSwitcher() {
  const { currentLanguage, t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleLanguageChange = async (languageCode: Language) => {
    await dispatch(changeLanguage(languageCode));
  };

  return (
    <View className="gap-3">
      {LANGUAGES.map((language) => (
        <Pressable
          key={language.code}
          onPress={() => handleLanguageChange(language.code)}
          className={`p-4 flex-row items-center gap-4 rounded-2xl border-2 ${
            currentLanguage === language.code
              ? 'bg-primary/10 border-primary'
              : 'bg-card border-border/50'
          }`}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <View className="w-10 h-10 rounded-full bg-background items-center justify-center border border-border">
            <Text className="text-2xl">{language.flag}</Text>
          </View>

          <View className="flex-1">
            <Text
              className={`text-lg font-medium ${
                currentLanguage === language.code
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {language.name}
            </Text>
          </View>

          {currentLanguage === language.code && (
            <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
}
