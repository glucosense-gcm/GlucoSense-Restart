# Система мультиязычности (i18n) с Redux

Эта система позволяет приложению поддерживать 3 языка: узбекский (uz), русский (ru) и английский (en).

## Структура файлов

```
src/
├── i18n/
│   ├── locales/
│   │   ├── uz.ts          # Узбекские переводы
│   │   ├── ru.ts          # Русские переводы
│   │   ├── en.ts          # Английские переводы
│   │   └── index.ts       # Экспорт всех переводов
│   ├── useTranslation.ts  # Хук для использования переводов
│   └── README.md
├── store/
│   ├── index.ts           # Redux store
│   ├── languageSlice.ts   # Слайс для управления языком
│   └── hooks.ts           # Типизированные хуки Redux
└── components/
    └── LanguageSwitcher.tsx # Компонент переключения языка
```

## Использование

### 1. Использование переводов в компонентах

```tsx
import { useTranslation } from '../i18n/useTranslation';

function MyComponent() {
  const { t, currentLanguage } = useTranslation();

  return (
    <View>
      <Text>{t('common.continue')}</Text>
      <Text>{t('login.welcome')}</Text>
      <Text>{t('settings.title')}</Text>
    </View>
  );
}
```

### 2. Переключение языка

```tsx
import { useAppDispatch } from '../store/hooks';
import { changeLanguage } from '../store/languageSlice';
import { Language } from '../i18n/locales';

function LanguageSelector() {
  const dispatch = useAppDispatch();

  const handleChangeLanguage = async (lang: Language) => {
    await dispatch(changeLanguage(lang));
  };

  return (
    <Button onPress={() => handleChangeLanguage('ru')}>
      Русский
    </Button>
  );
}
```

### 3. Получение текущего языка

```tsx
import { useTranslation } from '../i18n/useTranslation';

function MyComponent() {
  const { currentLanguage } = useTranslation();

  // currentLanguage будет 'uz' | 'ru' | 'en'
  console.log('Current language:', currentLanguage);
}
```

## Добавление новых переводов

### 1. Добавьте ключ во все файлы локализации

**uz.ts:**
```typescript
export default {
  mySection: {
    myKey: "O'zbek tilidagi matn",
  },
};
```

**ru.ts:**
```typescript
export default {
  mySection: {
    myKey: 'Текст на русском',
  },
};
```

**en.ts:**
```typescript
export default {
  mySection: {
    myKey: 'Text in English',
  },
};
```

### 2. Используйте новый ключ

```tsx
<Text>{t('mySection.myKey')}</Text>
```

## Структура ключей переводов

Переводы организованы по секциям:

- `common` - общие термины (кнопки, действия)
- `language` - экран выбора языка
- `login` - экран входа
- `register` - экран регистрации
- `home` - главный экран
- `history` - история
- `device` - устройства
- `settings` - настройки
- `qrScanner` - QR сканер
- `manualCode` - ввод кода вручную
- `alerts` - уведомления и сообщения

## Как работает система

1. **Redux Store** хранит текущий выбранный язык
2. **AsyncStorage** сохраняет выбор языка между сессиями
3. **useTranslation хук** предоставляет функцию `t()` для перевода
4. **languageSlice** управляет состоянием языка и синхронизацией с AsyncStorage

## Автоматическая загрузка языка

При запуске приложения в `RootNavigator.tsx`:

```tsx
useEffect(() => {
  dispatch(loadLanguage());
}, [dispatch]);
```

Это загружает сохраненный язык из AsyncStorage.

## Компонент LanguageSwitcher

Готовый компонент для переключения языка можно использовать в настройках:

```tsx
import LanguageSwitcher from '../components/LanguageSwitcher';

<LanguageSwitcher />
```

## Типобезопасность

Система полностью типизирована:
- `Language` тип для кодов языков ('uz' | 'ru' | 'en')
- `TranslationKeys` тип для всех ключей переводов
- TypeScript подсказывает доступные ключи при использовании `t()`

## Лучшие практики

1. **Всегда добавляйте переводы во все языки**
2. **Используйте понятные ключи** (например, `login.welcome` вместо `text1`)
3. **Группируйте переводы по экранам** для лучшей организации
4. **Не дублируйте переводы** - используйте общие ключи из `common`
5. **Проверяйте переводы** на всех языках после добавления

## Примеры использования

### Простой текст
```tsx
<Text>{t('common.continue')}</Text>
```

### Вложенные ключи
```tsx
<Text>{t('login.welcome')}</Text>
<Text>{t('settings.language')}</Text>
```

### Условный рендеринг
```tsx
{currentLanguage === 'uz' && <Text>Uzb content</Text>}
```

### Интерполяция (если нужно)
Для переменных в тексте, добавьте их в файлы переводов и обработайте вручную:

```typescript
// uz.ts
greeting: (name: string) => `Salom, ${name}!`

// Использование
const greeting = translations[currentLanguage].greeting('Azizbek');
```
