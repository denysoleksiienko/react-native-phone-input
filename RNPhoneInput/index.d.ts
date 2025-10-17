import type { TextInputProps, ViewStyle, TextStyle } from 'react-native';
import type { CountryCode, LanguageCode } from './constants/constants.d';

export interface PhoneInputProps {

  /** Custom down arrow icon component */
  downArrowIcon?: React.ReactNode;

  /** Custom container style */
  containerStyle?: ViewStyle;

  /** Default country code (default: 'BD') */
  defaultCountry?: CountryCode;

  /** Default phone number value */
  defaultValue?: string;

  /** Additional TextInput props */
  inputProps?: TextInputProps;

  /** Callback when text changes - returns clean digits only */
  onChangeText?: (text: string) => void;

  /** Callback when country is selected */
  onSelectCountryCode?: (data: {
    countryCode: CountryCode;
    callingCode: string;
  }) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Custom text input style */
  textInputStyle?: TextStyle;

  /** Placeholder text color */
  placeholderColor?: string;

  /** Custom country code text style */
  codeTextStyle?: TextStyle;

  /** Custom icon container style */
  iconContainerStyle?: ViewStyle;

  /** Enable dark mode */
  darkMode?: boolean;

  /** Additional search input props for country picker */
  searchInputProps?: TextInputProps;

  /** Enable phone number masking (default: true) */
  enableMask?: boolean;

  /** Language for country names: 'en', 'uk', 'ru' (default: 'en') */
  language?: LanguageCode;

  /** Validation rules for the field. These rules are used by `react-hook-form` to validate the input */
  rules?: Omit<
    RegisterOptions<FieldValue<TFieldValues>, Path<FieldValue<TFieldValues>>>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;

  /** Required if onFocus or onBlur is overrided */
  isFocused?: boolean;

  /** Disable input */
  disabled?: boolean;
}

export interface PhoneInputRef {
  /** Validates if the phone number is valid */
  isValidNumber: (text?: string) => boolean;

  /** Sets the default country programmatically */
  defaultCountry: (code: CountryCode) => void;

  /** Sets the default value programmatically */
  defaultValue: (text: string) => void;

  /** Changes text programmatically */
  onChangeText: (text: string) => void;

  /** Gets the current phone number (digits only) */
  getValue: () => string;

  /** Gets the formatted phone number with mask */
  getFormattedValue: () => string;

  /** Gets the full phone number with country code */
  getFullNumber: () => string;
}
