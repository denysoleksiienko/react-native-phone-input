import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import assets from './assets/assets';
import constants from './constants/constants';
import CountryPickerModal from './country-picker/CountryPickerModal';
import { type PickerOpenRef } from './country-picker/Picker.d';
import styles from './styles';
import { applyPhoneMask, removeMask, isValidLength } from './utils/phoneMask';
import type {
  CountryCode,
  EachCountry,
  LanguageCode,
} from './constants/constants.d';
import type { PhoneInputProps, PhoneInputRef } from './index.d';

const RNPhoneInput = forwardRef<PhoneInputRef, PhoneInputProps>(
  (
    {
      downArrowIcon,
      containerStyle,
      defaultCountry = 'BD',
      defaultValue = '',
      inputProps,
      onChangeText,
      onSelectCountryCode,
      placeholder,
      textInputStyle,
      placeholderColor,
      codeTextStyle,
      iconContainerStyle,
      darkMode = false,
      searchInputProps,
      enableMask = true,
      language = 'en',
      allowedCountries,
    },
    ref,
  ) => {
    // Memoize initial country to prevent unnecessary re-creation
    const initialCountry = useMemo(
      () => constants[defaultCountry],
      [defaultCountry],
    );

    const [country, setCountry] = useState<EachCountry>(initialCountry);
    const [value, setValue] = useState<string>(defaultValue);
    const [displayValue, setDisplayValue] = useState<string>(
      enableMask && defaultValue
        ? applyPhoneMask(defaultValue, initialCountry.mask)
        : defaultValue,
    );

    const openModalRef = useRef<PickerOpenRef>(null);
    const inputRef = useRef<TextInput>(null);

    // Memoize styles to prevent recreation on every render
    const componentStyles = useMemo(() => styles(darkMode), [darkMode]);

    // Memoize arrow icon to prevent recreation
    const arrowIcon = useMemo(() => {
      if (downArrowIcon) return downArrowIcon;

      return (
        <Image
          height={10}
          resizeMode="contain"
          source={{
            uri: darkMode
              ? assets.downArrowDefaultIcon
              : assets.downArrowDarkIcon,
          }}
          width={10}
        />
      );
    }, [downArrowIcon, darkMode]);

    // Memoize regex pattern to avoid recreation
    const validationRegex = useMemo(
      () => new RegExp(country.regex),
      [country.regex],
    );

    // Get dynamic placeholder
    const dynamicPlaceholder = useMemo(
      () => placeholder || country.placeholder || 'Phone Number',
      [placeholder, country.placeholder],
    );

    const openBottomSheet = useCallback(() => {
      openModalRef.current?.openModal();
    }, []);

    const handleCountrySelect = useCallback(
      (item: EachCountry) => {
        setCountry(item);

        // When country changes, recalculate full number with new dial code
        if (value) {
          onChangeText?.(item.callingCode + value);
        }

        onSelectCountryCode?.({
          countryCode: item.countryCode,
          callingCode: item.callingCode,
        });
      },
      [onSelectCountryCode, onChangeText, value],
    );

    const handleChangeText = useCallback(
      (text: string) => {
        if (enableMask) {
          // Remove all non-digits
          const cleanValue = removeMask(text);

          // Apply mask
          const formatted = applyPhoneMask(cleanValue, country.mask);

          setDisplayValue(formatted);
          setValue(cleanValue);
          // Return full number with dial code but without +
          onChangeText?.(country.callingCode + cleanValue);
        } else {
          const cleanValue = text.replace(/\D/g, '');
          setValue(cleanValue);
          setDisplayValue(text);
          // Return full number with dial code but without +
          onChangeText?.(country.callingCode + cleanValue);
        }
      },
      [onChangeText, enableMask, country.mask, country.callingCode],
    );

    // Memoize imperative handle methods
    const imperativeHandleMethods = useMemo(
      () => ({
        isValidNumber: (text?: string): boolean => {
          const phoneValue = text ?? value;
          if (!phoneValue?.length) return false;

          if (enableMask) {
            return isValidLength(phoneValue, country.mask);
          }

          const fullNumber = country.callingCode + phoneValue;
          return validationRegex.test(fullNumber);
        },

        defaultCountry: (code: CountryCode): void => {
          const newCountry = constants[code];
          if (newCountry) {
            setCountry(newCountry);
            // Recalculate full number with new dial code if value exists
            if (value) {
              onChangeText?.(newCountry.callingCode + value);
            }
          }
        },

        defaultValue: (text: string): void => {
          const cleanValue = enableMask
            ? removeMask(text)
            : text.replace(/\D/g, '');
          const display = enableMask
            ? applyPhoneMask(cleanValue, country.mask)
            : text;

          setValue(cleanValue);
          setDisplayValue(display);
          inputRef.current?.setNativeProps({ text: display });
          // Update with full number
          onChangeText?.(country.callingCode + cleanValue);
        },

        onChangeText: (text: string): void => {
          const cleanValue = enableMask
            ? removeMask(text)
            : text.replace(/\D/g, '');
          const display = enableMask
            ? applyPhoneMask(cleanValue, country.mask)
            : text;

          setValue(cleanValue);
          setDisplayValue(display);
          inputRef.current?.setNativeProps({ text: display });
          // Update with full number
          onChangeText?.(country.callingCode + cleanValue);
        },

        getValue: (): string => value,

        getFormattedValue: (): string => displayValue,

        getFullNumber: (): string => country.callingCode + value,

        getFullNumberWithPlus: (): string => `+${country.callingCode}${value}`,
      }),
      [
        country.callingCode,
        country.mask,
        validationRegex,
        value,
        displayValue,
        enableMask,
        onChangeText,
      ],
    );

    useImperativeHandle(ref, () => imperativeHandleMethods, [
      imperativeHandleMethods,
    ]);

    useEffect(() => {
      if (defaultValue) {
        const digits = defaultValue.replace(/\D/g, '');
        const found = Object.values(constants).find((c) =>
          digits.startsWith(c.callingCode),
        );

        if (found) {
          setCountry(found);
          const clean = digits.slice(found.callingCode.length);
          const display = enableMask
            ? applyPhoneMask(clean, found.mask)
            : clean;
          handleChangeText(clean);
          setDisplayValue(display);
        }
      }
    }, [defaultValue, enableMask, handleChangeText]);

    return (
      <>
        <View style={[componentStyles.container, containerStyle]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openBottomSheet}
            style={[componentStyles.flexRow, iconContainerStyle]}
          >
            <Text style={componentStyles.ft28}>{country.icon}</Text>
            {arrowIcon}
          </TouchableOpacity>

          <View style={[componentStyles.flexRow, componentStyles.gap10]}>
            <Text style={[componentStyles.ft16, codeTextStyle]}>
              +{country.callingCode}
            </Text>
            <TextInput
              ref={inputRef}
              keyboardType="phone-pad"
              maxLength={enableMask ? country.mask.length : undefined}
              numberOfLines={1}
              onChangeText={handleChangeText}
              placeholder={dynamicPlaceholder}
              placeholderTextColor={placeholderColor}
              style={[
                componentStyles.width75,
                componentStyles.ft16,
                textInputStyle,
              ]}
              value={displayValue}
              {...inputProps}
            />
          </View>
        </View>

        <CountryPickerModal
          ref={openModalRef}
          allowedCountries={allowedCountries}
          darkMode={darkMode}
          language={language}
          onSelect={handleCountrySelect}
          searchInputProps={searchInputProps}
        />
      </>
    );
  },
);

// Add display name for debugging
RNPhoneInput.displayName = 'RNPhoneInput';

export type { CountryCode, LanguageCode, PhoneInputProps, PhoneInputRef };
export default RNPhoneInput;
