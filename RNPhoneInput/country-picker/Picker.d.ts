import type { TextInputProps } from 'react-native';
import type { EachCountry, LanguageCode } from '../constants/constants.d';

export interface EachOptionProps {
  onSelect?: (item: EachCountry) => void;
  item: EachCountry;
  index: number;
  darkMode: boolean;
  closeModal: () => void;
  language: LanguageCode;
}

/**
 * props for the picker
 */
export interface PickerProps {
  /**
   * on select for the picker
   */
  onSelect: (value: EachCountry) => void;
  /**
   * dark mode for the picker
   */
  darkMode: boolean;
  /**
   * close modal for the picker
   */
  closeModal: () => void;
  /**
   * search input props for the picker
   */
  searchInputProps?: TextInputProps;
  /**
   * language for country list
   */
  language?: LanguageCode;
  /**
   * array of coutries for filtering country list
   */
  allowedCountries?: CountryCode[];
}

export interface PickerOpenRef {
  openModal: () => void;
}
