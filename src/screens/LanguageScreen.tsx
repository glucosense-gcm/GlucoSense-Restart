import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useAppDispatch } from '../store/hooks';
import { changeLanguage } from '../store/languageSlice';
import { Language } from '../i18n/locales';
import { useTranslation } from '../i18n/useTranslation';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'uz', name: "O'zbekcha", nativeName: 'Uzbek', flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', nativeName: 'Russian', flag: '🇷🇺' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
];

type LanguageScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Language'>;
};

export default function LanguageScreen({ navigation }: LanguageScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('uz');
  const { setLanguageSelected } = useAuth();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleContinue = async () => {
    try {
      // Save language using Redux
      await dispatch(changeLanguage(selectedLanguage));
      await setLanguageSelected();

      // Navigate to Login screen
      navigation.replace('Login');
    } catch (error) {
      console.error('Error saving language:', error);
      Alert.alert(t('common.error'), 'Failed to save language');
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: 40 }}>
      <View className="flex-1 px-6 pt-12">
        <View className="mb-10 items-center">
          <View className="w-16 h-16 rounded-2xl bg-primary/20 items-center justify-center mb-4 border border-primary/40">
            <Text className="text-4xl">💧</Text>
          </View>
          <Text className="text-3xl font-bold text-white mb-2">
            GlucoSense
          </Text>
          <Text className="text-muted-foreground text-center text-sm max-w-[200px]">
            {t('language.description')}
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-1">
            {t('language.title')}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {t('language.subtitle')}
          </Text>
        </View>

        <View className="flex-1 gap-4">
          {LANGUAGES.map((language) => (
            <Pressable
              key={language.code}
              onPress={() => setSelectedLanguage(language.code)}
              className={`p-4 flex-row items-center gap-4 rounded-2xl border-2 ${
                selectedLanguage === language.code
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
                <Text className={`text-lg font-medium ${
                  selectedLanguage === language.code ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {language.name}
                </Text>
                {selectedLanguage === language.code && (
                  <Text className="text-xs text-primary/80">Default</Text>
                )}
              </View>

              {selectedLanguage === language.code ? (
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              ) : (
                <View className="w-6 h-6 rounded-full border-2 border-border" />
              )}
            </Pressable>
          ))}
        </View>

        <View className="py-6 pb-8">
          <Pressable
            onPress={handleContinue}
            className="flex-row items-center justify-center gap-2 bg-primary rounded-full py-4 px-6"
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <Text className="text-white font-semibold text-base">
              {t('common.continue')}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}