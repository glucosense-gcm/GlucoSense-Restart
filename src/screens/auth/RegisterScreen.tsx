import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, clearError } from '../../store/authSlice';
import { useTranslation } from '../../i18n/useTranslation';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useAppDispatch();
  const { isRegisterLoading, error } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();

  useEffect(() => {
    if (error) {
      Alert.alert(t('common.error'), error);
      dispatch(clearError());
    }
  }, [error]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t('register.errorName');
    }

    if (!email.trim() || !email.includes('@')) {
      newErrors.email = t('register.errorEmail');
    }

    if (password.length < 6) {
      newErrors.password = t('register.errorPassword');
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t('register.errorPasswordMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;
    dispatch(registerUser({ name: name.trim(), email: email.trim(), password }));
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: StatusBar.currentHeight || 40 }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-card items-center justify-center mb-6"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Ionicons name="arrow-back" size={20} color="#ffffff" />
        </Pressable>

        {/* Header */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-white mb-1">
            {t('register.title')}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {t('register.subtitle')}
          </Text>
        </View>

        {/* Name */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t('register.name')}
          </Text>
          <View
            className={`flex-row items-center bg-card border rounded-xl px-4 py-3 ${
              errors.name ? 'border-red-500' : 'border-border'
            }`}
          >
            <Ionicons name="person-outline" size={20} color="#94a3b8" />
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors((e) => ({ ...e, name: '' }));
              }}
              placeholder={t('register.namePlaceholder')}
              placeholderTextColor="#64748b"
              autoCapitalize="words"
              className="flex-1 ml-3 text-white"
            />
          </View>
          {errors.name ? (
            <Text className="text-xs text-red-500 mt-1">{errors.name}</Text>
          ) : null}
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t('login.email')}
          </Text>
          <View
            className={`flex-row items-center bg-card border rounded-xl px-4 py-3 ${
              errors.email ? 'border-red-500' : 'border-border'
            }`}
          >
            <Ionicons name="mail-outline" size={20} color="#94a3b8" />
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((e) => ({ ...e, email: '' }));
              }}
              placeholder={t('login.emailPlaceholder')}
              placeholderTextColor="#64748b"
              keyboardType="email-address"
              autoCapitalize="none"
              className="flex-1 ml-3 text-white"
            />
          </View>
          {errors.email ? (
            <Text className="text-xs text-red-500 mt-1">{errors.email}</Text>
          ) : null}
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t('register.password')}
          </Text>
          <View
            className={`flex-row items-center bg-card border rounded-xl px-4 py-3 ${
              errors.password ? 'border-red-500' : 'border-border'
            }`}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((e) => ({ ...e, password: '' }));
              }}
              placeholder={t('register.passwordPlaceholder')}
              placeholderTextColor="#64748b"
              secureTextEntry={!showPassword}
              className="flex-1 ml-3 text-white"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#94a3b8"
              />
            </Pressable>
          </View>
          {errors.password ? (
            <Text className="text-xs text-red-500 mt-1">{errors.password}</Text>
          ) : null}
        </View>

        {/* Confirm Password */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground mb-2">
            {t('register.confirmPassword')}
          </Text>
          <View
            className={`flex-row items-center bg-card border rounded-xl px-4 py-3 ${
              errors.confirmPassword ? 'border-red-500' : 'border-border'
            }`}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color="#94a3b8" />
            <TextInput
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors((e) => ({ ...e, confirmPassword: '' }));
              }}
              placeholder={t('register.confirmPasswordPlaceholder')}
              placeholderTextColor="#64748b"
              secureTextEntry={!showConfirm}
              className="flex-1 ml-3 text-white"
            />
            <Pressable onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons
                name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#94a3b8"
              />
            </Pressable>
          </View>
          {errors.confirmPassword ? (
            <Text className="text-xs text-red-500 mt-1">{errors.confirmPassword}</Text>
          ) : null}
        </View>

        {/* Register Button */}
        <Pressable
          onPress={handleRegister}
          disabled={isRegisterLoading}
          className="bg-primary rounded-xl py-3.5 mb-6"
          style={({ pressed }) => ({
            opacity: pressed || isRegisterLoading ? 0.7 : 1,
          })}
        >
          {isRegisterLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-center">
              {t('register.register')}
            </Text>
          )}
        </Pressable>

        {/* Already have account */}
        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-muted-foreground text-sm">
            {t('register.haveAccount')}
          </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text className="text-primary font-medium text-sm">
              {t('login.login')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
