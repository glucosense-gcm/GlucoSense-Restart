import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLanguageSelected: boolean;
  isLoading: boolean;
  user: any | null;
  login: (token: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  setLanguageSelected: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLanguageSelected, setIsLanguageSelectedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    console.log('Ì¥ç Checking auth status...');
    try {
      const language = await AsyncStorage.getItem('@app_language');
      console.log('Ì≥ù Language:', language);
      if (language) {
        setIsLanguageSelectedState(true);
      }

      const token = await AsyncStorage.getItem('@auth_token');
      const userData = await AsyncStorage.getItem('@user_data');
      
      console.log('Ì¥ë Token:', token ? 'EXISTS' : 'NULL');
      console.log('Ì±§ UserData:', userData ? 'EXISTS' : 'NULL');

      if (token && userData) {
        console.log('‚úÖ User authenticated!');
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        console.log('‚ùå User NOT authenticated');
      }
    } catch (error) {
      console.error('‚ùå Error checking auth status:', error);
    } finally {
      setIsLoading(false);
      console.log('‚úÖ Auth check complete');
    }
  };

  const login = async (token: string, userData: any) => {
    console.log('Ì¥ê LOGIN called with token:', token);
    try {
      await AsyncStorage.setItem('@auth_token', token);
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      console.log('‚úÖ Token and user data saved!');
      setIsAuthenticated(true);
      setUser(userData);
      console.log('‚úÖ isAuthenticated set to TRUE');
    } catch (error) {
      console.error('‚ùå Error logging in:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Ì∫™ LOGOUT called');
    try {
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@user_data');
      setIsAuthenticated(false);
      setUser(null);
      console.log('‚úÖ Logged out successfully');
    } catch (error) {
      console.error('‚ùå Error logging out:', error);
      throw error;
    }
  };

  const setLanguageSelected = async () => {
    console.log('Ìºê Language marked as selected');
    setIsLanguageSelectedState(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLanguageSelected,
        isLoading,
        user,
        login,
        logout,
        setLanguageSelected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
