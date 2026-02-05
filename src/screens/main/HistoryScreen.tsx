import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'

const { width } = Dimensions.get('window')

export default function HistoryScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('1 kun')

  // Generate sample data for the chart
  const generateChartPath = () => {
    const points = [
      { x: 0, y: 60 },
      { x: 25, y: 45 },
      { x: 50, y: 55 },
      { x: 75, y: 35 },
      { x: 100, y: 50 },
      { x: 125, y: 40 },
      { x: 150, y: 60 },
      { x: 175, y: 45 },
      { x: 200, y: 55 },
      { x: 225, y: 50 },
      { x: 250, y: 40 },
    ]

    let path = `M ${points[0].x} ${points[0].y}`
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1]
      const currentPoint = points[i]
      const controlX = (prevPoint.x + currentPoint.x) / 2
      
      path += ` Q ${controlX} ${prevPoint.y}, ${currentPoint.x} ${currentPoint.y}`
    }
    
    return path
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Tarix</Text>
            <Text style={styles.subtitle}>Oxirgi 24 soatlik ko'rsatkichlar</Text>
          </View>
          <Pressable style={styles.calendarButton}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path 
                d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" 
                stroke="#94A3B8" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardLeft]}>
            <Text style={styles.statLabel}>QITTACHA</Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>5.8</Text>
              <Text style={styles.statUnit}>mmol/L</Text>
            </View>
          </View>
          
          <View style={[styles.statCard, styles.statCardRight]}>
            <Text style={styles.statLabel}>MAQSADDA</Text>
            <View style={styles.statValueContainer}>
              <Text style={[styles.statValue, styles.statValueSuccess]}>92%</Text>
              <Text style={[styles.statUnit, styles.statUnitSuccess]}>vaqt</Text>
            </View>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['1 soat', '1 kun', '1 hafta', '1 oy'].map((period) => (
            <Pressable
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive
              ]}>
                {period}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Chart Section */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartLabel}>Trend xronologiyasi</Text>
            <Text style={styles.chartRange}>DIAPAZON</Text>
          </View>
          <View style={styles.chartRangeValues}>
            <Text style={styles.chartValue}>0-6 mmol/L</Text>
            <Text style={styles.chartValue}>4.2— 8.5</Text>
          </View>

          {/* Chart */}
          <View style={styles.chart}>
            <Svg width={width - 70} height={120} viewBox="0 0 250 80">
              {/* Grid lines */}
              <Path d="M 0 20 L 250 20" stroke="#1e293b" strokeWidth="1" />
              <Path d="M 0 40 L 250 40" stroke="#1e293b" strokeWidth="1" />
              <Path d="M 0 60 L 250 60" stroke="#1e293b" strokeWidth="1" />
              
              {/* Chart line */}
              <Path 
                d={generateChartPath()} 
                stroke="#3b82f6" 
                strokeWidth="2.5" 
                fill="none"
                strokeLinecap="round"
              />
            </Svg>
            
            {/* Time labels */}
            <View style={styles.timeLabels}>
              <Text style={styles.timeLabel}>15:00</Text>
              <Text style={styles.timeLabel}>17:00</Text>
              <Text style={styles.timeLabel}>19:02</Text>
            </View>
          </View>
        </View>

        {/* Date */}
        <Text style={styles.dateText}>Bugun, 24-Oktyabr</Text>

        {/* Log Entries */}
        <View style={styles.logContainer}>
          {/* Entry 1 - Blood Glucose */}
          <Pressable style={styles.logEntry}>
            <View style={[styles.logIcon, styles.logIconBlue]}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path 
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" 
                  fill="#3b82f6"
                />
                <Circle cx="12" cy="12" r="4" fill="#3b82f6" />
              </Svg>
            </View>
            <View style={styles.logContent}>
              <View style={styles.logHeader}>
                <Text style={styles.logTime}>18:45</Text>
              </View>
              <Text style={styles.logTitle}>Kechki ovqat</Text>
              <Text style={styles.logSubtitle}>65g uglevod</Text>
            </View>
            <View style={styles.logValue}>
              <Text style={styles.logValueText}>6.4</Text>
              <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <Path d="M7 10l5 5 5-5H7z" fill="#3b82f6" />
              </Svg>
            </View>
          </Pressable>

          {/* Entry 2 - Medication */}
          <Pressable style={styles.logEntry}>
            <View style={[styles.logIcon, styles.logIconRed]}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path 
                  d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14h-4v-2h4v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" 
                  fill="#ef4444"
                />
              </Svg>
            </View>
            <View style={styles.logContent}>
              <View style={styles.logHeader}>
                <Text style={styles.logTime}>18:50</Text>
              </View>
              <Text style={styles.logTitle}>Novorapid</Text>
              <Text style={styles.logSubtitle}>8 birlik • Qorin sonasi</Text>
            </View>
          </Pressable>

          {/* Entry 3 - Auto Measurement */}
          <Pressable style={styles.logEntry}>
            <View style={[styles.logIcon, styles.logIconBlue]}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path 
                  d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" 
                  fill="#3b82f6"
                />
              </Svg>
            </View>
            <View style={styles.logContent}>
              <View style={styles.logHeader}>
                <Text style={styles.logTime}>16:20</Text>
              </View>
              <Text style={styles.logTitle}>Avtomatik o'lchov</Text>
              <Text style={styles.logSubtitle}>Barqaror holat</Text>
            </View>
            <View style={styles.logValue}>
              <Text style={styles.logValueText}>5.2</Text>
            </View>
          </Pressable>

          {/* Entry 4 - Exercise */}
          <Pressable style={styles.logEntry}>
            <View style={[styles.logIcon, styles.logIconGreen]}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path 
                  d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" 
                  fill="#22c55e"
                />
              </Svg>
            </View>
            <View style={styles.logContent}>
              <View style={styles.logHeader}>
                <Text style={styles.logTime}>14:00</Text>
              </View>
              <Text style={styles.logTitle}>Yengil sayr</Text>
              <Text style={styles.logSubtitle}>45 daqiqa • 3.2 km</Text>
            </View>
          </Pressable>
        </View>

        {/* Previous Date */}
        <Text style={[styles.dateText, { marginTop: 24 }]}>Kecha, 23-Oktyabr</Text>

        {/* Previous Day Entries */}
        <View style={styles.logContainer}>
          <Pressable style={styles.logEntry}>
            <View style={[styles.logIcon, styles.logIconBlue]}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path 
                  d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" 
                  fill="#3b82f6"
                />
              </Svg>
            </View>
            <View style={styles.logContent}>
              <View style={styles.logHeader}>
                <Text style={styles.logTime}>22:30</Text>
              </View>
              <Text style={styles.logTitle}>Uyqudan oldin</Text>
            </View>
            <View style={styles.logValue}>
              <Text style={styles.logValueText}>5.9</Text>
            </View>
          </Pressable>
        </View>

        {/* Bottom padding for navigation */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020817',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  calendarButton: {
    width: 44,
    height: 44,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
  },
  statCardLeft: {
    backgroundColor: '#1e293b',
  },
  statCardRight: {
    backgroundColor: '#1e293b',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
  },
  statValueSuccess: {
    color: '#22d3ee',
  },
  statUnit: {
    fontSize: 14,
    color: '#64748b',
  },
  statUnitSuccess: {
    color: '#22d3ee',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
  },
  periodButtonActive: {
    backgroundColor: '#3b82f6',
  },
  periodText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#ffffff',
  },
  chartContainer: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chartLabel: {
    fontSize: 13,
    color: '#94a3b8',
  },
  chartRange: {
    fontSize: 11,
    color: '#64748b',
    letterSpacing: 0.5,
  },
  chartRangeValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartValue: {
    fontSize: 13,
    color: '#94a3b8',
  },
  chart: {
    marginTop: 10,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  timeLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  dateText: {
    fontSize: 15,
    color: '#94a3b8',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  logContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  logIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logIconBlue: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  logIconRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  logIconGreen: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  logContent: {
    flex: 1,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  logTime: {
    fontSize: 13,
    color: '#64748b',
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  logSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  logValue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  logValueText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
  },
  bottomPadding: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '300',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#3b82f6',
  },
})