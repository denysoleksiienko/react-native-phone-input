Компонент для введення телефонних номерів з автоматичним форматуванням (маскуванням) та підтримкою мультимовності.

## ✨ Особливості

- ✅ **Автоматичне форматування** номерів для 190+ країн
- 🌍 **Мультимовність**: Англійська, Українська
- 🎭 **Маски для кожної країни** (наприклад: `(XXX) XXX-XXXX` для США)
- 🔍 **Розумний пошук** країн на всіх мовах
- 🌙 **Dark mode**
- ⚡ **Оптимізована продуктивність** з мемоїзацією
- 📱 **190+ країн** з прапорами та кодами

## 📦 Встановлення
```bash
# Скопіюйте файли у ваш проєкт:
# - RNPhoneInput/
#   - index.tsx
#   - constants/constants.ts
#   - constants/constants.d.ts
#   - utils/phoneMask.ts
#   - country-picker/Picker.tsx
#   - country-picker/Picker.d.ts
#   - country-picker/CountryPickerModal.tsx
```

## 🚀 Використання

### Базовий приклад
```tsx
import RNPhoneInput from './RNPhoneInput';

function App() {
  return (
    <RNPhoneInput
      defaultCountry="UA"
      onChangeText={(value) => console.log(value)}
      language="uk"
    />
  );
}
```

### З маскою та валідацією
```tsx
import { useRef } from 'react';
import RNPhoneInput, { PhoneInputRef } from './RNPhoneInput';

function App() {
  const phoneRef = useRef<PhoneInputRef>(null);

  const handleSubmit = () => {
    const isValid = phoneRef.current?.isValidNumber();
    const fullNumber = phoneRef.current?.getFullNumber(); // "380501234567"
    const fullNumberWithPlus = phoneRef.current?.getFullNumberWithPlus(); // "+380501234567"
    
    if (isValid) {
      console.log('Valid number:', fullNumber);
    }
  };

  return (
    <RNPhoneInput
      ref={phoneRef}
      defaultCountry="UA"
      enableMask={true}
      language="uk"
      onChangeText={(fullNumberNoPlus) => {
        // fullNumberNoPlus = "380501234567" (dial code + number)
        console.log('Full number:', fullNumberNoPlus);
      }}
    />
  );
}
```

### З фільтрацією країн
```tsx
// Показати тільки вибрані країни
const allowedCountries = ['UA', 'PL', 'US', 'GB', 'DE'];

return (
  <RNPhoneInput
    defaultCountry="UA"
    language="uk"
    allowedCountries={allowedCountries}
  />
);

// Тільки Європейські країни
const europeanCountries = ['DE', 'FR', 'IT', 'ES', 'GB', 'PL', 'UA'];

// Тільки Північна Америка
const northAmerica = ['US', 'CA', 'MX'];
```
```tsx
const [language, setLanguage] = useState<'en' | 'uk'>('en');

return (
  <>
    <Button title="English" onPress={() => setLanguage('en')} />
    <Button title="Українська" onPress={() => setLanguage('uk')} />
    
    <RNPhoneInput
      defaultCountry="UA"
      language={language}
    />
  </>
);
```

## 📖 Props

| Prop | Type | Default | Опис |
|------|------|---------|------|
| `defaultCountry` | `CountryCode` | `'BD'` | Код країни за замовчуванням |
| `defaultValue` | `string` | `''` | Початкове значення номера |
| `language` | `'en' \| 'uk' ` | `'en'` | Мова інтерфейсу |
| `enableMask` | `boolean` | `true` | Увімкнути форматування |
| `allowedCountries` | `CountryCode[]` | `undefined` | Фільтр країн (якщо не вказано - всі 190+ країн) |
| `darkMode` | `boolean` | `false` | Темна тема |
| `onChangeText` | `(text: string) => void` | - | Callback з повним номером (без +): "380501234567" |
| `onSelectCountryCode` | `(data) => void` | - | Callback вибору країни |
| `placeholder` | `string` | auto | Текст placeholder |
| `containerStyle` | `ViewStyle` | - | Стиль контейнера |
| `textInputStyle` | `TextStyle` | - | Стиль input |
| `placeholderColor` | `string` | - | Колір placeholder |
| `inputProps` | `TextInputProps` | - | Додаткові props для TextInput |

