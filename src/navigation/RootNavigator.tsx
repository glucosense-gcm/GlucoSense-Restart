import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadLanguage } from '../store/languageSlice';
import { restoreSession } from '../store/authSlice';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const { isLanguageSelected, isLoading: languageLoading } = useAppSelector(
    (state) => state.language
  );
  const { isAuthenticated, isLoading: authLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(loadLanguage());
    dispatch(restoreSession());
  }, [dispatch]);

  if (authLoading || languageLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ color: '#ffffff', marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isLanguageSelected ? (
        <AuthStack initialRoute="Language" />
      ) : !isAuthenticated ? (
        <AuthStack initialRoute="Login" />
      ) : (
        <MainTabs />
      )}
    </NavigationContainer>
  );
}
