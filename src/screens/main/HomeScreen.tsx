import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useAuth } from '../../context/AuthContext';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const { user } = useAuth();

  const [currentGlucose] = useState(5.8);
  const [glucoseData] = useState([
    4.5, 5.2, 5.8, 6.1, 5.9, 5.4, 5.8, 6.2, 5.7, 5.3, 5.8,
  ]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <ScrollView className="flex-1"
       showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        {/* ================= HEADER ================= */}
        <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center border-2 border-primary">
              <Text className="text-xl">👤</Text>
            </View>
            <View>
              <Text className="text-xs text-muted-foreground">Xayrli kech,</Text>
              <Text className="text-lg font-bold text-white">
                {user?.name || 'Azizbek'}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2">
            <Pressable
              onPress={() => console.log('Notifications')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 1,
              })}
              className="w-10 h-10 rounded-full bg-card items-center justify-center"
            >
              <Ionicons name="notifications-outline" size={22} color="#94a3b8" />
              <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </Pressable>

            <Pressable
              onPress={() => console.log('Settings')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 1,
              })}
              className="w-10 h-10 rounded-full bg-card items-center justify-center"
            >
              <Ionicons name="settings-outline" size={22} color="#94a3b8" />
            </Pressable>
          </View>
        </View>

        {/* ================= GLUCOSE CARD ================= */}
        <View className="mx-6 mb-6">
          <View className="rounded-3xl overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
            <View className="px-8 pt-12 pb-8 items-center">
              <View className="flex-row items-baseline mb-2">
                <Text className="text-7xl font-bold" style={{ color: '#6ee7b7' }}>
                  {currentGlucose}
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={32}
                  color="#6ee7b7"
                  style={{ marginLeft: 8 }}
                />
              </View>

              <Text className="text-lg text-muted-foreground mb-6">mmol/L</Text>

              <View className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-green-500/20">
                <View className="w-2 h-2 rounded-full bg-green-500" />
                <Text className="text-sm font-medium text-green-500">
                  Normal holatda
                </Text>
              </View>

              <Text className="text-xs text-muted-foreground mt-4">
                Sensor · 5 daqiqa oldin
              </Text>
            </View>

            <View className="px-6 pb-6">
              <Text className="text-sm text-muted-foreground mb-3">
                So‘nggi 24 soat
              </Text>

              <View pointerEvents='none' className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
                <LineChart
                  data={{
                    labels: [],
                    datasets: [
                      {
                        data: glucoseData,
                        color: (opacity = 1) =>
                          `rgba(52, 211, 153, ${opacity})`,
                        strokeWidth: 3,
                      },
                    ],
                  }}
                  width={screenWidth - 80}
                  height={180}
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
                    color: (opacity = 1) =>
                      `rgba(52, 211, 153, ${opacity})`,
                  }}
                  bezier
                  style={{ marginLeft: -15 }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* ================= ACTION CARDS ================= */}
        <View className="px-6 flex-row gap-4 mb-8" style={{zIndex: 10, position: 'relative' }}>
          <Pressable
            hitSlop={20}
            onPress={() => console.log('Insulin')}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1, transform:[{ scale: pressed ? 0.97 : 1 }] })}
            className="flex-1 rounded-2xl p-6 h-32 justify-between"
            android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
          >
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
              <Text className="text-2xl">💉</Text>
            </View>
            <View>
              <Text className="text-xl font-bold text-white mb-1">Insulin</Text>
              <Text className="text-xs text-white/60">Kiritish</Text>
            </View>
          </Pressable>

          <Pressable
            hitSlop={20}
            onPress={() => console.log('Carbs')}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            className="flex-1 rounded-2xl p-6 h-32 justify-between"
            android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
          >
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
              <Text className="text-2xl">🍞</Text>
            </View>
            <View>
              <Text className="text-xl font-bold text-white mb-1">Uglevod</Text>
              <Text className="text-xs text-white/60">Ovqat</Text>
            </View>
          </Pressable>
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
