import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useRegisterMutation } from '../../store/services/authService';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Ошибка', 'Введите email');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Ошибка', 'Введите корректный email');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Ошибка', 'Введите пароль');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен быть минимум 6 символов');
      return false;
    }
    if (!firstName.trim()) {
      Alert.alert('Ошибка', 'Введите имя');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('Ошибка', 'Введите фамилию');
      return false;
    }
    if (!dateOfBirth) {
      Alert.alert('Ошибка', 'Выберите дату рождения');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const result = await register({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: dateOfBirth!.toISOString(),
        language: 'ru',
      }).unwrap();

      Alert.alert('Успешно!', 'Регистрация прошла успешно. Теперь войдите.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage =
        error?.data?.message || error?.message || 'Ошибка регистрации';
      Alert.alert('Ошибка', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Регистрация</Text>
          <Text style={styles.subtitle}>Создайте аккаунт GlucoSense</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Имя</Text>
            <TextInput
              style={styles.input}
              placeholder="Введите ваше имя"
              placeholderTextColor="#64748b"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Фамилия</Text>
            <TextInput
              style={styles.input}
              placeholder="Введите вашу фамилию"
              placeholderTextColor="#64748b"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Пароль</Text>
            <TextInput
              style={styles.input}
              placeholder="Минимум 6 символов"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Дата рождения</Text>
            <Pressable
              onPress={() => {
                console.log('Date picker button pressed');
                setDatePickerVisibility(true);
              }}
              disabled={isLoading}
              style={[styles.input, styles.datePickerButton]}
            >
              <Text style={dateOfBirth ? styles.dateText : styles.datePlaceholder}>
                {dateOfBirth ? dateOfBirth.toLocaleDateString('ru-RU') : 'Выберите дату'}
              </Text>
            </Pressable>
            {/* DateTimePicker в Modal для iOS */}
            {isDatePickerVisible && Platform.OS === 'ios' && (
              <Modal
                transparent={true}
                animationType="slide"
                visible={isDatePickerVisible}
                onRequestClose={() => setDatePickerVisibility(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.datePickerContainer}>
                    <View style={styles.datePickerHeader}>
                      <Pressable onPress={() => setDatePickerVisibility(false)}>
                        <Text style={styles.datePickerHeaderButton}>Готово</Text>
                      </Pressable>
                    </View>
                    <DateTimePicker
                      value={dateOfBirth || new Date(2000, 0, 1)}
                      mode="date"
                      display="spinner"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          setDateOfBirth(selectedDate);
                        }
                      }}
                      maximumDate={new Date()}
                      minimumDate={new Date(1900, 0, 1)}
                      locale="ru-RU"
                      textColor="#ffffff"
                      themeVariant="dark"
                    />
                  </View>
                </View>
              </Modal>
            )}

            {/* DateTimePicker для Android */}
            {isDatePickerVisible && Platform.OS === 'android' && (
              <DateTimePicker
                value={dateOfBirth || new Date(2000, 0, 1)}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setDatePickerVisibility(false);
                  if (selectedDate) {
                    setDateOfBirth(selectedDate);
                  }
                }}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}
          </View>

          <Pressable
            onPress={handleRegister}
            style={({ pressed }) => [
              styles.button,
              isLoading && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Зарегистрироваться</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={styles.link}
            disabled={isLoading}
          >
            <Text style={styles.linkText}>
              Уже есть аккаунт? <Text style={styles.linkTextBold}>Войти</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020817',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  linkTextBold: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  datePickerButton: {
    justifyContent: 'center',
  },
  dateText: {
    color: '#ffffff',
    fontSize: 16,
  },
  datePlaceholder: {
    color: '#64748b',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  datePickerHeaderButton: {
    color: '#3b82f6',
    fontSize: 17,
    fontWeight: '600',
  },
});