import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';
import { useLoginMutation, useFirebaseAuthMutation } from '../../store/services/authService';
import { useGoogleAuth } from '../../utils/googleAuth';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useAppDispatch();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [firebaseAuth, { isLoading: isGoogleLoading }] = useFirebaseAuthMutation();

  const { response, promptAsync } = useGoogleAuth();

  const handleLogin = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Xato', 'Iltimos, togri email kiriting');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Xato', 'Iltimos, parolni kiriting');
      return;
    }

    try {
      const result = await login({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();

      dispatch(setCredentials({
        token: result.data.token,
        user: result.data.user,
      }));
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.data?.message || error?.message || 'Login xatolik';
      Alert.alert('Xato', errorMessage);
    }
  };

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleAuth(authentication?.idToken);
    }
  }, [response]);

  const handleGoogleAuth = async (idToken: string | undefined) => {
    if (!idToken) {
      Alert.alert('Xato', 'Google auth muvaffaqiyatsiz');
      return;
    }

    try {
      const result = await firebaseAuth({
        idToken,
        provider: 'google'
      }).unwrap();

      dispatch(setCredentials({
        token: result.data.token,
        user: result.data.user
      }));
    } catch (error: any) {
      console.error('Google auth error:', error);
      const errorMessage = error?.data?.message || error?.message || 'Google auth xatolik';
      Alert.alert('Xato', errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Xato', 'Google login xatolik');
    }
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple', 'Apple login - coming soon!');
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: StatusBar.currentHeight || 40 }}>
      <View className="flex-1 px-6 pt-12">
        <View className="mb-8 items-center">
          <View className="w-16 h-16 rounded-2xl bg-primary/20 items-center justify-center mb-3 border border-primary/40">
            <Text className="text-4xl">💧</Text>
          </View>
          <Text className="text-2xl font-bold text-white mb-1">
            Xush kelibsiz!
          </Text>
          <Text className="text-sm text-muted-foreground">
            Tizimga kirish uchun email va parol kiriting
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-foreground mb-2">
            Email
          </Text>
          <View className="flex-row items-center bg-card border border-border rounded-xl px-4 py-3">
            <Ionicons name="mail-outline" size={20} color="#94a3b8" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@gmail.com"
              placeholderTextColor="#64748b"
              keyboardType="email-address"
              autoCapitalize="none"
              className="flex-1 ml-3 text-white"
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground mb-2">
            Parol
          </Text>
          <View className="flex-row items-center bg-card border border-border rounded-xl px-4 py-3">
            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="******"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              secureTextEntry={!isPasswordVisible}
              className="flex-1 ml-3 text-white"
            />
            <Pressable onPress={() => setIsPasswordVisible((prev) => !prev)}>
              <Ionicons
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#94a3b8"
              />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={handleLogin}
          disabled={isLoginLoading}
          className="bg-primary rounded-xl py-3.5 mb-6"
          style={({ pressed }) => ({ opacity: pressed || isLoginLoading ? 0.7 : 1 })}
        >
          {isLoginLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-center">
              Kirish
            </Text>
          )}
        </Pressable>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-border" />
          <Text className="px-4 text-sm text-muted-foreground">yoki</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        <View className="gap-3 mb-8">
          <Pressable
            onPress={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="flex-row items-center justify-center gap-3 bg-card border border-border rounded-xl py-3"
            style={({ pressed }) => ({ opacity: pressed || isGoogleLoading ? 0.7 : 1 })}
          >
            {isGoogleLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Ionicons name="logo-google" size={24} color="#4285F4" />
                <Text className="text-white font-medium">Google bilan kirish</Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={handleAppleLogin}
            className="flex-row items-center justify-center gap-3 bg-card border border-border rounded-xl py-3"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Ionicons name="logo-apple" size={24} color="#ffffff" />
            <Text className="text-white font-medium">Apple bilan kirish</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-muted-foreground text-sm">
            Akkauntingiz yoqmi?
          </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text className="text-primary font-medium text-sm">
              Royxatdan otish
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
