import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleSendCode = () => {
    if (!email || !email.includes('@')) {
      Alert.alert(t('common.error'), t('login.errorInvalidEmail'));
      return;
    }

    setIsCodeSent(true);
    Alert.alert(t('common.success'), t('login.successCodeSent'));

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = async () => {
    if (!code || code.length !== 6) {
      Alert.alert(t('common.error'), t('login.errorInvalidCode'));
      return;
    }

    try {
      // TODO: Real API call here
      // Mock login - replace with actual API
      const mockToken = 'mock_token_' + Date.now();
      const mockUser = {
        id: '1',
        email: email,
        name: 'Test User',
      };

      await login(mockToken, mockUser);
      Alert.alert(t('common.success'), t('login.successLogin'));
    } catch (error) {
      Alert.alert(t('common.error'), 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google', t('alerts.featureComingSoon'));
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple', t('alerts.featureComingSoon'));
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: StatusBar.currentHeight || 40 }}>
      <View className="flex-1 px-6 pt-12">
        <View className="mb-8 items-center">
          <View className="w-16 h-16 rounded-2xl bg-primary/20 items-center justify-center mb-3 border border-primary/40">
            <Text className="text-4xl">💧</Text>
          </View>
          <Text className="text-2xl font-bold text-white mb-1">
            {t('login.welcome')}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {t('login.subtitle')}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t('login.email')}
          </Text>
          <View className="flex-row items-center bg-card border border-border rounded-xl px-4 py-3">
            <Ionicons name="mail-outline" size={20} color="#94a3b8" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={t('login.emailPlaceholder')}
              placeholderTextColor="#64748b"
              keyboardType="email-address"
              autoCapitalize="none"
              className="flex-1 ml-3 text-white"
            />
          </View>
        </View>

        {!isCodeSent ? (
          <Pressable
            onPress={handleSendCode}
            className="bg-primary rounded-xl py-3.5 mb-6"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Text className="text-white font-semibold text-center">
              {t('login.sendCode')}
            </Text>
          </Pressable>
        ) : (
          <>
            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">
                {t('login.verificationCode')}
              </Text>
              <View className="flex-row items-center bg-card border border-border rounded-xl px-4 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder={t('login.codePlaceholder')}
                  placeholderTextColor="#64748b"
                  keyboardType="number-pad"
                  maxLength={6}
                  className="flex-1 ml-3 text-white tracking-widest"
                />
              </View>

              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-xs text-muted-foreground">
                  {t('login.codeSent')}
                </Text>
                {timer > 0 ? (
                  <Text className="text-xs text-primary">
                    {timer} {t('login.seconds')}
                  </Text>
                ) : (
                  <Pressable onPress={handleSendCode}>
                    <Text className="text-xs text-primary font-medium">
                      {t('login.resendCode')}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>

            <Pressable
              onPress={handleLogin}
              className="bg-primary rounded-xl py-3.5 mb-6"
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <Text className="text-white font-semibold text-center">
                {t('login.login')}
              </Text>
            </Pressable>
          </>
        )}

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-border" />
          <Text className="px-4 text-sm text-muted-foreground">{t('common.or')}</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        <View className="gap-3 mb-8">
          <Pressable
            onPress={handleGoogleLogin}
            className="flex-row items-center justify-center gap-3 bg-card border border-border rounded-xl py-3"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Ionicons name="logo-google" size={24} color="#4285F4" />
            <Text className="text-white font-medium">{t('login.loginWithGoogle')}</Text>
          </Pressable>

          <Pressable
            onPress={handleAppleLogin}
            className="flex-row items-center justify-center gap-3 bg-card border border-border rounded-xl py-3"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Ionicons name="logo-apple" size={24} color="#ffffff" />
            <Text className="text-white font-medium">{t('login.loginWithApple')}</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-muted-foreground text-sm">
            {t('login.noAccount')}
          </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text className="text-primary font-medium text-sm">
              {t('login.register')}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}