import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Chiqish',
      'Hisobdan chiqmoqchimisiz?',
      [
        { text: 'Bekor qilish', style: 'cancel' },
        { text: 'Chiqish', style: 'destructive', onPress: async () => { await logout(); } },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#020817', padding: 24 }}>
      <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 20 }}>
        Sozlamalar
      </Text>

      <View style={{ backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="person" size={32} color="#ffffff" />
          </View>
          <View style={{ marginLeft: 16 }}>
            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600' }}>{user?.name || 'User'}</Text>
            <Text style={{ color: '#64748b', fontSize: 14 }}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>
      </View>

      <Pressable style={{ backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="language-outline" size={24} color="#3b82f6" />
          <Text style={{ color: '#ffffff', fontSize: 16, marginLeft: 12 }}>Til / Language</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#64748b" />
      </Pressable>

      <Pressable style={{ backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="notifications-outline" size={24} color="#3b82f6" />
          <Text style={{ color: '#ffffff', fontSize: 16, marginLeft: 12 }}>Bildirishnomalar</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#64748b" />
      </Pressable>

      <Pressable 
        onPress={handleLogout}
        style={{ backgroundColor: '#ef4444', borderRadius: 12, padding: 16, marginTop: 'auto', marginBottom: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
      >
        <Ionicons name="log-out-outline" size={24} color="#ffffff" />
        <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600', marginLeft: 12 }}>Chiqish</Text>
      </Pressable>
    </View>
  );
}