#!/bin/bash

# Update HomeScreen.tsx
sed -i "7a import { useTranslation } from '../../i18n/useTranslation';" src/screens/main/HomeScreen.tsx
sed -i "s/const { user } = useAuth();/const { user } = useAuth();\n  const { t } = useTranslation();/" src/screens/main/HomeScreen.tsx
sed -i "s/if (value < 3.9) return { main: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', text: 'Past' };/if (value < 3.9) return { main: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', text: t('home.low') };/" src/screens/main/HomeScreen.tsx
sed -i "s/if (value > 7.0) return { main: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', text: 'Yuqori' };/if (value > 7.0) return { main: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', text: t('home.high') };/" src/screens/main/HomeScreen.tsx
sed -i "s/return { main: '#5eead4', bg: 'rgba(94, 234, 212, 0.15)', text: 'Normal holat' };/return { main: '#5eead4', bg: 'rgba(94, 234, 212, 0.15)', text: t('home.normal') };/" src/screens/main/HomeScreen.tsx
sed -i "s/Xayrli kech,/{t('home.greeting')},/" src/screens/main/HomeScreen.tsx
sed -i "s/'Azizbek'/'User'/" src/screens/main/HomeScreen.tsx
sed -i "s/Oldingi o'lchnash: 5 daqiqa oldin/{t('home.lastReading')}: 5 {t('login.seconds')}/" src/screens/main/HomeScreen.tsx
sed -i "s/So'nggi 24 soat/{t('history.today')}/" src/screens/main/HomeScreen.tsx
sed -i "s/Kiritish/{t('common.submit')}/" src/screens/main/HomeScreen.tsx
sed -i "s/Uglevod/{t('home.average')}/" src/screens/main/HomeScreen.tsx
sed -i "s/Qo'shlatish/{t('common.submit')}/" src/screens/main/HomeScreen.tsx

echo "HomeScreen.tsx updated!"
