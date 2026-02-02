import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Droplet, Activity, Zap, Settings2 } from 'lucide-react-native';

const TestScreen = () => {
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 pt-12 pb-32">
        <View className="mb-10 items-center">
          <View className="w-16 h-16 rounded-2xl bg-primary/20 items-center justify-center mb-4 border border-primary/40">
            <Droplet size={32} color="#3b82f6" />
          </View>
          <Text className="text-3xl font-bold text-white mb-2">
            GlucoSense
          </Text>
          <Text className="text-muted-foreground text-center text-sm">
            Expo + NativeWind Official Setup! ✅
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Design System Test
          </Text>
          
          <View className="bg-card border border-border/50 p-5 rounded-2xl mb-4">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
                <Activity size={20} color="#3b82f6" />
              </View>
              <Text className="text-foreground font-semibold">
                Primary Card
              </Text>
            </View>
            <Text className="text-muted-foreground text-sm">
              Using official NativeWind setup!
            </Text>
          </View>

          <View className="bg-card border border-border/50 p-5 rounded-2xl mb-4">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-10 h-10 rounded-xl bg-chart-1/10 items-center justify-center">
                <Zap size={20} color="#22c55e" />
              </View>
              <Text className="text-foreground font-semibold">
                Success Color
              </Text>
            </View>
            <Text className="text-muted-foreground text-sm">
              QR code test with Expo Go!
            </Text>
          </View>

          <View className="bg-card border border-border/50 p-5 rounded-2xl">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-10 h-10 rounded-xl bg-destructive/10 items-center justify-center">
                <Settings2 size={20} color="#ef4444" />
              </View>
              <Text className="text-foreground font-semibold">
                Hot Reload Active
              </Text>
            </View>
            <Text className="text-muted-foreground text-sm">
              Save and see changes instantly!
            </Text>
          </View>
        </View>

        <View className="bg-primary rounded-2xl p-4 items-center mb-4">
          <Text className="text-white font-bold text-base">
            Test Button - Tailwind Working!
          </Text>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 h-20 bg-background/80 border-t border-white/5 flex-row items-center justify-around">
        {[
          { icon: Activity, label: 'Asosiy', active: true },
          { icon: Droplet, label: 'Tarix', active: false },
          { icon: Zap, label: 'Qurilma', active: false },
          { icon: Settings2, label: 'Sozlamalar', active: false },
        ].map((tab, index) => (
          <View key={index} className="items-center gap-1">
            <View className={`p-1.5 rounded-xl ${tab.active ? 'bg-primary/10' : ''}`}>
              <tab.icon 
                size={24} 
                color={tab.active ? '#3b82f6' : '#94a3b8'} 
              />
            </View>
            <Text className={`text-[10px] font-medium ${tab.active ? 'text-primary' : 'text-muted-foreground'}`}>
              {tab.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TestScreen;
