import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable,
    Alert,
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Modal,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCredentials, logoutUser } from '../store/slices/authSlice';
import { useUpdateProfileMutation } from '../store/services/authService';

export default function ProfileCompletionScreen() {
    const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date(2000, 0, 1)); // Default: Jan 1, 2000
    const [tempDate, setTempDate] = useState<Date>(new Date(2000, 0, 1));
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const token = useAppSelector((state) => state.auth.token);

    const handleComplete = async () => {
        try {
            const result = await updateProfile({
                dateOfBirth: dateOfBirth.toISOString(),
            }).unwrap();

            if (token) {
                dispatch(setCredentials({
                    token,
                    user: result.data.user,
                }));
            }

            Alert.alert('Успешно!', 'Профиль обновлен');
        } catch (error: any) {
            console.error('Profile update error:', error);

            if (error?.status === 404 || error?.data?.error === 'NotFoundError') {
                Alert.alert(
                    'Пользователь не найден',
                    'Ваш аккаунт был удален. Вы будете перенаправлены на экран входа.',
                    [
                        {
                            text: 'OK',
                            onPress: () => dispatch(logoutUser())
                        }
                    ]
                );
                return;
            }

            const errorMessage = error?.data?.message || error?.message || 'Ошибка обновления профиля';
            Alert.alert('Ошибка', errorMessage);
        }
    };

    const handleSkip = () => {
        Alert.alert(
            'Пропустить?',
            'Вы сможете обновить дату рождения позже в настройках профиля',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Пропустить',
                    onPress: () => {
                        // Will navigate to main app via navigation logic
                    }
                },
            ]
        );
    };

    const openDatePicker = () => {
        setTempDate(dateOfBirth);
        setDatePickerVisibility(true);
    };

    const confirmDate = () => {
        setDateOfBirth(tempDate);
        setDatePickerVisibility(false);
    };

    const cancelDatePicker = () => {
        setTempDate(dateOfBirth);
        setDatePickerVisibility(false);
    };

    const handleAndroidDateChange = (event: any, selectedDate?: Date) => {
        setDatePickerVisibility(false);
        if (event.type === 'set' && selectedDate) {
            setDateOfBirth(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="person-circle-outline" size={64} color="#3b82f6" />
                    </View>
                    <Text style={styles.title}>Завершите ваш профиль</Text>
                    <Text style={styles.subtitle}>
                        Привет, {user?.firstName}! 👋{'\n'}
                        Пожалуйста, укажите вашу реальную дату рождения для лучшего опыта использования приложения
                    </Text>
                </View>

                {/* Date Picker Button */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Дата рождения</Text>
                    <Pressable
                        onPress={openDatePicker}
                        disabled={isLoading}
                        style={({ pressed }) => [
                            styles.datePickerButton,
                            pressed && styles.datePickerPressed,
                        ]}
                    >
                        <Ionicons name="calendar-outline" size={24} color="#3b82f6" />
                        <Text className='text-white' style={styles.dateText}>
                            {dayjs(dateOfBirth).locale('ru').format('DD.MM.YYYY')}
                        </Text>
                    </Pressable>
                </View>

                {/* Buttons */}
                <View style={styles.buttonSection}>
                    <Pressable
                        className='bg-blue-500 px-4 py-4 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-blue-500/30 elevation-5'
                        onPress={handleComplete}
                        disabled={isLoading}
                        style={({ pressed }) => [
                            styles.completeButton,
                            isLoading && styles.buttonDisabled,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <>
                                <Text style={styles.completeButtonText}>Завершить</Text>
                                <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
                            </>
                        )}
                    </Pressable>

                    <Pressable
                        onPress={handleSkip}
                        disabled={isLoading}
                        style={styles.skipButton}
                    >
                        <Text style={styles.skipButtonText}>Пропустить</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            Alert.alert(
                                'Выход',
                                'Вы уверены, что хотите выйти?',
                                [
                                    { text: 'Отмена', style: 'cancel' },
                                    {
                                        text: 'Выйти',
                                        style: 'destructive',
                                        onPress: () => dispatch(logoutUser())
                                    },
                                ]
                            );
                        }}
                        disabled={isLoading}
                        style={styles.logoutButton}
                    >
                        <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                        <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
                    </Pressable>
                </View>
            </View>

            {/* DateTimePicker inside Modal for iOS - Wheel/Spinner style */}
            {Platform.OS === 'ios' && isDatePickerVisible && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={isDatePickerVisible}
                    onRequestClose={cancelDatePicker}
                >
                    <Pressable style={styles.modalOverlay} onPress={cancelDatePicker}>
                        <Pressable style={styles.datePickerContainer} onPress={(e) => e.stopPropagation()}>
                            {/* Header with buttons */}
                            <View style={styles.datePickerHeader}>
                                <Pressable onPress={cancelDatePicker}>
                                    <Text style={styles.cancelButton}>Отмена</Text>
                                </Pressable>
                                <Text style={styles.datePickerTitle}>Дата рождения</Text>
                                <Pressable onPress={confirmDate}>
                                    <Text style={styles.confirmButton}>Готово</Text>
                                </Pressable>
                            </View>

                            {/* Native Wheel DatePicker */}
                            <View style={{ height: 220, backgroundColor: '#1e293b', justifyContent: 'center' }}>
                                <DateTimePicker
                                    value={tempDate}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            setTempDate(selectedDate);
                                        }
                                    }}
                                    maximumDate={new Date()}
                                    minimumDate={new Date(1900, 0, 1)}
                                    locale="ru-RU"
                                    textColor="#ffffff"
                                    themeVariant="dark"
                                    style={{ height: 220 }}
                                />
                            </View>
                        </Pressable>
                    </Pressable>
                </Modal>
            )}

            {/* DateTimePicker for Android - Native Dialog */}
            {Platform.OS === 'android' && isDatePickerVisible && (
                <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={handleAndroidDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020817',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: (StatusBar.currentHeight || 40) + 20,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: '#cbd5e1',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
    },
    formSection: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },
    label: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        letterSpacing: 0.3,
    },
    datePickerButton: {
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        minHeight: 56,
    },
    datePickerPressed: {
        backgroundColor: '#1e293b',
        borderColor: '#3b82f6',
        transform: [{ scale: 0.98 }],
    },
    dateText: {
        color: '#ffffff',
        fontSize: 16,
        flex: 1,
        fontWeight: '500',
    },
    buttonSection: {
        paddingBottom: 32,
        gap: 12,
    },
    completeButton: {
        backgroundColor: '#3b82f6',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
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
    completeButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    skipButton: {
        padding: 12,
        alignItems: 'center',
    },
    skipButtonText: {
        color: '#94a3b8',
        fontSize: 14,
    },
    logoutButton: {
        padding: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: '#1e293b',
        marginTop: 4,
        paddingTop: 16,
    },
    logoutButtonText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    datePickerContainer: {
        backgroundColor: '#1e293b',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        paddingBottom: 40,
        borderWidth: 1,
        borderColor: '#334155',
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
        backgroundColor: '#0f172a',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    datePickerTitle: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '600',
    },
    cancelButton: {
        color: '#94a3b8',
        fontSize: 17,
        fontWeight: '400',
    },
    confirmButton: {
        color: '#3b82f6',
        fontSize: 17,
        fontWeight: '600',
    },
});