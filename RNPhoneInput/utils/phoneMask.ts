/**
 * Formats a phone number according to the mask pattern
 * @param value - The input phone number (digits only)
 * @param mask - The mask pattern (e.g., "XXX XXX XXX")
 * @returns Formatted phone number
 */
export const applyPhoneMask = (value: string, mask: string): string => {
  if (!value || !mask) return value;

  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  let formattedValue = '';
  let digitIndex = 0;

  for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
    if (mask[i] === 'X') {
      formattedValue += digits[digitIndex];
      // eslint-disable-next-line no-plusplus
      digitIndex++;
    } else {
      formattedValue += mask[i];
    }
  }

  return formattedValue;
};

/**
 * Removes mask formatting and returns only digits
 * @param value - Formatted phone number
 * @returns Clean phone number (digits only)
 */
export const removeMask = (value: string): string => value.replace(/\D/g, '');

/**
 * Gets the maximum length of digits for a mask
 * @param mask - The mask pattern
 * @returns Number of X characters in mask
 */
export const getMaskLength = (mask: string): number =>
  (mask.match(/X/g) || []).length;

/**
 * Validates if the input matches the expected length
 * @param value - Phone number value
 * @param mask - The mask pattern
 * @returns Boolean indicating if length is valid
 */
export const isValidLength = (value: string, mask: string): boolean => {
  const digits = removeMask(value);
  const expectedLength = getMaskLength(mask);
  return digits.length === expectedLength;
};
