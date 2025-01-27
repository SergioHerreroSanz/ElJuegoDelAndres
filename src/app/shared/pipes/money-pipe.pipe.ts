import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money',
})
export class MoneyPipe implements PipeTransform {
  transform(value: number | string): unknown {
    const parsedValue = Number.parseFloat(`${value}`);
    return !Number.isNaN(parsedValue)
      ? formatNumber(parsedValue, 'es', '1.2-2') + ' €'
      : value;
  }
}
