import { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { NUIStatusBar } from '@cashalot-app/native-ui-lib';
import {
  Modal,
  SafeAreaView,
  StatusBar,
  TextInputProps,
  Platform,
} from 'react-native';
import {
  type EachCountry,
  type LanguageCode,
  type CountryCode,
} from '../constants/constants.d';
import Picker from './Picker';
import { type PickerOpenRef } from './Picker.d';
import { countryPickerStyles } from './styles/picker.style';

interface Props {
  darkMode: boolean;
  onSelect: (value: EachCountry) => void;
  searchInputProps?: TextInputProps;
  language?: LanguageCode;
  allowedCountries?: CountryCode[];
}

const CountryPickerModal = forwardRef<PickerOpenRef, Props>(
  (
    { darkMode, onSelect, searchInputProps, language = 'en', allowedCountries },
    ref,
  ) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const openModal = useCallback(() => {
      setIsModalVisible(true);
    }, []);

    const closeModal = useCallback(() => {
      setIsModalVisible(false);
    }, []);

    const handleCountrySelect = useCallback(
      (country: EachCountry) => {
        onSelect(country);
        closeModal();
      },
      [onSelect, closeModal],
    );

    useImperativeHandle(
      ref,
      () => ({
        openModal,
      }),
      [openModal],
    );

    return (
      <>
        <StatusBar
          backgroundColor={darkMode ? '#000000' : '#FFFFFF'}
          barStyle={darkMode ? 'light-content' : 'light-content'}
        />
        <NUIStatusBar />
        <Modal
          animationType="slide"
          onRequestClose={closeModal}
          presentationStyle="formSheet"
          statusBarTranslucent={Platform.OS === 'android'}
          transparent={false}
          visible={isModalVisible}
        >
          <SafeAreaView
            style={[countryPickerStyles.flex, countryPickerStyles.mb40]}
          >
            <Picker
              allowedCountries={allowedCountries}
              closeModal={closeModal}
              darkMode={darkMode}
              language={language}
              onSelect={handleCountrySelect}
              searchInputProps={searchInputProps}
            />
          </SafeAreaView>
        </Modal>
      </>
    );
  },
);

CountryPickerModal.displayName = 'CountryPickerModal';

export default CountryPickerModal;
