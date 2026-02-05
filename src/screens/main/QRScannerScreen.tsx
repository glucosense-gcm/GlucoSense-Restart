import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
    const serialMatch = rawData.match(/21(\d{19})/);
    
    if (serialMatch) {
      const serialNumber = serialMatch[1];
      const connectionCode = serialNumber.substring(6, 14);
      return { serialNumber, connectionCode };
    }
    
    return null;
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    const sensorInfo = parseQRCode(data);
    
    if (sensorInfo) {
      onSensorScanned(sensorInfo);
      onClose();
    } else {
      alert('Noto\'g\'ri QR code. Sibionics sensor QR code\'ini scan qiling.');
      setTimeout(() => setScanned(false), 2000);
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
        <Ionicons name="camera-off" size={64} color="#ef4444" />
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
        <Pressable style={styles.rescanButton} onPress={() => setScanned(false)}>
          <Text style={styles.rescanText}>Qayta scan</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  header: { paddingTop: 50, paddingHorizontal: 20, alignItems: 'flex-end' },
  closeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center' },
  scanArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  corner: { position: 'absolute', width: 60, height: 60 },
  cornerTL: { top: '25%', left: '10%', borderTopWidth: 5, borderLeftWidth: 5, borderColor: '#3b82f6' },
  cornerTR: { top: '25%', right: '10%', borderTopWidth: 5, borderRightWidth: 5, borderColor: '#3b82f6' },
  cornerBL: { bottom: '25%', left: '10%', borderBottomWidth: 5, borderLeftWidth: 5, borderColor: '#3b82f6' },
  cornerBR: { bottom: '25%', right: '10%', borderBottomWidth: 5, borderRightWidth: 5, borderColor: '#3b82f6' },
  instructions: { paddingBottom: 80, paddingHorizontal: 40, alignItems: 'center' },
  instructionText: { color: '#ffffff', fontSize: 16, textAlign: 'center', marginTop: 16, fontWeight: '500' },
  rescanButton: { position: 'absolute', bottom: 40, backgroundColor: '#3b82f6', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  rescanText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  text: { color: '#ffffff', fontSize: 18, marginTop: 20 },
  button: { marginTop: 20, backgroundColor: '#3b82f6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
