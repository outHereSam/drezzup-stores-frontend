import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroPad',
})
export class ZeroPadPipe implements PipeTransform {
  transform(value: number | string, length: number): string {
    const strValue = value.toString();
    return strValue.padStart(length, '0');
  }
}
