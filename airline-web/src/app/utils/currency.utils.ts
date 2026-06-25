export function currencyDisplayPrefix(currency = 'USD'): string {
  if (!currency || currency === 'USD') {
    return '$';
  }

  try {
    const part = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
    })
      .formatToParts(0)
      .find((segment) => segment.type === 'currency');

    return part?.value ?? `${currency} `;
  } catch {
    return `${currency} `;
  }
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyWhole(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}