import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Modal, PermissionsAndroid, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BleManager, Device } from 'react-native-ble-plx';
import ManualCodeScreen from './ManualCodeScreen';
import QRScannerScreen from './QRScannerScreen';

const bleManager = new BleManager();

export default function DeviceScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [targetCode, setTargetCode] = useState<string>('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    return () => {
      bleManager.stopDeviceScan();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      const allGranted = Object.values(granted).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        Alert.alert('Ruxsat kerak', 'Bluetooth va joylashuv ruxsatini bering');
        return false;
      }
    }
    return true;
  };

  const startRealScan = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setDevices([]);
    setIsScanning(true);

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        setIsScanning(false);
        Alert.alert('Xato', 'Bluetooth yoqilganligini tekshiring');
        return;
      }

      if (device && device.name) {
        console.log('Found device:', device.name, device.rssi);
        
        if (targetCode && !device.name.includes(targetCode)) {
          return;
        }

        setDevices(prev => {
          const exists = prev.find(d => d.id === device.id);
          if (!exists) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });

    setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  };

  const connectToDevice = async (device: Device) => {
    try {
      Alert.alert('Ulanmoqda', `${device.name} ga ulanmoqda...`);
      
      await bleManager.stopDeviceScan();
      
      const connected = await bleManager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      
      setConnectedDevice(connected);
      
      const services = await connected.services();
      console.log('Services:', services.map(s => s.uuid));
      
      Alert.alert('Muvaffaqiyat!', `${device.name} ulandi!`);
      
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Xato', 'Qurilmaga ulanib bo\'lmadi');
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await bleManager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
        Alert.alert('Uzildi', 'Qurilma uzildi');
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    }
  };

  const handleCodeEntered = (code: string) => {
    setTargetCode(code);
    Alert.alert(
      'Code saqlandi!',
      `Connection Code: ${code}\n\nBluetooth qidiruv boshlaysizmi?`,
      [
        { text: 'Yo\'q', style: 'cancel' },
        { text: 'Ha', onPress: startRealScan }
      ]
    );
  };

  const handleSensorScanned = (info: { connectionCode: string }) => {
    setTargetCode(info.connectionCode);
    Alert.alert(
      'Sensor topildi!',
      `Connection Code: ${info.connectionCode}\n\nBluetooth qidiruv boshlaysizmi?`,
      [
        { text: 'Yo\'q', style: 'cancel' },
        { text: 'Ha', onPress: startRealScan }
      ]
    );
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

        {connectedDevice && (
          <View style={{ marginHorizontal: 24, marginBottom: 20, backgroundColor: '#1e3a5f', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#22c55e' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="bluetooth" size={28} color="#ffffff" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600' }}>
                  {connectedDevice.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e', marginRight: 6 }} />
                  <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: '500' }}>Ulangan</Text>
                </View>
              </View>
            </View>
            <Pressable onPress={disconnectDevice} style={{ backgroundColor: '#ef4444', borderRadius: 12, padding: 12 }}>
              <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '600' }}>Uzish</Text>
            </Pressable>
          </View>
        )}

        {targetCode && (
          <View style={{ marginHorizontal: 24, marginBottom: 20, backgroundColor: '#1e3a5f', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#3b82f6' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>
                Target sensor code
              </Text>
            </View>
            <Text style={{ color: '#94a3b8', fontSize: 14 }}>
              Code: {targetCode}
            </Text>
          </View>
        )}

        <View style={{ paddingHorizontal: 24, marginBottom: 12, flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={() => setShowQRScanner(true)}
            style={{ flex: 1, backgroundColor: '#8b5cf6', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="qr-code" size={24} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
              QR Scan
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setShowCodeInput(true)}
            style={{ flex: 1, backgroundColor: '#0ea5e9', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="key" size={24} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
              Manual
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 24, marginBottom: 12 }}>
          <Pressable
            onPress={startRealScan}
            disabled={isScanning}
            style={{ backgroundColor: isScanning ? '#334155' : '#3b82f6', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name={isScanning ? 'sync' : 'search'} size={24} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
              {isScanning ? 'Qidirilmoqda... (10s)' : 'Bluetooth Qidirish'}
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 24 }}>
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
            Topilgan qurilmalar ({devices.length})
          </Text>

          {devices.length === 0 && !isScanning && (
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Ionicons name="bluetooth-outline" size={64} color="#334155" />
              <Text style={{ color: '#64748b', fontSize: 14, marginTop: 12, textAlign: 'center' }}>
                Qurilmalar topilmadi.{'\n'}Qidirish tugmasini bosing.
              </Text>
            </View>
          )}

          {devices.map((device) => (
            <Pressable
              key={device.id}
              onPress={() => connectToDevice(device)}
              style={{ backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="bluetooth-outline" size={24} color="#3b82f6" />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '500' }}>
                    {device.name || 'Unknown Device'}
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
            1. Sibionics sensorni yoqing{'\n'}
            2. QR Scan yoki Manual code kiriting{'\n'}
            3. "Bluetooth Qidirish" bosing{'\n'}
            4. Ro'yxatdan sensorni tanlang
          </Text>
        </View>
      </ScrollView>

      <Modal visible={showCodeInput} animationType="slide" transparent>
        <ManualCodeScreen
          onCodeEntered={handleCodeEntered}
          onClose={() => setShowCodeInput(false)}
        />
      </Modal>

      <Modal visible={showQRScanner} animationType="slide">
        <QRScannerScreen
          onSensorScanned={handleSensorScanned}
          onClose={() => setShowQRScanner(false)}
        />
      </Modal>
    </View>
  );
}
