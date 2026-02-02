import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabsParamList } from '../types/navigation';
import { View, Text, Platform } from 'react-native';
import HomeScreen from '../screens/main/HomeScreen';

const Tab = createBottomTabNavigator<MainTabsParamList>();

const HistoryScreen = () => (
  <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#020617' }}>
    <Ionicons name="time-outline" size={48} color="#3b82f6" />
    <Text className="text-white text-xl mt-4 font-semibold">Tarix</Text>
    <Text style={{ color: '#64748b' }} className="mt-2">Tez kunda...</Text>
  </View>
);

const DeviceScreen = () => (
  <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#020617' }}>
    <Ionicons name="bluetooth-outline" size={48} color="#3b82f6" />
    <Text className="text-white text-xl mt-4 font-semibold">Qurilma</Text>
    <Text style={{ color: '#64748b' }} className="mt-2">Tez kunda...</Text>
  </View>
);

const SettingsScreen = () => (
  <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#020617' }}>
    <Ionicons name="settings-outline" size={48} color="#3b82f6" />
    <Text className="text-white text-xl mt-4 font-semibold">Sozlamalar</Text>
    <Text style={{ color: '#64748b' }} className="mt-2">Tez kunda...</Text>
  </View>
);

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#020617',
          borderTopColor: '#1e293b',
          borderTopWidth: 1,
          height: Platform.OS === 'android' ? 65 : 85,
          paddingBottom: Platform.OS === 'android' ? 10 : 25,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Asosiy',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Tarix',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'time' : 'time-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Device"
        component={DeviceScreen}
        options={{
          tabBarLabel: 'Qurilma',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'flash' : 'flash-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Sozlamalar',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
