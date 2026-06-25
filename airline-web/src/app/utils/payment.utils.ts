export type CardBrand = 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Card';

export function detectCardBrand(cardNumber: string): CardBrand {
  const digits = cardNumber.replace(/\D/g, '');

  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  if (/^6(?:011|5)/.test(digits)) return 'Discover';

  return 'Card';
}

export function cardBrandLogoPath(brand: string): string | null {
  switch (brand) {
    case 'Visa':
      return '/images/cards/visa.svg';
    case 'Mastercard':
      return '/images/cards/mastercard.svg';
    case 'Amex':
      return '/images/cards/amex.svg';
    case 'Discover':
      return '/images/cards/discover.svg';
    case 'PayPal':
      return '/images/cards/paypal.svg';
    default:
      return null;
  }
}

export function cardDigits(cardNumber: string): string {
  return cardNumber.replace(/\D/g, '');
}

export function luhnCheck(cardNumber: string): boolean {
  const digits = cardDigits(cardNumber);
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alternate = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

export function isValidCardLength(cardNumber: string): boolean {
  const digits = cardDigits(cardNumber);
  const brand = detectCardBrand(digits);

  if (brand === 'Amex') {
    return digits.length === 15;
  }

  return digits.length >= 13 && digits.length <= 19;
}

export type CardValidationError = 'required' | 'invalidFormat' | 'invalidLength' | 'invalidChecksum';

export function getCardValidationError(cardNumber: string): CardValidationError | null {
  const digits = cardDigits(cardNumber);

  if (!digits) {
    return 'required';
  }

  if (!/^\d+$/.test(digits)) {
    return 'invalidFormat';
  }

  if (!isValidCardLength(cardNumber)) {
    return 'invalidLength';
  }

  if (!luhnCheck(cardNumber)) {
    return 'invalidChecksum';
  }

  return null;
}

export function cardValidationMessage(error: CardValidationError | null): string {
  switch (error) {
    case 'required':
      return 'Card number is required.';
    case 'invalidFormat':
      return 'Card number must contain digits only.';
    case 'invalidLength':
      return 'Enter a valid card length (16 digits for Visa/Mastercard, 15 for Amex).';
    case 'invalidChecksum':
      return 'This card number is not valid. Please check the digits and try again.';
    default:
      return '';
  }
}

export function getCvvValidationError(cvv: string, cardNumber: string): 'required' | 'invalid' | null {
  const trimmed = cvv.trim();
  if (!trimmed) return 'required';

  const brand = detectCardBrand(cardNumber);
  const pattern = brand === 'Amex' ? /^\d{4}$/ : /^\d{3}$/;

  return pattern.test(trimmed) ? null : 'invalid';
}

export function cvvValidationMessage(error: 'required' | 'invalid' | null, cardNumber: string): string {
  if (error === 'required') return 'CVV is required.';
  if (error === 'invalid') {
    return detectCardBrand(cardNumber) === 'Amex'
      ? 'Enter the 4-digit CVV on the front of your Amex card.'
      : 'Enter the 3-digit CVV on the back of your card.';
  }
  return '';
}

export function getExpiryValidationError(month: string | number, year: string | number): 'required' | 'expired' | null {
  if (month === '' || month === null || month === undefined || !year) {
    return 'required';
  }

  const monthNum = Number(month);
  const yearNum = Number(year);
  if (!monthNum || !yearNum) return 'required';

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return 'expired';
  }

  return null;
}

export function expiryValidationMessage(error: 'required' | 'expired' | null): string {
  if (error === 'required') return 'Expiration date is required.';
  if (error === 'expired') return 'This card has expired. Use a valid expiration date.';
  return '';
}

export function formatCardNumber(value: string): string {
  const digits = cardDigits(value);
  const brand = detectCardBrand(digits);
  const maxLength = brand === 'Amex' ? 15 : 19;
  const limited = digits.slice(0, maxLength);

  if (brand === 'Amex') {
    return limited.replace(/^(\d{4})(\d{6})(\d{0,5}).*/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(' ')
    );
  }

  return limited.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function cardLastFour(cardNumber: string): string {
  return cardDigits(cardNumber).slice(-4);
}

export function highlightCardBrand(cardNumber: string): CardBrand | null {
  const brand = detectCardBrand(cardNumber);
  const digits = cardDigits(cardNumber);
  if (digits.length < 2) return null;
  return brand;
}