## 🔧 Ref Methods
```tsx
const phoneRef = useRef<PhoneInputRef>(null);

// Валідація номера
const isValid = phoneRef.current?.isValidNumber(); // boolean

// Отримати значення
const cleanValue = phoneRef.current?.getValue(); // "501234567" (тільки номер)
const formatted = phoneRef.current?.getFormattedValue(); // "50 123 45 67" (з маскою)
const fullNumber = phoneRef.current?.getFullNumber(); // "380501234567" (без +)
const fullNumberPlus = phoneRef.current?.getFullNumberWithPlus(); // "+380501234567" (з +)

// Встановити значення програмно
phoneRef.current?.defaultValue('501234567');

// Змінити країну
phoneRef.current?.defaultCountry('US');
```

## 🌍 Підтримувані країни

190+ країн включно з:

- 🇺🇦 Ukraine: `XX XXX XX XX` → `50 123 45 67`
- 🇺🇸 USA: `(XXX) XXX-XXXX` → `(555) 123-4567`
- 🇬🇧 UK: `XXXX XXX XXXX` → `7400 123456`
- 🇵🇱 Poland: `XXX XXX XXX` → `512 345 678`
- 🇩🇪 Germany: `XXX XXXXXXX` → `151 12345678`
- 🇫🇷 France: `X XX XX XX XX` → `6 12 34 56 78`
- 🇨🇳 China: `XXX XXXX XXXX` → `131 2345 6789`
- 🇯🇵 Japan: `XX-XXXX-XXXX` → `90-1234-5678`
- і багато інших...

## 📝 Приклади масок
```typescript
// США
mask: '(XXX) XXX-XXXX'
placeholder: '(555) 123-4567'

// Україна
mask: 'XX XXX XX XX'
placeholder: '50 123 45 67'

// Бразилія
mask: '(XX) XXXXX-XXXX'
placeholder: '(11) 91234-5678'

// Німеччина
mask: 'XXX XXXXXXX'
placeholder: '151 12345678'
```

## 🎨 Кастомізація

### Dark Mode
```tsx
<RNPhoneInput
  darkMode={true}
  containerStyle={{
    backgroundColor: '#2C2C2E',
    borderColor: '#DDDDDE',
  }}
  textInputStyle={{
    color: '#FFFFFF',
  }}
  placeholderColor="#888888"
/>
```

### Власні іконки
```tsx
<RNPhoneInput
  downArrowIcon={<CustomArrowIcon />}
  iconContainerStyle={{
    paddingHorizontal: 10,
  }}
/>
```

## ⚙️ Додавання нової країни
```typescript
// constants/constants.ts
export const constants: Constant = {
  // ... інші країни
  XX: {
    icon: '🏁',
    countryCode: 'XX',
    countryName: {
      en: 'Example Country',
      uk: 'Приклад країни',
    },
    callingCode: '123',
    regex: '^(\\+123|123)?[0-9]\\d{8}$',
    mask: 'XXX XXX XXX',
    placeholder: '123 456 789',
  },
};
```

## 🔍 Пошук країн

Пошук працює на всіх мовах одночасно:
- 🔤 За назвою країни (англійською, українською)
- #️⃣ За кодом країни (UA, US, GB)
- 📞 За кодом виклику (+380, +1, +44)

## 💡 Поради

1. **Валідація**: Використовуйте `isValidNumber()` перед відправкою форми
2. **Зберігання**: Зберігайте `getFullNumber()` (без +) або `getFullNumberWithPlus()` (з +) в БД
3. **Відображення**: Використовуйте `getFormattedValue()` для UI
4. **Локалізація**: Змінюйте `language` динамічно на основі налаштувань користувача
5. **onChangeText**: Повертає повний номер з кодом країни без + (наприклад, "380501234567")
6. **Фільтрація країн**: Використовуйте `allowedCountries` для обмеження списку країн (покращує UX)

## 🎯 Приклади фільтрації
```tsx
// Тільки СНД країни
const cis = ['UA', 'KZ', 'UZ', 'AM', 'AZ', 'GE', 'MD', 'TJ', 'KG'];

// Тільки ЄС країни
const eu = ['DE', 'FR', 'IT', 'ES', 'PL', 'NL', 'BE', 'AT', 'SE', 'DK'];

// Основні світові ринки
const major = ['US', 'CN', 'JP', 'DE', 'GB', 'FR', 'IN', 'BR'];

<RNPhoneInput
  defaultCountry="UA"
  allowedCountries={cis}
/>
```

## 🐛 Troubleshooting

**Маска не застосовується:**
- Перевірте що `enableMask={true}`
- Переконайтесь що маска існує для вибраної країни

**Пошук не працює:**
- Переконайтесь що всі країни мають локалізовані назви
- Перевірте що searchInputProps не блокує введення

**Продуктивність:**
- Компонент оптимізований з `memo`, `useMemo`, `useCallback`
- Для великих списків використовується `FlatList` з `windowSize`
