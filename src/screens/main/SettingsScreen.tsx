<<<<<<< HEAD
import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
=======
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Modal } from 'react-native';
>>>>>>> a5f436d0a69676c05cb45df5cf82b44fc62b80fc
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
<<<<<<< HEAD
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
=======
  const { user } = useAuth();
  const [selectedUnit, setSelectedUnit] = useState('mmol/L');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('O\'zbekcha');

  const languages = [
    { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  const handleLanguageSelect = (languages) => {
    setSelectedLanguage(languages.name);
    setLanguageModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Sozlamalar</Text>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={40} color="#64748b" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Azizbek Abduvaliyev</Text>
              <Text style={styles.profileId}>ID: 884-291-00</Text>
            </View>
          </View>
          <Pressable style={styles.editButton}>
            <Ionicons name="pencil" size={20} color="#3b82f6" />
          </Pressable>
        </View>

        {/* To'langan Badge */}
        <View style={styles.profileBadge}>
          <Text style={styles.badgeText}>TO'LANGAN</Text>
        </View>

        {/* Unit Selector Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O'LCHOV BIRLIGI</Text>
          <View style={styles.unitSelector}>
            <Pressable
              style={[
                styles.unitButton,
                selectedUnit === 'mmol/L' && styles.unitButtonActive
              ]}
              onPress={() => setSelectedUnit('mmol/L')}
            >
              <Text style={[
                styles.unitText,
                selectedUnit === 'mmol/L' && styles.unitTextActive
              ]}>
                mmol/L
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.unitButton,
                selectedUnit === 'mg/dL' && styles.unitButtonActive
              ]}
              onPress={() => setSelectedUnit('mg/dL')}
            >
              <Text style={[
                styles.unitText,
                selectedUnit === 'mg/dL' && styles.unitTextActive
              ]}>
                mg/dL
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Thresholds Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>XABARNOMA CHEGARALARI</Text>
          
          <View style={styles.settingsCard}>
            {/* High Threshold */}
            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, styles.settingIconRed]}>
                  <Ionicons name="trending-up" size={24} color="#ef4444" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Yuqori chegara</Text>
                  <Text style={styles.settingSubtitle}>Kritik daraja</Text>
                </View>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>10.0</Text>
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
              </View>
            </Pressable>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Low Threshold */}
            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, styles.settingIconYellow]}>
                  <Ionicons name="trending-down" size={24} color="#eab308" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Pastki chegara</Text>
                  <Text style={styles.settingSubtitle}>Kritik daraja</Text>
                </View>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>3.9</Text>
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
              </View>
            </Pressable>
          </View>
        </View>

        {/* General Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UMUMIY</Text>
          
          <View style={styles.settingsCard}>
            {/* Language */}
            <Pressable 
              style={styles.settingItem}
              onPress={() => setLanguageModalVisible(true)}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, styles.settingIconBlue]}>
                  <Ionicons name="language" size={24} color="#3b82f6" />
                </View>
                <Text style={styles.settingTitle}>Ilova tili</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingSecondary}>{selectedLanguage}</Text>
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
              </View>
            </Pressable>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Security */}
            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, styles.settingIconGreen]}>
                  <Ionicons name="shield-checkmark" size={24} color="#22c55e" />
                </View>
                <Text style={styles.settingTitle}>Xavfsizlik va PIN-kod</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748b" />
            </Pressable>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Support */}
            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, styles.settingIconPurple]}>
                  <Ionicons name="help-circle" size={24} color="#a855f7" />
                </View>
                <Text style={styles.settingTitle}>Yordam va qo'llab-quvvatlash</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748b" />
            </Pressable>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutButton}>
          <Ionicons name="exit-outline" size={24} color="#ef4444" />
          <Text style={styles.logoutText}>Chiqish</Text>
        </Pressable>

        {/* Version Info */}
        <Text style={styles.versionText}>Versiya 2.4.0 (Build 102)</Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>


      {/* Language Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tilni tanlang</Text>
              <Pressable 
                style={styles.modalCloseButton}
                onPress={() => setLanguageModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.languageList}>
              {languages.map((language, index) => (
                <React.Fragment key={language.code}>
                  <Pressable
                    style={styles.languageItem}
                    onPress={() => handleLanguageSelect(language)}
                  >
                    <View style={styles.languageLeft}>
                      <Text style={styles.languageFlag}>{language.flag}</Text>
                      <Text style={styles.languageName}>{language.name}</Text>
                    </View>
                    {selectedLanguage === language.name && (
                      <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                    )}
                  </Pressable>
                  {index < languages.length - 1 && (
                    <View style={styles.languageDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020817',
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },

  // Profile Card
  profileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    marginBottom: 12,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    gap: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileId: {
    fontSize: 14,
    color: '#64748b',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadge: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1e3a5f',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3b82f6',
    letterSpacing: 0.5,
  },

  // Section
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  // Unit Selector
  unitSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 6,
    gap: 6,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 20,
  },
  unitButtonActive: {
    backgroundColor: '#3b82f6',
  },
  unitText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  unitTextActive: {
    color: '#ffffff',
  },

  // Settings Card
  settingsCard: {
    marginHorizontal: 20,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  settingIconYellow: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
  },
  settingIconBlue: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  settingIconGreen: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  settingIconPurple: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
  },
  settingInfo: {
    gap: 2,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ef4444',
  },
  settingSecondary: {
    fontSize: 14,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginLeft: 84,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    padding: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },

  // Version
  versionText: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20,
  },

  bottomSpacer: {
    height: 20,
  },

  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  navLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#3b82f6',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageList: {
    padding: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  languageFlag: {
    fontSize: 32,
  },
  languageName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
  languageDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginHorizontal: 16,
  },
});
>>>>>>> a5f436d0a69676c05cb45df5cf82b44fc62b80fc
