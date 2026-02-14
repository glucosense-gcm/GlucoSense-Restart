# 🌍 Руководство по мультиязычности GlucoSense

## ✅ Что уже сделано

Система мультиязычности полностью настроена для поддержки 3 языков:
- 🇺🇿 O'zbekcha (Узбекский) - по умолчанию
- 🇷🇺 Русский
- 🇬🇧 English (Английский)

## 📦 Установленные пакеты

- `@reduxjs/toolkit` - для управления состоянием
- `react-redux` - для интеграции Redux с React

## 📁 Структура проекта

```
src/
├── i18n/
│   ├── locales/
│   │   ├── uz.ts          # Узбекские переводы
│   │   ├── ru.ts          # Русские переводы
│   │   ├── en.ts          # Английские переводы
│   │   └── index.ts
│   ├── useTranslation.ts  # Хук для переводов
│   └── README.md          # Детальная документация
├── store/
│   ├── index.ts           # Redux store
│   ├── languageSlice.ts   # Управление языком
│   └── hooks.ts
└── components/
    └── LanguageSwitcher.tsx # Готовый компонент
```

## 🚀 Быстрый старт

### 1. Использование в компонентах

```tsx
import { useTranslation } from '../i18n/useTranslation';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <Text>{t('common.continue')}</Text>
  );
}
```

### 2. Доступные переводы

Все переводы организованы по категориям:
- `common.*` - общие термины (continue, cancel, save и т.д.)
- `language.*` - экран выбора языка
- `login.*` - экран входа
- `register.*` - регистрация
- `home.*` - главный экран
- `history.*` - история
- `device.*` - устройства
- `settings.*` - настройки
- `qrScanner.*` - QR сканер
- `manualCode.*` - ввод кода
- `alerts.*` - уведомления

### 3. Примеры ключей

```tsx
t('common.continue')        // "Davom etish" / "Продолжить" / "Continue"
t('login.welcome')          // "Xush kelibsiz!" / "Добро пожаловать!" / "Welcome!"
t('settings.language')      // "Til" / "Язык" / "Language"
```

## 🔧 Обновленные экраны

Следующие экраны уже обновлены для использования переводов:
- ✅ LanguageScreen - экран выбора языка
- ✅ LoginScreen - экран входа
- ✅ SettingsScreen - настройки
- ✅ RootNavigator - автозагрузка языка

## ➕ Добавление новых переводов

### Шаг 1: Добавьте ключ в файлы локализации

**src/i18n/locales/uz.ts:**
```typescript
export default {
  // ... существующие переводы
  myFeature: {
    title: "Mening funksiyam",
    description: "Bu yangi funksiya",
  },
};
```

**src/i18n/locales/ru.ts:**
```typescript
export default {
  // ... существующие переводы
  myFeature: {
    title: "Моя функция",
    description: "Это новая функция",
  },
};
```

**src/i18n/locales/en.ts:**
```typescript
export default {
  // ... существующие переводы
  myFeature: {
    title: "My Feature",
    description: "This is a new feature",
  },
};
```

### Шаг 2: Используйте в компоненте

```tsx
import { useTranslation } from '../i18n/useTranslation';

function MyFeature() {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('myFeature.title')}</Text>
      <Text>{t('myFeature.description')}</Text>
    </View>
  );
}
```

## 🔄 Переключение языка

### Вариант 1: Использовать готовый компонент

```tsx
import LanguageSwitcher from '../components/LanguageSwitcher';

<LanguageSwitcher />
```

### Вариант 2: Создать свой переключатель

```tsx
import { useAppDispatch } from '../store/hooks';
import { changeLanguage } from '../store/languageSlice';

function MyLanguageSwitcher() {
  const dispatch = useAppDispatch();

  return (
    <Pressable onPress={() => dispatch(changeLanguage('ru'))}>
      <Text>Русский</Text>
    </Pressable>
  );
}
```

## 📝 Следующие шаги

Обновите остальные экраны для использования переводов:

1. **src/screens/auth/RegisterScreen.tsx**
   ```tsx
   import { useTranslation } from '../../i18n/useTranslation';
   const { t } = useTranslation();
   // Замените хардкод на t('register.title'), t('register.name') и т.д.
   ```

2. **src/screens/main/HomeScreen.tsx**
   ```tsx
   import { useTranslation } from '../../i18n/useTranslation';
   const { t } = useTranslation();
   // Используйте t('home.greeting'), t('home.currentGlucose') и т.д.
   ```

3. **src/screens/main/HistoryScreen.tsx**
   ```tsx
   import { useTranslation } from '../../i18n/useTranslation';
   const { t } = useTranslation();
   // Используйте t('history.title'), t('history.noData') и т.д.
   ```

4. **src/screens/main/DeviceScreen.tsx**
   ```tsx
   import { useTranslation } from '../../i18n/useTranslation';
   const { t } = useTranslation();
   // Используйте t('device.searching'), t('device.connect') и т.д.
   ```

5. **src/screens/main/QRScannerScreen.tsx**
   ```tsx
   import { useTranslation } from '../../i18n/useTranslation';
   const { t } = useTranslation();
   // Используйте t('qrScanner.title'), t('qrScanner.instruction') и т.д.
   ```

6. **src/screens/main/ManualCodeScreen.tsx**
   ```tsx
   import { useTranslation } from '../../i18n/useTranslation';
   const { t } = useTranslation();
   // Используйте t('manualCode.title'), t('manualCode.subtitle') и т.д.
   ```

## 🎯 Как работает система

1. **Выбор языка сохраняется** в AsyncStorage
2. **При запуске приложения** автоматически загружается сохраненный язык
3. **Все переводы** мгновенно обновляются при смене языка
4. **Redux управляет** текущим языком через единый store

## 📚 Дополнительная информация

Подробную документацию смотрите в файле:
- **src/i18n/README.md** - полное руководство по i18n системе

## ⚠️ Важно

- Всегда добавляйте переводы во **все 3 языка**
- Используйте **понятные ключи** (например, `login.welcome`, а не `text1`)
- **Не дублируйте** переводы - используйте общие из `common`
- **Тестируйте** на всех языках перед релизом

## 🆘 Помощь

Если у вас возникли вопросы:
1. Проверьте файлы примеров (LoginScreen, SettingsScreen)
2. Прочитайте src/i18n/README.md
3. Посмотрите на структуру файлов локализации

---

Приятной разработки! 🚀
