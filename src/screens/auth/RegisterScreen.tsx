import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const currentGlucose = 5.8;

  const getGlucoseColor = (value: number) => {
    if (value < 3.9) return { main: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', text: t('home.low') };
    if (value > 7.0) return { main: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', text: t('home.high') };
    return { main: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', text: t('home.normal') };
  };

  const glucoseStatus = getGlucoseColor(currentGlucose);

console.log('glucoseStatus.main =', glucoseStatus.main);
  return (
    <View style={styles.container}>
      <ScrollView
       showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always" >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
            <View>
              <Text style={styles.greeting}>{t('home.goodEvening')},</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={22} color="#8b92a8" />
              <View style={styles.notificationDot} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Ionicons name="settings-outline" size={22} color="#8b92a8" />
            </Pressable>
          </View>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.glucoseSection}>
            <View style={styles.glucoseValueRow}>
                <Text
                    style={[
                        styles.glucoseValue,
                        {
                        color: glucoseStatus.main,
                        textShadowColor: glucoseStatus.main,
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 30,
                        },
                    ]}
                    >
                    {currentGlucose}
                </Text>
              <Ionicons name="arrow-forward" size={32} color={glucoseStatus.main} style={{ marginTop: 20, marginLeft: 4 }} />
            </View>
            
            <Text style={styles.glucoseUnit}>mmol/L</Text>
            
            <View style={[styles.statusBadge, { backgroundColor: glucoseStatus.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: glucoseStatus.main }]} />
              <Text style={[styles.statusText, { color: glucoseStatus.main }]}>{glucoseStatus.text}</Text>
            </View>
            
            <Text style={styles.lastUpdate}>{t('home.lastReadingTime')}</Text>
          </View>

          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>{t('home.last24Hours')}</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: [],
                  datasets: [{
                    data: [3.8, 4.2, 4.8, 5.3, 5.8, 6.1, 5.9, 5.5, 5.2, 5.6, 5.9, 5.8],
                  }],
                }}
                width={screenWidth - 48}
                height={180}
                withVerticalLabels={false}
                withHorizontalLabels={false}
                withDots={false}
                withInnerLines={false}
                withOuterLines={false}
                withShadow={false}
                chartConfig={{
                  backgroundGradientFrom: '#060b14',
                  backgroundGradientTo: '#0a1220',
                  fillShadowGradientFrom: glucoseStatus.main,
                  fillShadowGradientFromOpacity: 0.6,
                  fillShadowGradientTo: glucoseStatus.main,
                  fillShadowGradientToOpacity: 0.02,
                  color: (opacity = 1) => glucoseStatus.main,
                  strokeWidth: 2.5,
                  propsForBackgroundLines: { strokeWidth: 0 },
                }}
                bezier
                style={{ marginLeft: 0, marginRight: 0, paddingRight: 0 }}
              />
            </View>
          </View>
        </View>

        <View style={styles.actionCards}>
          <Pressable hitSlop={20} style={[styles.actionCard, { backgroundColor: '#4c1d95' }]}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>💉</Text>
            </View>
            <View>
              <Text style={styles.actionTitle}>{t('home.insulin')}</Text>
              <Text style={styles.actionSubtitle}>{t('home.log')}</Text>
            </View>
          </Pressable>

          <Pressable hitSlop={20} style={[styles.actionCard, { backgroundColor: '#92400e' }]}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>🍴</Text>
            </View>
            <View>
              <Text style={styles.actionTitle}>{t('home.carbs')}</Text>
              <Text style={styles.actionSubtitle}>{t('home.meal')}</Text>
            </View>
          </Pressable>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020817',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e3a5f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  greeting: {
    fontSize: 12,
    color: '#64748b',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e2940',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  mainCard: {
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 24,
    backgroundColor: '#0b1221',
    overflow: 'hidden',
  },
  glucoseSection: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  glucoseValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  glucoseValue: {
    fontSize: 96,
    fontWeight: '700',
    lineHeight: 96,
    letterSpacing: -4,
  },
  glucoseUnit: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  lastUpdate: {
    fontSize: 12,
    color: '#475569',
    marginTop: 12,
  },
  chartSection: {
    paddingBottom: 20,
  },
  chartTitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  chartContainer: {
    backgroundColor: '#060b14',
  },
  actionCards: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: {
    fontSize: 28,
  },
  actionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});