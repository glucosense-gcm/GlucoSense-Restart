import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import { useTranslation } from '../../i18n/useTranslation';
const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const currentGlucose = 5.8;
  const navigation = useNavigation();
  const getGlucoseColor = (value: number) => {
    if (value < 3.9) return { main: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', text: t('home.low') };
    if (value > 7.0) return { main: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', text: t('home.high') };
    return { main: '#5eead4', bg: 'rgba(94, 234, 212, 0.15)', text: t('home.normal') };
  };

  const glucoseStatus = getGlucoseColor(currentGlucose);
  // Custom chart component matching the design
  const CustomChart = () => {
    const chartData = [3.8, 4.2, 4.8, 6.3, 5.8, 6.1, 5.9, 6.5, 5.2, 5.6, 5.9, 3.8];
    const chartWidth = screenWidth - 110;
    const chartHeight = 270;
    const padding = 10;

    const maxValue = 10;
    const minValue = 0;

    const points = chartData.map((value, index) => {
      const x = (index / (chartData.length - 1)) * (chartWidth - padding * 2) + padding;
      const y = chartHeight - ((value - minValue) / (maxValue - minValue)) * (chartHeight - padding * 2) - padding;
      return { x, y };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      const controlX = (prevPoint.x + currentPoint.x) / 2;
      pathD += ` Q ${controlX} ${prevPoint.y}, ${currentPoint.x} ${currentPoint.y}`;
    }

    // Create fill path
    const fillPath = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

    return (
      <View style={styles.chartWrapper}>
        {/* Grid lines */}
        <View style={styles.gridLines}>
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
        </View>

        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          <Text style={styles.yAxisLabel}>10.0</Text>
          <Text style={styles.yAxisLabel}>3.9</Text>
        </View>

        <Svg width={chartWidth} height={chartHeight} style={styles.chartSvg}>
          <Defs>
            <LinearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={glucoseStatus.main} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={glucoseStatus.main} stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Fill */}
          <Path
            d={fillPath}
            fill="url(#chartGradient)"
          />

          {/* Line */}
          <Path
            d={pathD}
            stroke={glucoseStatus.main}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.navigate('Settings')}
            style={styles.headerLeft}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={28} color="#64748b" />
            </View>
            <View>
              <Text style={styles.greeting}>{t('home.greeting')},</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>
          </Pressable>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#64748b" />
              <View style={styles.notificationDot} />
            </Pressable>
          </View>
        </View>

        {/* Main Glucose Card */}
        <View style={styles.mainCard}>
          {/* Glucose Value Section */}
          <View style={styles.glucoseSection}>
            <View style={styles.glucoseValueRow}>
              <Text style={[styles.glucoseValue, { color: glucoseStatus.main }]}>
                5.8
              </Text>
              <Ionicons
                name="arrow-forward"
                size={36}
                color={glucoseStatus.main}
                style={styles.arrowIcon}
              />
            </View>

            <Text style={styles.glucoseUnit}>mmol/L</Text>

            <View style={[styles.statusBadge, { backgroundColor: glucoseStatus.bg, borderColor: glucoseStatus.main }]}>
              <View style={[styles.statusDot, { backgroundColor: glucoseStatus.main }]} />
              <Text style={[styles.statusText, { color: glucoseStatus.main }]}>
                {glucoseStatus.text}
              </Text>
            </View>

            <Text style={styles.lastUpdate}>{t('home.lastReading')}: 5 min</Text>
          </View>

          {/* Chart Section */}
          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>{t('history.today')}</Text>
            <CustomChart />
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.actionCards}>
          <Pressable style={[styles.actionCard, styles.actionCardInsulin]}>
            <View style={[styles.actionIconWrapper, styles.actionIconInsulin]}>
              <Ionicons name="water" size={28} color="#ffffff" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Insulin</Text>
              <Text style={styles.actionSubtitle}>{t('common.submit')}</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.actionCard, styles.actionCardFood]}>
            <View style={[styles.actionIconWrapper, styles.actionIconFood]}>
              <Ionicons name="restaurant" size={28} color="#ffffff" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Food</Text>
              <Text style={styles.actionSubtitle}>{t('common.submit')}</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />  
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#1e293b',
  },

  // Main Card
  mainCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 28,
    backgroundColor: '#0a1628',
    overflow: 'hidden',
  },

  // Glucose Section
  glucoseSection: {
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: 'center',
  },
  glucoseValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  glucoseValue: {
    fontSize: 120,
    fontWeight: '700',
    lineHeight: 120,
    letterSpacing: -6,
  },
  arrowIcon: {
    marginLeft: 8,
    marginTop: 30,
  },
  glucoseUnit: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  lastUpdate: {
    fontSize: 13,
    color: '#475569',
    marginTop: 16,
  },

  // Chart Section
  chartSection: {
    paddingBottom: 0,
  },
  chartTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  chartWrapper: {
    height: 200,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  gridLine: {
    height: 1,
    backgroundColor: '#1e293b',
  },
  yAxisLabels: {
    position: 'absolute',
    right: 28,
    top: 20,
    bottom: 20,
    justifyContent: 'space-between',
  },
  yAxisLabel: {
    fontSize: 11,
    color: '#475569',
  },
  chartSvg: {
    marginLeft: 0,
  },

  // Action Cards
  actionCards: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  actionCardInsulin: {
    backgroundColor: '#4c1d95',
  },
  actionCardFood: {
    backgroundColor: '#92400e',
  },
  actionIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconInsulin: {
    backgroundColor: '#6d28d9',
  },
  actionIconFood: {
    backgroundColor: '#c2410c',
  },
  actionTextContainer: {
    gap: 2,
  },
  actionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  actionSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.2,
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
});