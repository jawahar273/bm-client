import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralization'
})
export class PluralizationPipe implements PipeTransform {

  transform(value: string, count: number): any {
    if (count > 1) {
        return value + 's';
    }
    return value;
  }

}
