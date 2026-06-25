import { Pipe, PipeTransform } from '@angular/core';

import { formatCurrency } from '../utils/currency.utils';

@Pipe({ name: 'currencyFormat', standalone: true })
export class CurrencyFormatPipe implements PipeTransform {
  transform(amount: number | null | undefined, currency = 'USD'): string {
    if (amount === null || amount === undefined) {
      return formatCurrency(0, currency);
    }
    return formatCurrency(amount, currency);
  }
}
