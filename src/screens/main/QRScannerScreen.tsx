import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

interface SensorInfo {
  serialNumber: string;
  connectionCode: string;
}

interface Props {
  onSensorScanned: (info: SensorInfo) => void;
  onClose: () => void;
}

export default function QRScannerScreen({ onSensorScanned, onClose }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const parseQRCode = (rawData: string): SensorInfo | null => {
    console.log('QR Data:', rawData);

    // FIXED: 18 characters (not 19!)
    const serialMatch = rawData.match(/21([A-Z0-9]{18})/);

    if (serialMatch) {
      const serialNumber = serialMatch[1];
      const connectionCode = serialNumber.substring(6, 14);

      console.log('✅ Serial Number:', serialNumber);
      console.log('✅ Connection Code:', connectionCode);

      return { serialNumber, connectionCode };
    }

    console.log('❌ No match found!');
    return null;
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);
    const sensorInfo = parseQRCode(data);

    if (sensorInfo) {
      Alert.alert(
        'Sensor topildi! ✅',
        `Serial: ${sensorInfo.serialNumber}\n\nConnection Code: ${sensorInfo.connectionCode}`,
        [
          {
            text: 'Ulanish',
            onPress: () => {
              onSensorScanned(sensorInfo);
              onClose();
            }
          },
          {
            text: 'Bekor qilish',
            style: 'cancel',
            onPress: () => setScanned(false)
          }
        ]
      );
    } else {
      Alert.alert(
        'Xato ❌',
        'Noto\'g\'ri QR code formati. Sibionics sensor QR code\'ini scan qiling.',
        [{ text: 'Qayta urinish', onPress: () => setScanned(false) }]
      );
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Kamera ruxsati yuklanmoqda...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-outline" size={64} color="#ef4444" />
        <Text style={styles.text}>Kamera ruxsati kerak</Text>
        <Pressable onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Ruxsat berish</Text>
        </Pressable>
        <Pressable onPress={onClose} style={[styles.button, { backgroundColor: '#334155', marginTop: 10 }]}>
          <Text style={styles.buttonText}>Yopish</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'datamatrix'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      <View style={styles.overlay}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#ffffff" />
          </Pressable>
        </View>

        <View style={styles.scanArea}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        <View style={styles.instructions}>
          <Ionicons name="qr-code-outline" size={48} color="#3b82f6" />
          <Text style={styles.instructionText}>
            Sibionics sensor qutisidagi{'\n'}QR code'ni scan qiling
          </Text>
        </View>
      </View>

      {scanned && (
        <View style={styles.footer}>
          <Pressable style={styles.rescanButton} onPress={() => setScanned(false)}>
            <Ionicons name="reload" size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.rescanText}>Qayta scan</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  header: { paddingTop: 60, paddingHorizontal: 24, alignItems: 'flex-end' },
  closeButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.3)' },
  scanArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  corner: { position: 'absolute', width: 80, height: 80 },
  cornerTL: { top: '20%', left: '10%', borderTopWidth: 6, borderLeftWidth: 6, borderColor: '#3b82f6' },
  cornerTR: { top: '20%', right: '10%', borderTopWidth: 6, borderRightWidth: 6, borderColor: '#3b82f6' },
  cornerBL: { bottom: '30%', left: '10%', borderBottomWidth: 6, borderLeftWidth: 6, borderColor: '#3b82f6' },
  cornerBR: { bottom: '30%', right: '10%', borderBottomWidth: 6, borderRightWidth: 6, borderColor: '#3b82f6' },
  instructions: { paddingBottom: 60, paddingHorizontal: 40, alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', marginHorizontal: 20, padding: 24, borderRadius: 16 },
  instructionText: { color: '#ffffff', fontSize: 16, textAlign: 'center', marginTop: 16, fontWeight: '500' },
  footer: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
  rescanButton: { backgroundColor: '#3b82f6', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  rescanText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  text: { color: '#ffffff', fontSize: 18, marginTop: 20 },
  button: { marginTop: 20, backgroundColor: '#3b82f6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
