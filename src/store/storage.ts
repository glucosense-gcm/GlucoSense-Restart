import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const createSecureStorage = () => {
  if (Platform.OS === 'web') {
    return AsyncStorage;
  }
  return {
    getItem: async (key: string) => {
      const sanitizedKey = key.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      return await SecureStore.getItemAsync(sanitizedKey);
    },
    setItem: async (key: string, value: string) => {
      const sanitizedKey = key.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      return await SecureStore.setItemAsync(sanitizedKey, value);
    },
    removeItem: async (key: string) => {
      const sanitizedKey = key.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      return await SecureStore.deleteItemAsync(sanitizedKey);
    },
  };
};

export default createSecureStorage();
