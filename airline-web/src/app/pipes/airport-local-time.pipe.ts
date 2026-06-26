import { Pipe, PipeTransform } from '@angular/core';

import { formatAirportLocalTime } from '../utils/flight.utils';

@Pipe({ name: 'airportTime', standalone: true })
export class AirportLocalTimePipe implements PipeTransform {
  transform(
    localIso: string | null | undefined,
    format: 'time' | 'date' | 'datetime' = 'time'
  ): string {
    return formatAirportLocalTime(localIso ?? '', format);
  }
}
