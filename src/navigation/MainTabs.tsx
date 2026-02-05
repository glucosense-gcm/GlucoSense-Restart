import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import HomeScreen from '../screens/main/HomeScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

const Tab = createBottomTabNavigator();
const DeviceScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#020817' }}>
    <Ionicons name="bluetooth-outline" size={48} color="#3b82f6" />
    <Text style={{ color: '#ffffff', fontSize: 20, marginTop: 16, fontWeight: '600' }}>Qurilma</Text>
    <Text style={{ color: '#64748b', marginTop: 8 }}>Tez kunda...</Text>
  </View>
);


export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#020817',
          borderTopColor: '#1e293b',
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Asosiy',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'pulse' : 'pulse-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Tarix',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Device"
        component={DeviceScreen}
        options={{
          tabBarLabel: 'Qurilma',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'flash' : 'flash-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Sozlamalar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'options' : 'options-outline'} size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
