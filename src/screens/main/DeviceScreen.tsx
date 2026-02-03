import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DeviceScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [devices] = useState([
    { id: '1', name: 'Sibionics CGM Sensor', rssi: -45 },
    { id: '2', name: 'Dexcom G6', rssi: -60 },
    { id: '3', name: 'FreeStyle Libre', rssi: -70 },
  ]);

  const startScan = () => {
    setIsScanning(true);
    Alert.alert('Qidirilmoqda', 'Bluetooth qurilmalari qidirilmoqda...');
    setTimeout(() => setIsScanning(false), 2000);
  };

  const connectToDevice = (deviceName: string) => {
    Alert.alert('Ulanmoqda', `${deviceName} ga ulanmoqda...`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#020817' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 24, paddingTop: 60 }}>
          <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>
            Qurilmalar
          </Text>
          <Text style={{ color: '#64748b', fontSize: 14 }}>
            CGM sensoringizni ulang
          </Text>
        </View>

        <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
          <Pressable
            onPress={startScan}
            disabled={isScanning}
            style={{ backgroundColor: isScanning ? '#334155' : '#3b82f6', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name={isScanning ? 'sync' : 'search'} size={24} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
              {isScanning ? 'Qidirilmoqda...' : 'Qurilmalarni qidirish'}
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 24 }}>
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
            Mavjud qurilmalar ({devices.length})
          </Text>

          {devices.map((device) => (
            <Pressable
              key={device.id}
              onPress={() => connectToDevice(device.name)}
              style={{ backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="bluetooth-outline" size={24} color="#3b82f6" />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '500' }}>
                    {device.name}
                  </Text>
                  <Text style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
                    Signal: {device.rssi} dBm
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748b" />
            </Pressable>
          ))}
        </View>

        <View style={{ margin: 24, backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderLeftWidth: 4, borderLeftColor: '#3b82f6' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '600', marginLeft: 8 }}>
              Yordam
            </Text>
          </View>
          <Text style={{ color: '#94a3b8', fontSize: 13, lineHeight: 20 }}>
            • Sibionics CGM sensoringizni yoqing{'\n'}
            • Bluetooth ulanishni yoqing{'\n'}
            • Qurilmani ro'yxatdan tanlang{'\n'}
            • Real Bluetooth uchun native build kerak
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}