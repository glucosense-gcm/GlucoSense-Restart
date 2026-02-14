import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadLanguage } from '../store/languageSlice';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

export default function RootNavigator() {
  const { isAuthenticated, isLanguageSelected, isLoading } = useAuth();
  const dispatch = useAppDispatch();
  const languageLoading = useAppSelector((state) => state.language.isLoading);

  useEffect(() => {
    dispatch(loadLanguage());
  }, [dispatch]);
  
  if (isLoading || languageLoading) {
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
        <AuthStack />
      ) : (
        <MainTabs />
      )}
    </NavigationContainer>
  );
}
