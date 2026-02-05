import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onCodeEntered: (code: string) => void;
  onClose: () => void;
}

export default function ManualCodeScreen({ onCodeEntered, onClose }: Props) {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    const cleaned = code.trim().toUpperCase();
    
    if (cleaned.length === 8 && /^[A-Z0-9]{8}$/.test(cleaned)) {
      onCodeEntered(cleaned);
      onClose();
    } else {
      Alert.alert(
        'Xato',
        'Connection code 8 ta harf/raqamdan iborat bo\'lishi kerak.\n\nMisol: 9VLB672K'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#64748b" />
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.iconContainer}>
            <Ionicons name="key" size={64} color="#3b82f6" />
          </View>

          <Text style={styles.title}>Connection Code</Text>
          <Text style={styles.subtitle}>
            Sensor qutisidagi 8 belgili kodni kiriting
          </Text>

          <View style={styles.example}>
            <Text style={styles.exampleLabel}>Misol:</Text>
            <Text style={styles.exampleCode}>9VLB672K</Text>
          </View>

          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="9VLB672K"
            placeholderTextColor="#64748b"
            maxLength={8}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <Pressable
            onPress={handleSubmit}
            style={[styles.button, code.length === 8 && styles.buttonActive]}
            disabled={code.length !== 8}
          >
            <Text style={styles.buttonText}>Davom etish</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </Pressable>

          <View style={styles.hint}>
            <Ionicons name="information-circle-outline" size={20} color="#64748b" />
            <Text style={styles.hintText}>
              Code sensor qutisining orqa tomonida yozilgan
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '60%',
  },
  header: {
    padding: 20,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  example: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  exampleLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  exampleCode: {
    fontSize: 20,
    color: '#3b82f6',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  buttonActive: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  hintText: {
    fontSize: 13,
    color: '#64748b',
  },
});
