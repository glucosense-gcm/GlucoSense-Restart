import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Modal, PermissionsAndroid, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BleManager, Device, State } from 'react-native-ble-plx';
import QRScannerScreen from './QRScannerScreen';
import { parseGlucosePacket, GlucoseReading } from '../../utils/sibionicsProtocol';

const bleManager = new BleManager();

const SIBIONICS_SERVICE = '0000ff30-0000-1000-8000-00805f9b34fb';
const SIBIONICS_NOTIFY = '0000ff31-0000-1000-8000-00805f9b34fb';
const SIBIONICS_WRITE = '0000ff32-0000-1000-8000-00805f9b34fb';

export default function DeviceScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [targetCode, setTargetCode] = useState<string>('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [bluetoothState, setBluetoothState] = useState<State>('Unknown');
  const [knownDeviceId] = useState<string>('EB:F4:3F:92:87:B7');
  const [latestReading, setLatestReading] = useState<GlucoseReading | null>(null);

  useEffect(() => {
    const subscription = bleManager.onStateChange((state) => {
      console.log('��� Bluetooth State:', state);
      setBluetoothState(state);
    }, true);

    return () => {
      subscription.remove();
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
        Alert.alert('Ruxsat kerak', 'Bluetooth va Location ruxsati bering');
        return false;
      }
    }
    return true;
  };

  const connectDirectly = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    if (bluetoothState !== 'PoweredOn') {
      Alert.alert('Bluetooth o\'chirilgan', 'Iltimos yoqing');
      return;
    }

    setIsConnecting(true);
    console.log('��� Direct connect to:', knownDeviceId);

    try {
      const connected = await bleManager.connectToDevice(knownDeviceId, {
        requestMTU: 512,
        refreshGatt: 'OnConnected',
        timeout: 30000
      });
      
      console.log('✅ Connected!');
      
      await connected.discoverAllServicesAndCharacteristics();
      console.log('✅ Services discovered!');
      
      setConnectedDevice(connected);
      
      console.log('��� Subscribing to glucose data...');
      
      connected.monitorCharacteristicForService(
        SIBIONICS_SERVICE,
        SIBIONICS_NOTIFY,
        (error, characteristic) => {
          if (error) {
            console.error('❌ Monitor error:', error.message);
            return;
          }
          
          if (characteristic?.value) {
            console.log('\n��������� GLUCOSE DATA RECEIVED! ���������');
            
            const reading = parseGlucosePacket(characteristic.value);
            
            if (reading && reading.isValid) {
              setLatestReading(reading);
              console.log('��� Saved to state:', reading.glucoseMmol, 'mmol/L');
            }
            
            console.log('═══════════════════════════════\n');
          }
        }
      );
      
      Alert.alert('Ulandi! ✅', 'Sensor ulandi!\n\nData kutilmoqda...');
      
    } catch (error: any) {
      console.error('❌ Connection failed:', error?.message || error);
      
      if (error?.message?.includes('not found')) {
        Alert.alert(
          'Sensor topilmadi',
          'SugarJoy+ ni Force Stop qiling va qayta urinib ko\'ring',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Xato', error?.message || 'Ulanib bo\'lmadi');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await bleManager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
        setLatestReading(null);
        Alert.alert('Uzildi', 'Qurilma uzildi');
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    }
  };

  const handleSensorScanned = (info: { connectionCode: string }) => {
    setTargetCode(info.connectionCode);
    Alert.alert(
      'Sensor topildi! ✅',
      `Connection Code: ${info.connectionCode}\n\nUlanishni boshlaysizmi?`,
      [
        { text: 'Yo\'q', style: 'cancel' },
        { text: 'Ha', onPress: connectDirectly }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#020817' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 24, paddingTop: 60 }}>
          <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: 'bold' }}>
            Qurilmalar
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: bluetoothState === 'PoweredOn' ? '#22c55e' : '#ef4444', marginRight: 6 }} />
            <Text style={{ color: '#64748b', fontSize: 14 }}>
              Bluetooth: {bluetoothState}
            </Text>
          </View>
        </View>

        {latestReading && (
          <View style={{ marginHorizontal: 24, marginBottom: 20, backgroundColor: '#1e3a5f', borderRadius: 20, padding: 24, borderLeftWidth: 4, borderLeftColor: '#10b981' }}>
            <Text style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>Oxirgi o'lchash</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ color: '#ffffff', fontSize: 48, fontWeight: 'bold' }}>
                {latestReading.glucoseMmol.toFixed(1)}
              </Text>
              <Text style={{ color: '#94a3b8', fontSize: 20, marginLeft: 8 }}>
                mmol/L
              </Text>
            </View>
            <Text style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
              {latestReading.glucoseMgdl.toFixed(0)} mg/dL
            </Text>
            <Text style={{ color: '#64748b', fontSize: 12, marginTop: 8 }}>
              {latestReading.timestamp.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}

        {connectedDevice && (
          <View style={{ marginHorizontal: 24, marginBottom: 20, backgroundColor: '#1e3a5f', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#22c55e' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="bluetooth" size={28} color="#ffffff" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600' }}>
                  {connectedDevice.name || 'Sibionics Sensor'}
                </Text>
                <Text style={{ color: '#22c55e', fontSize: 12, marginTop: 4 }}>Ulangan</Text>
              </View>
            </View>
            <Pressable onPress={disconnectDevice} style={{ backgroundColor: '#ef4444', borderRadius: 12, padding: 12 }}>
              <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '600' }}>Uzish</Text>
            </Pressable>
          </View>
        )}

        <View style={{ paddingHorizontal: 24, marginBottom: 12 }}>
          <Pressable
            onPress={connectDirectly}
            disabled={isConnecting || bluetoothState !== 'PoweredOn' || !!connectedDevice}
            style={{ 
              backgroundColor: isConnecting ? '#334155' : connectedDevice ? '#64748b' : '#10b981',
              borderRadius: 16, 
              padding: 18,
              marginBottom: 12,
              opacity: (isConnecting || connectedDevice) ? 0.5 : 1
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="flash" size={24} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                {isConnecting ? 'Ulanmoqda...' : connectedDevice ? 'Ulangan' : 'Direct Connect'}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setShowQRScanner(true)}
            style={{ backgroundColor: '#8b5cf6', borderRadius: 16, padding: 18 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="qr-code" size={24} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                QR Scan
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={{ margin: 24, backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderLeftWidth: 4, borderLeftColor: '#10b981' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '600', marginLeft: 8 }}>
              Protocol Decoded! ✅
            </Text>
          </View>
          <Text style={{ color: '#94a3b8', fontSize: 13, lineHeight: 20 }}>
            Sibionics protokol muvaffaqiyatli decode qilindi!{'\n'}
            Formula: Bytes[6-7] (LE) / 1800 = mmol/L{'\n'}
            Har 1 daqiqada yangi data keladi.
          </Text>
        </View>
      </ScrollView>

      <Modal visible={showQRScanner} animationType="slide">
        <QRScannerScreen
          onSensorScanned={handleSensorScanned}
          onClose={() => setShowQRScanner(false)}
        />
      </Modal>
    </View>
  );
}
