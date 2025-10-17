import React, { useState, useCallback, useMemo, memo, useRef } from 'react';
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ListRenderItem,
} from 'react-native';
import assets from '../assets/assets';
import constants from '../constants/constants';
import { customBorder, usePickerStyles } from './styles/picker.style';
import type { EachOptionProps, PickerProps } from './Picker.d';
import type { EachCountry } from '../constants/constants.d';

// Memoized country option component to prevent unnecessary re-renders
const EachOption = memo<EachOptionProps>(
  ({ onSelect, item, index, darkMode, closeModal, language }) => {
    const styles = usePickerStyles(darkMode);
    const borderStyle = useMemo(
      () => customBorder(index, darkMode).border,
      [index, darkMode],
    );

    const handlePress = useCallback(() => {
      onSelect?.(item);
      closeModal();
    }, [onSelect, item, closeModal]);

    // Get localized country name
    const countryName =
      item?.countryName?.[language] || item?.countryName?.en || '';

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        style={[styles.eachContainer, borderStyle]}
      >
        <Text style={styles.eachTextContainer}>
          <Text style={styles.eachText}>{item?.icon}</Text>
          {'  '}
          {countryName}
          {'  '}+{item?.callingCode}
        </Text>
      </TouchableOpacity>
    );
  },
);

EachOption.displayName = 'EachOption';

const Picker: React.FC<PickerProps> = memo(
  ({
    onSelect,
    darkMode,
    closeModal,
    searchInputProps,
    language = 'en',
    allowedCountries,
  }) => {
    // Memoize initial country list to prevent recreation
    const allCountries = useMemo(() => {
      const countries = Object.values(constants);

      // Filter countries if allowedCountries is provided
      if (allowedCountries && allowedCountries.length > 0) {
        return countries.filter((country) =>
          allowedCountries.includes(country.countryCode),
        );
      }

      return countries;
    }, [allowedCountries]);

    const [filteredCountries, setFilteredCountries] =
      useState<EachCountry[]>(allCountries);
    const [searchText, setSearchText] = useState('');
    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    // Get styles first
    const styles = usePickerStyles(darkMode);

    // Memoize styles to prevent recreation on every render
    const memoizedStyles = useMemo(() => styles, [styles]);

    // Optimized search functionality with debouncing
    const handleSearch = useCallback(
      (text: string) => {
        setSearchText(text);

        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
          if (!text.trim()) {
            setFilteredCountries(allCountries);
            return;
          }

          const searchTerm = text.toLowerCase().trim();
          const filtered = allCountries.filter((country) => {
            // Search in all language versions
            const countryNameEn = country.countryName?.en?.toLowerCase() || '';
            const countryNameUk = country.countryName?.uk?.toLowerCase() || '';
            const countryNameRu = country.countryName?.ru?.toLowerCase() || '';
            const callingCode = country.callingCode?.toString() || '';

            return (
              countryNameEn.includes(searchTerm) ||
              countryNameUk.includes(searchTerm) ||
              countryNameRu.includes(searchTerm) ||
              callingCode.includes(searchTerm) ||
              country.countryCode?.toLowerCase().includes(searchTerm)
            );
          });

          setFilteredCountries(filtered);
        }, 300); // 300ms debounce
      },
      [allCountries],
    );

    // Memoized close icon to prevent recreation
    const closeIcon = useMemo(
      () => (
        <Image
          height={12}
          resizeMode="contain"
          source={{
            uri: darkMode ? assets.closeDarkIcon : assets.closeDefaultIcon,
          }}
          width={12}
        />
      ),
      [darkMode],
    );

    // Memoized render item function for FlatList
    const renderCountryItem: ListRenderItem<EachCountry> = useCallback(
      ({ item, index }) => (
        <EachOption
          closeModal={closeModal}
          darkMode={darkMode}
          index={index}
          item={item}
          language={language}
          onSelect={onSelect}
        />
      ),
      [onSelect, darkMode, closeModal, language],
    );

    // Memoized key extractor
    const keyExtractor = useCallback(
      (item: EachCountry) => item.countryCode,
      [],
    );

    // Get localized placeholder text
    const searchPlaceholder = useMemo(() => {
      const placeholders = {
        en: 'Search Country',
        uk: 'Пошук країни',
      };
      return placeholders[language] || placeholders.en;
    }, [language]);

    // Memoized empty component for better UX
    const EmptyComponent = useMemo(() => {
      const emptyText = {
        en: `No countries found for "${searchText}"`,
        uk: `Не знайдено країн для "${searchText}"`,
      };
      return (
        <View style={memoizedStyles.emptyContainer}>
          <Text style={memoizedStyles.emptyText}>
            {emptyText[language] || emptyText.en}
          </Text>
        </View>
      );
    }, [
      memoizedStyles.emptyContainer,
      memoizedStyles.emptyText,
      searchText,
      language,
    ]);

    // Memoized getItemLayout for better FlatList performance
    const getItemLayout = useCallback(
      (data: ArrayLike<EachCountry> | null | undefined, index: number) => ({
        length: 60,
        offset: 60 * index,
        index,
      }),
      [],
    );

    return (
      <View style={memoizedStyles.bgWhite}>
        <View style={memoizedStyles.flexRow}>
          <TouchableOpacity
            accessibilityLabel="Close country picker"
            accessibilityRole="button"
            onPress={closeModal}
            style={memoizedStyles.iconButton}
          >
            {closeIcon}
          </TouchableOpacity>

          <TextInput
            accessibilityLabel="Search countries"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            maxLength={50}
            onChangeText={handleSearch}
            placeholder={searchPlaceholder}
            placeholderTextColor={darkMode ? '#FFFFFF' : '#000000'}
            returnKeyType="search"
            style={memoizedStyles.searchInput}
            value={searchText}
            {...searchInputProps}
          />
        </View>

        <FlatList
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={memoizedStyles.flatListContainer}
          data={filteredCountries}
          getItemLayout={getItemLayout}
          initialNumToRender={15}
          keyboardShouldPersistTaps="always"
          keyExtractor={keyExtractor}
          ListEmptyComponent={EmptyComponent}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
          maxToRenderPerBatch={10}
          removeClippedSubviews
          renderItem={renderCountryItem}
          showsVerticalScrollIndicator={false}
          updateCellsBatchingPeriod={50}
          windowSize={10}
        />
      </View>
    );
  },
);

Picker.displayName = 'Picker';

export default Picker;
