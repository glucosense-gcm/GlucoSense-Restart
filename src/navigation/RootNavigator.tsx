import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { View, Text, ActivityIndicator } from 'react-native';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

export default function RootNavigator() {
  const { isAuthenticated, isLanguageSelected, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ color: '#ffffff', marginTop: 16 }}>Yuklanmoqda...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isLanguageSelected || !isAuthenticated ? (
        <AuthStack />
      ) : (
        <MainTabs />
      )}
    </NavigationContainer>
  );
}
