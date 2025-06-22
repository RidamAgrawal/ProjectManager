import { Pipe, PipeTransform } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Pipe({
  name: 'ngbDate'
})
export class NgbDatePipe implements PipeTransform {

  transform(date:NgbDate): string {
    return `${date.day||'XX'}/${date.month||'XX'}/${date.year||'XXXX'}`;
  }

}
