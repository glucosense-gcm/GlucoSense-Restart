import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const { user } = useAuth();
  const [currentGlucose] = useState(5.8);
  const [glucoseData] = useState([4.5, 5.2, 5.8, 6.1, 5.9, 5.4, 5.8, 6.2, 5.7, 5.3, 5.8]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center border-2 border-primary">
              <Text className="text-xl">í±¤</Text>
            </View>
            <View>
              <Text className="text-xs text-muted-foreground">Xayrli kech,</Text>
              <Text className="text-lg font-bold text-white">
                {user?.name || 'Azizbek'}
              </Text>
            </View>
          </View>
          
          <View className="flex-row gap-2">
            <Pressable className="w-10 h-10 rounded-full bg-card items-center justify-center">
              <Ionicons name="notifications-outline" size={22} color="#94a3b8" />
              <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </Pressable>
            <Pressable className="w-10 h-10 rounded-full bg-card items-center justify-center">
              <Ionicons name="settings-outline" size={22} color="#94a3b8" />
            </Pressable>
          </View>
        </View>

        {/* Main Glucose Card */}
        <View className="mx-6 mb-6">
          <View className="rounded-3xl overflow-hidden" style={{
            backgroundColor: '#0f172a',
          }}>
            {/* Glucose Value */}
            <View className="px-8 pt-12 pb-8 items-center">
              <View className="flex-row items-baseline mb-2">
                <Text className="text-7xl font-bold" style={{ color: '#6ee7b7' }}>
                  {currentGlucose}
                </Text>
                <Ionicons name="arrow-forward" size={32} color="#6ee7b7" style={{ marginLeft: 8 }} />
              </View>
              <Text className="text-lg text-muted-foreground mb-6">mmol/L</Text>
              
              {/* Status Badge */}
              <View className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-green-500/20">
                <View className="w-2 h-2 rounded-full bg-green-500" />
                <Text className="text-sm font-medium text-green-500">Normal holatda</Text>
              </View>
              
              <Text className="text-xs text-muted-foreground mt-4">
                Qidirg'ich bilan 5 daqiqa oldin
              </Text>
            </View>

            {/* Chart Section */}
            <View className="px-6 pb-6">
              <Text className="text-sm text-muted-foreground mb-3">So'ngi 24 soat</Text>
              
              <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
                <LineChart
                  data={{
                    labels: [],
                    datasets: [{ 
                      data: glucoseData,
                      color: (opacity = 1) => `rgba(52, 211, 153, ${opacity})`,
                      strokeWidth: 3,
                    }],
                  }}
                  width={screenWidth - 80}
                  height={180}
                  withVerticalLabels={false}
                  withHorizontalLabels={false}
                  withDots={false}
                  withInnerLines={false}
                  withOuterLines={false}
                  withVerticalLines={false}
                  withHorizontalLines={false}
                  chartConfig={{
                    backgroundColor: '#0a1628',
                    backgroundGradientFrom: '#0a1628',
                    backgroundGradientTo: '#0f172a',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(52, 211, 153, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForBackgroundLines: {
                      strokeWidth: 0,
                    },
                  }}
                  bezier
                  style={{
                    paddingRight: 0,
                    marginLeft: -15,
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Action Cards */}
        <View className="px-6 flex-row gap-4 mb-8">
          {/* Insulin Card */}
          <Pressable 
            className="flex-1 rounded-2xl p-6 h-32 justify-between"
            style={{ backgroundColor: '#312e81' }}
          >
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
              <Text className="text-2xl">í²‰</Text>
            </View>
            <View>
              <Text className="text-xl font-bold text-white mb-1">Insulin</Text>
              <Text className="text-xs text-white/60">Kiritish</Text>
            </View>
          </Pressable>

          {/* Carbs Card */}
          <Pressable 
            className="flex-1 rounded-2xl p-6 h-32 justify-between"
            style={{ backgroundColor: '#78350f' }}
          >
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
              <Text className="text-2xl">í½ž</Text>
            </View>
            <View>
              <Text className="text-xl font-bold text-white mb-1">Uglevod</Text>
              <Text className="text-xs text-white/60">Qo'qatlanish</Text>
            </View>
          </Pressable>
        </View>

        {/* Quick Stats */}
        <View className="px-6 mb-8">
          <Text className="text-base font-semibold text-white mb-4">Bugungi ko'rsatkichlar</Text>
          
          <View className="bg-card rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-border">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-blue-500/20 items-center justify-center">
                  <Ionicons name="analytics" size={20} color="#3b82f6" />
                </View>
                <View>
                  <Text className="text-xs text-muted-foreground">O'rtacha</Text>
                  <Text className="text-lg font-bold text-white">5.6 mmol/L</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748b" />
            </View>

            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-border">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-yellow-500/20 items-center justify-center">
                  <Ionicons name="arrow-down-circle" size={20} color="#eab308" />
                </View>
                <View>
                  <Text className="text-xs text-muted-foreground">Eng past</Text>
                  <Text className="text-lg font-bold text-white">4.5 mmol/L</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748b" />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-red-500/20 items-center justify-center">
                  <Ionicons name="arrow-up-circle" size={20} color="#ef4444" />
                </View>
                <View>
                  <Text className="text-xs text-muted-foreground">Eng yuqori</Text>
                  <Text className="text-lg font-bold text-white">6.2 mmol/L</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748b" />
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
