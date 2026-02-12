import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';
import { useSendCodeMutation, useVerifyCodeMutation, useFirebaseAuthMutation } from '../../store/services/authService';
import { useGoogleAuth } from '../../utils/googleAuth';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const dispatch = useAppDispatch();

  const [sendCode, { isLoading: isSendingCode }] = useSendCodeMutation();
  const [verifyCode, { isLoading: isVerifying }] = useVerifyCodeMutation();
  const [firebaseAuth, { isLoading: isGoogleLoading }] = useFirebaseAuthMutation();

  const { request, response, promptAsync } = useGoogleAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCodeSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCodeSent, timer]);

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Xato', 'Iltimos, togri email kiriting');
      return;
    }

    try {
      const result = await sendCode({ email }).unwrap();
      setIsCodeSent(true);
      setTimer(60);
      Alert.alert('Muvaffaqiyat!', result.message || 'Kod emailga yuborildi!');
    } catch (error: any) {
      console.error('Send code error:', error);
      const errorMessage = error?.data?.message || error?.message || 'Kod yuborishda xatolik';
      Alert.alert('Xato', errorMessage);
    }
  };

  const handleLogin = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Xato', '6-xonali kodni kiriting');
      return;
    }

    try {
      const result = await verifyCode({ email, code }).unwrap();

      // Save credentials to Redux store and SecureStore
      dispatch(setCredentials({
        token: result.data.token,
        user: result.data.user
      }));

      // Navigation handled automatically by RootNavigator
    } catch (error: any) {
      console.error('Verify code error:', error);
      const errorMessage = error?.data?.message || error?.message || 'Kod noto\'g\'ri yoki muddati tugagan';
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

      // Save credentials
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
            Tizimga kirish uchun email kiriting
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

        {!isCodeSent ? (
          <Pressable
            onPress={handleSendCode}
            disabled={isSendingCode}
            className="bg-primary rounded-xl py-3.5 mb-6"
            style={({ pressed }) => ({ opacity: pressed || isSendingCode ? 0.7 : 1 })}
          >
            {isSendingCode ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-semibold text-center">
                Kod yuborish
              </Text>
            )}
          </Pressable>
        ) : (
          <>
            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">
                Tasdiqlash kodi
              </Text>
              <View className="flex-row items-center bg-card border border-border rounded-xl px-4 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="000000"
                  placeholderTextColor="#64748b"
                  keyboardType="number-pad"
                  maxLength={6}
                  className="flex-1 ml-3 text-white tracking-widest"
                />
              </View>

              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-xs text-muted-foreground">
                  Kod emailga yuborildi
                </Text>
                {timer > 0 ? (
                  <Text className="text-xs text-primary">
                    {timer} soniya
                  </Text>
                ) : (
                  <Pressable onPress={handleSendCode}>
                    <Text className="text-xs text-primary font-medium">
                      Qayta yuborish
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={isVerifying}
              className="bg-primary rounded-xl py-3.5 mb-6"
              style={({ pressed }) => ({ opacity: pressed || isVerifying ? 0.7 : 1 })}
            >
              {isVerifying ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-semibold text-center">
                  Kirish
                </Text>
              )}
            </Pressable>
          </>
        )}

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-border" />
          <Text className="px-4 text-sm text-muted-foreground">yoki</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        <View className="gap-3 mb-8">
          <Pressable
            onPress={handleGoogleLogin}
            className="flex-row items-center justify-center gap-3 bg-card border border-border rounded-xl py-3"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Ionicons name="logo-google" size={24} color="#4285F4" />
            <Text className="text-white font-medium">Google bilan kirish</Text>
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